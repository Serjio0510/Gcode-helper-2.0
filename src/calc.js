/**
 * CNC Tool Path Calculator - Calculation Engine
 * Чистые математические функции, валидация, обратные расчеты
 * 
 * Принципы:
 * - Нет зависимостей от DOM
 * - Все функции детерминированны
 * - Защита от NaN/Infinity
 * - Полная валидация входных данных
 */

// ============= STATUS ENUM =============
const Status = {
  OK: 'ok',
  ERROR_Y_OUT_OF_RANGE: 'error_y_range',
  ERROR_X_OUT_OF_RANGE: 'error_x_range',
  ERROR_INVALID_INPUT: 'error_input',
  ERROR_IMPOSSIBLE_CONFIG: 'error_config',
  WARNING_NEAR_LIMIT: 'warning_limit'
};

// ============= VALIDATION LAYER =============

/**
 * Валидация базовых параметров (диаметры, тип машины)
 */
function validateBaseParams(Dc, Dt, machineType) {
  // Проверка типов
  if (typeof Dc !== 'number' || typeof Dt !== 'number') {
    return {
      status: Status.ERROR_INVALID_INPUT,
      message: 'Диаметры должны быть числами'
    };
  }

  // Проверка положительности
  if (Dc <= 0 || Dt < 0) {
    return {
      status: Status.ERROR_INVALID_INPUT,
      message: 'Диаметры должны быть положительными (Dt может быть = 0)'
    };
  }

  // Проверка соотношения диаметров
  if (Dt > Dc) {
    return {
      status: Status.ERROR_IMPOSSIBLE_CONFIG,
      message: `Диаметр фрезы (${Dt} мм) должен быть меньше или равен диаметру контура (${Dc} мм)`
    };
  }

  // Проверка типа машины
  if (!['in', 'ex'].includes(machineType)) {
    return {
      status: Status.ERROR_INVALID_INPUT,
      message: 'Тип обработки должен быть "in" или "ex"'
    };
  }

  return { status: Status.OK };
}

/**
 * Валидация значения Y контура
 */
function validateContourY(yValue, Rc) {
  const tolerance = 0.01; // мм
  const maxY = Rc - tolerance;

  if (typeof yValue !== 'number' || !isFinite(yValue)) {
    return {
      status: Status.ERROR_INVALID_INPUT,
      message: 'Y должен быть конечным числом'
    };
  }

  if (Math.abs(yValue) >= Rc) {
    return {
      status: Status.ERROR_Y_OUT_OF_RANGE,
      message: `Y вне диапазона. Допуск: ±${maxY.toFixed(2)} мм`,
      maxValue: maxY,
      minValue: -maxY
    };
  }

  return { status: Status.OK };
}

/**
 * Валидация значения X контура
 */
function validateContourX(xValue, Rc) {
  const tolerance = 0.01; // мм
  const maxX = Rc - tolerance;

  if (typeof xValue !== 'number' || !isFinite(xValue)) {
    return {
      status: Status.ERROR_INVALID_INPUT,
      message: 'X должен быть конечным числом'
    };
  }

  if (Math.abs(xValue) >= Rc) {
    return {
      status: Status.ERROR_X_OUT_OF_RANGE,
      message: `X вне диапазона. Допуск: ±${maxX.toFixed(2)} мм`,
      maxValue: maxX,
      minValue: -maxX
    };
  }

  return { status: Status.OK };
}

/**
 * Валидация угла
 */
function validateAngle(angle) {
  if (typeof angle !== 'number' || !isFinite(angle)) {
    return {
      status: Status.ERROR_INVALID_INPUT,
      message: 'Угол должен быть конечным числом'
    };
  }

  return { status: Status.OK };
}

// ============= MATH LAYER =============

/**
 * Нормализация угла к диапазону [0, 360)
 */
