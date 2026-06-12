/**
 * State Manager - Единый источник правды для приложения
 */

class AppState {
  constructor() {
    this.params = {
      Dc: null,
      Dt: null,
      machineType: 'in'
    };

    this.input = {
      mode: 'angle',
      value: null,
      valueForDisplay: null,
      chordDirection: 'Yplus',
      chordSecondarySign: 'positive'
    };

    this.result = null;
    this.symmetricPoints = null;

    this.error = null;
    this.warning = null;

    this.calculator = null;
    this.initCalculator();

    this.history = [];
    this.maxHistorySize = 50;

    this.showSymmetry = false;
    this.showFormula = true;
  }

  initCalculator() {
    try {
      if (this.params.Dc === null || this.params.Dt === null) {
        this.calculator = null;
        this.error = null;
        return;
      }

      this.calculator = new CNCCalculator(
        this.params.Dc,
        this.params.Dt,
        this.params.machineType
      );
      this.error = null;
    } catch (e) {
      this.error = {
        type: 'CALC_INIT',
        message: e.message,
        status: Status.ERROR_IMPOSSIBLE_CONFIG
      };
      this.calculator = null;
    }
  }

  calculate() {
    this.error = null;
    this.warning = null;

    if (!this.calculator) {
      this.error = {
        type: 'NO_CALC',
        message: 'Calculator не инициализирован',
        status: Status.ERROR_IMPOSSIBLE_CONFIG
      };
      this.result = null;
      return false;
    }

    const { mode, value, chordDirection, chordSecondarySign } = this.input;
    let result;

    switch (mode) {
      case 'angle':
        result = this.calculator.fromAngle(value);
        break;
      case 'chord':
        const isNegativeDir = chordDirection.includes('minus');
        const isXAxis = chordDirection.includes('X');
        
        const primaryContourAbs = Math.abs(value);
        
        const Rc = this.calculator.Rc;
        const Rt = this.calculator.Rt;
        const Rp = this.calculator.Rp;
        const machineType = this.params.machineType;
        
        const primarySquared = primaryContourAbs * primaryContourAbs;
        const secondarySquared = Rc * Rc - primarySquared;
        
        if (secondarySquared < 0) {
          result = {
            status: Status.ERROR_Y_OUT_OF_RANGE,
            message: `Хорда выходит за пределы окружности`
          };
        } else {
          let secondaryContour = Math.sqrt(secondarySquared);
          
          if (chordSecondarySign === 'negative') {
            secondaryContour = -secondaryContour;
          }
          
          let xContourPos, yContourPos;
          if (isXAxis) {
            xContourPos = primaryContourAbs;
            yContourPos = secondaryContour;
          } else {
            yContourPos = primaryContourAbs;
            xContourPos = secondaryContour;
          }
          
          let primaryToolRaw;
          if (isXAxis) {
            primaryToolRaw = machineType === 'in' 
              ? xContourPos - Rt
              : xContourPos + Rt;
          } else {
            primaryToolRaw = machineType === 'in' 
              ? yContourPos - Rt
              : yContourPos + Rt;
          }
          
          if (Math.abs(primaryToolRaw) >= Rp) {
            result = {
              status: Status.ERROR_Y_OUT_OF_RANGE,
              message: `Для этой хорды конфигурация инструмента невозможна`
            };
          } else {
            const secondaryToolSquared = Rp * Rp - primaryToolRaw * primaryToolRaw;
            if (secondaryToolSquared < 0) {
              result = {
                status: Status.ERROR_Y_OUT_OF_RANGE,
                message: `Хорда выходит за пределы пути фрезы`
              };
            } else {
              let secondaryToolAbs = Math.sqrt(secondaryToolSquared);
              let secondaryToolRaw = (chordSecondarySign === 'negative') ? -secondaryToolAbs : secondaryToolAbs;
              
              let xTool, yTool, xContour, yContour;
              if (isXAxis) {
                xTool = primaryToolRaw;
                yTool = secondaryToolRaw;
                xContour = xContourPos;
                yContour = yContourPos;
              } else {
                xTool = secondaryToolRaw;
                yTool = primaryToolRaw;
                xContour = xContourPos;
                yContour = yContourPos;
              }
              
              if (isNegativeDir) {
                if (isXAxis) {
                  xTool = -xTool;
                  xContour = -xContour;
                } else {
                  yTool = -yTool;
                  yContour = -yContour;
                }
              }
              
              this.input.toolCoordinates = { x: xTool, y: yTool };
              
              let angle = Math.atan2(yContour, xContour) * 180 / Math.PI;
              if (angle < 0) angle += 360;
              
              result = {
                status: Status.OK,
                contour: { x: xContour, y: yContour },
                tool: { x: xTool, y: yTool },
                angle: angle,
                mode: 'chord'
              };
            }
          }
        }
        break;
      default:
        result = {
          status: Status.ERROR_INVALID_INPUT,
          message: `Unknown mode: ${mode}`
        };
    }

    if (result.status === Status.OK) {
      this.result = result;
      this.addToHistory(result);
      return true;
    } else {
      this.error = result;
      this.result = null;
      this.symmetricPoints = null;
      return false;
    }
  }

