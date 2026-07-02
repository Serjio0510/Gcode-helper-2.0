/**
 * Simple UI Controller for Arc Calculator
 */

class UIController {
  constructor(appState) {
    this.state = appState;
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.autoScale = 4.2;
    this.userScale = 1.0;
    this.scale = this.autoScale * this.userScale;
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.centerX = this.canvasWidth / 2;
    this.centerY = this.canvasHeight / 2;
    
    this.isPanning = false;
    this.panOffsetX = 0;
    this.panOffsetY = 0;
    this.panStartX = 0;
    this.panStartY = 0;
    
    this.cacheElements();

    document.addEventListener('themeChanged', () => this.render());
  }

  cacheElements() {
    const ids = [
      'iDc', 'iDt', 'iMachineIn', 'iMachineEx',
      'inputValue', 'inputLabel', 'inputUnit', 'inputHint', 'inputRange',
      'chordDirection', 'chordDirectionField',
      'chordSignField', 'chordSignLabel', 'chordSignPos', 'chordSignNeg', 'chordSignPosText', 'chordSignNegText',
      'quickAnglesContainer', 'sliderContainer',
      'canvasScale', 'canvasScaleValue',
      'oXc', 'oYc', 'oXt', 'oYt', 'oTh', 'oTh2', 'oRc', 'oRp', 'oRt',
      'errorBox', 'errorText', 'warningBox', 'warningText',
      'formula', 'canvas', 'sliderValue', 'inputModes'
    ];

    this.elements = {};
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        this.elements[id] = el;
      }
    });
  }

  attachEventListeners() {
    if (this.elements.iDc) {
      this.elements.iDc.addEventListener('change', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) this.state.setParam('Dc', val);
        this.render();
      });
    }

    if (this.elements.iDt) {
      this.elements.iDt.addEventListener('change', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) this.state.setParam('Dt', val);
        this.render();
      });
    }

    if (this.elements.iMachineIn) {
      this.elements.iMachineIn.addEventListener('change', () => {
        this.state.setParam('machineType', 'in');
        this.render();
      });
    }
    if (this.elements.iMachineEx) {
      this.elements.iMachineEx.addEventListener('change', () => {
        this.state.setParam('machineType', 'ex');
        this.render();
      });
    }

    document.querySelectorAll('[data-input-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.inputMode;
        const currentValue = this.state.input.value;
        this.state.setInput(mode, currentValue);
        this.render();
      });
    });

    if (this.elements.chordDirection) {
      this.elements.chordDirection.addEventListener('change', (e) => {
        this.state.setChordDirection(e.target.value);
        this.render();
      });
    }

    document.querySelectorAll('[data-chord-sign]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sign = btn.dataset.chordSign;
        this.state.setChordSecondarySign(sign);
        this.render();
      });
    });

    document.querySelectorAll('[data-angle]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.input.mode === 'angle') {
          const angle = parseFloat(btn.dataset.angle);
          this.state.updateInputValue(angle);
          this.render();
        }
      });
    });

    if (this.elements.inputValue) {
      this.elements.inputValue.addEventListener('blur', (e) => {
        try {
          const val = this.parseExpression(e.target.value);
          if (!isNaN(val)) {
            this.state.updateInputValue(val);
            this.elements.inputValue.value = val.toFixed(3);
            this.render();
          }
        } catch (error) {
          this.render();
        }
      });

      this.elements.inputValue.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          try {
            const val = this.parseExpression(e.target.value);
            if (!isNaN(val)) {
              this.state.updateInputValue(val);
              this.elements.inputValue.value = val.toFixed(3);
              this.render();
            }
          } catch (error) {
            alert('❌ ' + error.message);
          }
        }
      });

      this.elements.inputValue.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && this.elements.inputRange) {
          this.elements.inputRange.value = val;
        }
      });
    }

    if (this.elements.inputRange) {
      this.elements.inputRange.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.state.updateInputValue(val);
        this.render();
      });

      // Prevent focus on other inputs when dragging on mobile
      this.elements.inputRange.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        // Blur any focused input to prevent auto-focus
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }, { passive: true });

      this.elements.inputRange.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      }, { passive: true });

      this.elements.inputRange.addEventListener('touchend', (e) => {
        e.stopPropagation();
      }, { passive: true });

      this.elements.inputRange.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        // Blur any focused input
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      });
    }

    if (this.elements.canvasScale) {
      this.elements.canvasScale.addEventListener('input', (e) => {
        this.userScale = parseFloat(e.target.value);
        this.scale = this.autoScale * this.userScale;
        const percent = Math.round(this.userScale * 100);
        if (this.elements.canvasScaleValue) {
          this.elements.canvasScaleValue.textContent = percent + '%';
        }
        this.render();
      });

      // Prevent focus on other inputs when dragging on mobile
      this.elements.canvasScale.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        // Blur any focused input to prevent auto-focus
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }, { passive: true });

      this.elements.canvasScale.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      }, { passive: true });

      this.elements.canvasScale.addEventListener('touchend', (e) => {
        e.stopPropagation();
      }, { passive: true });

      this.elements.canvasScale.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        // Blur any focused input
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      });
    }

    // Canvas panning support (mouse + touch)
    if (this.canvas) {
      let mouseStartX = 0;
      let mouseStartY = 0;
      let touchStartX = 0;
      let touchStartY = 0;

      this.canvas.addEventListener('mousedown', (e) => {
        if (!this.state.calculator) return;
        // Blur any focused input to prevent auto-focus
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
        this.isPanning = true;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.isPanning) return;
        const dx = e.clientX - mouseStartX;
        const dy = e.clientY - mouseStartY;
        const rect = this.canvas.getBoundingClientRect();
        const pixelRatio = this.canvas.width / rect.width;
        this.panOffsetX += dx * pixelRatio;
        this.panOffsetY += dy * pixelRatio;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        this.render();
      });

      document.addEventListener('mouseup', () => {
        this.isPanning = false;
      });

      this.canvas.addEventListener('touchstart', (e) => {
        if (!this.state.calculator) return;
        // Blur any focused input to prevent auto-focus
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
        this.isPanning = true;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        if (e.target === this.canvas) {
          e.preventDefault();
        }
      }, { passive: false });

      this.canvas.addEventListener('touchmove', (e) => {
        if (!this.isPanning) return;
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const rect = this.canvas.getBoundingClientRect();
        const pixelRatio = this.canvas.width / rect.width;
        this.panOffsetX += dx * pixelRatio;
        this.panOffsetY += dy * pixelRatio;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        this.render();
        e.preventDefault();
      }, { passive: false });

      this.canvas.addEventListener('touchend', () => {
        this.isPanning = false;
      });
    }
  }

  parseExpression(input) {
    const num = parseFloat(input);
    if (!isNaN(num) && input.trim() === num.toString()) {
      return num;
    }

    if (!/^[0-9\s+\-*/().]+$/.test(input)) {
      throw new Error('Недопустимые символы');
    }

    try {
      const result = Function('"use strict"; return (' + input + ')')();
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Результат должен быть числом');
      }
      return result;
    } catch (e) {
      throw new Error('Ошибка расчета');
    }
  }

  render() {
    const stateData = this.state.getState();
    this.updateControls(stateData);
    this.drawCanvas(stateData);
    this.updateResults(stateData);
    this.updateErrors(stateData);
    this.updateFormula(stateData);
  }

  updateFormula(stateData) {
    if (!this.elements.formula) return;

    if (!stateData.result || !stateData.calculator) {
      this.elements.formula.textContent = 'Расчет выполняется...';
      return;
    }

    const { result, calculator, input } = stateData;
    const { Rc, Rt, Rp } = calculator;
    const { contour, tool, angle } = result;

    let formula = '';
    if (input.mode === 'angle') {
      formula = `• Угол θ = ${angle.toFixed(3)}°\n`;
      formula += `• Xк = Rc × cos(θ) = ${Rc.toFixed(3)} × cos(${angle.toFixed(3)}°) = ${contour.x.toFixed(4)} мм\n`;
      formula += `• Yк = Rc × sin(θ) = ${Rc.toFixed(3)} × sin(${angle.toFixed(3)}°) = ${contour.y.toFixed(4)} мм\n`;
      formula += `• Xф = Rп × cos(θ) = ${Rp.toFixed(3)} × cos(${angle.toFixed(3)}°) = ${tool.x.toFixed(4)} мм\n`;
      formula += `• Yф = Rп × sin(θ) = ${Rp.toFixed(3)} × sin(${angle.toFixed(3)}°) = ${tool.y.toFixed(4)} мм`;
    } else if (input.mode === 'chord') {
      const isXAxis = input.chordDirection.includes('X');
      const axisName = isXAxis ? 'X' : 'Y';
      const primaryValue = isXAxis ? contour.x : contour.y;
      const secondaryValue = isXAxis ? contour.y : contour.x;
      
      formula = `• Хорда по оси ${axisName} = ${Math.abs(primaryValue).toFixed(3)} мм\n`;
      formula += `• ${isXAxis ? 'Y' : 'X'} контура = √(Rc² - (хорда)²) = ${Math.abs(secondaryValue).toFixed(4)} мм\n`;
      formula += `• Направление: ${input.chordDirection}\n`;
      formula += `• Знак второй оси: ${input.chordSecondarySign === 'positive' ? '+' : '−'}\n`;
      formula += `• Координаты фрезы: (${tool.x.toFixed(4)}, ${tool.y.toFixed(4)}) мм`;
    }

    this.elements.formula.textContent = formula;
  }

  updateControls(stateData) {
    if (this.elements.iDc) this.elements.iDc.value = stateData.params.Dc || '';
    if (this.elements.iDt) this.elements.iDt.value = stateData.params.Dt || '';

    if (this.elements.iMachineIn) {
      this.elements.iMachineIn.checked = stateData.params.machineType === 'in';
    }
    if (this.elements.iMachineEx) {
      this.elements.iMachineEx.checked = stateData.params.machineType === 'ex';
    }

    document.querySelectorAll('[data-input-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.inputMode === stateData.input.mode);
    });

    const isChordMode = stateData.input.mode === 'chord';
    
    // Show/hide chord direction
    if (this.elements.chordDirectionField) {
      this.elements.chordDirectionField.style.display = isChordMode ? 'block' : 'none';
    }

    // Show/hide chord sign field (buttons for +/-)
    if (this.elements.chordSignField) {
      this.elements.chordSignField.style.display = isChordMode ? 'block' : 'none';
    }

    // Show/hide quick angles (only for angle mode)
    if (this.elements.quickAnglesContainer) {
      this.elements.quickAnglesContainer.style.display = stateData.input.mode === 'angle' ? 'grid' : 'none';
    }
    if (this.elements.sliderContainer) {
      this.elements.sliderContainer.style.display = stateData.input.mode === 'angle' ? 'block' : 'none';
    }

    // Hide hint tip for chord mode
    const hintTip = document.getElementById('inputHintTip');
    if (hintTip) {
      hintTip.style.display = stateData.input.mode === 'angle' ? 'block' : 'none';
    }

    const range = stateData.inputRange;
    if (!range) return;
    
    if (this.elements.inputLabel) this.elements.inputLabel.textContent = range.label;
    if (this.elements.inputUnit) this.elements.inputUnit.textContent = range.unit;
    if (this.elements.inputHint) {
      if (!stateData.calculator && stateData.input.mode === 'chord') {
        this.elements.inputHint.textContent = '';
      } else {
        this.elements.inputHint.textContent = `Диапазон: ${range.min.toFixed(3)}–${range.max.toFixed(3)} ${range.unit}`;
      }
    }

    if (this.elements.inputRange) {
      this.elements.inputRange.min = range.min;
      this.elements.inputRange.max = range.max;
      this.elements.inputRange.step = range.step;
      this.elements.inputRange.value = stateData.input.value || 0;
    }

    if (this.elements.inputValue && document.activeElement !== this.elements.inputValue) {
      this.elements.inputValue.value = stateData.input.value !== null ? stateData.input.value.toFixed(3) : '';
    }

    if (this.elements.sliderValue && stateData.input.value !== null) {
      this.elements.sliderValue.textContent = stateData.input.value.toFixed(1) + range.unit;
    }

    // Update chord sign buttons text
    if (isChordMode && stateData.result) {
      const { tool } = stateData.result;
      const isXAxis = stateData.input.chordDirection.includes('X');
      const primaryAxis = isXAxis ? tool.x : tool.y;
      const secondaryAxis = isXAxis ? tool.y : tool.x;
      
      if (this.elements.chordSignPosText) {
        this.elements.chordSignPosText.textContent = `+${Math.abs(secondaryAxis).toFixed(3)} мм`;
      }
      if (this.elements.chordSignNegText) {
        this.elements.chordSignNegText.textContent = `-${Math.abs(secondaryAxis).toFixed(3)} мм`;
      }

      // Update active state of sign buttons
      document.querySelectorAll('[data-chord-sign]').forEach(btn => {
        const isActive = btn.dataset.chordSign === stateData.input.chordSecondarySign;
        btn.classList.toggle('active', isActive);
      });
    }
  }

  updateResults(stateData) {
    if (!stateData.result) {
      const fields = ['oXc', 'oYc', 'oXt', 'oYt', 'oTh', 'oTh2', 'oRc', 'oRp', 'oRt'];
      fields.forEach(id => {
        if (this.elements[id]) this.elements[id].textContent = '—';
      });
      return;
    }

    const { result, calculator } = stateData;
    const { contour, tool, angle } = result;
    const { Rc, Rt, Rp } = calculator;

    if (this.elements.oXc) this.elements.oXc.textContent = `${contour.x.toFixed(3)} мм`;
    if (this.elements.oYc) this.elements.oYc.textContent = `${contour.y.toFixed(3)} мм`;
    if (this.elements.oTh) this.elements.oTh.textContent = `${angle.toFixed(3)}°`;

    if (this.elements.oXt) this.elements.oXt.textContent = `${tool.x.toFixed(3)} мм`;
    if (this.elements.oYt) this.elements.oYt.textContent = `${tool.y.toFixed(3)} мм`;
    if (this.elements.oTh2) this.elements.oTh2.textContent = `${angle.toFixed(3)}°`;

    if (this.elements.oRc) this.elements.oRc.textContent = `${Rc.toFixed(3)} мм`;
    if (this.elements.oRp) this.elements.oRp.textContent = `${Rp.toFixed(3)} мм`;
    if (this.elements.oRt) this.elements.oRt.textContent = `${Rt.toFixed(3)} мм`;
  }

  updateErrors(stateData) {
    if (stateData.error) {
      if (this.elements.errorBox) this.elements.errorBox.style.display = 'flex';
      if (this.elements.errorText) this.elements.errorText.textContent = stateData.error.message;
    } else {
      if (this.elements.errorBox) this.elements.errorBox.style.display = 'none';
    }
  }

  drawCanvas(stateData) {
    if (!this.canvas || !this.ctx) return;

    const { result, calculator } = stateData;

    if (!calculator) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      return;
    }

    // Определяем тему для правильных цветов
    const isDarkTheme = !document.body.classList.contains('light-theme');

    const { Rc, Rt, Rp } = calculator;
    const maxR = Math.max(Rc, Rp) + Rt + 6;
    this.autoScale = Math.min(4.4, 183 / maxR);
    this.scale = this.autoScale * this.userScale;

    const ctx = this.ctx;
    const CX = this.centerX + this.panOffsetX;
    const CY = this.centerY + this.panOffsetY;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Фон canvas
    if (isDarkTheme) {
      ctx.fillStyle = 'rgb(28, 28, 32)';
    } else {
      ctx.fillStyle = 'rgb(235, 237, 240)';
    }
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Сетка
    ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.18)' : 'rgba(180, 185, 195, 0.55)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= this.canvasWidth; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.canvasHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.canvasWidth, i);
      ctx.stroke();
    }

    // Оси X и Y
    ctx.strokeStyle = isDarkTheme ? 'rgba(255,255,255,.25)' : 'rgba(80, 90, 110, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, CY);
    ctx.lineTo(this.canvasWidth, CY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CX, 0);
    ctx.lineTo(CX, this.canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Центр координат (крест)
    ctx.strokeStyle = isDarkTheme ? 'rgba(212,210,202,.8)' : 'rgba(80,80,80,.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CX - 8, CY);
    ctx.lineTo(CX + 8, CY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CX, CY - 8);
    ctx.lineTo(CX, CY + 8);
    ctx.stroke();

    // Окружность контура (синяя)
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(CX, CY, Rc * this.scale, 0, Math.PI * 2);
    ctx.strokeStyle = '#378ADD';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Окружность пути фрезы (красная пунктирная)
    ctx.beginPath();
    ctx.arc(CX, CY, Rp * this.scale, 0, Math.PI * 2);
    ctx.strokeStyle = '#E24B4A';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Текущая точка
    if (result) {
      const { contour, tool } = result;
      const pcx = CX + contour.x * this.scale;
      const pcy = CY - contour.y * this.scale;
      const ptx = CX + tool.x * this.scale;
      const pty = CY - tool.y * this.scale;

      // Линии проекций (серые)
      ctx.strokeStyle = 'rgba(239,159,39,.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      // X проекция
      ctx.beginPath();
      ctx.moveTo(pcx, pcy);
      ctx.lineTo(CX, pcy);
      ctx.stroke();
      
      // Y проекция
      ctx.beginPath();
      ctx.moveTo(pcx, pcy);
      ctx.lineTo(pcx, CY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Окружность фрезы (зелёная)
      ctx.beginPath();
      ctx.arc(ptx, pty, Rt * this.scale, 0, Math.PI * 2);
      ctx.strokeStyle = '#0F6E56';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#0F6E56';
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();

      // Точка на контуре (синяя)
      ctx.beginPath();
      ctx.arc(pcx, pcy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#378ADD';
      ctx.fill();
      ctx.strokeStyle = '#378ADD';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Центр фрезы (красная)
      ctx.beginPath();
      ctx.arc(ptx, pty, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#E24B4A';
      ctx.fill();
      ctx.strokeStyle = '#E24B4A';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Линия от центра к точке контура (оранжевая)
      ctx.strokeStyle = 'rgba(239,159,39,.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(pcx, pcy);
      ctx.stroke();

      // Текст координат на canvas - выводим компактнее
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#378ADD';
      ctx.fillText(`Xк=${contour.x.toFixed(1)}`, pcx + 14, pcy + 2);
      ctx.fillText(`Yк=${contour.y.toFixed(1)}`, pcx + 14, pcy - 10);

      ctx.fillStyle = '#E24B4A';
      ctx.fillText(`Xф=${tool.x.toFixed(1)}`, ptx + 14, pty - 38);
      ctx.fillText(`Yф=${tool.y.toFixed(1)}`, ptx + 14, pty - 50);
    }

    // Метки осей с направлениями (X+, X-, Y+, Y-)
    ctx.fillStyle = isDarkTheme ? 'rgba(212,210,202,.7)' : 'rgba(80,80,80,.7)';
    ctx.font = 'bold 14px monospace';
    ctx.textBaseline = 'middle';
    
    // X+ (right), X- (left), Y+ (up), Y- (down)
    ctx.textAlign = 'left';
    ctx.fillText('+X', CX + 18, CY - 5);  // правее центра, чуть выше оси
    ctx.textAlign = 'right';
    ctx.fillText('-X', CX - 23, CY - 5);  // левее центра, чуть выше оси
    ctx.textAlign = 'center';
    ctx.fillText('+Y', CX, CY - 30);
    ctx.fillText('−Y', CX, CY + 30);

    // Метки углов (0°, 90°, 180°, 270°)
    ctx.font = '14px monospace';
    ctx.fillStyle = isDarkTheme ? 'rgba(212,210,202,.7)' : 'rgba(80,80,80,.7)';
    const angleMarkRadius = Math.min((Rc + 10) * this.scale + 16, this.canvasWidth / 2 - 24);
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('0°', CX + angleMarkRadius, CY + 10);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('90°', CX + 16, CY - angleMarkRadius);
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('180°', CX - angleMarkRadius + 12, CY -9);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('270°', CX - 18, CY + angleMarkRadius);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIController };
}