function normalizeAngle(angle) {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Безопасное вычисление квадратного корня
 * Если под корнем отрицательное число, возвращает error
 */
function safeSqrt(value, context = '') {
  if (value < 0) {
    return {
      status: Status.ERROR_INVALID_INPUT,
      message: `Невозможно вычислить √${value.toFixed(4)}. ${context}`
    };
  }
  return { status: Status.OK, value: Math.sqrt(value) };
}

/**
 * CNC Calculator - главный класс для всех расчетов
 * 
 * Инвариант: после создания объекта Rp > 0 гарантировано
 */
class CNCCalculator {
  constructor(Dc, Dt, machineType = 'in') {
    // Валидация
    const validation = validateBaseParams(Dc, Dt, machineType);
    if (validation.status !== Status.OK) {
      throw new Error(validation.message);
    }

    this.Dc = Dc;
    this.Dt = Dt;
    this.machineType = machineType;
    this.Rc = Dc / 2;
    this.Rt = Dt / 2;

    // Расчет радиуса пути фрезы
    this.Rp = machineType === 'in' 
      ? this.Rc - this.Rt 
      : this.Rc + this.Rt;

    // Гарантируем Rp > 0
    if (this.Rp <= 0) {
      throw new Error('Невозможная конфигурация: Rp <= 0');
    }
  }

  /**
   * Основной расчет: по углу → координаты
   * Input: angleDeg ∈ [0, 360)
   * Output: { status, contour, tool, angle, mode } или { status, message }
   */
  fromAngle(angleDeg) {
    // Валидация
    const angleValidation = validateAngle(angleDeg);
    if (angleValidation.status !== Status.OK) {
      return angleValidation;
    }

    const angle = normalizeAngle(angleDeg);
    const angleRad = angle * Math.PI / 180;

    const cos_a = Math.cos(angleRad);
    const sin_a = Math.sin(angleRad);

    const contourX = this.Rc * cos_a;
    const contourY = this.Rc * sin_a;
    const toolX = this.Rp * cos_a;
    const toolY = this.Rp * sin_a;

    // Финальная проверка на NaN
    if (!isFinite(contourX) || !isFinite(contourY) || !isFinite(toolX) || !isFinite(toolY)) {
      return {
        status: Status.ERROR_INVALID_INPUT,
        message: 'Расчет привел к невалидному результату'
      };
    }

    return {
      status: Status.OK,
      contour: { x: contourX, y: contourY },
      tool: { x: toolX, y: toolY },
      angle: angle,
      mode: 'angle'
    };
  }

  /**
   * Обратный расчет: по X,Y фрезы → угол
   * Проверяет, что точка лежит на пути фрезы (с толеансом)
   */
  fromToolXY(toolX, toolY) {
    if (typeof toolX !== 'number' || typeof toolY !== 'number') {
      return {
        status: Status.ERROR_INVALID_INPUT,
        message: 'X и Y должны быть числами'
      };
    }

    if (!isFinite(toolX) || !isFinite(toolY)) {
      return {
        status: Status.ERROR_INVALID_INPUT,
        message: 'X и Y должны быть конечными'
      };
    }

    const dist = Math.sqrt(toolX * toolX + toolY * toolY);
    const tolerance = 0.05; // мм

    if (Math.abs(dist - this.Rp) > tolerance) {
      return {
        status: Status.ERROR_INVALID_INPUT,
        message: `Точка не лежит на пути фрезы. Радиус ${dist.toFixed(3)} мм, ожидается ${this.Rp.toFixed(3)} мм`
      };
    }

    let angle = Math.atan2(toolY, toolX) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    // Пересчитываем через fromAngle для консистентности
    return this.fromAngle(angle);
  }

  /**
   * Расчет по Y контура
   */
  fromContourY(yContour) {
    // Валидация
    const validation = validateContourY(yContour, this.Rc);
    if (validation.status !== Status.OK) {
      return validation;
    }

    // X контура: ВСЕГДА левая часть окружности (X < 0)
    // Это дает нам полукруг от 90° до 270°
    const xContourSqrt = safeSqrt(
      this.Rc * this.Rc - yContour * yContour,
      'Y контура вне диапазона'
    );
    if (xContourSqrt.status !== Status.OK) {
      return xContourSqrt;
    }
    const xContour = -xContourSqrt.value; // ВСЕГДА отрицательный (левая половина)

    // Y фрезы
    const yTool = this.machineType === 'in'
      ? yContour - this.Rt
      : yContour + this.Rt;

    // Проверяем, что Y фрезы в допуске
    if (Math.abs(yTool) >= this.Rp) {
      return {
        status: Status.ERROR_Y_OUT_OF_RANGE,
        message: `Для Y=${yContour.toFixed(2)} мм конфигурация инструмента невозможна (Yt=${yTool.toFixed(2)}, допуск: ±${(this.Rp-0.01).toFixed(2)})`
      };
    }

    // X фрезы: ВСЕГДА левая часть (X < 0), как и X контура
    const xToolSqrt = safeSqrt(
      this.Rp * this.Rp - yTool * yTool,
      `Y инструмента ${yTool.toFixed(2)} вне диапазона`
    );
    if (xToolSqrt.status !== Status.OK) {
      return xToolSqrt;
    }
    const xTool = -xToolSqrt.value; // ВСЕГДА отрицательный

    // Угол
    let angle = Math.atan2(yContour, xContour) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    return {
      status: Status.OK,
      contour: { x: xContour, y: yContour },
      tool: { x: xTool, y: yTool },
      angle: angle,
      mode: 'contourY'
    };
  }

  /**
   * Расчет по X контура
   */
  fromContourX(xContour) {
    // Валидация
    const validation = validateContourX(xContour, this.Rc);
    if (validation.status !== Status.OK) {
      return validation;
    }

    // Y контура (всегда верхняя часть, Y > 0)
    const yContourSqrt = safeSqrt(
      this.Rc * this.Rc - xContour * xContour,
      'X контура вне диапазона'
    );
    if (yContourSqrt.status !== Status.OK) {
      return yContourSqrt;
    }
    const yContour = yContourSqrt.value; // верхняя часть

    // Y фрезы
    const yTool = this.machineType === 'in'
      ? yContour - this.Rt
      : yContour + this.Rt;

    // Проверяем, что Y фрезы в допуске
    if (Math.abs(yTool) >= this.Rp) {
      return {
        status: Status.ERROR_Y_OUT_OF_RANGE,
        message: `Для X=${xContour.toFixed(2)} мм конфигурация инструмента невозможна (Yt=${yTool.toFixed(2)}, допуск: ±${(this.Rp-0.01).toFixed(2)})`
      };
    }

    // X фрезы (вычисляем абсолютное значение и применяем знак исходного X)
    const xToolSqrt = safeSqrt(
      this.Rp * this.Rp - yTool * yTool,
      `Y инструмента ${yTool.toFixed(2)} вне диапазона`
    );
    if (xToolSqrt.status !== Status.OK) {
      return xToolSqrt;
    }
    // X фрезы имеет тот же знак что и X контура
    const xTool = xContour >= 0 ? xToolSqrt.value : -xToolSqrt.value;

    // Угол (atan2 сохраняет квадранты правильно)
    let angle = Math.atan2(yContour, xContour) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    return {
      status: Status.OK,
      contour: { x: xContour, y: yContour },
      tool: { x: xTool, y: yTool },
      angle: angle,
      mode: 'contourX'
    };
  }

  /**
   * Расчет по хорде (половина размера)
   */
  fromChord(chordYHalf) {
    return this.fromContourY(chordYHalf);
  }

  /**
   * Получить все 4 симметричные точки
   */
  getSymmetricPoints(primaryResult) {
    if (primaryResult.status !== Status.OK) {
      return null;
    }

    const { contour, tool, angle } = primaryResult;

    return {
      p1: { // исходная
        contour: { x: contour.x, y: contour.y },
        tool: { x: tool.x, y: tool.y },
        angle: angle
      },
      p2: { // зеркало по Y (180 - θ)
        contour: { x: -contour.x, y: contour.y },
        tool: { x: -tool.x, y: tool.y },
        angle: normalizeAngle(180 - angle)
      },
      p3: { // зеркало по X (360 - θ = -θ)
        contour: { x: contour.x, y: -contour.y },
        tool: { x: tool.x, y: -tool.y },
        angle: normalizeAngle(-angle)
      },
      p4: { // центральная симметрия (180 + θ)
        contour: { x: -contour.x, y: -contour.y },
        tool: { x: -tool.x, y: -tool.y },
        angle: normalizeAngle(180 + angle)
      }
    };
  }

  /**
   * Верификация компенсации инструмента
   */
  verifyToolCompensation(nominalContour, calculatedTool) {
    const tolerance = 0.05; // мм

    const expectedRadius = this.machineType === 'in'
      ? Math.sqrt(nominalContour.x ** 2 + nominalContour.y ** 2) - this.Rt
      : Math.sqrt(nominalContour.x ** 2 + nominalContour.y ** 2) + this.Rt;

    const actualRadius = Math.sqrt(calculatedTool.x ** 2 + calculatedTool.y ** 2);
    const error = Math.abs(expectedRadius - actualRadius);

    return {
      valid: error < tolerance,
      error: error,
      tolerance: tolerance,
      message: error < tolerance
        ? '✓ Компенсация корректна'
        : `⚠ Ошибка компенсации: ${error.toFixed(4)} мм (допуск: ${tolerance} мм)`
    };
  }
}

// ============= EXPORT FOR MODULES =============
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Status,
    CNCCalculator,
    validateBaseParams,
    validateContourY,
    validateContourX,
    validateAngle,
    normalizeAngle
  };
}