  setParam(key, value) {
    if (!(key in this.params)) {
      throw new Error(`Unknown param: ${key}`);
    }

    this.params[key] = value;

    if (['Dc', 'Dt', 'machineType'].includes(key)) {
      this.initCalculator();
    }

    this.calculate();
    return this;
  }

  setInput(mode, value) {
    if (!['angle', 'contourY', 'contourX', 'chord'].includes(mode)) {
      throw new Error(`Unknown input mode: ${mode}`);
    }

    this.input.mode = mode;
    this.input.value = value;
    this.input.valueForDisplay = value;

    this.calculate();
    return this;
  }

  setChordDirection(direction) {
    if (!['Xplus', 'Xminus', 'Yplus', 'Yminus'].includes(direction)) {
      throw new Error(`Unknown chord direction: ${direction}`);
    }

    this.input.chordDirection = direction;

    if (this.input.mode === 'chord') {
      this.calculate();
    }

    return this;
  }

  setChordSecondarySign(sign) {
    if (!['positive', 'negative'].includes(sign)) {
      throw new Error(`Unknown chord secondary sign: ${sign}`);
    }

    this.input.chordSecondarySign = sign;

    if (this.input.mode === 'chord') {
      this.calculate();
    }

    return this;
  }

  updateInputValue(value) {
    this.input.value = value;
    this.input.valueForDisplay = value;
    this.calculate();
    return this;
  }

  addToHistory(result) {
    const entry = {
      timestamp: new Date().toISOString(),
      params: { ...this.params },
      input: { ...this.input },
      result: JSON.parse(JSON.stringify(result))
    };

    this.history.push(entry);

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  getInputRange() {
  const defaults = {
    angle: { min: 0, max: 360, step: 0.1, unit: '°',  label: 'Угол θ' },
    chord: { min: 0, max: 0,   step: 0.1, unit: 'мм', label: 'Хорда'  }
  };

  if (!this.calculator) {
    return defaults[this.input.mode] || defaults.angle;
  }

  const { Rc } = this.calculator;
  const tolerance = 0.01;

  return {
    angle: { min: 0, max: 360,              step: 0.1, unit: '°',  label: 'Угол θ' },
    chord: { min: 0, max: Rc - tolerance,   step: 0.1, unit: 'мм', label: 'Хорда'  }
    }[this.input.mode] || defaults.angle;
  }

  getState() {
    return {
      params: { ...this.params },
      input: { ...this.input },
      result: this.result,
      symmetricPoints: this.symmetricPoints,
      error: this.error,
      warning: this.warning,
      calculator: this.calculator ? {
        Rc: this.calculator.Rc,
        Rt: this.calculator.Rt,
        Rp: this.calculator.Rp,
        Dc: this.calculator.Dc,
        Dt: this.calculator.Dt
      } : null,
      inputRange: this.getInputRange()
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppState };
}
