document.getElementById("defaultOpen").click();

// Функция-помощник для отображения ошибок
function showError(elementId, errorText) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error-message">⚠️ ${errorText}</div>`;
        element.style.display = 'block';
    }
}

// Функция-помощник для отображения результатов
function showResult(elementId, resultHTML) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="result-message">${resultHTML}</div>`;
        element.style.display = 'block';
    }
}

// Класс для кастомного Select
class CustomSelect {
    constructor(selectElement) {
        this.select = selectElement;
        this.wrapper = null;
        this.trigger = null;
        this.dropdown = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Скрыть оригинальный select
        this.select.style.display = 'none';

        // Создать wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-select-wrapper';

        // Создать trigger (видимая часть)
        this.trigger = document.createElement('div');
        this.trigger.className = 'custom-select-trigger';
        this.trigger.textContent = this.select.options[this.select.selectedIndex].text || 'Выбрать...';

        // Создать dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'custom-select-dropdown';

        // Добавить опции в dropdown
        this.renderOptions();

        // Сборка
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.dropdown);
        this.select.parentNode.insertBefore(this.wrapper, this.select.nextSibling);

        // События
        this.trigger.addEventListener('click', () => this.toggle());
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    renderOptions() {
        this.dropdown.innerHTML = '';
        
        for (let i = 0; i < this.select.children.length; i++) {
            const child = this.select.children[i];

            if (child.tagName === 'OPTGROUP') {
                // Создать заголовок группы
                const groupLabel = document.createElement('div');
                groupLabel.className = 'custom-select-optgroup-label';
                groupLabel.textContent = child.label;
                this.dropdown.appendChild(groupLabel);

                // Добавить опции из группы
                for (let j = 0; j < child.children.length; j++) {
                    const option = child.children[j];
                    this.createOptionElement(option);
                }
            } else if (child.tagName === 'OPTION') {
                this.createOptionElement(child);
            }
        }
    }

    createOptionElement(option) {
        const optionEl = document.createElement('div');
        optionEl.className = 'custom-select-option';
        optionEl.textContent = option.text;
        optionEl.dataset.value = option.value;

        if (option.selected) {
            optionEl.classList.add('selected');
        }

        optionEl.addEventListener('click', () => {
            this.select.value = option.value;
            this.trigger.textContent = option.text;
            
            // Обновить все опции - убрать selected
            const allOptions = this.dropdown.querySelectorAll('.custom-select-option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            optionEl.classList.add('selected');

            this.select.dispatchEvent(new Event('change', { bubbles: true }));
            this.close();
        });

        this.dropdown.appendChild(optionEl);
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.trigger.classList.add('active');
        this.dropdown.classList.add('active');
    }

    close() {
        this.isOpen = false;
        this.trigger.classList.remove('active');
        this.dropdown.classList.remove('active');
    }

    handleClickOutside(e) {
        if (!this.wrapper.contains(e.target)) {
            this.close();
        }
    }
}

// Класс для управления темой
class ThemeManager {
    constructor() {
        this.body = document.body;
        this.themeToggleButton = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.body.classList.add('dark-theme');
            this.themeToggleButton.textContent = '☀️';
        } else {
            this.body.classList.add('light-theme');
            this.themeToggleButton.textContent = '🌙';
        }
        this.themeToggleButton.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.body.classList.toggle('dark-theme');
        this.body.classList.toggle('light-theme');
        
        if (this.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            this.themeToggleButton.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            this.themeToggleButton.textContent = '🌙';
        }

        document.dispatchEvent(new CustomEvent('themeChanged'));
    }
}

// Инициализация темы при загрузке
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    
    // Инициализировать кастомные select для всех select элементов
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        if (!select.dataset.customSelectInit) {
            select.dataset.customSelectInit = 'true';
            new CustomSelect(select);
        }
    });

    // Наблюдать за новыми select элементами (на случай динамического создания)
    const observer = new MutationObserver(() => {
        const newSelects = document.querySelectorAll('select:not([data-custom-select-init])');
        newSelects.forEach(select => {
            select.dataset.customSelectInit = 'true';
            new CustomSelect(select);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function openMainTab(evt, tabName) {
    var tabcontents = document.getElementsByClassName("main-tabcontent");
    var tabButtons = document.getElementsByClassName("tab-button");

    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
        tabButtons[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");

    // Инициализация Arc Calculator
    if (tabName === 'arcCalc') {
        if (typeof initializeArcCalculator !== 'undefined') {
            initializeArcCalculator();
        }
    }
}

function goBack() {
    var tabcontents = document.getElementsByClassName("main-tabcontent");
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }
    document.getElementById("mainButtons").style.display = "block";
    document.getElementById("backButton").style.display = "none";
}

// Расчет расстояния
function calculateDistance() {
    const diameterInput = document.getElementById("diameter");
    const distanceToTopInput = document.getElementById("distanceToTop");
    const indexInput = document.getElementById("index");

    const diameter = parseFloat(diameterInput.value);
    const distanceToTop = parseFloat(distanceToTopInput.value);
    const index = parseFloat(indexInput.value);

    if (isNaN(diameter) || diameter <= 0 || isNaN(distanceToTop) || distanceToTop < 0 || isNaN(index) || index < 0) {
        showError('gapResultHeight', 'Пожалуйста, введите корректные данные.');
        return;
    }

    const distanceToCenter = calculateDistanceToCenter(diameter, distanceToTop, index);
    // Форматируем до 3 знаков после запятой
    const formattedDistance = distanceToCenter.toFixed(3);

    // Выводим значение в элемент с id "gapResultHeight"
    document.getElementById("gapResultHeight").innerHTML = `Расстояние от центра диаметра до вершины паза: <strong>${formattedDistance} мм.</strong>`;
}

function calculateDistanceToCenter(diameter, distanceToTop, index) {
    const slot = distanceToTop - diameter;
    const radius = diameter / 2;
    const coefficient = index / 2;

    return slot + radius + coefficient;
}

// Расчет ширины паза
function calculateGapWidth() {
    const gapWidthInput = document.getElementById("gapWidth");
    const indexInputtwo = document.getElementById("indextwo");

    const gapWidth = parseFloat(gapWidthInput.value);
    const indextwo = parseFloat(indexInputtwo.value);

    if (isNaN(gapWidth) || gapWidth < 0 || isNaN(indextwo) || indextwo < 0) {
        showError('gapResultWidth', 'Пожалуйста, введите корректные данные.');
        return;
    }

    const gapWidthCalculated = calculateGapWidthValue(gapWidth, indextwo);
        // Форматируем до 3 знаков после запятой
        const formattedgapWidth = gapWidthCalculated.toFixed(4);

        // Выводим значение в элемент с id "gapResultWidth"
        document.getElementById("gapResultWidth").innerHTML = `Ширина паза: ${gapWidth} мм, Допуск: ${indextwo} мм, Середина паза равна: <strong>${formattedgapWidth} мм.</strong>`;
}

function calculateGapWidthValue(gapWidth, index) {
    const mediumWidth = gapWidth / 2;
    const coefficient1 = index / 4;

    return coefficient1 + mediumWidth;
}

// Расчет угла
document.getElementById('windowSelectorCoord').addEventListener('change', (event) => {
    // Получаем выбранное значение
    const selectedValue = event.target.value;

    // Все окна
    const windows = {
        Kompensaciya: document.getElementById('KompensaciyaWindow'),
        Treugolnick: document.getElementById('TreugolnickWindow'),
        FaskaAngle: document.getElementById('FaskaAngleWindow'),
    };

    // Скрываем все окна
    Object.values(windows).forEach(window => {
        if (window) {
            window.classList.remove('active');
            window.style.display = 'none'; // Скрываем окно
        }
    });

    // Показываем только выбранное окно
    if (windows[selectedValue]) {
        windows[selectedValue].classList.add('active');
        windows[selectedValue].style.display = 'block'; // Отображаем окно
    }
});


function calculateCoordinates(point) {
    let diameterInput, angleInput, cutterDiameterInput, resultElement;

    if (point === 'bottom') {
        diameterInput = document.getElementById("diameterBottom");
        angleInput = document.getElementById("angleBottom");
        cutterDiameterInput = document.getElementById("cutterDiameterBottom");
        resultElement = document.getElementById("resultBottom");
    } else {
        diameterInput = document.getElementById("diameterTop");
        angleInput = document.getElementById("angleTop");
        cutterDiameterInput = document.getElementById("cutterDiameterTop");
        resultElement = document.getElementById("resultTop");
    }

    const diameter = parseFloat(diameterInput.value);
    const angle = parseFloat(angleInput.value);
    const cutterDiameter = parseFloat(cutterDiameterInput.value);

    if (isNaN(diameter) || diameter <= 0 || isNaN(angle) || angle < 0 || angle > 360 || isNaN(cutterDiameter) || cutterDiameter < 0) {
        showError(point === 'bottom' ? 'resultBottom' : 'resultTop', 'Пожалуйста, заполните все поля!');
        return;
    }

    const radius = diameter / 2;
    const angleInRadians = (angle * Math.PI) / 180;
    let x, y;

    if (point === 'bottom') {
        x = (radius - cutterDiameter) * Math.cos(angleInRadians);
        y = (radius - cutterDiameter) * Math.sin(angleInRadians);
    } else {
        x = (radius + cutterDiameter) * Math.cos(angleInRadians);
        y = (radius + cutterDiameter) * Math.sin(angleInRadians);
    }

            // Форматируем до 3 знаков после запятой
            const formattedXcenter = x.toFixed(3);
            const formattedYcenter = y.toFixed(3);
        
            // Выводим значение в элемент с id "resultBottom and resultTop"
            resultElement.innerHTML = `Координаты отверстия: <strong>X = ${formattedXcenter}</strong>, <strong>Y = ${formattedYcenter}</strong>`;
    }

    // select second

    function calculateFaskaAngle() {
        // Находим данные формы в зависимости от типа окна
        const CoordinateOsi = parseFloat(document.getElementById('CoordinateOsi').value);
        const CoordinateAngle = parseFloat(document.getElementById('CoordinateAngle').value);
    
        if (!CoordinateOsi || !CoordinateAngle) {
            showError('FaskaAngleResult', 'Пожалуйста, заполните все поля!');
            return;
        }

            //* Расчёты угла по X и Y
        const RadianFask = (CoordinateAngle * Math.PI) / 180;
        const AngCoodinateTan = Math.tan(RadianFask);
        const ResultCoordinate = AngCoodinateTan * CoordinateOsi

        //Выводим значение в элемент с id "TreugolnickResult"
        const ResultFix = ResultCoordinate.toFixed(4);

        document.getElementById('FaskaAngleResult').innerHTML = `Координата оси(?): <strong>${ResultFix} мм</strong>`;
    }

        // select three
    
        function calculateTreugolnick() {
        // Находим данные формы в зависимости от типа окна
        const CoordinateX = parseFloat(document.getElementById('CoordinateX').value);
        const CoordinateY = parseFloat(document.getElementById('CoordinateY').value);
    
        if (!CoordinateX || !CoordinateY) {
            showError('TreugolnickResult', 'Пожалуйста, заполните все поля!');
            return;
        }

            //* Расчёты угла по X и Y
        const angleCoorRadians = Math.atan2(CoordinateX,CoordinateY);

        const angleCoorDegrees = angleCoorRadians * (180/Math.PI);

        const Pifagor = Math.sqrt(Math.pow(CoordinateX,2) + Math.pow(CoordinateY,2));

        //Выводим значение в элемент с id "TreugolnickResult"
        const formattedangle = angleCoorDegrees.toFixed(4);
        const formattedPifagor = Pifagor.toFixed(4);

        document.getElementById('TreugolnickResult').innerHTML = `Угол данных координат: <strong>${formattedangle}°</strong>, длинна угла: <strong>${formattedPifagor}</strong>`;
    }

// Расчёт координат отверстий

function calculateHoleCoordinates() {
    const pitchDiameterInput = document.getElementById("pitchDiameter");
    const angleInput = document.getElementById("angleHole");

    const pitchDiameter = parseFloat(pitchDiameterInput.value);
    const angle = parseFloat(angleInput.value);

    if (isNaN(pitchDiameter) || pitchDiameter <= 0 || isNaN(angle) || angle < 0 || angle > 360) {
        showError('resultHole', 'Пожалуйста, введите корректные данные.');
        return;
    }

    const radius = pitchDiameter / 2;
    const angleInRadians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);

    // Форматируем до 3 знаков после запятой
    const formattedX = x.toFixed(2);
    const formattedY = y.toFixed(2);

    // Выводим значение в элемент с id "resultHole"
    document.getElementById("resultHole").innerHTML = `Координаты отверстия: <strong>X = ${formattedX}</strong>, <strong>Y = ${formattedY}</strong>`;
}

// Расчет для эвольвентных шлицов
function calculateGear() {
    // Получение входных данных
    const numTeeth = parseFloat(document.getElementById('numTeeth').value);
    const module = parseFloat(document.getElementById('module').value);
    const diameterNom = parseFloat(document.getElementById('diameterHeight').value);

    if (!numTeeth || !module || !diameterNom ) {
        showError('results', 'Пожалуйста, заполните все поля!');
        return;
    }

    // Расчёт делительного диаметра
    const pitchCircle = module * numTeeth;

    // Фаска или радиус притупления продольной кромки
    const FaskaVtulki = 0.15 * module;

    // Угол профиля
    const degrees = 30;
    const profile = degrees * (Math.PI / 180);

    // Смещение исходного контура
    const displacement = 0.5*(diameterNom - module * numTeeth - 1.1 * module);

    // Коэффициент смещения исходного конутра
    const displacementCoefficient = displacement / module; 

    // Диаметр ролика
        // Получаем выбранную формулу
        const selectedFormulaValue = parseFloat(document.getElementById('formulaSelect').value);
        // Вычисляем rollerDiameter
        const rollerDiameter = selectedFormulaValue * module;


    // Эвольвента угла профиля в точке на концентрической окружности зубчатого колеса, проходящей через центр ролика(шарика)
        
    const inv = - (rollerDiameter / numTeeth / module/ Math.cos(profile)) + (Math.tan(profile) - profile) + 
    ((Math.PI / 2 + 2 * displacementCoefficient * Math.tan(profile)) / numTeeth);

    // Угол профиля в точке на концентрической окружности зубчатого колеса, проходящей через центр ролика(шарика)

        const term1 = Math.cbrt(3 * inv);
        const term2 = (2 * inv) / 5;
        const term3 = (9 / 175) * Math.pow(3, 2 / 3) * Math.pow(inv, 5 / 3);
        const term4 = (-(2 / 175) * Math.cbrt(3) * Math.pow(inv, 7 / 3));
        const term5 = (-(144 / 67375) * Math.pow(inv, 3));
        const term6 = (3258 / 3128125) * Math.pow(3, 2 / 3) * Math.pow(inv, 11 / 3);
        const term7 = (-(49711 / 153278125) * Math.cbrt(3) * Math.pow(inv, 13 / 3));
        const term8 = (-(1130112 / 9306171875) * Math.pow(inv, 5));
        const term9 = (5169659643 / 95304506171875) * Math.pow(3, 2 / 3) * Math.pow(inv, 17 / 3);
        const Ad = term1 - term2 + term3 + term4 + term5 + term6 + term7 + term8 + term9;

    // 1 - z нечётное, 0 - z четное

    const checkTeeth = (numTeeth % 2 === 0) ? 0 : 1;

 
    // Расстояние между роликами
    const distanceBetweenRollers = (numTeeth * module * Math.cos(profile) / Math.cos(Ad) * Math.cos(Math.PI / 2 / numTeeth * checkTeeth)) - rollerDiameter;

    // Угол профиля в точке на концентрической окружности диаметра
    let numerator = numTeeth * Math.cos(profile);
    let denominator = numTeeth + 2 * displacementCoefficient * Math.cos(0);
    let acosValue = Math.acos(numerator / denominator);

    // Преобразуем результат из радианов в градусы для aX
    let aX = acosValue * (180 / Math.PI);

    // Число зубьев на длине общей нормали
    const teethOnNormal = (numTeeth / Math.PI * (Math.tan(acosValue) - 2 * displacementCoefficient * Math.tan(profile) / numTeeth  - (Math.tan(profile) - profile))) + 0.5;
    const teethOnNormalIntValue = Math.round(teethOnNormal);

    // Длина общей нормали
    const normalLength = module * Math.cos(profile) * (Math.PI * (teethOnNormalIntValue - 0.5) + 2 * displacementCoefficient * Math.tan(profile) + numTeeth * (Math.tan(profile) - profile));


    // Вывод результатов
    const formattedDisplacementCoefficient = displacementCoefficient.toFixed(3)
    const formattedPitchCircle = pitchCircle.toFixed(3)
    const formattedRollerDiameter = rollerDiameter.toFixed(3)
    const formattedDistanceBetweenRollers = distanceBetweenRollers.toFixed(3)
    const formattedTeethOnNormalIntValue = teethOnNormalIntValue
    const formattedNormalLength = normalLength.toFixed(3)
    const formattedFaskaVtulki = FaskaVtulki.toFixed(2)
    document.getElementById('displacementCoefficient').innerHTML = `Коэффициент смещения исходного контура: <strong>${formattedDisplacementCoefficient}</strong>`;
    document.getElementById('pitchCircle').innerHTML = `Делительный диаметр (мм): <strong>${formattedPitchCircle}</strong>`;
    document.getElementById('rollerDiameter').innerHTML = `Диаметр ролика (мм): <strong>${formattedRollerDiameter}</strong>`;
    document.getElementById('distanceBetweenRollers').innerHTML = `Расстояние между роликами (мм): <strong>${formattedDistanceBetweenRollers}</strong>`;
    document.getElementById('teethOnNormal').innerHTML = `Число зубьев на длине общей нормали: <strong>${formattedTeethOnNormalIntValue}</strong>`;
    document.getElementById('normalLength').innerHTML = `Длинна общей нормали (мм): <strong>${formattedNormalLength}</strong>`;
    document.getElementById('FaskaVtulki').innerHTML = `Фаска или радиус притупления продольной кромки: <strong>${formattedFaskaVtulki}</strong>`;
}

function calculateContactCircle() {
    // Получение данных из формы
    const numTeeth = parseFloat(document.getElementById('numTeeth').value);
    const module = parseFloat(document.getElementById('module').value);
    const normalW = parseFloat(document.getElementById('normalW').value);
    const dopuskW = parseFloat(document.getElementById('dopuskW').value);

    // Проверка корректности данных
    if (!numTeeth || !module) {
        showError('resultsW', 'Сначала выполните расчёт шлицев!');
        return;
    }

    if (isNaN(normalW) || normalW <= 0 || isNaN(dopuskW) || dopuskW < -1) {
        showError('resultsW', 'Пожалуйста, введите корректные данные для длины общей нормали и допуска!');
        return;
    }

    // Угол профиля в радианах (30 градусов)
    const profileAngle = 30 * (Math.PI / 180);

    // Диаметр основной окружности
    const Db = module * numTeeth * Math.cos(profileAngle);

    // Расчёт диаметра окружности точек касания с учётом допуска
    const W_with_tolerance = normalW + dopuskW;
    const contactDiameter_with_tolerance = 2 * Math.sqrt(Math.pow(Db / 2, 2) + Math.pow(W_with_tolerance / 2, 2));

    // Вывод результатов
    document.getElementById('contactCircleDiameter_tolerance').innerHTML = `Диаметр окружности точек касания (с допуском, мм): <strong>${contactDiameter_with_tolerance.toFixed(3)}</strong>`;
}

// Впадина зуба
function calculateSocket() {
    const toothPitch = document.getElementById("pitchTooth");
    const toothModule = document.getElementById("moduleTooth");
    const toothCoeff = document.getElementById("coeffTooth");
    const resultEl = document.getElementById("resultSocket");

    const pitchTooth = parseFloat(toothPitch.value);
    const moduleTooth = parseFloat(toothModule.value);
    const coeffTooth = parseFloat(toothCoeff.value);

    if (isNaN(pitchTooth) || pitchTooth <= 0 || isNaN(moduleTooth) || moduleTooth < 0 || isNaN(coeffTooth) || coeffTooth < -10) {
        showError('resultSocket', 'Пожалуйста, введите корректные данные.');
        return;
    }

    const SocketTooth = calculateSocketTooth(pitchTooth, moduleTooth, coeffTooth);
    const formattedSocketTooth = SocketTooth.toFixed(4)
    resultEl.innerHTML = `Диаметр впадин зубчатого колеса (df): <strong>${formattedSocketTooth} мм</strong>`;

function calculateSocketTooth(pitchTooth, moduleTooth, coeffTooth) {
    const sockTooth = pitchTooth - 2 * moduleTooth * (1.25 - coeffTooth);

    return sockTooth;
}

}

function calculatePitch() {
    const numbTeeth = document.getElementById("teethNumb");
    const modulePitch = document.getElementById("pitchModule");
    const pitchAngle = document.getElementById("anglePitch");
    const resultEl = document.getElementById("resultPitch");

    const teethNumb = parseFloat(numbTeeth.value);
    const pitchModule = parseFloat(modulePitch.value);
    const anglePitch = parseFloat(pitchAngle.value);
    const radianPitch = (anglePitch * (Math.PI / 180))

    if (isNaN(teethNumb) || teethNumb <= 0 || isNaN(pitchModule) || pitchModule < 0 || isNaN(anglePitch) || anglePitch < 0) {
        showError('resultPitch', "Пожалуйста, введите корректные данные.");
        return;
    }

    const pitchDm = calculatepitchDm(teethNumb, pitchModule, radianPitch);
    const formattedPitchDm = pitchDm.toFixed(4)
    resultEl.innerHTML = `Делительный диаметр (d): <strong>${formattedPitchDm} мм</strong>`;

function calculatepitchDm(teethNumb, pitchModule, radianPitch) {
    const dmPitch = (teethNumb * pitchModule) / Math.cos(radianPitch);

    return dmPitch;
}
}

// Допуски и посадки
// Переключение между вкладками отверстия/валы
function switchTolTab(evt, tabName) {
    var tabcontents = document.getElementsByClassName("tolerance-tab");
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
    
    // Обновление активной кнопки
    var buttons = evt.currentTarget.parentElement.getElementsByClassName("tab-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    evt.currentTarget.classList.add("active");
}

function calculateTolerance(type) {
    if (type === 'holes') {
        calculateHolesTolerance();
    } else if (type === 'shafts') {
        calculateShaftsTolerance();
    }
}

function calculateHolesTolerance() {
    const diameterDop = parseFloat(document.getElementById('diameterDop').value);
    const toleranceClass = document.getElementById('toleranceClass').value;
    let tolerance = '';

    // Валидация входных данных
    if (!diameterDop || diameterDop < 0 || diameterDop > 3150) {
        document.getElementById('result').innerHTML = `<span style="color: #FF6B6B;">⚠️ Ошибка: Введите диаметр в пределах от 0 до 3150 мм</span>`;
        return;
    }

    if (diameterDop >= 0 && diameterDop <= 3150) {
        // Здесь вычисляем допуск в зависимости от класса точности
        switch (toleranceClass) {
            case 'H1':
                tolerance = getToleranceH1(diameterDop);
                break;
            case 'H2':
                tolerance = getToleranceH2(diameterDop);
                break;
            case 'H3':
                tolerance = getToleranceH3(diameterDop);
                break;
            case 'H4':
                tolerance = getToleranceH4(diameterDop);
                break;
            case 'H5':
                tolerance = getToleranceH5(diameterDop);
                break;
            case 'H6':
                tolerance = getToleranceH6(diameterDop);
                break;
            case 'H7':
                tolerance = getToleranceH7(diameterDop);
                break;
            case 'H8':
                tolerance = getToleranceH8(diameterDop);
                break;
            case 'H9':
                tolerance = getToleranceH9(diameterDop);
                break;
            case 'H10':
                tolerance = getToleranceH10(diameterDop);
                break;
            case 'H11':
                tolerance = getToleranceH11(diameterDop);
                break;
            case 'H12':
                tolerance = getToleranceH12(diameterDop);
                break;
            case 'H13':
                tolerance = getToleranceH13(diameterDop);
                break;
            case 'H14':
                tolerance = getToleranceH14(diameterDop);
                break;
            case 'H15':
                tolerance = getToleranceH15(diameterDop);
                break;
            case 'H16':
                tolerance = getToleranceH16(diameterDop);
                break;
            case 'H17':
                tolerance = getToleranceH17(diameterDop);
                break;
            case 'H18':
                tolerance = getToleranceH18(diameterDop);
                break;
            case 'JS5':
                tolerance = getToleranceJS6(diameterDop);
                break;
            case 'JS6':
                tolerance = getToleranceJS6(diameterDop);
                break;
            case 'JS7':
                tolerance = getToleranceJS7(diameterDop);
                break;
            case 'JS8':
                tolerance = getToleranceJS8(diameterDop);
                break;
            case 'JS9':
                tolerance = getToleranceJS9(diameterDop);
                break;
            case 'JS10':
                tolerance = getToleranceJS10(diameterDop);
                break;
            case 'JS11':
                tolerance = getToleranceJS11(diameterDop);
                break;
            case 'JS12':
                tolerance = getToleranceJS12(diameterDop);
                break;
            case 'JS13':
                tolerance = getToleranceJS13(diameterDop);
                break;
            case 'JS14':
                tolerance = getToleranceJS14(diameterDop);
                break;
            case 'JS15':
                tolerance = getToleranceJS15(diameterDop);
                break;
            case 'JS16':
                tolerance = getToleranceJS16(diameterDop);
                break;
            case 'JS17':
                tolerance = getToleranceJS17(diameterDop);
                break;
            case 'JS18':
                tolerance = getToleranceJS18(diameterDop);
                break;
            case 'A9':
                tolerance = getToleranceA9(diameterDop);
                break;
            case 'A10':
                tolerance = getToleranceA10(diameterDop);
                break;
            case 'A11':
                tolerance = getToleranceA11(diameterDop);
                break;
            case 'A12':
                tolerance = getToleranceA12(diameterDop);
                break;
            case 'A13':
                tolerance = getToleranceA13(diameterDop);
                break;
            case 'B8':
                tolerance = getToleranceB8(diameterDop);
                break;
            case 'B9':
                tolerance = getToleranceB9(diameterDop);
                break;
            case 'B10':
                tolerance = getToleranceB10(diameterDop);
                break;
            case 'B11':
                tolerance = getToleranceB11(diameterDop);
                break;
            case 'B12':
                tolerance = getToleranceB12(diameterDop);
                break;
            case 'B13':
                tolerance = getToleranceB13(diameterDop);
                break;
            case 'C8':
                tolerance = getToleranceC8(diameterDop);
                break;
            case 'C9':
                tolerance = getToleranceC9(diameterDop);
                break;
            case 'C10':
                tolerance = getToleranceC10(diameterDop);
                break;
            case 'C11':
                tolerance = getToleranceC11(diameterDop);
                break;
            case 'C12':
                tolerance = getToleranceC12(diameterDop);
                break;
            case 'C13':
                tolerance = getToleranceC13(diameterDop);
                break;
            case 'D6':
                tolerance = getToleranceD6(diameterDop);
                break;
            case 'D7':
                tolerance = getToleranceD7(diameterDop);
                break;
            case 'D8':
                tolerance = getToleranceD8(diameterDop);
                break;
            case 'D9':
                tolerance = getToleranceD9(diameterDop);
                break;
            case 'D10':
                tolerance = getToleranceD10(diameterDop);
                break;
            case 'D11':
                tolerance = getToleranceD11(diameterDop);
                break;
            case 'D12':
                tolerance = getToleranceD12(diameterDop);
                break;
            case 'D13':
                tolerance = getToleranceD13(diameterDop);
                break;
            case 'E5':
                tolerance = getToleranceE5(diameterDop);
                break;
            case 'E6':
                tolerance = getToleranceE6(diameterDop);
                break;
            case 'E7':
                tolerance = getToleranceE7(diameterDop);
                break;
            case 'E8':
                tolerance = getToleranceE8(diameterDop);
                break;
            case 'E9':
                tolerance = getToleranceE9(diameterDop);
                break;
            case 'E10':
                tolerance = getToleranceE10(diameterDop);
                break;
            case 'F3':
                tolerance = getToleranceF3(diameterDop);
                break;
            case 'F4':
                tolerance = getToleranceF4(diameterDop);
                break;
            case 'F5':
                tolerance = getToleranceF5(diameterDop);
                break;
            case 'F6':
                tolerance = getToleranceF6(diameterDop);
                break;
            case 'F7':
                tolerance = getToleranceF7(diameterDop);
                break;
            case 'F8':
                tolerance = getToleranceF8(diameterDop);
                break;
            case 'F9':
                tolerance = getToleranceF9(diameterDop);
                break;
            case 'F10':
                tolerance = getToleranceF10(diameterDop);
                break;
            case 'G3':
                tolerance = getToleranceG3(diameterDop);
                break;
            case 'G4':
                tolerance = getToleranceG4(diameterDop);
                break;
            case 'G5':
                tolerance = getToleranceG5(diameterDop);
                break;
            case 'G6':
                tolerance = getToleranceG6(diameterDop);
                break;
            case 'G7':
                tolerance = getToleranceG7(diameterDop);
                break;
            case 'G8':
                tolerance = getToleranceG8(diameterDop);
                break;
            case 'G9':
                tolerance = getToleranceG9(diameterDop);
                break;
            case 'G10':
                tolerance = getToleranceG10(diameterDop);
                break;
            case 'J6':
                tolerance = getToleranceJ6(diameterDop);
                break;
            case 'J7':
                tolerance = getToleranceJ7(diameterDop);
                break;
            case 'J8':
                tolerance = getToleranceJ8(diameterDop);
                break;
            case 'K3':
                tolerance = getToleranceK3(diameterDop);
                break;
            case 'K4':
                tolerance = getToleranceK4(diameterDop);
                break;
            case 'K5':
                tolerance = getToleranceK5(diameterDop);
                break;
            case 'K6':
                tolerance = getToleranceK6(diameterDop);
                break;
            case 'K7':
                tolerance = getToleranceK7(diameterDop);
                break;
            case 'K8':
                tolerance = getToleranceK8(diameterDop);
                break;
            case 'K9':
                tolerance = getToleranceK9(diameterDop);
                break;
            case 'K10':
                tolerance = getToleranceK10(diameterDop);
                break;
            case 'M3':
                tolerance = getToleranceM3(diameterDop);
                break;
            case 'M4':
                tolerance = getToleranceM4(diameterDop);
                break;
            case 'M5':
                tolerance = getToleranceM5(diameterDop);
                break;
            case 'M6':
                tolerance = getToleranceM6(diameterDop);
                break;
            case 'M7':
                tolerance = getToleranceM7(diameterDop);
                break;
            case 'M8':
                tolerance = getToleranceM8(diameterDop);
                break;
            case 'M9':
                tolerance = getToleranceM9(diameterDop);
                break;
            case 'M10':
                tolerance = getToleranceM10(diameterDop);
                break;
            case 'N3':
                tolerance = getToleranceN3(diameterDop);
                break;
            case 'N4':
                tolerance = getToleranceN4(diameterDop);
                break;
            case 'N5':
                tolerance = getToleranceN5(diameterDop);
                break;
            case 'N6':
                tolerance = getToleranceN6(diameterDop);
                break;
            case 'N7':
                tolerance = getToleranceN7(diameterDop);
                break;
            case 'N8':
                tolerance = getToleranceN8(diameterDop);
                break;
            case 'N9':
                tolerance = getToleranceN9(diameterDop);
                break;
            case 'N10':
                tolerance = getToleranceN10(diameterDop);
                break;
            case 'N11':
                tolerance = getToleranceN11(diameterDop);
                break;
            case 'P3':
                tolerance = getToleranceP3(diameterDop);
                break;
            case 'P4':
                tolerance = getToleranceP4(diameterDop);
                break;
            case 'P5':
                tolerance = getToleranceP5(diameterDop);
                break;
            case 'P6':
                tolerance = getToleranceP6(diameterDop);
                break;
            case 'P7':
                tolerance = getToleranceP7(diameterDop);
                break;
            case 'P8':
                tolerance = getToleranceP8(diameterDop);
                break;
            case 'P9':
                tolerance = getToleranceP9(diameterDop);
                break;
            case 'P10':
                tolerance = getToleranceP10(diameterDop);
                break;
            default:
                tolerance = 'Неверный класс точности';
        }

        document.getElementById('result').innerHTML = `Диаметр: <strong>${diameterDop} мм</strong><br>Класс точности: <strong>${toleranceClass}</strong><br>Допуск: ${tolerance}`;
    } else {
        showError('result', 'Введите диаметр в пределах от 0 до 3150 мм');
    }
}

// Функции расчета допусков для каждого класса точности (пример)
function getToleranceH1(diameterDop) {
    if (diameterDop <= 3) return '<b>+0,0008 мм';
    if (diameterDop <= 6) return '<b>+0,001мм';
    if (diameterDop <= 10) return '<b>+0,001 мм';
    if (diameterDop <= 18) return '<b>+0,0012 мм';
    if (diameterDop <= 30) return '<b>+0,0015 мм';
    if (diameterDop <= 50) return '<b>+0,0015 мм';
    if (diameterDop <= 80) return '<b>+0,002 мм';
    if (diameterDop <= 120) return '<b>+0,0025 мм';
    if (diameterDop <= 180) return '<b>+0,0035 мм';
    if (diameterDop <= 250) return '<b>+0,0045 мм';
    if (diameterDop <= 315) return '<b>+0,006 мм';
    if (diameterDop <= 400) return '<b>+0,007 мм';
    if (diameterDop <= 500) return '<b>+0,008 мм';
    if (diameterDop <= 630) return '<b>+0,009 мм';
    if (diameterDop <= 800) return '<b>+0,01 мм';
    if (diameterDop <= 1000) return '<b>+0,011 мм';
    if (diameterDop <= 1250) return '<b>+0,013 мм';
    if (diameterDop <= 1600) return '<b>+0,015 мм';
    if (diameterDop <= 2000) return '<b>+0,018 мм';
    if (diameterDop <= 2500) return '<b>+0,022 мм';
    if (diameterDop <= 3150) return '<b>+0,026 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH2(diameterDop) {
    if (diameterDop <= 3) return '<b>+0,0012 мм';
    if (diameterDop <= 6) return '<b>+0,0015 мм';
    if (diameterDop <= 10) return '<b>+0,0015 мм';
    if (diameterDop <= 18) return '<b>+0,002 мм';
    if (diameterDop <= 30) return '<b>+0,0025 мм';
    if (diameterDop <= 50) return '<b>+0,0025 мм';
    if (diameterDop <= 80) return '<b>+0,003 мм';
    if (diameterDop <= 120) return '<b>+0,004 мм';
    if (diameterDop <= 180) return '<b>+0,005мм';
    if (diameterDop <= 250) return '<b>+0,007 мм';
    if (diameterDop <= 315) return '<b>+0,008 мм';
    if (diameterDop <= 400) return '<b>+0,009 мм';
    if (diameterDop <= 500) return '<b>+0,01 мм';
    if (diameterDop <= 630) return '<b>+0,011 мм';
    if (diameterDop <= 800) return '<b>+0,013 мм';
    if (diameterDop <= 1000) return '<b>+0,015 мм';
    if (diameterDop <= 1250) return '<b>+0,018 мм';
    if (diameterDop <= 1600) return '<b>+0,021 мм';
    if (diameterDop <= 2000) return '<b>+0,025 мм';
    if (diameterDop <= 2500) return '<b>+0,03 мм';
    if (diameterDop <= 3150) return '<b>+0,036 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH3(diameterDop) {
    if (diameterDop <= 3) return '<b>+0,002 мм';
    if (diameterDop <= 6) return '<b>+0,0025 мм';
    if (diameterDop <= 10) return '<b>+0,0025 мм';
    if (diameterDop <= 18) return '<b>+0.003 мм';
    if (diameterDop <= 30) return '<b>+0.004 мм';
    if (diameterDop <= 50) return '<b>+0.004 мм';
    if (diameterDop <= 80) return '<b>+0.005 мм';
    if (diameterDop <= 120) return '<b>+0.006 мм';
    if (diameterDop <= 180) return '<b>+0.008 мм';
    if (diameterDop <= 250) return '<b>+0.01 мм';
    if (diameterDop <= 315) return '<b>+0.012 мм';
    if (diameterDop <= 400) return '<b>+0.013 мм';
    if (diameterDop <= 500) return '<b>+0.015 мм';
    if (diameterDop <= 630) return '<b>+0.016 мм';
    if (diameterDop <= 800) return '<b>+0.018 мм';
    if (diameterDop <= 1000) return '<b>+0.021 мм';
    if (diameterDop <= 1250) return '<b>+0.024 мм';
    if (diameterDop <= 1600) return '<b>+0.029 мм';
    if (diameterDop <= 2000) return '<b>+0.035 мм';
    if (diameterDop <= 2500) return '<b>+0.041 мм';
    if (diameterDop <= 3150) return '<b>+0.05 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH4(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.003 мм';
    if (diameterDop <= 6) return '<b>+0.004 мм';
    if (diameterDop <= 10) return '<b>+0.004 мм';
    if (diameterDop <= 18) return '<b>+0.005 мм';
    if (diameterDop <= 30) return '<b>+0.006 мм';
    if (diameterDop <= 50) return '<b>+0.007 мм';
    if (diameterDop <= 80) return '<b>+0.008 мм';
    if (diameterDop <= 120) return '<b>+0.01 мм';
    if (diameterDop <= 180) return '<b>+0.012 мм';
    if (diameterDop <= 250) return '<b>+0.014 мм';
    if (diameterDop <= 315) return '<b>+0.016 мм';
    if (diameterDop <= 400) return '<b>+0.018 мм';
    if (diameterDop <= 500) return '<b>+0.02 мм';
    if (diameterDop <= 630) return '<b>+0.022 мм';
    if (diameterDop <= 800) return '<b>+0.025 мм';
    if (diameterDop <= 1000) return '<b>+0.028 мм';
    if (diameterDop <= 1250) return '<b>+0.033 мм';
    if (diameterDop <= 1600) return '<b>+0.039 мм';
    if (diameterDop <= 2000) return '<b>+0.046 мм';
    if (diameterDop <= 2500) return '<b>+0.055 мм';
    if (diameterDop <= 3150) return '<b>+0.068 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH5(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.004 мм';
    if (diameterDop <= 6) return '<b>+0.005 мм';
    if (diameterDop <= 10) return '<b>+0.006 мм';
    if (diameterDop <= 18) return '<b>+0.008 мм';
    if (diameterDop <= 30) return '<b>+0.009 мм';
    if (diameterDop <= 50) return '<b>+0.011 мм';
    if (diameterDop <= 80) return '<b>+0.013 мм';
    if (diameterDop <= 120) return '<b>+0.015 мм';
    if (diameterDop <= 180) return '<b>+0.018 мм';
    if (diameterDop <= 250) return '<b>+0.02 мм';
    if (diameterDop <= 315) return '<b>+0.023 мм';
    if (diameterDop <= 400) return '<b>+0.025 мм';
    if (diameterDop <= 500) return '<b>+0.027 мм';
    if (diameterDop <= 630) return '<b>+0.032 мм';
    if (diameterDop <= 800) return '<b>+0.036 мм';
    if (diameterDop <= 1000) return '<b>+0.04 мм';
    if (diameterDop <= 1250) return '<b>+0.047 мм';
    if (diameterDop <= 1600) return '<b>+0.055 мм';
    if (diameterDop <= 2000) return '<b>+0.065 мм';
    if (diameterDop <= 2500) return '<b>+0.078 мм';
    if (diameterDop <= 3150) return '<b>+0.096 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH6(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.006 мм';
    if (diameterDop <= 6) return '<b>+0.008 мм';
    if (diameterDop <= 10) return '<b>+0.009 мм';
    if (diameterDop <= 18) return '<b>+0.011 мм';
    if (diameterDop <= 30) return '<b>+0.013 мм';
    if (diameterDop <= 50) return '<b>+0.016 мм';
    if (diameterDop <= 80) return '<b>+0.019 мм';
    if (diameterDop <= 120) return '<b>+0.022 мм';
    if (diameterDop <= 180) return '<b>+0.025 мм';
    if (diameterDop <= 250) return '<b>+0.029 мм';
    if (diameterDop <= 315) return '<b>+0.032 мм';
    if (diameterDop <= 400) return '<b>+0.036 мм';
    if (diameterDop <= 500) return '<b>+0.04 мм';
    if (diameterDop <= 630) return '<b>+0.044 мм';
    if (diameterDop <= 800) return '<b>+0.05 мм';
    if (diameterDop <= 1000) return '<b>+0.056 мм';
    if (diameterDop <= 1250) return '<b>+0.066 мм';
    if (diameterDop <= 1600) return '<b>+0.078 мм';
    if (diameterDop <= 2000) return '<b>+0.092 мм';
    if (diameterDop <= 2500) return '<b>+0.11 мм';
    if (diameterDop <= 3150) return '<b>+0.135 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH7(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.01 мм';
    if (diameterDop <= 6) return '<b>+0.012 мм';
    if (diameterDop <= 10) return '<b>+0.015 мм';
    if (diameterDop <= 18) return '<b>+0.018 мм';
    if (diameterDop <= 30) return '<b>+0.021 мм';
    if (diameterDop <= 50) return '<b>+0.025 мм';
    if (diameterDop <= 80) return '<b>+0.03 мм';
    if (diameterDop <= 120) return '<b>+0.035 мм';
    if (diameterDop <= 180) return '<b>+0.04 мм';
    if (diameterDop <= 250) return '<b>+0.046 мм';
    if (diameterDop <= 315) return '<b>+0.052 мм';
    if (diameterDop <= 400) return '<b>+0.057 мм';
    if (diameterDop <= 500) return '<b>+0.063 мм';
    if (diameterDop <= 630) return '<b>+0.07 мм';
    if (diameterDop <= 800) return '<b>+0.08 мм';
    if (diameterDop <= 1000) return '<b>+0.09 мм';
    if (diameterDop <= 1250) return '<b>+0.105 мм';
    if (diameterDop <= 1600) return '<b>+0.125 мм';
    if (diameterDop <= 2000) return '<b>+0.15 мм';
    if (diameterDop <= 2500) return '<b>+0.175 мм';
    if (diameterDop <= 3150) return '<b>+0.21 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH8(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.014 мм';
    if (diameterDop <= 6) return '<b>+0.018 мм';
    if (diameterDop <= 10) return '<b>+0.022 мм';
    if (diameterDop <= 18) return '<b>+0.027 мм';
    if (diameterDop <= 30) return '<b>+0.033 мм';
    if (diameterDop <= 50) return '<b>+0.039 мм';
    if (diameterDop <= 80) return '<b>+0.046 мм';
    if (diameterDop <= 120) return '<b>+0.054 мм';
    if (diameterDop <= 180) return '<b>+0.063 мм';
    if (diameterDop <= 250) return '<b>+0.072 мм';
    if (diameterDop <= 315) return '<b>+0.081 мм';
    if (diameterDop <= 400) return '<b>+0.089 мм';
    if (diameterDop <= 500) return '<b>+0.097 мм';
    if (diameterDop <= 630) return '<b>+0.11 мм';
    if (diameterDop <= 800) return '<b>+0.125 мм';
    if (diameterDop <= 1000) return '<b>+0.14 мм';
    if (diameterDop <= 1250) return '<b>+0.165 мм';
    if (diameterDop <= 1600) return '<b>+0.195 мм';
    if (diameterDop <= 2000) return '<b>+0.23 мм';
    if (diameterDop <= 2500) return '<b>+0.28 мм';
    if (diameterDop <= 3150) return '<b>+0.33 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH9(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.025 мм';
    if (diameterDop <= 6) return '<b>+0.03 мм';
    if (diameterDop <= 10) return '<b>+0.036 мм';
    if (diameterDop <= 18) return '<b>+0.043 мм';
    if (diameterDop <= 30) return '<b>+0.052 мм';
    if (diameterDop <= 50) return '<b>+0.062 мм';
    if (diameterDop <= 80) return '<b>+0.074 мм';
    if (diameterDop <= 120) return '<b>+0.087 мм';
    if (diameterDop <= 180) return '<b>+0.1 мм';
    if (diameterDop <= 250) return '<b>+0.115 мм';
    if (diameterDop <= 315) return '<b>+0.13 мм';
    if (diameterDop <= 400) return '<b>+0.14 мм';
    if (diameterDop <= 500) return '<b>+0.155 мм';
    if (diameterDop <= 630) return '<b>+0.175 мм';
    if (diameterDop <= 800) return '<b>+0.2 мм';
    if (diameterDop <= 1000) return '<b>+0.23 мм';
    if (diameterDop <= 1250) return '<b>+0.26 мм';
    if (diameterDop <= 1600) return '<b>+0.31 мм';
    if (diameterDop <= 2000) return '<b>+0.37 мм';
    if (diameterDop <= 2500) return '<b>+0.44 мм';
    if (diameterDop <= 3150) return '<b>+0.54 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH10(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.04 мм';
    if (diameterDop <= 6) return '<b>+0.048 мм';
    if (diameterDop <= 10) return '<b>+0.058 мм';
    if (diameterDop <= 18) return '<b>+0.07 мм';
    if (diameterDop <= 30) return '<b>+0.084 мм';
    if (diameterDop <= 50) return '<b>+0.1 мм';
    if (diameterDop <= 80) return '<b>+0.12 мм';
    if (diameterDop <= 120) return '<b>+0.14 мм';
    if (diameterDop <= 180) return '<b>+0.16 мм';
    if (diameterDop <= 250) return '<b>+0.185 мм';
    if (diameterDop <= 315) return '<b>+0.21 мм';
    if (diameterDop <= 400) return '<b>+0.23 мм';
    if (diameterDop <= 500) return '<b>+0.25 мм';
    if (diameterDop <= 630) return '<b>+0.28 мм';
    if (diameterDop <= 800) return '<b>+0.32 мм';
    if (diameterDop <= 1000) return '<b>+0.36 мм';
    if (diameterDop <= 1250) return '<b>+0.42 мм';
    if (diameterDop <= 1600) return '<b>+0.5 мм';
    if (diameterDop <= 2000) return '<b>+0.6 мм';
    if (diameterDop <= 2500) return '<b>+0.7 мм';
    if (diameterDop <= 3150) return '<b>+0.86 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH11(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.06 мм';
    if (diameterDop <= 6) return '<b>+0.075 мм';
    if (diameterDop <= 10) return '<b>+0.09 мм';
    if (diameterDop <= 18) return '<b>+0.11 мм';
    if (diameterDop <= 30) return '<b>+0.13 мм';
    if (diameterDop <= 50) return '<b>+0.16 мм';
    if (diameterDop <= 80) return '<b>+0.19 мм';
    if (diameterDop <= 120) return '<b>+0.22 мм';
    if (diameterDop <= 180) return '<b>+0.25 мм';
    if (diameterDop <= 250) return '<b>+0.29 мм';
    if (diameterDop <= 315) return '<b>+0.32 мм';
    if (diameterDop <= 400) return '<b>+0.36 мм';
    if (diameterDop <= 500) return '<b>+0.4 мм';
    if (diameterDop <= 630) return '<b>+0.44 мм';
    if (diameterDop <= 800) return '<b>+0.5 мм';
    if (diameterDop <= 1000) return '<b>+0.56 мм';
    if (diameterDop <= 1250) return '<b>+0.66 мм';
    if (diameterDop <= 1600) return '<b>+0.78 мм';
    if (diameterDop <= 2000) return '<b>+0.92 мм';
    if (diameterDop <= 2500) return '<b>+1.1 мм';
    if (diameterDop <= 3150) return '<b>+1.35 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH12(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.1 мм';
    if (diameterDop <= 6) return '<b>+0.12 мм';
    if (diameterDop <= 10) return '<b>+0.15 мм';
    if (diameterDop <= 18) return '<b>+0.18 мм';
    if (diameterDop <= 30) return '<b>+0.21 мм';
    if (diameterDop <= 50) return '<b>+0.25 мм';
    if (diameterDop <= 80) return '<b>+0.3 мм';
    if (diameterDop <= 120) return '<b>+0.35 мм';
    if (diameterDop <= 180) return '<b>+0.4 мм';
    if (diameterDop <= 250) return '<b>+0.46 мм';
    if (diameterDop <= 315) return '<b>+0.52 мм';
    if (diameterDop <= 400) return '<b>+0.57 мм';
    if (diameterDop <= 500) return '<b>+0.63 мм';
    if (diameterDop <= 630) return '<b>+0.7 мм';
    if (diameterDop <= 800) return '<b>+0.8 мм';
    if (diameterDop <= 1000) return '<b>+0.9 мм';
    if (diameterDop <= 1250) return '<b>+1.05 мм';
    if (diameterDop <= 1600) return '<b>+1.25 мм';
    if (diameterDop <= 2000) return '<b>+1.5 мм';
    if (diameterDop <= 2500) return '<b>+1.75 мм';
    if (diameterDop <= 3150) return '<b>+2.1 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH13(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.14 мм';
    if (diameterDop <= 6) return '<b>+0.18 мм';
    if (diameterDop <= 10) return '<b>+0.22 мм';
    if (diameterDop <= 18) return '<b>+0.27 мм';
    if (diameterDop <= 30) return '<b>+0.33 мм';
    if (diameterDop <= 50) return '<b>+0.39 мм';
    if (diameterDop <= 80) return '<b>+0.46 мм';
    if (diameterDop <= 120) return '<b>+0.54 мм';
    if (diameterDop <= 180) return '<b>+0.63 мм';
    if (diameterDop <= 250) return '<b>+0.72 мм';
    if (diameterDop <= 315) return '<b>+0.81 мм';
    if (diameterDop <= 400) return '<b>+0.89 мм';
    if (diameterDop <= 500) return '<b>+0.97 мм';
    if (diameterDop <= 630) return '<b>+1.1 мм';
    if (diameterDop <= 800) return '<b>+1.25 мм';
    if (diameterDop <= 1000) return '<b>+1.4 мм';
    if (diameterDop <= 1250) return '<b>+1.65 мм';
    if (diameterDop <= 1600) return '<b>+1.95 мм';
    if (diameterDop <= 2000) return '<b>+2.3 мм';
    if (diameterDop <= 2500) return '<b>+2.8 мм';
    if (diameterDop <= 3150) return '<b>+3.3 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH14(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.25 мм';
    if (diameterDop <= 6) return '<b>+0.3 мм';
    if (diameterDop <= 10) return '<b>+0.36 мм';
    if (diameterDop <= 18) return '<b>+0.43 мм';
    if (diameterDop <= 30) return '<b>+0.52 мм';
    if (diameterDop <= 50) return '<b>+0.62 мм';
    if (diameterDop <= 80) return '<b>+0.74 мм';
    if (diameterDop <= 120) return '<b>+0.87 мм';
    if (diameterDop <= 180) return '<b>+1 мм';
    if (diameterDop <= 250) return '<b>+1.15 мм';
    if (diameterDop <= 315) return '<b>+1.3 мм';
    if (diameterDop <= 400) return '<b>+1.4 мм';
    if (diameterDop <= 500) return '<b>+1.55 мм';
    if (diameterDop <= 630) return '<b>+1.75 мм';
    if (diameterDop <= 800) return '<b>+2 мм';
    if (diameterDop <= 1000) return '<b>+2.3 мм';
    if (diameterDop <= 1250) return '<b>+2.6 мм';
    if (diameterDop <= 1600) return '<b>+3.1 мм';
    if (diameterDop <= 2000) return '<b>+3.7 мм';
    if (diameterDop <= 2500) return '<b>+4.4 мм';
    if (diameterDop <= 3150) return '<b>+5.4 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH15(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.4 мм';
    if (diameterDop <= 6) return '<b>+0.48 мм';
    if (diameterDop <= 10) return '<b>+0.58 мм';
    if (diameterDop <= 18) return '<b>+0.7 мм';
    if (diameterDop <= 30) return '<b>+0.84 мм';
    if (diameterDop <= 50) return '<b>+1 мм';
    if (diameterDop <= 80) return '<b>+1.2 мм';
    if (diameterDop <= 120) return '<b>+1.4 мм';
    if (diameterDop <= 180) return '<b>+1.6 мм';
    if (diameterDop <= 250) return '<b>+1.85 мм';
    if (diameterDop <= 315) return '<b>+2.1 мм';
    if (diameterDop <= 400) return '<b>+2.3 мм';
    if (diameterDop <= 500) return '<b>+2.5 мм';
    if (diameterDop <= 630) return '<b>+2.8 мм';
    if (diameterDop <= 800) return '<b>+3.2 мм';
    if (diameterDop <= 1000) return '<b>+3.6 мм';
    if (diameterDop <= 1250) return '<b>+4.2 мм';
    if (diameterDop <= 1600) return '<b>+5 мм';
    if (diameterDop <= 2000) return '<b>+6 мм';
    if (diameterDop <= 2500) return '<b>+7 мм';
    if (diameterDop <= 3150) return '<b>+8.6 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH16(diameterDop) {
    if (diameterDop <= 3) return '<b>+0.6 мм';
    if (diameterDop <= 6) return '<b>+0.75 мм';
    if (diameterDop <= 10) return '<b>+0.9 мм';
    if (diameterDop <= 18) return '<b>+1.1 мм';
    if (diameterDop <= 30) return '<b>+1.3 мм';
    if (diameterDop <= 50) return '<b>+1.6 мм';
    if (diameterDop <= 80) return '<b>+1.9 мм';
    if (diameterDop <= 120) return '<b>+2.2 мм';
    if (diameterDop <= 180) return '<b>+2.5 мм';
    if (diameterDop <= 250) return '<b>+2.9 мм';
    if (diameterDop <= 315) return '<b>+3.2 мм';
    if (diameterDop <= 400) return '<b>+3.6 мм';
    if (diameterDop <= 500) return '<b>+4 мм';
    if (diameterDop <= 630) return '<b>+4.4 мм';
    if (diameterDop <= 800) return '<b>+5 мм';
    if (diameterDop <= 1000) return '<b>+5.6 мм';
    if (diameterDop <= 1250) return '<b>+6.6 мм';
    if (diameterDop <= 1600) return '<b>+7.8 мм';
    if (diameterDop <= 2000) return '<b>+9.2 мм';
    if (diameterDop <= 2500) return '<b>+11 мм';
    if (diameterDop <= 3150) return '<b>+13.5 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH17(diameterDop) {
    if (diameterDop <= 3) return '<b>Не применяют';
    if (diameterDop <= 6) return '<b>+1.2 мм';
    if (diameterDop <= 10) return '<b>+1.5 мм';
    if (diameterDop <= 18) return '<b>+1.8 мм';
    if (diameterDop <= 30) return '<b>+2.1 мм';
    if (diameterDop <= 50) return '<b>+2.5 мм';
    if (diameterDop <= 80) return '<b>+3 мм';
    if (diameterDop <= 120) return '<b>+3.5 мм';
    if (diameterDop <= 180) return '<b>+4 мм';
    if (diameterDop <= 250) return '<b>+4.6 мм';
    if (diameterDop <= 315) return '<b>+5.2 мм';
    if (diameterDop <= 400) return '<b>+5.7 мм';
    if (diameterDop <= 500) return '<b>+6.3 мм';
    if (diameterDop <= 630) return '<b>+7 мм';
    if (diameterDop <= 800) return '<b>+8 мм';
    if (diameterDop <= 1000) return '<b>+9 мм';
    if (diameterDop <= 1250) return '<b>+10.5 мм';
    if (diameterDop <= 1600) return '<b>+12.5 мм';
    if (diameterDop <= 2000) return '<b>+15 мм';
    if (diameterDop <= 2500) return '<b>+17.5 мм';
    if (diameterDop <= 3150) return '<b>+21 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceH18(diameterDop) {
    if (diameterDop <= 3) return '<b>Не применяют';
    if (diameterDop <= 6) return '<b>+1.8 мм';
    if (diameterDop <= 10) return '<b>+2.2 мм';
    if (diameterDop <= 18) return '<b>+2.7 мм';
    if (diameterDop <= 30) return '<b>+3.3 мм';
    if (diameterDop <= 50) return '<b>+3.9 мм';
    if (diameterDop <= 80) return '<b>+4.6 мм';
    if (diameterDop <= 120) return '<b>+5.4 мм';
    if (diameterDop <= 180) return '<b>+6.3 мм';
    if (diameterDop <= 250) return '<b>+7.2 мм';
    if (diameterDop <= 315) return '<b>+8.1 мм';
    if (diameterDop <= 400) return '<b>+8.9 мм';
    if (diameterDop <= 500) return '<b>+9.7 мм';
    if (diameterDop <= 630) return '<b>+11 мм';
    if (diameterDop <= 800) return '<b>+12.5 мм';
    if (diameterDop <= 1000) return '<b>+14 мм';
    if (diameterDop <= 1250) return '<b>+16.5 мм';
    if (diameterDop <= 1600) return '<b>+19.5 мм';
    if (diameterDop <= 2000) return '<b>+23 мм';
    if (diameterDop <= 2500) return '<b>+28 мм';
    if (diameterDop <= 3150) return '<b>+33 мм';
    // Добавить реальные значения для каждого диапазона
    return 'Не рассчитан';
}

function getToleranceJS5(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.002 мм';
    if (diameterDop <= 6) return '<b>±0.0025 мм';
    if (diameterDop <= 10) return '<b>±0.003 мм';
    if (diameterDop <= 18) return '<b>±0.004 мм';
    if (diameterDop <= 30) return '<b>±0.0045 мм';
    if (diameterDop <= 50) return '<b>±0.0055 мм';
    if (diameterDop <= 80) return '<b>±0.0065 мм';
    if (diameterDop <= 120) return '<b>±0.0075 мм';
    if (diameterDop <= 180) return '<b>±0.009 мм';
    if (diameterDop <= 250) return '<b>+0.01 мм';
    if (diameterDop <= 315) return '<b>±0.0115 мм';
    if (diameterDop <= 400) return '<b>±0.0125 мм';
    if (diameterDop <= 500) return '<b>±0.0135 мм';
    if (diameterDop <= 630) return '<b>±0.016 мм';
    if (diameterDop <= 800) return '<b>±0.018 мм';
    if (diameterDop <= 1000) return '<b>±0.02 мм';
    if (diameterDop <= 1250) return '<b>±0.0235 мм';
    if (diameterDop <= 1600) return '<b>±0.0275 мм';
    if (diameterDop <= 2000) return '<b>±0.0325 мм';
    if (diameterDop <= 2500) return '<b>±0.039 мм';
    if (diameterDop <= 3150) return '<b>±0.048 мм';
    return 'Не рассчитан';
}

function getToleranceJS6(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.003 мм';
    if (diameterDop <= 6) return '<b>±0.004 мм';
    if (diameterDop <= 10) return '<b>±0.0045 мм';
    if (diameterDop <= 18) return '<b>±0.0055 мм';
    if (diameterDop <= 30) return '<b>±0.0065 мм';
    if (diameterDop <= 50) return '<b>±0.008 мм';
    if (diameterDop <= 80) return '<b>±0.0095 мм';
    if (diameterDop <= 120) return '<b>±0.011 мм';
    if (diameterDop <= 180) return '<b>±0.0125 мм';
    if (diameterDop <= 250) return '<b>+0.0145 мм';
    if (diameterDop <= 315) return '<b>±0.016 мм';
    if (diameterDop <= 400) return '<b>±0.018 мм';
    if (diameterDop <= 500) return '<b>±0.02 мм';
    if (diameterDop <= 630) return '<b>±0.022 мм';
    if (diameterDop <= 800) return '<b>±0.025 мм';
    if (diameterDop <= 1000) return '<b>±0.028 мм';
    if (diameterDop <= 1250) return '<b>±0.033 мм';
    if (diameterDop <= 1600) return '<b>±0.039 мм';
    if (diameterDop <= 2000) return '<b>±0.046 мм';
    if (diameterDop <= 2500) return '<b>±0.055 мм';
    if (diameterDop <= 3150) return '<b>±0.0675 мм';
    return 'Не рассчитан';
}

function getToleranceJS7(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.005 мм';
    if (diameterDop <= 6) return '<b>±0.006 мм';
    if (diameterDop <= 10) return '<b>±0.0075 мм';
    if (diameterDop <= 18) return '<b>±0.009 мм';
    if (diameterDop <= 30) return '<b>±0.0105 мм';
    if (diameterDop <= 50) return '<b>±0.0125 мм';
    if (diameterDop <= 80) return '<b>±0.015 мм';
    if (diameterDop <= 120) return '<b>±0.0175 мм';
    if (diameterDop <= 180) return '<b>±0.02 мм';
    if (diameterDop <= 250) return '<b>±0.023 мм';
    if (diameterDop <= 315) return '<b>±0.026 мм';
    if (diameterDop <= 400) return '<b>±0.0285 мм';
    if (diameterDop <= 500) return '<b>±0.0315 мм';
    if (diameterDop <= 630) return '<b>±0.035 мм';
    if (diameterDop <= 800) return '<b>±0.04 мм';
    if (diameterDop <= 1000) return '<b>±0.045 мм';
    if (diameterDop <= 1250) return '<b>±0.0525 мм';
    if (diameterDop <= 1600) return '<b>±0.0625 мм';
    if (diameterDop <= 2000) return '<b>±0.075 мм';
    if (diameterDop <= 2500) return '<b>±0.0875 мм';
    if (diameterDop <= 3150) return '<b>±0.105 мм';
    return 'Не рассчитан';
}

function getToleranceJS8(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.007  мм';
    if (diameterDop <= 6) return '<b>±0.009 мм';
    if (diameterDop <= 10) return '<b>±0.011 мм';
    if (diameterDop <= 18) return '<b>±0.0135 мм';
    if (diameterDop <= 30) return '<b>±0.165 мм';
    if (diameterDop <= 50) return '<b>±0.0195 мм';
    if (diameterDop <= 80) return '<b>±0.023 мм';
    if (diameterDop <= 120) return '<b>±0.027 мм';
    if (diameterDop <= 180) return '<b>±0.0315 мм';
    if (diameterDop <= 250) return '<b>±0.036 мм';
    if (diameterDop <= 315) return '<b>±0.0405 мм';
    if (diameterDop <= 400) return '<b>±0.0445 мм';
    if (diameterDop <= 500) return '<b>±0.0485 мм';
    if (diameterDop <= 630) return '<b>±0.055 мм';
    if (diameterDop <= 800) return '<b>±0.0625 мм';
    if (diameterDop <= 1000) return '<b>±0.07 мм';
    if (diameterDop <= 1250) return '<b>±0.0825 мм';
    if (diameterDop <= 1600) return '<b>±0.0975 мм';
    if (diameterDop <= 2000) return '<b>±0.115 мм';
    if (diameterDop <= 2500) return '<b>±0.14 мм';
    if (diameterDop <= 3150) return '<b>±0.165 мм';
    return 'Не рассчитан';
}

function getToleranceJS9(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.0125 мм';
    if (diameterDop <= 6) return '<b>±0.015 мм';
    if (diameterDop <= 10) return '<b>±0.018 мм';
    if (diameterDop <= 18) return '<b>±0.0215 мм';
    if (diameterDop <= 30) return '<b>±0.026 мм';
    if (diameterDop <= 50) return '<b>±0.031 мм';
    if (diameterDop <= 80) return '<b>±0.037 мм';
    if (diameterDop <= 120) return '<b>±0.0435 мм';
    if (diameterDop <= 180) return '<b>±0.05 мм';
    if (diameterDop <= 250) return '<b>±0.0575 мм';
    if (diameterDop <= 315) return '<b>±0.065 мм';
    if (diameterDop <= 400) return '<b>±0.07 мм';
    if (diameterDop <= 500) return '<b>±0.0775 мм';
    if (diameterDop <= 630) return '<b>±0.0875 мм';
    if (diameterDop <= 800) return '<b>±0.1 мм';
    if (diameterDop <= 1000) return '<b>±0.115 мм';
    if (diameterDop <= 1250) return '<b>±0.13 мм';
    if (diameterDop <= 1600) return '<b>±0.155 мм';
    if (diameterDop <= 2000) return '<b>±0.185 мм';
    if (diameterDop <= 2500) return '<b>±0.22 мм';
    if (diameterDop <= 3150) return '<b>±0.27 мм';
    return 'Не рассчитан';
}

function getToleranceJS10(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.02 мм';
    if (diameterDop <= 6) return '<b>±0.024 мм';
    if (diameterDop <= 10) return '<b>±0.029 мм';
    if (diameterDop <= 18) return '<b>±0.035 мм';
    if (diameterDop <= 30) return '<b>±0.042 мм';
    if (diameterDop <= 50) return '<b>±0.05 мм';
    if (diameterDop <= 80) return '<b>±0.06 мм';
    if (diameterDop <= 120) return '<b>±0.07 мм';
    if (diameterDop <= 180) return '<b>±0.08 мм';
    if (diameterDop <= 250) return '<b>±0.0925 мм';
    if (diameterDop <= 315) return '<b>±0.105 мм';
    if (diameterDop <= 400) return '<b>±0.115 мм';
    if (diameterDop <= 500) return '<b>±0.125 мм';
    if (diameterDop <= 630) return '<b>±0.14 мм';
    if (diameterDop <= 800) return '<b>±0.16 мм';
    if (diameterDop <= 1000) return '<b>±0.18 мм';
    if (diameterDop <= 1250) return '<b>±0.21 мм';
    if (diameterDop <= 1600) return '<b>±0.25 мм';
    if (diameterDop <= 2000) return '<b>±0.3 мм';
    if (diameterDop <= 2500) return '<b>±0.35 мм';
    if (diameterDop <= 3150) return '<b>±0.43 мм';
    return 'Не рассчитан';
}

function getToleranceJS11(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.03 мм';
    if (diameterDop <= 6) return '<b>±0.0375 мм';
    if (diameterDop <= 10) return '<b>±0.045 мм';
    if (diameterDop <= 18) return '<b>±0.055 мм';
    if (diameterDop <= 30) return '<b>±0.065 мм';
    if (diameterDop <= 50) return '<b>±0.08 мм';
    if (diameterDop <= 80) return '<b>±0.095 мм';
    if (diameterDop <= 120) return '<b>±0.11 мм';
    if (diameterDop <= 180) return '<b>±0.125 мм';
    if (diameterDop <= 250) return '<b>±0.145 мм';
    if (diameterDop <= 315) return '<b>±0.16 мм';
    if (diameterDop <= 400) return '<b>±0.18 мм';
    if (diameterDop <= 500) return '<b>±0.2 мм';
    if (diameterDop <= 630) return '<b>±0.22 мм';
    if (diameterDop <= 800) return '<b>±0.25 мм';
    if (diameterDop <= 1000) return '<b>±0.28 мм';
    if (diameterDop <= 1250) return '<b>±0.33 мм';
    if (diameterDop <= 1600) return '<b>±0.39 мм';
    if (diameterDop <= 2000) return '<b>±0.46 мм';
    if (diameterDop <= 2500) return '<b>±0.55 мм';
    if (diameterDop <= 3150) return '<b>±0.675 мм';
    return 'Не рассчитан';
}

function getToleranceJS12(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.05 мм';
    if (diameterDop <= 6) return '<b>±+0.06 мм';
    if (diameterDop <= 10) return '<b>±+0.075 мм';
    if (diameterDop <= 18) return '<b>±0.09 мм';
    if (diameterDop <= 30) return '<b>±+0.105 мм';
    if (diameterDop <= 50) return '<b>±0.125 мм';
    if (diameterDop <= 80) return '<b>±0.15 мм';
    if (diameterDop <= 120) return '<b>±0.175 мм';
    if (diameterDop <= 180) return '<b>±0.2 мм';
    if (diameterDop <= 250) return '<b>±0.23 мм';
    if (diameterDop <= 315) return '<b>±0.26 мм';
    if (diameterDop <= 400) return '<b>±0.285 мм';
    if (diameterDop <= 500) return '<b>±0.315 мм';
    if (diameterDop <= 630) return '<b>±0.035 мм';
    if (diameterDop <= 800) return '<b>±0.4 мм';
    if (diameterDop <= 1000) return '<b>±0.45 мм';
    if (diameterDop <= 1250) return '<b>±0.525 мм';
    if (diameterDop <= 1600) return '<b>±0.625 мм';
    if (diameterDop <= 2000) return '<b>±0.75 мм';
    if (diameterDop <= 2500) return '<b>±0.875 мм';
    if (diameterDop <= 3150) return '<b>±1.05 мм';
    return 'Не рассчитан';
}

function getToleranceJS13(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.07  мм';
    if (diameterDop <= 6) return '<b>±0.09 мм';
    if (diameterDop <= 10) return '<b>±0.11 мм';
    if (diameterDop <= 18) return '<b>±0.135 мм';
    if (diameterDop <= 30) return '<b>±0.165 мм';
    if (diameterDop <= 50) return '<b>±0.195 мм';
    if (diameterDop <= 80) return '<b>±0.23 мм';
    if (diameterDop <= 120) return '<b>±0.27 мм';
    if (diameterDop <= 180) return '<b>±0.315 мм';
    if (diameterDop <= 250) return '<b>±0.36 мм';
    if (diameterDop <= 315) return '<b>±0.405 мм';
    if (diameterDop <= 400) return '<b>±0.445 мм';
    if (diameterDop <= 500) return '<b>±0.485 мм';
    if (diameterDop <= 630) return '<b>±0.55 мм';
    if (diameterDop <= 800) return '<b>±0.625 мм';
    if (diameterDop <= 1000) return '<b>±0.7 мм';
    if (diameterDop <= 1250) return '<b>±0.825 мм';
    if (diameterDop <= 1600) return '<b>±0.975 мм';
    if (diameterDop <= 2000) return '<b>±1.15 мм';
    if (diameterDop <= 2500) return '<b>±1.4 мм';
    if (diameterDop <= 3150) return '<b>±1.65 мм';
    return 'Не рассчитан';
}

function getToleranceJS14(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.125 мм';
    if (diameterDop <= 6) return '<b>±0.15 мм';
    if (diameterDop <= 10) return '<b>±0.18 мм';
    if (diameterDop <= 18) return '<b>±0.215 мм';
    if (diameterDop <= 30) return '<b>±0.26 мм';
    if (diameterDop <= 50) return '<b>±0.31 мм';
    if (diameterDop <= 80) return '<b>±0.37 мм';
    if (diameterDop <= 120) return '<b>±0.435 мм';
    if (diameterDop <= 180) return '<b>±0.5 мм';
    if (diameterDop <= 250) return '<b>±0.575 мм';
    if (diameterDop <= 315) return '<b>±0.65 мм';
    if (diameterDop <= 400) return '<b>±0.7 мм';
    if (diameterDop <= 500) return '<b>±0.775 мм';
    if (diameterDop <= 630) return '<b>±0.875 мм';
    if (diameterDop <= 800) return '<b>±1 мм';
    if (diameterDop <= 1000) return '<b>±1.15 мм';
    if (diameterDop <= 1250) return '<b>±1.3 мм';
    if (diameterDop <= 1600) return '<b>±1.55 мм';
    if (diameterDop <= 2000) return '<b>±1.85 мм';
    if (diameterDop <= 2500) return '<b>±2.2 мм';
    if (diameterDop <= 3150) return '<b>±2.7 мм';
    return 'Не рассчитан';
}

function getToleranceJS15(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.2 мм';
    if (diameterDop <= 6) return '<b>±0.24 мм';
    if (diameterDop <= 10) return '<b>±0.29 мм';
    if (diameterDop <= 18) return '<b>±0.35 мм';
    if (diameterDop <= 30) return '<b>±0.42 мм';
    if (diameterDop <= 50) return '<b>±0.5 мм';
    if (diameterDop <= 80) return '<b>±0.6 мм';
    if (diameterDop <= 120) return '<b>±0.7 мм';
    if (diameterDop <= 180) return '<b>±0.8 мм';
    if (diameterDop <= 250) return '<b>±0.925 мм';
    if (diameterDop <= 315) return '<b>±1.05 мм';
    if (diameterDop <= 400) return '<b>±0.115 мм';
    if (diameterDop <= 500) return '<b>±1.25 мм';
    if (diameterDop <= 630) return '<b>±1.4 мм';
    if (diameterDop <= 800) return '<b>±1.6 мм';
    if (diameterDop <= 1000) return '<b>±1.8 мм';
    if (diameterDop <= 1250) return '<b>±2.1 мм';
    if (diameterDop <= 1600) return '<b>±2.5 мм';
    if (diameterDop <= 2000) return '<b>±3 мм';
    if (diameterDop <= 2500) return '<b>±3.5 мм';
    if (diameterDop <= 3150) return '<b>±4.3 мм';
    return 'Не рассчитан';
}

function getToleranceJS16(diameterDop) {
    if (diameterDop <= 3) return '<b>±0.3 мм';
    if (diameterDop <= 6) return '<b>±0.375 мм';
    if (diameterDop <= 10) return '<b>±0.45 мм';
    if (diameterDop <= 18) return '<b>±0.55 мм';
    if (diameterDop <= 30) return '<b>±0.65 мм';
    if (diameterDop <= 50) return '<b>±0.8 мм';
    if (diameterDop <= 80) return '<b>±0.95 мм';
    if (diameterDop <= 120) return '<b>±1.1 мм';
    if (diameterDop <= 180) return '<b>±1.25 мм';
    if (diameterDop <= 250) return '<b>±1.45 мм';
    if (diameterDop <= 315) return '<b>±1.6 мм';
    if (diameterDop <= 400) return '<b>±1.8 мм';
    if (diameterDop <= 500) return '<b>±2 мм';
    if (diameterDop <= 630) return '<b>±2.2 мм';
    if (diameterDop <= 800) return '<b>±2.5 мм';
    if (diameterDop <= 1000) return '<b>±2.8 мм';
    if (diameterDop <= 1250) return '<b>±3.3 мм';
    if (diameterDop <= 1600) return '<b>±3.9 мм';
    if (diameterDop <= 2000) return '<b>±4.6 мм';
    if (diameterDop <= 2500) return '<b>±5.5 мм';
    if (diameterDop <= 3150) return '<b>±6.75 мм';
    return 'Не рассчитан';
}

function getToleranceJS17(diameterDop) {
    if (diameterDop <= 3) return '<b>Не применяют';
    if (diameterDop <= 6) return '<b>±0.6 мм';
    if (diameterDop <= 10) return '<b>±0.75 мм';
    if (diameterDop <= 18) return '<b>±0.9 мм';
    if (diameterDop <= 30) return '<b>±1.05 мм';
    if (diameterDop <= 50) return '<b>±1.25 мм';
    if (diameterDop <= 80) return '<b>±1.5 мм';
    if (diameterDop <= 120) return '<b>±1.75 мм';
    if (diameterDop <= 180) return '<b>±2 мм';
    if (diameterDop <= 250) return '<b>±2.3 мм';
    if (diameterDop <= 315) return '<b>±2.6 мм';
    if (diameterDop <= 400) return '<b>±2.85 мм';
    if (diameterDop <= 500) return '<b>±3.15 мм';
    if (diameterDop <= 630) return '<b>±3.5 мм';
    if (diameterDop <= 800) return '<b>±4 мм';
    if (diameterDop <= 1000) return '<b>±4.5 мм';
    if (diameterDop <= 1250) return '<b>±5.25 мм';
    if (diameterDop <= 1600) return '<b>±6.25 мм';
    if (diameterDop <= 2000) return '<b>±7.5 мм';
    if (diameterDop <= 2500) return '<b>±8.75 мм';
    if (diameterDop <= 3150) return '<b>±10.5 мм';
    return 'Не рассчитан';
}

function getToleranceJS18(diameterDop) {
    if (diameterDop <= 3) return '<b>Не применяют';
    if (diameterDop <= 6) return '<b>±0.9 мм';
    if (diameterDop <= 10) return '<b>±1.1 мм';
    if (diameterDop <= 18) return '<b>±1.35 мм';
    if (diameterDop <= 30) return '<b>±1.65 мм';
    if (diameterDop <= 50) return '<b>±1.95 мм';
    if (diameterDop <= 80) return '<b>±2.3 мм';
    if (diameterDop <= 120) return '<b>±2.7 мм';
    if (diameterDop <= 180) return '<b>±3.15 мм';
    if (diameterDop <= 250) return '<b>±3.6 мм';
    if (diameterDop <= 315) return '<b>±4.05 мм';
    if (diameterDop <= 400) return '<b>±4.45 мм';
    if (diameterDop <= 500) return '<b>±4.85 мм';
    if (diameterDop <= 630) return '<b>±5.5 мм';
    if (diameterDop <= 800) return '<b>±6.25 мм';
    if (diameterDop <= 1000) return '<b>±7 мм';
    if (diameterDop <= 1250) return '<b>±8.25 мм';
    if (diameterDop <= 1600) return '<b>±9.75 мм';
    if (diameterDop <= 2000) return '<b>±11.5 мм';
    if (diameterDop <= 2500) return '<b>±14 мм';
    if (diameterDop <= 3150) return '<b>±16.5 мм';
    return 'Не рассчитан';
}

function getToleranceA9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.295 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.3 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.316 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.333 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.352 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.372 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.382 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.414 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.434 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.467 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.497 мм <br> +0.41 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.56 мм <br> +0.46 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.62 мм <br> +0.52 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.68 мм <br> +0.58 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.775 мм <br> +0.66 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.855 мм <br> +0.74 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.935 мм <br> +0.82 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1.05 мм <br> +0.92 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.18 мм <br> +1.05 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+1.34 мм <br> +1.2 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.49 мм <br> +1.35 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.655 мм <br> +1.5 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.805 мм <br> +1.65 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceA10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.31 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.318 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.338 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.36 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.384 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.41 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.42 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.46 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.48 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.52 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.55 мм <br> +0.41 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.62 мм <br> +0.46 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.68 мм <br> +0.52 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.74 мм <br> +0.58 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.845 мм <br> +0.66 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.925 мм <br> +0.74 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+1.005 мм <br> +0.82 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1.13 мм <br> +0.92 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.26 мм <br> +1.05 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+1.43 мм <br> +1.2 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.58 мм <br> +1.35 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.75 мм <br> +1.5 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.9 мм <br> +1.65 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceA11(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.33 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.345 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.37 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.4 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.43 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.47 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.48 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.53 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.55 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.6 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.63 мм <br> +0.41 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.71 мм <br> +0.46 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.77 мм <br> +0.52 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.83 мм <br> +0.58 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.95 мм <br> +0.66 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+1.03 мм <br> +0.74 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+1.11 мм <br> +0.82 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1.24 мм <br> +0.92 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.37 мм <br> +1.05 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+1.56 мм <br> +1.2 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.71 мм <br> +1.35 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.9 мм <br> +1.5 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+2.05 мм <br> +1.65 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceA12(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.37 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.39 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.43 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.47 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.51 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.56 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.57 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.64 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.66 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.73 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.76 мм <br> +0.41 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.86 мм <br> +0.46 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.92 мм <br> +0.52 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.98 мм <br> +0.58 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+1.12 мм <br> +0.66 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+1.2 мм <br> +0.74 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+1.28 мм <br> +0.82 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1.44 мм <br> +0.92 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.57 мм <br> +1.05 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+1.77 мм <br> +1.2 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.92 мм <br> +1.35 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+2.13 мм <br> +1.5 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+2.28 мм <br> +1.65 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceA13(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.41 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.45 мм <br> +0.27 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.5 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.56 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.63 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.7 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.71 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.8 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.82 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.92 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.95 мм <br> +0.41 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+1.09 мм <br> +0.46 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+1.15 мм <br> +0.52 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+1.21 мм <br> +0.58 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+1.38 мм <br> +0.66 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+1.46 мм <br> +0.74 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+1.54 мм <br> +0.82 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1.73 мм <br> +0.92 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.86 мм <br> +1.05 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+2.09 мм <br> +1.2 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+2.24 мм <br> +1.35 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+2.47 мм <br> +1.5 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+2.62 мм <br> +1.65 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceB8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.154 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.158 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.172 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.177 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.193 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.209 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.219 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.236 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.246 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.274 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.294 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.323 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.343 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.373 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.412 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.452 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.492 мм <br> +0.42 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.561 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.621 мм <br> +0.54 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.689 мм <br> +0.6 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.769 мм <br> +0.68 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+0.857 мм <br> +0.76 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.937 мм <br> +0.84 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceB9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.165 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.17 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.186 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.193 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.212 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.232 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.242 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.264 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.274 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.307 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.327 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.36 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.38 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.41 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.455 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.495 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.535 мм <br> +0.42 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.61 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.67 мм <br> +0.54 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.74 мм <br> +0.6 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.82 мм <br> +0.68 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+0.915 мм <br> +0.76 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.995 мм <br> +0.84 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceB10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.18 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.188 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.208 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.22 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.244 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.27 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.28 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.31 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.32 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.36 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.38 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.42 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.44 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.47 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.525 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.565 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.605 мм <br> +0.42 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.69 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.75 мм <br> +0.54 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.83 мм <br> +0.6 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.91 мм <br> +0.68 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.01 мм <br> +0.76 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.09 мм <br> +0.84 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceB11(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.2 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.215 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.24 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.26 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.29 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.33 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.34 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.38 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.39 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.44 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.46 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.51 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.53 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.56 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.63 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.67 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.71 мм <br> +0.42 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.8 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.86 мм <br> +0.54 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.96 мм <br> +0.6 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.04 мм <br> +0.68 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.16 мм <br> +0.76 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.24 мм <br> +0.84 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceB12(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.24 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.26 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.3 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.33 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.37 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.42 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.43 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.49 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.5 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.57 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.59 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.66 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.68 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.71 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.8 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.84 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.88 мм <br> +0.42 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.06 мм <br> +0.54 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+1.17 мм <br> +0.6 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.25 мм <br> +0.68 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.39 мм <br> +0.76 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.47 мм <br> +0.84 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceB13(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.28 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.32 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.37 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.42 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.49 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.56 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.57 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.65 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.66 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.76 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.78 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.89 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.91 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.94 мм <br> +0.31 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+1.06 мм <br> +0.34 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+1.1 мм <br> +0.38 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+1.14 мм <br> +0.42 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1.29 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.35 мм <br> +0.54 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+1.49 мм <br> +0.6 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.57 мм <br> +0.68 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.73 мм <br> +0.76 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.81 мм <br> +0.84 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceC8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.074 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.088 мм <br> +0.07 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.102 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.122 мм <br> +0.095 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.143 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.159 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.169 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.186 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.196 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.224 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.234 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.263 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.273 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.293 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.312 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.332 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.352 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.381 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.411 мм <br> +0.33 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.449 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.489 мм <br> +0.4 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+0.537 мм <br> +0.44 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.577 мм <br> +0.48 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceC9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.085 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.1 мм <br> +0.07 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.116 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.138 мм <br> +0.095 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.162 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.182 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.192 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.214 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.224 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.257 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.267 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.3 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.31 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.33 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.355 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.375 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.395 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.43 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.46 мм <br> +0.33 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.5 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.54 мм <br> +0.4 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+0.595 мм <br> +0.44 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.635 мм <br> +0.48 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceC10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.1 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.118 мм <br> +0.07 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.138 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.165 мм <br> +0.095 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.194 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.22 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.23 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.26 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.27 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.31 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.32 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.36 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.37 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.39 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.425 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.445 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.465 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.51 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.54 мм <br> +0.33 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.59 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.63 мм <br> +0.4 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+0.69 мм <br> +0.44 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.73 мм <br> +0.48 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceC11(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.12 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.145 мм <br> +0.07 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.17 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.205 мм <br> +0.095 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.24 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.28 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.29 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.33 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.34 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.39 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.4 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.45 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.46 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.48 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.53 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.55 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.57 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.62 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.65 мм <br> +0.33 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.72 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.76 мм <br> +0.4 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+0.84 мм <br> +0.44 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.88 мм <br> +0.48 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceC12(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.16 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.19 мм <br> +0.07 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.23 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.275 мм <br> +0.095 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.32 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.37 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.38 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.44 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.45 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.52 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.53 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.6 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.61 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.63 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.7 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.72 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.74 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+0.82 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.85 мм <br> +0.33 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+0.93 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.97 мм <br> +0.4 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.07 мм <br> +0.44 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.11 мм <br> +0.48 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceC13(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.2 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.25 мм <br> +0.07 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.3 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.365 мм <br> +0.095 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.44 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 40) return `<p><b>+0.51 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.52 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 65) return `<p><b>+0.6 мм <br> +0.14 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.61 мм <br> +0.15 мм</p></b>`;
    if (diameterDop <= 100) return `<p><b>+0.71 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.72 мм <br> +0.18 мм</p></b>`;
    if (diameterDop <= 140) return `<p><b>+0.83 мм <br> +0.2 мм</p></b>`;
    if (diameterDop <= 160) return `<p><b>+0.84 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.86 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 200) return `<p><b>+0.96 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 225) return `<p><b>+0.98 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+1 мм <br> +0.28 мм</p></b>`;
    if (diameterDop <= 280) return `<p><b>+1.11 мм <br> +0.3 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1.14 мм <br> +0.33 мм</p></b>`;
    if (diameterDop <= 355) return `<p><b>+1.25 мм <br> +0.36 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.29 мм <br> +0.4 мм</p></b>`;
    if (diameterDop <= 450) return `<p><b>+1.41 мм <br> +0.44 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.45 мм <br> +0.48 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.026 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.038 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.049 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.061 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.078 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.096 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.119 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.142 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.17 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.199 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.222 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.246 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.27 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.304 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.34 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.376 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.416 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.468 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.522 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.59 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.655 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.03 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.042 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.055 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.068 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.086 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.105 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.13 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.155 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.185 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.216 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.242 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.267 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.293 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.33 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.37 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.41 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.455 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.515 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.58 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.655 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.73 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.034 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.048 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.062 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.077 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.098 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.119 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.146 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.174 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.208 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.242 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.271 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.299 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.327 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.37 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.415 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.46 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.515 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.585 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.66 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.76 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.85 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.045 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.06 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.076 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.093 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.117 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.142 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.174 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.207 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.245 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.285 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.32 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.35 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.385 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.435 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.49 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.55 мм <br> +0.32 мм</p></b>`;
    if (diameterDop<= 1250) return `<p><b>+0.61 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.7 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.8 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.92 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+1.06 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.06 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.078 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.098 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.12 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.149 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.18 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.22 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.26 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.305 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.355 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.4 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.44 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.48 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.54 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.61 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.68 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.77 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.89 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+1.03 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+1.18 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+1.38 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD11(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.08 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.105 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.13 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.16 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.195 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.24 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.29 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.34 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.395 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.46 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.51 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.57 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.63 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.7 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.79 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.88 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+1.01 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+1.17 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+1.35 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+1.58 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+1.87 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD12(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.12 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.15 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.19 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.23 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.275 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.33 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.4 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.47 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.545 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.63 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.71 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.78 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.86 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.96 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+1.09 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+1.22 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+1.4 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+1.64 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+1.93 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+2.23 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+2.62 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceD13(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.16 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.21 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.26 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.32 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.395 мм <br> +0.065 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.47 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.56 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.66 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.775 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.89 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+1 мм <br> +0.19 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+1.1 мм <br> +0.21 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+1.2 мм <br> +0.23 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+1.36 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+1.54 мм <br> +0.29 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+1.72 мм <br> +0.32 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+2 мм <br> +0.35 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+2.34 мм <br> +0.39 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+2.73 мм <br> +0.43 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+3.28 мм <br> +0.48 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+3.82 мм <br> +0.52 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceE5(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.018 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.025 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.031 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.04 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.049 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.061 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.073 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.087 мм <br> +0.072 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.103 мм <br> +0.085 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.12 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.133 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.15 мм <br> +0.125 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.162 мм <br> +0.135 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceE6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.02 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.028 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.034 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.043 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.053 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.066 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.079 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.094 мм <br> +0.072 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.11 мм <br> +0.085 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.129 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.142 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.161 мм <br> +0.125 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.175 мм <br> +0.135 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.189 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.21 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.226 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.261 мм <br> +0.195 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.298 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.332 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.37 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.425 мм <br> +0.29 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceE7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.024 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.032 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.04 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.05 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.061 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.075 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.09 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.107 мм <br> +0.072 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.125 мм <br> +0.085 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.146 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.162 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.182 мм <br> +0.125 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.198 мм <br> +0.135 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.215 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.24 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.26 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.3 мм <br> +0.195 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.345 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.39 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.435 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.5 мм <br> +0.29 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceE8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.028 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.038 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.047 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.059 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.073 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.089 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.106 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.126 мм <br> +0.072 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.148 мм <br> +0.085 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.172 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.191 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.214 мм <br> +0.125 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.232 мм <br> +0.135 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.255 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.285 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.31 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.36 мм <br> +0.195 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.415 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.47 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.54 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.62 мм <br> +0.29 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceE9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.039 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.05 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.061 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.075 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.092 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.112 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.134 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.159 мм <br> +0.072 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.185 мм <br> +0.085 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.215 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.24 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.265 мм <br> +0.125 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.29 мм <br> +0.135 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.32 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.36 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.4 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.455 мм <br> +0.195 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.53 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.61 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.7 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.83 мм <br> +0.29 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceE10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.054 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.068 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.083 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.102 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.124 мм <br> +0.04 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.15 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.18 мм <br> +0.06 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.212 мм <br> +0.072 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.245 мм <br> +0.085 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.285 мм <br> +0.1 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.32 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.355 мм <br> +0.125 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.385 мм <br> +0.135 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.425 мм <br> +0.145 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.48 мм <br> +0.16 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.53 мм <br> +0.17 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.615 мм <br> +0.195 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.72 мм <br> +0.22 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.84 мм <br> +0.24 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.96 мм <br> +0.26 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+1.15 мм <br> +0.29 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceF3(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.008 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.0125 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.0155 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.019 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.024 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.029 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceF4(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.009 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.014 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.017 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.021 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.026 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.032 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceF5(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.01 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.015 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.019 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.024 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.029 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.036 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.043 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.051 мм <br> +0.036 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.061 мм <br> +0.043 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.07 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.079 мм <br> +0.056 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.087 мм <br> +0.062 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.095 мм <br> +0.068 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceF6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.012 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.018 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.022 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.027 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.033 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.041 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.049 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.058 мм <br> +0.036 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.068 мм <br> +0.043 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.079 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.088 мм <br> +0.056 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.098 мм <br> +0.062 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.108 мм <br> +0.068 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.12 мм <br> +0.076 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.13 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.142 мм <br> +0.086 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.164 мм <br> +0.098 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.188 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.212 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.24 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.28 мм <br> +0.145 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceF7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.016 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.022 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.028 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.034 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.041 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.05 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.06 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.071 мм <br> +0.036 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.083 мм <br> +0.043 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.096 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.108 мм <br> +0.056 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.119 мм <br> +0.062 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.131 мм <br> +0.068 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.146 мм <br> +0.076 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.16 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.176 мм <br> +0.086 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.203 мм <br> +0.098 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.235 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.27 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.305 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.355 мм <br> +0.145 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceF8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.02 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.028 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.035 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.043 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.053 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.064 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.076 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.09 мм <br> +0.036 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.106 мм <br> +0.043 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.122 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.137 мм <br> +0.056 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.151 мм <br> +0.062 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.165 мм <br> +0.068 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.186 мм <br> +0.076 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.205 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.226 мм <br> +0.086 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.263 мм <br> +0.098 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.305 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.35 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.41 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.475 мм <br> +0.145 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceF9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.031 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.04 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.049 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.059 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.072 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.087 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.104 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.123 мм <br> +0.036 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.143 мм <br> +0.043 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.165 мм <br> +0.05 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.186 мм <br> +0.056 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.202 мм <br> +0.062 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.223 мм <br> +0.068 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.251 мм <br> +0.076 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.28 мм <br> +0.08 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.316 мм <br> +0.086 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.358 мм <br> +0.098 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.42 мм <br> +0.11 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.49 мм <br> +0.12 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.57 мм <br> +0.13 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.685 мм <br> +0.145 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceF10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.046 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.058 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.071 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.086 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.104 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.125 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceG3(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.004 мм <br> +0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.0065 мм <br> +0.004 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.0075 мм <br> +0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.009 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.011 мм <br> +0.007 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.013 мм <br> +0.009 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceG4(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.005 мм <br> +0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.008 мм <br> +0.004 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.009 мм <br> +0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.011 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.013 мм <br> +0.007 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.016 мм <br> +0.009 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceG5(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.006 мм <br> +0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.009 мм <br> +0.004 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.011 мм <br> +0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.014 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.016 мм <br> +0.007 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.02 мм <br> +0.009 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.023 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.027 мм <br> +0.012 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.032 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.035 мм <br> +0.015 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.04 мм <br> +0.017 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.043 мм <br> +0.018 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.047 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceG6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.008 мм <br> +0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.012 мм <br> +0.004 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.014 мм <br> +0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.017 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.02 мм <br> +0.007 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.025 мм <br> +0.009 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.029 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.034 мм <br> +0.012 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.039 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.044 мм <br> +0.015 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.049 мм <br> +0.017 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.054 мм <br> +0.018 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.06 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.066 мм <br> +0.022 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.074 мм <br> +0.024 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.082 мм <br> +0.026 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.094 мм <br> +0.028 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.108 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.124 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.144 мм <br> +0.034 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.173 мм <br> +0.038 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceG7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.012 мм <br> +0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.016 мм <br> +0.004 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.02 мм <br> +0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.024 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.028 мм <br> +0.007 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.034 мм <br> +0.009 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.04 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.047 мм <br> +0.012 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.054 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.061 мм <br> +0.015 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.069 мм <br> +0.017 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.075 мм <br> +0.018 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.083 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.092 мм <br> +0.022 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.104 мм <br> +0.024 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.116 мм <br> +0.026 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.133 мм <br> +0.028 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.155 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.182 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.209 мм <br> +0.034 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.248 мм <br> +0.038 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceG8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.016 мм <br> +0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.022 мм <br> +0.004 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.027 мм <br> +0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.033 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.04 мм <br> +0.007 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.048 мм <br> +0.009 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.056 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.066 мм <br> +0.012 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.077 мм <br> +0.014 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.087 мм <br> +0.015 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.098 мм <br> +0.017 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.107 мм <br> +0.018 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.117 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>+0.132 мм <br> +0.022 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>+0.149 мм <br> +0.024 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>+0.166 мм <br> +0.026 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>+0.193 мм <br> +0.028 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>+0.225 мм <br> +0.03 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>+0.262 мм <br> +0.032 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>+0.314 мм <br> +0.034 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>+0.368 мм <br> +0.038 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceG9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.027 мм <br> +0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.034 мм <br> +0.004 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.041 мм <br> +0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.049 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.059 мм <br> +0.007 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.071 мм <br> +0.009 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceG10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.042 мм <br> +0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.052 мм <br> +0.01 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.063 мм <br> +0.013 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.076 мм <br> +0.016 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.091 мм <br> +0.02 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.109 мм <br> +0.025 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceJ6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.002 мм <br> -0.004 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.005 мм <br> -0.003 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.005 мм <br> -0.004 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.006 мм <br> -0.005 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.008 мм <br> -0.005 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.01 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.013 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.016 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.018 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.022 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.025 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.029 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.033 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceJ7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.004 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.006 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.008 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.01 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.012 мм <br> -0.009 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.014 мм <br> -0.011 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.018 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.022 мм <br> -0.013 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.026 мм <br> -0.014 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.03 мм <br> -0.014 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.036 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.039 мм <br> -0.018 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.043 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceJ8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>+0.006 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.01 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.012 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.015 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.02 мм <br> -0.013 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.024 мм <br> -0.015 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.028 мм <br> -0.018 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.034 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.041 мм <br> -0.022 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.047 мм <br> -0.025 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.055 мм <br> -0.026 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.06 мм <br> -0.029 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.066 мм <br> -0.031 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceK3(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.002 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>0 мм <br> -0.0025 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>0 мм <br> -0.0025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>0 мм <br> -0.003 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.0005 мм <br> -0.0045 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.0005 мм <br> -0.0045 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceK4(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.003 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.0005 мм <br> -0.0035 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.0005 мм <br> -0.0035 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.001 мм <br> -0.004 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>0 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.001 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceK5(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.004 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>0 мм <br> -0.005 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.001 мм <br> -0.005 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.002 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.001 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.002 мм <br> -0.009 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.003 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.002 мм <br> -0.013 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.003 мм <br> -0.015 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.002 мм <br> -0.018 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.003 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.003 мм <br> -0.022 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.002 мм <br> -0.025 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceK6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.002 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.002 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.002 мм <br> -0.009 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.002 мм <br> -0.011 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.003 мм <br> -0.013 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.004 мм <br> -0.015 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.004 мм <br> -0.018 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.004 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.005 мм <br> -0.024 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.005 мм <br> -0.027 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.007 мм <br> -0.029 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.008 мм <br> -0.032 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>0 мм <br> -0.044 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>0 мм <br> -0.05 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>0 мм <br> -0.056 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>0 мм <br> -0.066 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>0 мм <br> -0.078 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>0 мм <br> -0.092 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>0 мм <br> -0.11 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>0 мм <br> -0.135 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceK7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.003 мм <br> -0.009 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.005 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.006 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.006 мм <br> -0.015 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.007 мм <br> -0.018 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.009 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.01 мм <br> -0.025 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.012 мм <br> -0.028 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.013 мм <br> -0.033 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.016 мм <br> -0.036 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.017 мм <br> -0.04 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.018 мм <br> -0.045 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>0 мм <br> -0.07 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>0 мм <br> -0.08 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>0 мм <br> -0.09 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>0 мм <br> -0.105 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>0 мм <br> -0.125 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>0 мм <br> -0.15 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>0 мм <br> -0.175 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>0 мм <br> -0.21 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceK8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.005 мм <br> -0.013 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.006 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.008 мм <br> -0.019 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.01 мм <br> -0.023 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.012 мм <br> -0.027 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.014 мм <br> -0.032 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.016 мм <br> -0.038 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.02 мм <br> -0.043 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.022 мм <br> -0.05 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.025 мм <br> -0.056 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.028 мм <br> -0.061 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.029 мм <br> -0.068 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>0 мм <br> -0.11 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>0 мм <br> -0.125 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>0 мм <br> -0.14 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>0 мм <br> -0.165 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>0 мм <br> -0.195 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>0 мм <br> -0.23 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>0 мм <br> -0.28 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>0 мм <br> -0.33 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceK9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.025 мм</p></b>`;
    if (diameterDop <= 6) return '<b>Не применяют';
    if (diameterDop <= 10) return '<b>Не применяют';
    if (diameterDop <= 18) return '<b>Не применяют';
    if (diameterDop <= 30) return '<b>Не применяют';
    if (diameterDop <= 50) return '<b>Не применяют';
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceK10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>0 мм <br> -0.04 мм</p></b>`;
    if (diameterDop <= 6) return '<b>Не применяют';
    if (diameterDop <= 10) return '<b>Не применяют';
    if (diameterDop <= 18) return '<b>Не применяют';
    if (diameterDop <= 30) return '<b>Не применяют';
    if (diameterDop <= 50) return '<b>Не применяют';
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceM3(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.004 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.003 мм <br> -0.0055 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.005 мм <br> -0.0075 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.006 мм <br> -0.009 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.0065 мм <br> -0.0105 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.0075 мм <br> -0.0115 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceM4(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.005 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.0025 мм <br> -0.0065 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.0045 мм <br> -0.0085 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.005 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.006 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.006 мм <br> -0.013 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceM5(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.003 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.004 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.004 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.005 мм <br> -0.014 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.005 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.006 мм <br> -0.019 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.008 мм <br> -0.023 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.009 мм <br> -0.027 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.011 мм <br> -0.031 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.013 мм <br> -0.036 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.014 мм <br> -0.039 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.016 мм <br> -0.043 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют'
    return 'Не рассчитан';
}

function getToleranceM6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.001 мм <br> -0.009 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.003 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.004 мм <br> -0.015 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.004 мм <br> -0.017 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.004 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.005 мм <br> -0.024 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.006 мм <br> -0.028 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.008 мм <br> -0.033 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.008 мм <br> -0.037 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.009 мм <br> -0.041 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.01 мм <br> -0.046 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.01 мм <br> -0.05 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.026 мм <br> -0.07 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.03 мм <br> -0.08 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.034 мм <br> -0.09 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.04 мм <br> -0.106 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.048 мм <br> -0.126 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.058 мм <br> -0.15 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.068 мм <br> -0.178 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.076 мм <br> -0.211 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceM7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>0 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>0 мм <br> -0.015 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>0 мм <br> -0.018 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>0 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>0 мм <br> -0.025 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>0 мм <br> -0.03 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>0 мм <br> -0.035 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>0 мм <br> -0.04 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>0 мм <br> -0.046 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>0 мм <br> -0.052 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>0 мм <br> -0.057 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>0 мм <br> -0.063 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.026 мм <br> -0.096 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.03 мм <br> -0.11 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.034 мм <br> -0.124 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.04 мм <br> -0.145 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.048 мм <br> -0.173 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.058 мм <br> -0.208 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.068 мм <br> -0.243 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.076 мм <br> -0.286 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceM8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>+0.002 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>+0.001 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>+0.002 мм <br> -0.025 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>+0.004 мм <br> -0.029 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>+0.005 мм <br> -0.034 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>+0.005 мм <br> -0.041 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>+0.006 мм <br> -0.048 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>+0.008 мм <br> -0.055 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>+0.009 мм <br> -0.063 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>+0.009 мм <br> -0.072 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>+0.011 мм <br> -0.078 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>+0.011 мм <br> -0.086 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.026 мм <br> -0.136 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.03 мм <br> -0.155 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.034 мм <br> -0.174 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.04 мм <br> -0.205 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.048 мм <br> -0.243 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.058 мм <br> -0.288 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.068 мм <br> -0.348 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.076 мм <br> -0.406 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceM9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.027 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.004 мм <br> -0.034 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.006 мм <br> -0.042 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.007 мм <br> -0.05 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.008 мм <br> -0.06 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.009 мм <br> -0.071 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceM10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.002 мм <br> -0.042 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.004 мм <br> -0.052 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.006 мм <br> -0.064 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.007 мм <br> -0.077 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.008 мм <br> -0.092 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.009 мм <br> -0.109 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceN3(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.006 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.007 мм <br> -0.0095 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.009 мм <br> -0.0115 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.011 мм <br> -0.014 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.0135 мм <br> -0.0175 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.0155 мм <br> -0.0195 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceN4(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.007 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.0065 мм <br> -0.0105 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.0085 мм <br> -0.0125 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.01 мм <br> -0.015 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.013 мм <br> -0.019 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.014 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceN5(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.007 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.008 мм <br> -0.014 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.009 мм <br> -0.017 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.012 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.013 мм <br> -0.024 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.015 мм <br> -0.028 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.018 мм <br> -0.033 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.021 мм <br> -0.039 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.025 мм <br> -0.045 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.027 мм <br> -0.05 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.03 мм <br> -0.055 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.033 мм <br> -0.06 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceN6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.005 мм <br> -0.013 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.007 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.009 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.011 мм <br> -0.024 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.012 мм <br> -0.028 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.014 мм <br> -0.033 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.016 мм <br> -0.038 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.02 мм <br> -0.045 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.022 мм <br> -0.051 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.025 мм <br> -0.057 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.026 мм <br> -0.062 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.027 мм <br> -0.067 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.044 мм <br> -0.088 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.05 мм <br> -0.1 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.056 мм <br> -0.112 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.066 мм <br> -0.132 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.078 мм <br> -0.156 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.092 мм <br> -0.184 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.11 мм <br> -0.22 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.135 мм <br> -0.27 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceN7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.014 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.004 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.004 мм <br> -0.019 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.005 мм <br> -0.023 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.007 мм <br> -0.028 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.008 мм <br> -0.033 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.009 мм <br> -0.039 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.01 мм <br> -0.045 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.012 мм <br> -0.052 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.014 мм <br> -0.06 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.014 мм <br> -0.066 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.016 мм <br> -0.073 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.017 мм <br> -0.08 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.044 мм <br> -0.114 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.05 мм <br> -0.13 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.056 мм <br> -0.146 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.066 мм <br> -0.171 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.078 мм <br> -0.203 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.092 мм <br> -0.242 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.11 мм <br> -0.285 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.135 мм <br> -0.345 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceN8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.018 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.002 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.003 мм <br> -0.025 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.003 мм <br> -0.03 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.003 мм <br> -0.036 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.003 мм <br> -0.042 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.004 мм <br> -0.05 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.004 мм <br> -0.058 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.004 мм <br> -0.067 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.005 мм <br> -0.077 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.005 мм <br> -0.086 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.005 мм <br> -0.094 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.006 мм <br> -0.103 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.044 мм <br> -0.154 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.05 мм <br> -0.175 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.056 мм <br> -0.196 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.066 мм <br> -0.231 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.078 мм <br> -0.273 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.092 мм <br> -0.322 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.11 мм <br> -0.39 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.135 мм <br> -0.465 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceN9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.029 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>0 мм <br> -0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>0 мм <br> -0.036 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>0 мм <br> -0.043 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>0 мм <br> -0.052 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>0 мм <br> -0.062 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>0 мм <br> -0.074 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>0 мм <br> -0.087 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>0 мм <br> -0.1 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>0 мм <br> -0.115 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>0 мм <br> -0.13 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>0 мм <br> -0.14 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>0 мм <br> -0.155 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.044 мм <br> -0.219 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.05 мм <br> -0.25 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.056 мм <br> -0.286 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.066 мм <br> -0.326 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.078 мм <br> -0.388 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.092 мм <br> -0.462 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.11 мм <br> -0.55 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.135 мм <br> -0.675 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceN10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.044 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>0 мм <br> -0.048 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>0 мм <br> -0.058 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>0 мм <br> -0.07 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>0 мм <br> -0.084 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>0 мм <br> -0.1 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>0 мм <br> -0.12 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>0 мм <br> -0.14 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>0 мм <br> -0.16 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>0 мм <br> -0.185 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>0 мм <br> -0.21 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>0 мм <br> -0.23 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>0 мм <br> -0.25 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceN11(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.004 мм <br> -0.064 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>0 мм <br> -0.075 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>0 мм <br> -0.09 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>0 мм <br> -0.11 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>0 мм <br> -0.13 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>0 мм <br> -0.16 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>0 мм <br> -0.19 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>0 мм <br> -0.22 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>0 мм <br> -0.25 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>0 мм <br> -0.29 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>0 мм <br> -0.32 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>0 мм <br> -0.36 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>0 мм <br> -0.4 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceP3(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.008 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.011 мм <br> -0.0135 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.014 мм <br> -0.0165 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.017 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.0205 мм <br> -0.0245 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.0245 мм <br> -0.0285 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceP4(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.009 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.0105 мм <br> -0.0145 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.0135 мм <br> -0.0175 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.016 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.02 мм <br> -0.026 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.023 мм <br> -0.03 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceP5(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.01 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.011 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.013 мм <br> -0.019 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.015 мм <br> -0.023 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.019 мм <br> -0.028 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.022 мм <br> -0.033 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.027 мм <br> -0.04 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.032 мм <br> -0.047 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.037 мм <br> -0.055 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.044 мм <br> -0.064 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.049 мм <br> -0.072 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.055 мм <br> -0.08 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.061 мм <br> -0.088 мм</p></b>`;
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

function getToleranceP6(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.012 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.009 мм <br> -0.017 мм</p></b>`;
    if (diameterDop<= 10) return `<p><b>-0.012 мм <br> -0.021 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.015 мм <br> -0.026 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.018 мм <br> -0.031 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.021 мм <br> -0.037 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.026 мм <br> -0.045 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.03 мм <br> -0.052 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.036 мм <br> -0.061 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.041 мм <br> -0.07 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.047 мм <br> -0.079 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.051 мм <br> -0.087 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.055 мм <br> -0.095 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.078 мм <br> -0.122 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.088 мм <br> -0.138 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.1 мм <br> -0.156 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.12 мм <br> -0.186 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.14 мм <br> -0.218 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.17 мм <br> -0.262 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.195 мм <br> -0.305 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.24 мм <br> -0.375 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceP7(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.016 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.008 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.009 мм <br> -0.024 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.011 мм <br> -0.029 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.014 мм <br> -0.035 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.017 мм <br> -0.042 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.021 мм <br> -0.051 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.024 мм <br> -0.059 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.028 мм <br> -0.068 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.033 мм <br> -0.079 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.036 мм <br> -0.088 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.041 мм <br> -0.098 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.045 мм <br> -0.108 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.078 мм <br> -0.148 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.088 мм <br> -0.168 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.1 мм <br> -0.19 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.12 мм <br> -0.225 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.14 мм <br> -0.265 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.17 мм <br> -0.32 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.195 мм <br> -0.37 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.24 мм <br> -0.45 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceP8(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.02 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.012 мм <br> -0.03 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.015 мм <br> -0.037 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.018 мм <br> -0.045 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.022 мм <br> -0.055 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.026 мм <br> -0.065 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.032 мм <br> -0.078 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.037 мм <br> -0.091 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.043 мм <br> -0.106 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.05 мм <br> -0.122 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.056 мм <br> -0.137 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.062 мм <br> -0.151 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.068 мм <br> -0.165 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.078 мм <br> -0.188 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.088 мм <br> -0.213 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.1 мм <br> -0.24 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.12 мм <br> -0.285 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.14 мм <br> -0.335 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.17 мм <br> -0.4 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.195 мм <br> -0.475 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.24 мм <br> -0.57 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceP9(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.031 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.012 мм <br> -0.042 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.015 мм <br> -0.051 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.018 мм <br> -0.061 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.022 мм <br> -0.074 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.026 мм <br> -0.088 мм</p></b>`;
    if (diameterDop <= 80) return `<p><b>-0.032 мм <br> -0.106 мм</p></b>`;
    if (diameterDop <= 120) return `<p><b>-0.037 мм <br> -0.124 мм</p></b>`;
    if (diameterDop <= 180) return `<p><b>-0.043 мм <br> -0.143 мм</p></b>`;
    if (diameterDop <= 250) return `<p><b>-0.05 мм <br> -0.165 мм</p></b>`;
    if (diameterDop <= 315) return `<p><b>-0.056 мм <br> -0.186 мм</p></b>`;
    if (diameterDop <= 400) return `<p><b>-0.062 мм <br> -0.202 мм</p></b>`;
    if (diameterDop <= 500) return `<p><b>-0.068 мм <br> -0.223 мм</p></b>`;
    if (diameterDop <= 630) return `<p><b>-0.078 мм <br> -0.253 мм</p></b>`;
    if (diameterDop <= 800) return `<p><b>-0.088 мм <br> -0.288 мм</p></b>`;
    if (diameterDop <= 1000) return `<p><b>-0.1 мм <br> -0.33 мм</p></b>`;
    if (diameterDop <= 1250) return `<p><b>-0.12 мм <br> -0.38 мм</p></b>`;
    if (diameterDop <= 1600) return `<p><b>-0.14 мм <br> -0.45 мм</p></b>`;
    if (diameterDop <= 2000) return `<p><b>-0.17 мм <br> -0.54 мм</p></b>`;
    if (diameterDop <= 2500) return `<p><b>-0.195 мм <br> -0.635 мм</p></b>`;
    if (diameterDop <= 3150) return `<p><b>-0.24 мм <br> -0.78 мм</p></b>`;
    return 'Не рассчитан';
}

function getToleranceP10(diameterDop) {
    if (diameterDop <= 3) return `<p><b>-0.006 мм <br> -0.046 мм</p></b>`;
    if (diameterDop <= 6) return `<p><b>-0.012 мм <br> -0.06 мм</p></b>`;
    if (diameterDop <= 10) return `<p><b>-0.015 мм <br> -0.073 мм</p></b>`;
    if (diameterDop <= 18) return `<p><b>-0.018 мм <br> -0.088 мм</p></b>`;
    if (diameterDop <= 30) return `<p><b>-0.022 мм <br> -0.106 мм</p></b>`;
    if (diameterDop <= 50) return `<p><b>-0.026 мм <br> -0.126 мм</p></b>`;
    if (diameterDop <= 80) return '<b>Не применяют';
    if (diameterDop <= 120) return '<b>Не применяют';
    if (diameterDop <= 180) return '<b>Не применяют';
    if (diameterDop <= 250) return '<b>Не применяют';
    if (diameterDop <= 315) return '<b>Не применяют';
    if (diameterDop <= 400) return '<b>Не применяют';
    if (diameterDop <= 500) return '<b>Не применяют';
    if (diameterDop <= 630) return '<b>Не применяют';
    if (diameterDop <= 800) return '<b>Не применяют';
    if (diameterDop <= 1000) return '<b>Не применяют';
    if (diameterDop <= 1250) return '<b>Не применяют';
    if (diameterDop <= 1600) return '<b>Не применяют';
    if (diameterDop <= 2000) return '<b>Не применяют';
    if (diameterDop <= 2500) return '<b>Не применяют';
    if (diameterDop <= 3150) return '<b>Не применяют';
    return 'Не рассчитан';
}

/// Поиск класса точности
const searchInput = document.getElementById('searchInput');
const select = document.getElementById('toleranceClass');

searchInput.addEventListener('keyup', function() {
    const filter = searchInput.value.toLowerCase();
    const wrapper = select.nextElementSibling;
    
    if (wrapper && wrapper.classList.contains('custom-select-wrapper')) {
        const options = wrapper.querySelectorAll('.custom-select-option');
        const labels = wrapper.querySelectorAll('.custom-select-optgroup-label');
        
        // Скрыть все labels изначально
        labels.forEach(label => {
            label.style.display = 'none';
        });
        
        // Отслеживать видимые группы
        let currentLabel = null;
        
        options.forEach(option => {
            // Получить только текст опции (не label)
            const txtValue = option.textContent.trim().toLowerCase();
            
            if (filter === '' || txtValue.includes(filter)) {
                option.style.display = '';
                // Показать label перед этой опцией если она есть
                let prev = option.previousElementSibling;
                while (prev) {
                    if (prev.classList.contains('custom-select-optgroup-label')) {
                        prev.style.display = '';
                        break;
                    }
                    prev = prev.previousElementSibling;
                }
            } else {
                option.style.display = 'none';
            }
        });
    } else {
        // Fallback для встроенного select
        const options = select.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const txtValue = option.text.toLowerCase();
            option.style.display = txtValue.includes(filter) ? '' : 'none';
        }
    }
});

// Поиск класса точности для валов
const searchInputShaft = document.getElementById('searchInputShaft');
const selectShaft = document.getElementById('toleranceClassShaft');

searchInputShaft.addEventListener('keyup', function() {
    const filter = searchInputShaft.value.toLowerCase();
    const wrapper = selectShaft.nextElementSibling;
    
    if (wrapper && wrapper.classList.contains('custom-select-wrapper')) {
        const options = wrapper.querySelectorAll('.custom-select-option');
        const labels = wrapper.querySelectorAll('.custom-select-optgroup-label');
        
        // Скрыть все labels изначально
        labels.forEach(label => {
            label.style.display = 'none';
        });
        
        options.forEach(option => {
            // Получить только текст опции (не label)
            const txtValue = option.textContent.trim().toLowerCase();
            
            if (filter === '' || txtValue.includes(filter)) {
                option.style.display = '';
                // Показать label перед этой опцией если она есть
                let prev = option.previousElementSibling;
                while (prev) {
                    if (prev.classList.contains('custom-select-optgroup-label')) {
                        prev.style.display = '';
                        break;
                    }
                    prev = prev.previousElementSibling;
                }
            } else {
                option.style.display = 'none';
            }
        });
    } else {
        // Fallback для встроенного select
        const options = selectShaft.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const txtValue = option.text.toLowerCase();
            option.style.display = txtValue.includes(filter) ? '' : 'none';
        }
    }
});

// Расёт времени обработки
document.getElementById('windowSelector').addEventListener('change', (event) => {
    // Получаем выбранное значение
    const selectedValue = event.target.value;

    // Все окна
    const windows = {
        paz: document.getElementById('pazWindow'),
        evolvent: document.getElementById('evolventWindow'),
        pryamobochniy: document.getElementById('pryamobochniyWindow'),
        reyka: document.getElementById('reykaWindow'),
    };

    // Скрываем все окна
    Object.values(windows).forEach(window => window.classList.remove('active'));

    // Показываем только выбранное окно
    if (windows[selectedValue]) {
        windows[selectedValue].classList.add('active');
    }
});

    //* Эвольвентные ШЛИЦЫ
    function calculateProcessingTimeE() {
    // Находим данные формы в зависимости от типа окна
    const height = parseFloat(document.getElementById(`evolvent-height`).value);
    const TopDiameter = parseFloat(document.getElementById(`evolventTopDiameter`).value);
    const BottomDiameter = parseFloat(document.getElementById(`evolventBottomDiameter`).value);
    const NumTeeth = parseInt(document.getElementById(`evolventNumTeeth`).value);
    const Module = parseFloat(document.getElementById(`evolventModule`).value);

    if (!height || !TopDiameter || !BottomDiameter || !NumTeeth || !Module ) {
        showError('evolventResult', 'Пожалуйста, заполните все поля!');
        return;
    }

    // Учитываем коэффициенты для разных высот и модулей
    const baseTimePerTooth = 20; // минут на зуб
    let heightFactor = height / 100; // коэффициент на основе высоты детали
    let moduleFactor = Module / 5; // коэффициент на основе модуля, предположим модуль 5 как базовый

    // Скорректированное время обработки на зуб с учетом высоты и модуля
    const adjustedTimePerTooth = baseTimePerTooth * heightFactor * moduleFactor;

    // Общее время для всех зубьев
    const totalProcessingTime = adjustedTimePerTooth * NumTeeth;

    const hours = Math.trunc(totalProcessingTime/60);
    const minutes = totalProcessingTime % 60;
    const timeValueE = Math.round(minutes);

    document.getElementById('evolventResult').innerHTML = `Примерное время обработки: <strong>${hours} ч. ${timeValueE} м.</strong>`;
}
    //*

    //* Прямобочные Шлицы
    function calculateProcessingTimeP() {
        // Находим данные формы в зависимости от типа окна
        const height = parseFloat(document.getElementById(`pryamobochniy-height`).value);
        const TopDiameter = parseFloat(document.getElementById(`pryamobochniyTopDiameter`).value);
        const BottomDiameter = parseFloat(document.getElementById(`pryamobochniyBottomDiameter`).value);
        const NumTeeth = parseInt(document.getElementById(`pryamobochniyNumTeeth`).value);
        const Width = parseFloat(document.getElementById(`pryamobochniyWidth`).value);
    
        if (!height || !TopDiameter || !BottomDiameter || !NumTeeth || !Width ) {
            showError('pryamobochniyResult', 'Пожалуйста, заполните все поля!');
            return;
        }

    // Учитываем коэффициенты для разных высот и модулей
    const pryamobochniyTimeTooth = 32; // минут на зуб
    let pryamobochniyHeightFactor = height / 100; // коэффициент на основе высоты детали
    let pryamobochniyWidthFactor = Width / 19; // коэффициент на основе ширины, предположим ширина 10 как базовый

    // Скорректированное время обработки на зуб с учетом высоты и ширины
    const pryamobochniyAdjustedTimePerTooth = pryamobochniyTimeTooth * pryamobochniyHeightFactor * pryamobochniyWidthFactor;

    // Общее время для всех зубьев
    const pryamobochniyTotalProcessingTime = pryamobochniyAdjustedTimePerTooth * NumTeeth;

    const hoursP = Math.trunc(pryamobochniyTotalProcessingTime/60);
    const minutesP = pryamobochniyTotalProcessingTime % 60;
    const timeValue = Math.round(minutesP);

    document.getElementById('pryamobochniyResult').innerHTML = `Примерное время обработки: <strong>${hoursP} ч. ${timeValue} м.</strong>`;
    }
    //*

    //* ПАЗ
    function calculateProcessingTimePaz() {
        // Находим данные формы в зависимости от типа окна
        const height = parseFloat(document.getElementById(`paz-height`).value);
        const Diameter = parseFloat(document.getElementById(`pazDiameter`).value);
        const Depth = parseInt(document.getElementById(`pazDepth`).value);
        const Width = parseFloat(document.getElementById(`pazWidth`).value);
    
        if (!height || !Depth || !Diameter || !Width ) {
            showError('pazResult', 'Пожалуйста, заполните все поля!');
            return;
        }
    // Учитываем коэффициенты для разных высот и модулей
    const PazTimeTooth = 42; // минут на паз
    let PazHeightFactor = height / 55; // коэффициент на основе высоты детали
    let WidthFactor = Width / 28; // коэффициент на основе ширины, предположим ширина 28 как базовая
    let DepthFactor = Depth / 6.4 // коэффициент на основе глубины, предположим глубина 6.5 как базовая

    // Скорректированное время обработки на зуб с учетом высоты и модуля
    const PazTotalProcessing = PazTimeTooth * PazHeightFactor * WidthFactor * DepthFactor;

    // Общее время для всех зубьев

    const hoursPaz = Math.trunc(PazTotalProcessing/60);
    const minutesPaz = PazTotalProcessing % 60;
    const timeValuePaz = Math.round(minutesPaz);

    document.getElementById('pazResult').innerHTML = `Примерное время обработки: <strong>${hoursPaz} ч. ${timeValuePaz} м.</strong>`;
    }

    //*

    //* РЕЙКА

        function calculateProcessingTimeR() {
            // Находим данные формы в зависимости от типа окна
            const height = parseFloat(document.getElementById(`reyka-height`).value);
            const Length = parseFloat(document.getElementById(`reykaLength`).value);
            const Module = parseInt(document.getElementById(`reykaModule`).value);
            const NumTeeth = parseFloat(document.getElementById(`reykaNumTeeth`).value);
        
            if (!height || !Length || !Module || !NumTeeth ) {
                showError('reykaResult', 'Пожалуйста, заполните все поля!');
                return;
            }
        // Учитываем коэффициенты для разных высот и модулей
        const reykaTimeTooth = 34; // минут на зуб
        const baseRackLength = 755; // длинна рейки
        let reykaHeightFactor = height / 79; // коэффициент на основе высоты детали
        let reykaModuleFactor = Module / 8; // коэффициент на основе модуля, предположим модуль 8 как базовый
        const rackFactor = Length/baseRackLength;
    
        // Скорректированное время обработки на зуб с учетом высоты ,модуля, длинны.
        const reykaAdjustedTimePerTooth = reykaTimeTooth * reykaHeightFactor * reykaModuleFactor * rackFactor;
    
        // Общее время для всех зубьев
        const reykaTotalProcessingTime = reykaAdjustedTimePerTooth * NumTeeth;
    
        const hoursR = Math.trunc(reykaTotalProcessingTime/60);
        const minutesR = reykaTotalProcessingTime % 60;
        const timeValueR = Math.round(minutesR);
    
        document.getElementById('reykaResult').innerHTML = `Примерное время обработки: <strong>${hoursR} ч. ${timeValueR} м.</strong>`;
        }

        //*



// ДОПУСКИ И ПОСАДКИ ВАЛОВ
function calculateShaftsTolerance() {
    const diameterShaft = parseFloat(document.getElementById('diameterShaft').value);
    const toleranceClass = document.getElementById('toleranceClassShaft').value;
    let tolerance = '';

    // Валидация входных данных
    if (!diameterShaft || diameterShaft < 0 || diameterShaft > 3150) {
        document.getElementById('resultShaft').innerHTML = `<span style="color: #FF6B6B;">⚠️ Ошибка: Введите диаметр в пределах от 0 до 3150 мм</span>`;
        return;
    }

    if (diameterShaft >= 0 && diameterShaft <= 3150) {
        // Получаем допуск для вала
        tolerance = getShaftTolerance(toleranceClass, diameterShaft);
        
        // Выводим результат с дополнительной информацией
        document.getElementById('resultShaft').innerHTML = `Диаметр вала: <strong>${diameterShaft} мм</strong><br>
                                                           Класс точности: <strong>${toleranceClass}</strong><br>
                                                           Допуск: <strong>${tolerance}</strong>`;
    } else {
        showError('resultShaft', 'Введите диаметр в пределах от 0 до 3150 мм');
    }
}

function getShaftTolerance(toleranceClass, diameterShaft) {
    // Полная таблица допусков валов согласно ГОСТ 25346-89
const shaftTolerances = {
    'h1': [
        {range: [0, 3], upper: 0, lower: -0.0008},
        {range: [3, 6], upper: 0, lower: -0.001},
        {range: [6, 10], upper: 0, lower: -0.0012},
        {range: [10, 18], upper: 0, lower: -0.0015},
        {range: [18, 30], upper: 0, lower: -0.002},
        {range: [30, 50], upper: 0, lower: -0.0024},
        {range: [50, 80], upper: 0, lower: -0.003},
        {range: [80, 120], upper: 0, lower: -0.0035},
        {range: [120, 180], upper: 0, lower: -0.004},
        {range: [180, 250], upper: 0, lower: -0.0048},
        {range: [250, 315], upper: 0, lower: -0.0055},
        {range: [315, 400], upper: 0, lower: -0.006},
        {range: [400, 500], upper: 0, lower: -0.0065},
        {range: [500, 630], upper: 0, lower: -0.007},
        {range: [630, 800], upper: 0, lower: -0.008},
        {range: [800, 1000], upper: 0, lower: -0.0085},
        {range: [1000, 1250], upper: 0, lower: -0.0095},
        {range: [1250, 1600], upper: 0, lower: -0.011},
        {range: [1600, 2000], upper: 0, lower: -0.013},
        {range: [2000, 2500], upper: 0, lower: -0.015},
        {range: [2500, 3150], upper: 0, lower: -0.0175}
    ],
    'h2': [
        {range: [0, 3], upper: 0, lower: -0.0012},
        {range: [3, 6], upper: 0, lower: -0.0015},
        {range: [6, 10], upper: 0, lower: -0.0018},
        {range: [10, 18], upper: 0, lower: -0.002},
        {range: [18, 30], upper: 0, lower: -0.0025},
        {range: [30, 50], upper: 0, lower: -0.003},
        {range: [50, 80], upper: 0, lower: -0.0035},
        {range: [80, 120], upper: 0, lower: -0.004},
        {range: [120, 180], upper: 0, lower: -0.0048},
        {range: [180, 250], upper: 0, lower: -0.0055},
        {range: [250, 315], upper: 0, lower: -0.0065},
        {range: [315, 400], upper: 0, lower: -0.0075},
        {range: [400, 500], upper: 0, lower: -0.0085},
        {range: [500, 630], upper: 0, lower: -0.0095},
        {range: [630, 800], upper: 0, lower: -0.011},
        {range: [800, 1000], upper: 0, lower: -0.012},
        {range: [1000, 1250], upper: 0, lower: -0.0145},
        {range: [1250, 1600], upper: 0, lower: -0.0165},
        {range: [1600, 2000], upper: 0, lower: -0.0195},
        {range: [2000, 2500], upper: 0, lower: -0.0225},
        {range: [2500, 3150], upper: 0, lower: -0.026}
    ],
    'h3': [
        {range: [0, 3], upper: 0, lower: -0.002},
        {range: [3, 6], upper: 0, lower: -0.0025},
        {range: [6, 10], upper: 0, lower: -0.0025},
        {range: [10, 18], upper: 0, lower: -0.003},
        {range: [18, 30], upper: 0, lower: -0.004},
        {range: [30, 50], upper: 0, lower: -0.004},
        {range: [50, 80], upper: 0, lower: -0.005},
        {range: [80, 120], upper: 0, lower: -0.006},
        {range: [120, 180], upper: 0, lower: -0.008},
        {range: [180, 250], upper: 0, lower: -0.01},
        {range: [250, 315], upper: 0, lower: -0.012},
        {range: [315, 400], upper: 0, lower: -0.013},
        {range: [400, 500], upper: 0, lower: -0.015},
        {range: [500, 630], upper: 0, lower: -0.016},
        {range: [630, 800], upper: 0, lower: -0.018},
        {range: [800, 1000], upper: 0, lower: -0.021},
        {range: [1000, 1250], upper: 0, lower: -0.024},
        {range: [1250, 1600], upper: 0, lower: -0.029},
        {range: [1600, 2000], upper: 0, lower: -0.035},
        {range: [2000, 2500], upper: 0, lower: -0.041},
        {range: [2500, 3150], upper: 0, lower: -0.05}
    ],
    'h4': [
        {range: [0, 3], upper: 0, lower: -0.003},
        {range: [3, 6], upper: 0, lower: -0.004},
        {range: [6, 10], upper: 0, lower: -0.004},
        {range: [10, 18], upper: 0, lower: -0.005},
        {range: [18, 30], upper: 0, lower: -0.006},
        {range: [30, 50], upper: 0, lower: -0.007},
        {range: [50, 80], upper: 0, lower: -0.008},
        {range: [80, 120], upper: 0, lower: -0.01},
        {range: [120, 180], upper: 0, lower: -0.012},
        {range: [180, 250], upper: 0, lower: -0.014},
        {range: [250, 315], upper: 0, lower: -0.016},
        {range: [315, 400], upper: 0, lower: -0.018},
        {range: [400, 500], upper: 0, lower: -0.02},
        {range: [500, 630], upper: 0, lower: -0.022},
        {range: [630, 800], upper: 0, lower: -0.025},
        {range: [800, 1000], upper: 0, lower: -0.028},
        {range: [1000, 1250], upper: 0, lower: -0.033},
        {range: [1250, 1600], upper: 0, lower: -0.039},
        {range: [1600, 2000], upper: 0, lower: -0.046},
        {range: [2000, 2500], upper: 0, lower: -0.055},
        {range: [2500, 3150], upper: 0, lower: -0.068}
    ],
    'h5': [
        {range: [0, 3], upper: 0, lower: -0.004},
        {range: [3, 6], upper: 0, lower: -0.005},
        {range: [6, 10], upper: 0, lower: -0.006},
        {range: [10, 18], upper: 0, lower: -0.008},
        {range: [18, 30], upper: 0, lower: -0.009},
        {range: [30, 50], upper: 0, lower: -0.011},
        {range: [50, 80], upper: 0, lower: -0.013},
        {range: [80, 120], upper: 0, lower: -0.015},
        {range: [120, 180], upper: 0, lower: -0.018},
        {range: [180, 250], upper: 0, lower: -0.02},
        {range: [250, 315], upper: 0, lower: -0.023},
        {range: [315, 400], upper: 0, lower: -0.025},
        {range: [400, 500], upper: 0, lower: -0.027},
        {range: [500, 630], upper: 0, lower: -0.032},
        {range: [630, 800], upper: 0, lower: -0.036},
        {range: [800, 1000], upper: 0, lower: -0.04},
        {range: [1000, 1250], upper: 0, lower: -0.047},
        {range: [1250, 1600], upper: 0, lower: -0.055},
        {range: [1600, 2000], upper: 0, lower: -0.065},
        {range: [2000, 2500], upper: 0, lower: -0.078},
        {range: [2500, 3150], upper: 0, lower: -0.096}
    ],
    'h6': [
        {range: [0, 3], upper: 0, lower: -0.006},
        {range: [3, 6], upper: 0, lower: -0.008},
        {range: [6, 10], upper: 0, lower: -0.009},
        {range: [10, 18], upper: 0, lower: -0.011},
        {range: [18, 30], upper: 0, lower: -0.013},
        {range: [30, 50], upper: 0, lower: -0.016},
        {range: [50, 80], upper: 0, lower: -0.019},
        {range: [80, 120], upper: 0, lower: -0.022},
        {range: [120, 180], upper: 0, lower: -0.025},
        {range: [180, 250], upper: 0, lower: -0.029},
        {range: [250, 315], upper: 0, lower: -0.032},
        {range: [315, 400], upper: 0, lower: -0.036},
        {range: [400, 500], upper: 0, lower: -0.04},
        {range: [500, 630], upper: 0, lower: -0.044},
        {range: [630, 800], upper: 0, lower: -0.05},
        {range: [800, 1000], upper: 0, lower: -0.056},
        {range: [1000, 1250], upper: 0, lower: -0.066},
        {range: [1250, 1600], upper: 0, lower: -0.078},
        {range: [1600, 2000], upper: 0, lower: -0.092},
        {range: [2000, 2500], upper: 0, lower: -0.11},
        {range: [2500, 3150], upper: 0, lower: -0.135}
    ],
    'h7': [
        {range: [0, 3], upper: 0, lower: -0.01},
        {range: [3, 6], upper: 0, lower: -0.012},
        {range: [6, 10], upper: 0, lower: -0.015},
        {range: [10, 18], upper: 0, lower: -0.018},
        {range: [18, 30], upper: 0, lower: -0.021},
        {range: [30, 50], upper: 0, lower: -0.025},
        {range: [50, 80], upper: 0, lower: -0.03},
        {range: [80, 120], upper: 0, lower: -0.035},
        {range: [120, 180], upper: 0, lower: -0.04},
        {range: [180, 250], upper: 0, lower: -0.046},
        {range: [250, 315], upper: 0, lower: -0.052},
        {range: [315, 400], upper: 0, lower: -0.057},
        {range: [400, 500], upper: 0, lower: -0.063},
        {range: [500, 630], upper: 0, lower: -0.07},
        {range: [630, 800], upper: 0, lower: -0.08},
        {range: [800, 1000], upper: 0, lower: -0.09},
        {range: [1000, 1250], upper: 0, lower: -0.105},
        {range: [1250, 1600], upper: 0, lower: -0.125},
        {range: [1600, 2000], upper: 0, lower: -0.15},
        {range: [2000, 2500], upper: 0, lower: -0.175},
        {range: [2500, 3150], upper: 0, lower: -0.21}
    ],
    'h8': [
        {range: [0, 3], upper: 0, lower: -0.014},
        {range: [3, 6], upper: 0, lower: -0.018},
        {range: [6, 10], upper: 0, lower: -0.022},
        {range: [10, 18], upper: 0, lower: -0.027},
        {range: [18, 30], upper: 0, lower: -0.033},
        {range: [30, 50], upper: 0, lower: -0.039},
        {range: [50, 80], upper: 0, lower: -0.046},
        {range: [80, 120], upper: 0, lower: -0.054},
        {range: [120, 180], upper: 0, lower: -0.063},
        {range: [180, 250], upper: 0, lower: -0.072},
        {range: [250, 315], upper: 0, lower: -0.081},
        {range: [315, 400], upper: 0, lower: -0.089},
        {range: [400, 500], upper: 0, lower: -0.097},
        {range: [500, 630], upper: 0, lower: -0.11},
        {range: [630, 800], upper: 0, lower: -0.125},
        {range: [800, 1000], upper: 0, lower: -0.14},
        {range: [1000, 1250], upper: 0, lower: -0.165},
        {range: [1250, 1600], upper: 0, lower: -0.195},
        {range: [1600, 2000], upper: 0, lower: -0.23},
        {range: [2000, 2500], upper: 0, lower: -0.28},
        {range: [2500, 3150], upper: 0, lower: -0.33}
    ],
    'h9': [
        {range: [0, 3], upper: 0, lower: -0.025},
        {range: [3, 6], upper: 0, lower: -0.03},
        {range: [6, 10], upper: 0, lower: -0.036},
        {range: [10, 18], upper: 0, lower: -0.043},
        {range: [18, 30], upper: 0, lower: -0.052},
        {range: [30, 50], upper: 0, lower: -0.062},
        {range: [50, 80], upper: 0, lower: -0.074},
        {range: [80, 120], upper: 0, lower: -0.087},
        {range: [120, 180], upper: 0, lower: -0.1},
        {range: [180, 250], upper: 0, lower: -0.115},
        {range: [250, 315], upper: 0, lower: -0.13},
        {range: [315, 400], upper: 0, lower: -0.14},
        {range: [400, 500], upper: 0, lower: -0.155},
        {range: [500, 630], upper: 0, lower: -0.175},
        {range: [630, 800], upper: 0, lower: -0.2},
        {range: [800, 1000], upper: 0, lower: -0.23},
        {range: [1000, 1250], upper: 0, lower: -0.26},
        {range: [1250, 1600], upper: 0, lower: -0.31},
        {range: [1600, 2000], upper: 0, lower: -0.37},
        {range: [2000, 2500], upper: 0, lower: -0.44},
        {range: [2500, 3150], upper: 0, lower: -0.54}
    ],
    'h10': [
        {range: [0, 3], upper: 0, lower: -0.04},
        {range: [3, 6], upper: 0, lower: -0.048},
        {range: [6, 10], upper: 0, lower: -0.058},
        {range: [10, 18], upper: 0, lower: -0.07},
        {range: [18, 30], upper: 0, lower: -0.084},
        {range: [30, 50], upper: 0, lower: -0.1},
        {range: [50, 80], upper: 0, lower: -0.12},
        {range: [80, 120], upper: 0, lower: -0.14},
        {range: [120, 180], upper: 0, lower: -0.16},
        {range: [180, 250], upper: 0, lower: -0.185},
        {range: [250, 315], upper: 0, lower: -0.21},
        {range: [315, 400], upper: 0, lower: -0.23},
        {range: [400, 500], upper: 0, lower: -0.25},
        {range: [500, 630], upper: 0, lower: -0.28},
        {range: [630, 800], upper: 0, lower: -0.32},
        {range: [800, 1000], upper: 0, lower: -0.36},
        {range: [1000, 1250], upper: 0, lower: -0.42},
        {range: [1250, 1600], upper: 0, lower: -0.5},
        {range: [1600, 2000], upper: 0, lower: -0.6},
        {range: [2000, 2500], upper: 0, lower: -0.7},
        {range: [2500, 3150], upper: 0, lower: -0.86}
    ],
    'h11': [
        {range: [0, 3], upper: 0, lower: -0.06},
        {range: [3, 6], upper: 0, lower: -0.075},
        {range: [6, 10], upper: 0, lower: -0.09},
        {range: [10, 18], upper: 0, lower: -0.11},
        {range: [18, 30], upper: 0, lower: -0.13},
        {range: [30, 50], upper: 0, lower: -0.16},
        {range: [50, 80], upper: 0, lower: -0.19},
        {range: [80, 120], upper: 0, lower: -0.22},
        {range: [120, 180], upper: 0, lower: -0.25},
        {range: [180, 250], upper: 0, lower: -0.29},
        {range: [250, 315], upper: 0, lower: -0.32},
        {range: [315, 400], upper: 0, lower: -0.36},
        {range: [400, 500], upper: 0, lower: -0.4},
        {range: [500, 630], upper: 0, lower: -0.44},
        {range: [630, 800], upper: 0, lower: -0.5},
        {range: [800, 1000], upper: 0, lower: -0.56},
        {range: [1000, 1250], upper: 0, lower: -0.66},
        {range: [1250, 1600], upper: 0, lower: -0.78},
        {range: [1600, 2000], upper: 0, lower: -0.92},
        {range: [2000, 2500], upper: 0, lower: -1.1},
        {range: [2500, 3150], upper: 0, lower: -1.35}
    ],
    'h12': [
        {range: [0, 3], upper: 0, lower: -0.1},
        {range: [3, 6], upper: 0, lower: -0.12},
        {range: [6, 10], upper: 0, lower: -0.15},
        {range: [10, 18], upper: 0, lower: -0.18},
        {range: [18, 30], upper: 0, lower: -0.21},
        {range: [30, 50], upper: 0, lower: -0.25},
        {range: [50, 80], upper: 0, lower: -0.3},
        {range: [80, 120], upper: 0, lower: -0.35},
        {range: [120, 180], upper: 0, lower: -0.4},
        {range: [180, 250], upper: 0, lower: -0.46},
        {range: [250, 315], upper: 0, lower: -0.52},
        {range: [315, 400], upper: 0, lower: -0.57},
        {range: [400, 500], upper: 0, lower: -0.63},
        {range: [500, 630], upper: 0, lower: -0.7},
        {range: [630, 800], upper: 0, lower: -0.8},
        {range: [800, 1000], upper: 0, lower: -0.9},
        {range: [1000, 1250], upper: 0, lower: -1.05},
        {range: [1250, 1600], upper: 0, lower: -1.25},
        {range: [1600, 2000], upper: 0, lower: -1.5},
        {range: [2000, 2500], upper: 0, lower: -1.75},
        {range: [2500, 3150], upper: 0, lower: -2.1}
    ],
    'h13': [
        {range: [0, 3], upper: 0, lower: -0.14},
        {range: [3, 6], upper: 0, lower: -0.18},
        {range: [6, 10], upper: 0, lower: -0.22},
        {range: [10, 18], upper: 0, lower: -0.27},
        {range: [18, 30], upper: 0, lower: -0.33},
        {range: [30, 50], upper: 0, lower: -0.39},
        {range: [50, 80], upper: 0, lower: -0.46},
        {range: [80, 120], upper: 0, lower: -0.54},
        {range: [120, 180], upper: 0, lower: -0.63},
        {range: [180, 250], upper: 0, lower: -0.72},
        {range: [250, 315], upper: 0, lower: -0.81},
        {range: [315, 400], upper: 0, lower: -0.89},
        {range: [400, 500], upper: 0, lower: -0.97},
        {range: [500, 630], upper: 0, lower: -1.1},
        {range: [630, 800], upper: 0, lower: -1.25},
        {range: [800, 1000], upper: 0, lower: -1.4},
        {range: [1000, 1250], upper: 0, lower: -1.65},
        {range: [1250, 1600], upper: 0, lower: -1.95},
        {range: [1600, 2000], upper: 0, lower: -2.3},
        {range: [2000, 2500], upper: 0, lower: -2.8},
        {range: [2500, 3150], upper: 0, lower: -3.3}
    ],
    'h14': [
        {range: [0, 3], upper: 0, lower: -0.25},
        {range: [3, 6], upper: 0, lower: -0.3},
        {range: [6, 10], upper: 0, lower: -0.36},
        {range: [10, 18], upper: 0, lower: -0.43},
        {range: [18, 30], upper: 0, lower: -0.52},
        {range: [30, 50], upper: 0, lower: -0.62},
        {range: [50, 80], upper: 0, lower: -0.74},
        {range: [80, 120], upper: 0, lower: -0.87},
        {range: [120, 180], upper: 0, lower: -1},
        {range: [180, 250], upper: 0, lower: -1.15},
        {range: [250, 315], upper: 0, lower: -1.3},
        {range: [315, 400], upper: 0, lower: -1.4},
        {range: [400, 500], upper: 0, lower: -1.55},
        {range: [500, 630], upper: 0, lower: -1.75},
        {range: [630, 800], upper: 0, lower: -2},
        {range: [800, 1000], upper: 0, lower: -2.3},
        {range: [1000, 1250], upper: 0, lower: -2.6},
        {range: [1250, 1600], upper: 0, lower: -3.1},
        {range: [1600, 2000], upper: 0, lower: -3.7},
        {range: [2000, 2500], upper: 0, lower: -4.4},
        {range: [2500, 3150], upper: 0, lower: -5.4}
    ],
    'h15': [
        {range: [0, 3], upper: 0, lower: -0.4},
        {range: [3, 6], upper: 0, lower: -0.48},
        {range: [6, 10], upper: 0, lower: -0.58},
        {range: [10, 18], upper: 0, lower: -0.7},
        {range: [18, 30], upper: 0, lower: -0.84},
        {range: [30, 50], upper: 0, lower: -1},
        {range: [50, 80], upper: 0, lower: -1.2},
        {range: [80, 120], upper: 0, lower: -1.4},
        {range: [120, 180], upper: 0, lower: -1.6},
        {range: [180, 250], upper: 0, lower: -1.85},
        {range: [250, 315], upper: 0, lower: -2.1},
        {range: [315, 400], upper: 0, lower: -2.3},
        {range: [400, 500], upper: 0, lower: -2.5},
        {range: [500, 630], upper: 0, lower: -2.8},
        {range: [630, 800], upper: 0, lower: -3.2},
        {range: [800, 1000], upper: 0, lower: -3.6},
        {range: [1000, 1250], upper: 0, lower: -4.2},
        {range: [1250, 1600], upper: 0, lower: -5},
        {range: [1600, 2000], upper: 0, lower: -6},
        {range: [2000, 2500], upper: 0, lower: -7},
        {range: [2500, 3150], upper: 0, lower: -8.6}
    ],
    'h16': [
        {range: [0, 3], upper: 0, lower: -0.6},
        {range: [3, 6], upper: 0, lower: -0.75},
        {range: [6, 10], upper: 0, lower: -0.9},
        {range: [10, 18], upper: 0, lower: -1.1},
        {range: [18, 30], upper: 0, lower: -1.3},
        {range: [30, 50], upper: 0, lower: -1.6},
        {range: [50, 80], upper: 0, lower: -1.9},
        {range: [80, 120], upper: 0, lower: -2.2},
        {range: [120, 180], upper: 0, lower: -2.5},
        {range: [180, 250], upper: 0, lower: -2.9},
        {range: [250, 315], upper: 0, lower: -3.2},
        {range: [315, 400], upper: 0, lower: -3.6},
        {range: [400, 500], upper: 0, lower: -4},
        {range: [500, 630], upper: 0, lower: -4.4},
        {range: [630, 800], upper: 0, lower: -5},
        {range: [800, 1000], upper: 0, lower: -5.6},
        {range: [1000, 1250], upper: 0, lower: -6.6},
        {range: [1250, 1600], upper: 0, lower: -7.8},
        {range: [1600, 2000], upper: 0, lower: -9.2},
        {range: [2000, 2500], upper: 0, lower: -11},
        {range: [2500, 3150], upper: 0, lower: -13.5}
    ],
    'h17': [
        {range: [3, 6], upper: 0, lower: -1.2},
        {range: [6, 10], upper: 0, lower: -1.5},
        {range: [10, 18], upper: 0, lower: -1.8},
        {range: [18, 30], upper: 0, lower: -2.1},
        {range: [30, 50], upper: 0, lower: -2.5},
        {range: [50, 80], upper: 0, lower: -3},
        {range: [80, 120], upper: 0, lower: -3.5},
        {range: [120, 180], upper: 0, lower: -4},
        {range: [180, 250], upper: 0, lower: -4.6},
        {range: [250, 315], upper: 0, lower: -5.2},
        {range: [315, 400], upper: 0, lower: -5.7},
        {range: [400, 500], upper: 0, lower: -6.3},
        {range: [500, 630], upper: 0, lower: -7},
        {range: [630, 800], upper: 0, lower: -8},
        {range: [800, 1000], upper: 0, lower: -9},
        {range: [1000, 1250], upper: 0, lower: -10.5},
        {range: [1250, 1600], upper: 0, lower: -12.5},
        {range: [1600, 2000], upper: 0, lower: -15},
        {range: [2000, 2500], upper: 0, lower: -17.5},
        {range: [2500, 3150], upper: 0, lower: -21}
    ],
    'h18': [
        {range: [3, 6], upper: 0, lower: -1.8},
        {range: [6, 10], upper: 0, lower: -2.2},
        {range: [10, 18], upper: 0, lower: -2.7},
        {range: [18, 30], upper: 0, lower: -3.3},
        {range: [30, 50], upper: 0, lower: -3.9},
        {range: [50, 80], upper: 0, lower: -4.6},
        {range: [80, 120], upper: 0, lower: -5.4},
        {range: [120, 180], upper: 0, lower: -6.3},
        {range: [180, 250], upper: 0, lower: -7.2},
        {range: [250, 315], upper: 0, lower: -8.1},
        {range: [315, 400], upper: 0, lower: -8.9},
        {range: [400, 500], upper: 0, lower: -9.7},
        {range: [500, 630], upper: 0, lower: -11},
        {range: [630, 800], upper: 0, lower: -12.5},
        {range: [800, 1000], upper: 0, lower: -14},
        {range: [1000, 1250], upper: 0, lower: -16.5},
        {range: [1250, 1600], upper: 0, lower: -19.5},
        {range: [1600, 2000], upper: 0, lower: -23},
        {range: [2000, 2500], upper: 0, lower: -28},
        {range: [2500, 3150], upper: 0, lower: -33}
    ],
    'js5': [
        {range: [0, 3], upper: 0.002, lower: -0.002},
        {range: [3, 6], upper: 0.0025, lower: -0.0025},
        {range: [6, 10], upper: 0.003, lower: -0.003},
        {range: [10, 18], upper: 0.004, lower: -0.004},
        {range: [18, 30], upper: 0.0045, lower: -0.0045},
        {range: [30, 50], upper: 0.0055, lower: -0.0055},
        {range: [50, 80], upper: 0.0065, lower: -0.0065},
        {range: [80, 120], upper: 0.0075, lower: -0.0075},
        {range: [120, 180], upper: 0.009, lower: -0.009},
        {range: [180, 250], upper: 0.01, lower: -0.01},
        {range: [250, 315], upper: 0.0115, lower: -0.0115},
        {range: [315, 400], upper: 0.0125, lower: -0.0125},
        {range: [400, 500], upper: 0.0135, lower: -0.0135},
        {range: [500, 630], upper: 0.016, lower: -0.016},
        {range: [630, 800], upper: 0.018, lower: -0.018},
        {range: [800, 1000], upper: 0.02, lower: -0.02},
        {range: [1000, 1250], upper: 0.0235, lower: -0.0235},
        {range: [1250, 1600], upper: 0.0275, lower: -0.0275},
        {range: [1600, 2000], upper: 0.0325, lower: -0.0325},
        {range: [2000, 2500], upper: 0.039, lower: -0.039},
        {range: [2500, 3150], upper: 0.048, lower: -0.048}
    ],
    'js6': [
        {range: [0, 3], upper: 0.003, lower: -0.003},
        {range: [3, 6], upper: 0.004, lower: -0.004},
        {range: [6, 10], upper: 0.0045, lower: -0.0045},
        {range: [10, 18], upper: 0.0055, lower: -0.0055},
        {range: [18, 30], upper: 0.0065, lower: -0.0065},
        {range: [30, 50], upper: 0.008, lower: -0.008},
        {range: [50, 80], upper: 0.0095, lower: -0.0095},
        {range: [80, 120], upper: 0.011, lower: -0.011},
        {range: [120, 180], upper: 0.0125, lower: -0.0125},
        {range: [180, 250], upper: 0.0145, lower: -0.0145},
        {range: [250, 315], upper: 0.016, lower: -0.016},
        {range: [315, 400], upper: 0.018, lower: -0.018},
        {range: [400, 500], upper: 0.02, lower: -0.02},
        {range: [500, 630], upper: 0.022, lower: -0.022},
        {range: [630, 800], upper: 0.025, lower: -0.025},
        {range: [800, 1000], upper: 0.028, lower: -0.028},
        {range: [1000, 1250], upper: 0.033, lower: -0.033},
        {range: [1250, 1600], upper: 0.039, lower: -0.039},
        {range: [1600, 2000], upper: 0.046, lower: -0.046},
        {range: [2000, 2500], upper: 0.055, lower: -0.055},
        {range: [2500, 3150], upper: 0.0675, lower: -0.0675}
    ],
    'js7': [
        {range: [0, 3], upper: 0.005, lower: -0.005},
        {range: [3, 6], upper: 0.006, lower: -0.006},
        {range: [6, 10], upper: 0.0075, lower: -0.0075},
        {range: [10, 18], upper: 0.009, lower: -0.009},
        {range: [18, 30], upper: 0.0105, lower: -0.0105},
        {range: [30, 50], upper: 0.0125, lower: -0.0125},
        {range: [50, 80], upper: 0.015, lower: -0.015},
        {range: [80, 120], upper: 0.0175, lower: -0.0175},
        {range: [120, 180], upper: 0.02, lower: -0.02},
        {range: [180, 250], upper: 0.023, lower: -0.023},
        {range: [250, 315], upper: 0.026, lower: -0.026},
        {range: [315, 400], upper: 0.0285, lower: -0.0285},
        {range: [400, 500], upper: 0.0315, lower: -0.0315},
        {range: [500, 630], upper: 0.035, lower: -0.035},
        {range: [630, 800], upper: 0.04, lower: -0.04},
        {range: [800, 1000], upper: 0.045, lower: -0.045},
        {range: [1000, 1250], upper: 0.0525, lower: -0.0525},
        {range: [1250, 1600], upper: 0.0625, lower: -0.0625},
        {range: [1600, 2000], upper: 0.075, lower: -0.075},
        {range: [2000, 2500], upper: 0.0875, lower: -0.0875},
        {range: [2500, 3150], upper: 0.105, lower: -0.105}
    ],
    'js8': [
        {range: [0, 3], upper: 0.007, lower: -0.007},
        {range: [3, 6], upper: 0.009, lower: -0.009},
        {range: [6, 10], upper: 0.011, lower: -0.011},
        {range: [10, 18], upper: 0.0135, lower: -0.0135},
        {range: [18, 30], upper: 0.0165, lower: -0.0165},
        {range: [30, 50], upper: 0.0195, lower: -0.0195},
        {range: [50, 80], upper: 0.023, lower: -0.023},
        {range: [80, 120], upper: 0.027, lower: -0.027},
        {range: [120, 180], upper: 0.0315, lower: -0.0315},
        {range: [180, 250], upper: 0.036, lower: -0.036},
        {range: [250, 315], upper: 0.0405, lower: -0.0405},
        {range: [315, 400], upper: 0.0445, lower: -0.0445},
        {range: [400, 500], upper: 0.0485, lower: -0.0485},
        {range: [500, 630], upper: 0.055, lower: -0.055},
        {range: [630, 800], upper: 0.0625, lower: -0.0625},
        {range: [800, 1000], upper: 0.07, lower: -0.07},
        {range: [1000, 1250], upper: 0.0825, lower: -0.0825},
        {range: [1250, 1600], upper: 0.0975, lower: -0.0975},
        {range: [1600, 2000], upper: 0.115, lower: -0.115},
        {range: [2000, 2500], upper: 0.14, lower: -0.14},
        {range: [2500, 3150], upper: 0.165, lower: -0.165}
    ],
    'js9': [
        {range: [0, 3], upper: 0.0125, lower: -0.0125},
        {range: [3, 6], upper: 0.015, lower: -0.015},
        {range: [6, 10], upper: 0.018, lower: -0.018},
        {range: [10, 18], upper: 0.0215, lower: -0.0215},
        {range: [18, 30], upper: 0.026, lower: -0.026},
        {range: [30, 50], upper: 0.031, lower: -0.031},
        {range: [50, 80], upper: 0.037, lower: -0.037},
        {range: [80, 120], upper: 0.0435, lower: -0.0435},
        {range: [120, 180], upper: 0.05, lower: -0.05},
        {range: [180, 250], upper: 0.0575, lower: -0.0575},
        {range: [250, 315], upper: 0.065, lower: -0.065},
        {range: [315, 400], upper: 0.07, lower: -0.07},
        {range: [400, 500], upper: 0.0775, lower: -0.0775},
        {range: [500, 630], upper: 0.0875, lower: -0.0875},
        {range: [630, 800], upper: 0.1, lower: -0.1},
        {range: [800, 1000], upper: 0.115, lower: -0.115},
        {range: [1000, 1250], upper: 0.13, lower: -0.13},
        {range: [1250, 1600], upper: 0.155, lower: -0.155},
        {range: [1600, 2000], upper: 0.185, lower: -0.185},
        {range: [2000, 2500], upper: 0.22, lower: -0.22},
        {range: [2500, 3150], upper: 0.27, lower: -0.27}
    ],
    'js10': [
        {range: [0, 3], upper: 0.02, lower: -0.02},
        {range: [3, 6], upper: 0.024, lower: -0.024},
        {range: [6, 10], upper: 0.029, lower: -0.029},
        {range: [10, 18], upper: 0.035, lower: -0.035},
        {range: [18, 30], upper: 0.042, lower: -0.042},
        {range: [30, 50], upper: 0.05, lower: -0.05},
        {range: [50, 80], upper: 0.06, lower: -0.06},
        {range: [80, 120], upper: 0.07, lower: -0.07},
        {range: [120, 180], upper: 0.08, lower: -0.08},
        {range: [180, 250], upper: 0.0925, lower: -0.0925},
        {range: [250, 315], upper: 0.105, lower: -0.105},
        {range: [315, 400], upper: 0.115, lower: -0.115},
        {range: [400, 500], upper: 0.125, lower: -0.125},
        {range: [500, 630], upper: 0.14, lower: -0.14},
        {range: [630, 800], upper: 0.16, lower: -0.16},
        {range: [800, 1000], upper: 0.18, lower: -0.18},
        {range: [1000, 1250], upper: 0.21, lower: -0.21},
        {range: [1250, 1600], upper: 0.25, lower: -0.25},
        {range: [1600, 2000], upper: 0.3, lower: -0.3},
        {range: [2000, 2500], upper: 0.35, lower: -0.35},
        {range: [2500, 3150], upper: 0.43, lower: -0.43}
    ],
    'js11': [
        {range: [0, 3], upper: 0.03, lower: -0.03},
        {range: [3, 6], upper: 0.0375, lower: -0.0375},
        {range: [6, 10], upper: 0.045, lower: -0.045},
        {range: [10, 18], upper: 0.055, lower: -0.055},
        {range: [18, 30], upper: 0.065, lower: -0.065},
        {range: [30, 50], upper: 0.08, lower: -0.08},
        {range: [50, 80], upper: 0.095, lower: -0.095},
        {range: [80, 120], upper: 0.11, lower: -0.11},
        {range: [120, 180], upper: 0.125, lower: -0.125},
        {range: [180, 250], upper: 0.145, lower: -0.145},
        {range: [250, 315], upper: 0.16, lower: -0.16},
        {range: [315, 400], upper: 0.18, lower: -0.18},
        {range: [400, 500], upper: 0.2, lower: -0.2},
        {range: [500, 630], upper: 0.22, lower: -0.22},
        {range: [630, 800], upper: 0.25, lower: -0.25},
        {range: [800, 1000], upper: 0.28, lower: -0.28},
        {range: [1000, 1250], upper: 0.33, lower: -0.33},
        {range: [1250, 1600], upper: 0.39, lower: -0.39},
        {range: [1600, 2000], upper: 0.46, lower: -0.46},
        {range: [2000, 2500], upper: 0.55, lower: -0.55},
        {range: [2500, 3150], upper: 0.675, lower: -0.675}
    ],
    'js12': [
        {range: [0, 3], upper: 0.05, lower: -0.05},
        {range: [3, 6], upper: 0.06, lower: -0.06},
        {range: [6, 10], upper: 0.075, lower: -0.075},
        {range: [10, 18], upper: 0.09, lower: -0.09},
        {range: [18, 30], upper: 0.105, lower: -0.105},
        {range: [30, 50], upper: 0.125, lower: -0.125},
        {range: [50, 80], upper: 0.15, lower: -0.15},
        {range: [80, 120], upper: 0.175, lower: -0.175},
        {range: [120, 180], upper: 0.2, lower: -0.2},
        {range: [180, 250], upper: 0.23, lower: -0.23},
        {range: [250, 315], upper: 0.26, lower: -0.26},
        {range: [315, 400], upper: 0.285, lower: -0.285},
        {range: [400, 500], upper: 0.315, lower: -0.315},
        {range: [500, 630], upper: 0.35, lower: -0.35},
        {range: [630, 800], upper: 0.4, lower: -0.4},
        {range: [800, 1000], upper: 0.45, lower: -0.45},
        {range: [1000, 1250], upper: 0.525, lower: -0.525},
        {range: [1250, 1600], upper: 0.625, lower: -0.625},
        {range: [1600, 2000], upper: 0.75, lower: -0.75},
        {range: [2000, 2500], upper: 0.875, lower: -0.875},
        {range: [2500, 3150], upper: 1.05, lower: -1.05}
    ],
    'js13': [
        {range: [0, 3], upper: 0.07, lower: -0.07},
        {range: [3, 6], upper: 0.09, lower: -0.09},
        {range: [6, 10], upper: 0.11, lower: -0.11},
        {range: [10, 18], upper: 0.135, lower: -0.135},
        {range: [18, 30], upper: 0.165, lower: -0.165},
        {range: [30, 50], upper: 0.195, lower: -0.195},
        {range: [50, 80], upper: 0.23, lower: -0.23},
        {range: [80, 120], upper: 0.27, lower: -0.27},
        {range: [120, 180], upper: 0.315, lower: -0.315},
        {range: [180, 250], upper: 0.36, lower: -0.36},
        {range: [250, 315], upper: 0.405, lower: -0.405},
        {range: [315, 400], upper: 0.445, lower: -0.445},
        {range: [400, 500], upper: 0.485, lower: -0.485},
        {range: [500, 630], upper: 0.55, lower: -0.55},
        {range: [630, 800], upper: 0.625, lower: -0.625},
        {range: [800, 1000], upper: 0.7, lower: -0.7},
        {range: [1000, 1250], upper: 0.825, lower: -0.825},
        {range: [1250, 1600], upper: 0.975, lower: -0.975},
        {range: [1600, 2000], upper: 1.15, lower: -1.15},
        {range: [2000, 2500], upper: 1.4, lower: -1.4},
        {range: [2500, 3150], upper: 1.65, lower: -1.65}
    ],
    'js14': [
        {range: [0, 3], upper: 0.125, lower: -0.125},
        {range: [3, 6], upper: 0.15, lower: -0.15},
        {range: [6, 10], upper: 0.18, lower: -0.18},
        {range: [10, 18], upper: 0.215, lower: -0.215},
        {range: [18, 30], upper: 0.26, lower: -0.26},
        {range: [30, 50], upper: 0.31, lower: -0.31},
        {range: [50, 80], upper: 0.37, lower: -0.37},
        {range: [80, 120], upper: 0.435, lower: -0.435},
        {range: [120, 180], upper: 0.5, lower: -0.5},
        {range: [180, 250], upper: 0.575, lower: -0.575},
        {range: [250, 315], upper: 0.65, lower: -0.65},
        {range: [315, 400], upper: 0.7, lower: -0.7},
        {range: [400, 500], upper: 0.775, lower: -0.775},
        {range: [500, 630], upper: 0.875, lower: -0.875},
        {range: [630, 800], upper: 1, lower: -1},
        {range: [800, 1000], upper: 1.15, lower: -1.15},
        {range: [1000, 1250], upper: 1.3, lower: -1.3},
        {range: [1250, 1600], upper: 1.55, lower: -1.55},
        {range: [1600, 2000], upper: 1.85, lower: -1.85},
        {range: [2000, 2500], upper: 2.2, lower: -2.2},
        {range: [2500, 3150], upper: 2.7, lower: -2.7}
    ],
    'js15': [
        {range: [0, 3], upper: 0.2, lower: -0.2},
        {range: [3, 6], upper: 0.24, lower: -0.24},
        {range: [6, 10], upper: 0.29, lower: -0.29},
        {range: [10, 18], upper: 0.35, lower: -0.35},
        {range: [18, 30], upper: 0.42, lower: -0.42},
        {range: [30, 50], upper: 0.5, lower: -0.5},
        {range: [50, 80], upper: 0.6, lower: -0.6},
        {range: [80, 120], upper: 0.7, lower: -0.7},
        {range: [120, 180], upper: 0.8, lower: -0.8},
        {range: [180, 250], upper: 0.925, lower: -0.925},
        {range: [250, 315], upper: 1.05, lower: -1.05},
        {range: [315, 400], upper: 1.15, lower: -1.15},
        {range: [400, 500], upper: 1.25, lower: -1.25},
        {range: [500, 630], upper: 1.4, lower: -1.4},
        {range: [630, 800], upper: 1.6, lower: -1.6},
        {range: [800, 1000], upper: 1.8, lower: -1.8},
        {range: [1000, 1250], upper: 2.1, lower: -2.1},
        {range: [1250, 1600], upper: 2.5, lower: -2.5},
        {range: [1600, 2000], upper: 3, lower: -3},
        {range: [2000, 2500], upper: 3.5, lower: -3.5},
        {range: [2500, 3150], upper: 4.3, lower: -4.3}
    ],
    'js16': [
        {range: [0, 3], upper: 0.3, lower: -0.3},
        {range: [3, 6], upper: 0.375, lower: -0.375},
        {range: [6, 10], upper: 0.45, lower: -0.45},
        {range: [10, 18], upper: 0.55, lower: -0.55},
        {range: [18, 30], upper: 0.65, lower: -0.65},
        {range: [30, 50], upper: 0.8, lower: -0.8},
        {range: [50, 80], upper: 0.95, lower: -0.95},
        {range: [80, 120], upper: 1.1, lower: -1.1},
        {range: [120, 180], upper: 1.25, lower: -1.25},
        {range: [180, 250], upper: 1.45, lower: -1.45},
        {range: [250, 315], upper: 1.6, lower: -1.6},
        {range: [315, 400], upper: 1.8, lower: -1.8},
        {range: [400, 500], upper: 0.2, lower: -0.2},
        {range: [500, 630], upper: 2.2, lower: -2.2},
        {range: [630, 800], upper: 2.5, lower: -2.5},
        {range: [800, 1000], upper: 2.8, lower: -2.8},
        {range: [1000, 1250], upper: 3.3, lower: -3.3},
        {range: [1250, 1600], upper: 3.9, lower: -3.9},
        {range: [1600, 2000], upper: 4.6, lower: -4.6},
        {range: [2000, 2500], upper: 5.5, lower: -5.5},
        {range: [2500, 3150], upper: 6.75, lower: -6.75}
    ],
    'js17': [
        {range: [3, 6], upper: 0.6, lower: -0.6},
        {range: [6, 10], upper: 0.75, lower: -0.75},
        {range: [10, 18], upper: 0.9, lower: -0.9},
        {range: [18, 30], upper: 1.05, lower: -1.05},
        {range: [30, 50], upper: 1.25, lower: -1.25},
        {range: [50, 80], upper: 1.5, lower: -1.5},
        {range: [80, 120], upper: 1.75, lower: -1.75},
        {range: [120, 180], upper: 2.0, lower: -2.0},
        {range: [180, 250], upper: 2.3, lower: -2.3},
        {range: [250, 315], upper: 2.6, lower: -2.6},
        {range: [315, 400], upper: 2.85, lower: -2.85},
        {range: [400, 500], upper: 3.15, lower: -3.15},
        {range: [500, 630], upper: 3.5, lower: -3.5},
        {range: [630, 800], upper: 4, lower: -4},
        {range: [800, 1000], upper: 4.5, lower: -4.5},
        {range: [1000, 1250], upper: 5.25, lower: -5.25},
        {range: [1250, 1600], upper: 6.25, lower: -6.25},
        {range: [1600, 2000], upper: 7.5, lower: -7.5},
        {range: [2000, 2500], upper: 8.75, lower: -8.75},
        {range: [2500, 3150], upper: 10.5, lower: -10.5}
    ],
    'js18': [
        {range: [3, 6], upper: 0.9, lower: -0.9},
        {range: [6, 10], upper: 1.1, lower: -1.1},
        {range: [10, 18], upper: 1.35, lower: -1.35},
        {range: [18, 30], upper: 1.65, lower: -1.65},
        {range: [30, 50], upper: 1.95, lower: -1.95},
        {range: [50, 80], upper: 2.3, lower: -2.3},
        {range: [80, 120], upper: 2.7, lower: -2.7},
        {range: [120, 180], upper: 3.15, lower: -3.15},
        {range: [180, 250], upper: 3.6, lower: -3.6},
        {range: [250, 315], upper: 4.05, lower: -4.05},
        {range: [315, 400], upper: 4.45, lower: -4.45},
        {range: [400, 500], upper: 4.85, lower: -4.85},
        {range: [500, 630], upper: 5.5, lower: -5.5},
        {range: [630, 800], upper: 6.25, lower: -6.25},
        {range: [800, 1000], upper: 7, lower: -7},
        {range: [1000, 1250], upper: 8.25, lower: -8.25},
        {range: [1250, 1600], upper: 9.75, lower: -9.75},
        {range: [1600, 2000], upper: 11.5, lower: -11.5},
        {range: [2000, 2500], upper: 14, lower: -14},
        {range: [2500, 3150], upper: 16.5, lower: -16.5}
    ],
    'a9': [
        {range: [0, 3], upper: -0.27, lower: -0.295},
        {range: [3, 6], upper: -0.27, lower: -0.3},
        {range: [6, 10], upper: -0.28, lower: -0.316},
        {range: [10, 18], upper: -0.29, lower: -0.333},
        {range: [18, 30], upper: -0.3, lower: -0.352},
        {range: [30, 40], upper: -0.31, lower: -0.372},
        {range: [40, 50], upper: -0.32, lower: -0.382},
        {range: [50, 65], upper: -0.34, lower: -0.414},
        {range: [65, 80], upper: -0.36, lower: -0.434},
        {range: [80, 100], upper: -0.38, lower: -0.467},
        {range: [100, 120], upper: -0.41, lower: -0.497},
        {range: [120, 140], upper: -0.46, lower: -0.56},
        {range: [140, 160], upper: -0.52, lower: -0.62},
        {range: [160, 180], upper: -0.58, lower: -0.68},
        {range: [180, 200], upper: -0.66, lower: -0.775},
        {range: [200, 225], upper: -0.74, lower: -0.855},
        {range: [225, 250], upper: -0.82, lower: -0.935},
        {range: [250, 280], upper: -0.92, lower: -1.05},
        {range: [280, 315], upper: -1.05, lower: -1.18},
        {range: [315, 355], upper: -1.2, lower: -1.34},
        {range: [355, 400], upper: -1.35, lower: -1.49},
        {range: [400, 450], upper: -1.5, lower: -1.655},
        {range: [450, 500], upper: -1.65, lower: -1.805}
    ],
    'a10': [
        {range: [0, 3], upper: -0.27, lower: -0.31},
        {range: [3, 6], upper: -0.27, lower: -0.318},
        {range: [6, 10], upper: -0.28, lower: -0.338},
        {range: [10, 18], upper: -0.29, lower: -0.36},
        {range: [18, 30], upper: -0.3, lower: -0.384},
        {range: [30, 40], upper: -0.31, lower: -0.41},
        {range: [40, 50], upper: -0.32, lower: -0.42},
        {range: [50, 65], upper: -0.34, lower: -0.46},
        {range: [65, 80], upper: -0.36, lower: -0.48},
        {range: [80, 100], upper: -0.38, lower: -0.52},
        {range: [100, 120], upper: -0.41, lower: -0.55},
        {range: [120, 140], upper: -0.46, lower: -0.62},
        {range: [140, 160], upper: -0.52, lower: -0.68},
        {range: [160, 180], upper: -0.58, lower: -0.74},
        {range: [180, 200], upper: -0.66, lower: -0.845},
        {range: [200, 225], upper: -0.74, lower: -0.925},
        {range: [225, 250], upper: -0.82, lower: -1.005},
        {range: [250, 280], upper: -0.92, lower: -1.13},
        {range: [280, 315], upper: -1.05, lower: -1.26},
        {range: [315, 355], upper: -1.2, lower: -1.43},
        {range: [355, 400], upper: -1.35, lower: -1.58},
        {range: [400, 450], upper: -1.5, lower: -1.75},
        {range: [450, 500], upper: -1.65, lower: -1.9}
    ],
    'a11': [
        {range: [0, 3], upper: -0.27, lower: -0.33},
        {range: [3, 6], upper: -0.27, lower: -0.345},
        {range: [6, 10], upper: -0.28, lower: -0.37},
        {range: [10, 18], upper: -0.29, lower: -0.4},
        {range: [18, 30], upper: -0.3, lower: -0.43},
        {range: [30, 40], upper: -0.31, lower: -0.47},
        {range: [40, 50], upper: -0.32, lower: -0.48},
        {range: [50, 65], upper: -0.34, lower: -0.53},
        {range: [65, 80], upper: -0.36, lower: -0.55},
        {range: [80, 100], upper: -0.38, lower: -0.6},
        {range: [100, 120], upper: -0.41, lower: -0.63},
        {range: [120, 140], upper: -0.46, lower: -0.71},
        {range: [140, 160], upper: -0.52, lower: -0.77},
        {range: [160, 180], upper: -0.58, lower: -0.83},
        {range: [180, 200], upper: -0.66, lower: -0.95},
        {range: [200, 225], upper: -0.74, lower: -1.03},
        {range: [225, 250], upper: -0.82, lower: -1.11},
        {range: [250, 280], upper: -0.92, lower: -1.24},
        {range: [280, 315], upper: -1.05, lower: -1.37},
        {range: [315, 355], upper: -1.2, lower: -1.56},
        {range: [355, 400], upper: -1.35, lower: -1.71},
        {range: [400, 450], upper: -1.5, lower: -1.9},
        {range: [450, 500], upper: -1.65, lower: -2.05}
    ],
    'a12': [
        {range: [0, 3], upper: -0.27, lower: -0.37},
        {range: [3, 6], upper: -0.27, lower: -0.39},
        {range: [6, 10], upper: -0.28, lower: -0.43},
        {range: [10, 18], upper: -0.29, lower: -0.47},
        {range: [18, 30], upper: -0.3, lower: -0.51},
        {range: [30, 40], upper: -0.31, lower: -0.56},
        {range: [40, 50], upper: -0.32, lower: -0.57},
        {range: [50, 65], upper: -0.34, lower: -0.64},
        {range: [65, 80], upper: -0.36, lower: -0.66},
        {range: [80, 100], upper: -0.38, lower: -0.73},
        {range: [100, 120], upper: -0.41, lower: -0.76},
        {range: [120, 140], upper: -0.46, lower: -0.86},
        {range: [140, 160], upper: -0.52, lower: -0.92},
        {range: [160, 180], upper: -0.58, lower: -0.98},
        {range: [180, 200], upper: -0.66, lower: -1.12},
        {range: [200, 225], upper: -0.74, lower: -1.2},
        {range: [225, 250], upper: -0.82, lower: -1.28},
        {range: [250, 280], upper: -0.92, lower: -1.44},
        {range: [280, 315], upper: -1.05, lower: -1.57},
        {range: [315, 355], upper: -1.2, lower: -1.77},
        {range: [355, 400], upper: -1.35, lower: -1.92},
        {range: [400, 450], upper: -1.5, lower: -2.13},
        {range: [450, 500], upper: -1.65, lower: -2.28}
    ],
    'a13': [
        {range: [0, 3], upper: -0.27, lower: -0.41},
        {range: [3, 6], upper: -0.27, lower: -0.45},
        {range: [6, 10], upper: -0.28, lower: -0.5},
        {range: [10, 18], upper: -0.29, lower: -0.56},
        {range: [18, 30], upper: -0.3, lower: -0.63},
        {range: [30, 40], upper: -0.31, lower: -0.7},
        {range: [40, 50], upper: -0.32, lower: -0.71},
        {range: [50, 65], upper: -0.34, lower: -0.8},
        {range: [65, 80], upper: -0.36, lower: -0.82},
        {range: [80, 100], upper: -0.38, lower: -0.92},
        {range: [100, 120], upper: -0.41, lower: -0.95},
        {range: [120, 140], upper: -0.46, lower: -1.09},
        {range: [140, 160], upper: -0.52, lower: -1.15},
        {range: [160, 180], upper: -0.58, lower: -1.21},
        {range: [180, 200], upper: -0.66, lower: -1.38},
        {range: [200, 225], upper: -0.74, lower: -1.46},
        {range: [225, 250], upper: -0.82, lower: -1.54},
        {range: [250, 280], upper: -0.92, lower: -1.73},
        {range: [280, 315], upper: -1.05, lower: -1.86},
        {range: [315, 355], upper: -1.2, lower: -2.09},
        {range: [355, 400], upper: -1.35, lower: -2.24},
        {range: [400, 450], upper: -1.5, lower: -2.47},
        {range: [450, 500], upper: -1.65, lower: -2.62}
    ],
    'b8': [
        {range: [0, 3], upper: -0.14, lower: -0.154},
        {range: [3, 6], upper: -0.14, lower: -0.158},
        {range: [6, 10], upper: -0.15, lower: -0.172},
        {range: [10, 18], upper: -0.15, lower: -0.177},
        {range: [18, 30], upper: -0.16, lower: -0.193},
        {range: [30, 40], upper: -0.17, lower: -0.209},
        {range: [40, 50], upper: -0.18, lower: -0.219},
        {range: [50, 65], upper: -0.19, lower: -0.236},
        {range: [65, 80], upper: -0.2, lower: -0.246},
        {range: [80, 100], upper: -0.22, lower: -0.274},
        {range: [100, 120], upper: -0.24, lower: -0.294},
        {range: [120, 140], upper: -0.26, lower: -0.323},
        {range: [140, 160], upper: -0.28, lower: -0.343},
        {range: [160, 180], upper: -0.31, lower: -0.373},
        {range: [180, 200], upper: -0.34, lower: -0.412},
        {range: [200, 225], upper: -0.38, lower: -0.452},
        {range: [225, 250], upper: -0.42, lower: -0.492},
        {range: [250, 280], upper: -0.48, lower: -0.561},
        {range: [280, 315], upper: -0.54, lower: -0.621},
        {range: [315, 355], upper: -0.6, lower: -0.689},
        {range: [355, 400], upper: -0.68, lower: -0.769},
        {range: [400, 450], upper: -0.76, lower: -0.857},
        {range: [450, 500], upper: -0.84, lower: -0.937}
    ],
    'b9': [
        {range: [0, 3], upper: -0.14, lower: -0.154},
        {range: [3, 6], upper: -0.14, lower: -0.158},
        {range: [6, 10], upper: -0.15, lower: -0.172},
        {range: [10, 18], upper: -0.15, lower: -0.177},
        {range: [18, 30], upper: -0.16, lower: -0.193},
        {range: [30, 40], upper: -0.17, lower: -0.209},
        {range: [40, 50], upper: -0.18, lower: -0.219},
        {range: [50, 65], upper: -0.19, lower: -0.236},
        {range: [65, 80], upper: -0.2, lower: -0.246},
        {range: [80, 100], upper: -0.22, lower: -0.274},
        {range: [100, 120], upper: -0.24, lower: -0.294},
        {range: [120, 140], upper: -0.26, lower: -0.323},
        {range: [140, 160], upper: -0.28, lower: -0.343},
        {range: [160, 180], upper: -0.31, lower: -0.373},
        {range: [180, 200], upper: -0.34, lower: -0.412},
        {range: [200, 225], upper: -0.38, lower: -0.452},
        {range: [225, 250], upper: -0.42, lower: -0.492},
        {range: [250, 280], upper: -0.48, lower: -0.561},
        {range: [280, 315], upper: -0.54, lower: -0.621},
        {range: [315, 355], upper: -0.6, lower: -0.689},
        {range: [355, 400], upper: -0.68, lower: -0.769},
        {range: [400, 450], upper: -0.76, lower: -0.857},
        {range: [450, 500], upper: -0.84, lower: -0.937}
    ],
    'b10': [
        {range: [0, 3], upper: -0.14, lower: -0.165},
        {range: [3, 6], upper: -0.14, lower: -0.17},
        {range: [6, 10], upper: -0.15, lower: -0.186},
        {range: [10, 18], upper: -0.15, lower: -0.193},
        {range: [18, 30], upper: -0.16, lower: -0.212},
        {range: [30, 40], upper: -0.17, lower: -0.232},
        {range: [40, 50], upper: -0.18, lower: -0.242},
        {range: [50, 65], upper: -0.19, lower: -0.264},
        {range: [65, 80], upper: -0.2, lower: -0.274},
        {range: [80, 100], upper: -0.22, lower: -0.307},
        {range: [100, 120], upper: -0.24, lower: -0.327},
        {range: [120, 140], upper: -0.26, lower: -0.36},
        {range: [140, 160], upper: -0.28, lower: -0.38},
        {range: [160, 180], upper: -0.31, lower: -0.41},
        {range: [180, 200], upper: -0.34, lower: -0.455},
        {range: [200, 225], upper: -0.38, lower: -0.495},
        {range: [225, 250], upper: -0.42, lower: -0.535},
        {range: [250, 280], upper: -0.48, lower: -0.61},
        {range: [280, 315], upper: -0.54, lower: -0.67},
        {range: [315, 355], upper: -0.6, lower: -0.74},
        {range: [355, 400], upper: -0.68, lower: -0.82},
        {range: [400, 450], upper: -0.76, lower: -0.915},
        {range: [450, 500], upper: -0.84, lower: -0.995}
    ],
    'b11': [
        {range: [0, 3], upper: -0.14, lower: -0.18},
        {range: [3, 6], upper: -0.14, lower: -0.188},
        {range: [6, 10], upper: -0.15, lower: -0.208},
        {range: [10, 18], upper: -0.15, lower: -0.22},
        {range: [18, 30], upper: -0.16, lower: -0.244},
        {range: [30, 40], upper: -0.17, lower: -0.27},
        {range: [40, 50], upper: -0.18, lower: -0.28},
        {range: [50, 65], upper: -0.19, lower: -0.31},
        {range: [65, 80], upper: -0.2, lower: -0.32},
        {range: [80, 100], upper: -0.22, lower: -0.36},
        {range: [100, 120], upper: -0.24, lower: -0.38},
        {range: [120, 140], upper: -0.26, lower: -0.42},
        {range: [140, 160], upper: -0.28, lower: -0.44},
        {range: [160, 180], upper: -0.31, lower: -0.47},
        {range: [180, 200], upper: -0.34, lower: -0.525},
        {range: [200, 225], upper: -0.38, lower: -0.565},
        {range: [225, 250], upper: -0.42, lower: -0.605},
        {range: [250, 280], upper: -0.48, lower: -0.69},
        {range: [280, 315], upper: -0.54, lower: -0.75},
        {range: [315, 355], upper: -0.6, lower: -0.83},
        {range: [355, 400], upper: -0.68, lower: -0.91},
        {range: [400, 450], upper: -0.76, lower: -1.01},
        {range: [450, 500], upper: -0.84, lower: -1.09}
    ],
    'b12': [
        {range: [0, 3], upper: -0.14, lower: -0.2},
        {range: [3, 6], upper: -0.14, lower: -0.215},
        {range: [6, 10], upper: -0.15, lower: -0.24},
        {range: [10, 18], upper: -0.15, lower: -0.26},
        {range: [18, 30], upper: -0.16, lower: -0.29},
        {range: [30, 40], upper: -0.17, lower: -0.33},
        {range: [40, 50], upper: -0.18, lower: -0.34},
        {range: [50, 65], upper: -0.19, lower: -0.38},
        {range: [65, 80], upper: -0.2, lower: -0.39},
        {range: [80, 100], upper: -0.22, lower: -0.44},
        {range: [100, 120], upper: -0.24, lower: -0.46},
        {range: [120, 140], upper: -0.26, lower: -0.51},
        {range: [140, 160], upper: -0.28, lower: -0.53},
        {range: [160, 180], upper: -0.31, lower: -0.56},
        {range: [180, 200], upper: -0.34, lower: -0.63},
        {range: [200, 225], upper: -0.38, lower: -0.67},
        {range: [225, 250], upper: -0.42, lower: -0.71},
        {range: [250, 280], upper: -0.48, lower: -0.8},
        {range: [280, 315], upper: -0.54, lower: -0.86},
        {range: [315, 355], upper: -0.6, lower: -0.96},
        {range: [355, 400], upper: -0.68, lower: -1.04},
        {range: [400, 450], upper: -0.76, lower: -1.16},
        {range: [450, 500], upper: -0.84, lower: -1.24}
    ],
    'b13': [
        {range: [0, 3], upper: -0.14, lower: -0.24},
        {range: [3, 6], upper: -0.14, lower: -0.26},
        {range: [6, 10], upper: -0.15, lower: -0.3},
        {range: [10, 18], upper: -0.15, lower: -0.33},
        {range: [18, 30], upper: -0.16, lower: -0.37},
        {range: [30, 40], upper: -0.17, lower: -0.42},
        {range: [40, 50], upper: -0.18, lower: -0.43},
        {range: [50, 65], upper: -0.19, lower: -0.49},
        {range: [65, 80], upper: -0.2, lower: -0.5},
        {range: [80, 100], upper: -0.22, lower: -0.57},
        {range: [100, 120], upper: -0.24, lower: -0.59},
        {range: [120, 140], upper: -0.26, lower: -0.66},
        {range: [140, 160], upper: -0.28, lower: -0.68},
        {range: [160, 180], upper: -0.31, lower: -0.71},
        {range: [180, 200], upper: -0.34, lower: -0.8},
        {range: [200, 225], upper: -0.38, lower: -0.84},
        {range: [225, 250], upper: -0.42, lower: -0.88},
        {range: [250, 280], upper: -0.48, lower: -1},
        {range: [280, 315], upper: -0.54, lower: -1.06},
        {range: [315, 355], upper: -0.6, lower: -1.17},
        {range: [355, 400], upper: -0.68, lower: -1.25},
        {range: [400, 450], upper: -0.76, lower: -1.39},
        {range: [450, 500], upper: -0.84, lower: -1.47}
    ],
    'c8': [
        {range: [0, 3], upper: -0.06, lower: -0.074},
        {range: [3, 6], upper: -0.07, lower: -0.088},
        {range: [6, 10], upper: -0.08, lower: -0.102},
        {range: [10, 18], upper: -0.095, lower: -0.122},
        {range: [18, 30], upper: -0.11, lower: -0.143},
        {range: [30, 40], upper: -0.12, lower: -0.159},
        {range: [40, 50], upper: -0.13, lower: -0.169},
        {range: [50, 65], upper: -0.14, lower: -0.186},
        {range: [65, 80], upper: -0.15, lower: -0.196},
        {range: [80, 100], upper: -0.17, lower: -0.224},
        {range: [100, 120], upper: -0.18, lower: -0.234},
        {range: [120, 140], upper: -0.2, lower: -0.263},
        {range: [140, 160], upper: -0.21, lower: -0.273},
        {range: [160, 180], upper: -0.23, lower: -0.293},
        {range: [180, 200], upper: -0.24, lower: -0.312},
        {range: [200, 225], upper: -0.26, lower: -0.332},
        {range: [225, 250], upper: -0.28, lower: -0.352},
        {range: [250, 280], upper: -0.3, lower: -0.381},
        {range: [280, 315], upper: -0.33, lower: -0.411},
        {range: [315, 355], upper: -0.36, lower: -0.449},
        {range: [355, 400], upper: -0.4, lower: -0.489},
        {range: [400, 450], upper: -0.44, lower: -0.537},
        {range: [450, 500], upper: -0.48, lower: -0.577}
    ],
    'c9': [
        {range: [0, 3], upper: -0.06, lower: -0.074},
        {range: [3, 6], upper: -0.07, lower: -0.088},
        {range: [6, 10], upper: -0.08, lower: -0.102},
        {range: [10, 18], upper: -0.095, lower: -0.122},
        {range: [18, 30], upper: -0.11, lower: -0.143},
        {range: [30, 40], upper: -0.12, lower: -0.159},
        {range: [40, 50], upper: -0.13, lower: -0.169},
        {range: [50, 65], upper: -0.14, lower: -0.186},
        {range: [65, 80], upper: -0.15, lower: -0.196},
        {range: [80, 100], upper: -0.17, lower: -0.224},
        {range: [100, 120], upper: -0.18, lower: -0.234},
        {range: [120, 140], upper: -0.2, lower: -0.263},
        {range: [140, 160], upper: -0.21, lower: -0.273},
        {range: [160, 180], upper: -0.23, lower: -0.293},
        {range: [180, 200], upper: -0.24, lower: -0.312},
        {range: [200, 225], upper: -0.26, lower: -0.332},
        {range: [225, 250], upper: -0.28, lower: -0.352},
        {range: [250, 280], upper: -0.3, lower: -0.381},
        {range: [280, 315], upper: -0.33, lower: -0.411},
        {range: [315, 355], upper: -0.36, lower: -0.449},
        {range: [355, 400], upper: -0.4, lower: -0.489},
        {range: [400, 450], upper: -0.44, lower: -0.537},
        {range: [450, 500], upper: -0.48, lower: -0.577}
    ],
    'c10': [
        {range: [0, 3], upper: -0.06, lower: -0.085},
        {range: [3, 6], upper: -0.07, lower: -0.1},
        {range: [6, 10], upper: -0.08, lower: -0.116},
        {range: [10, 18], upper: -0.095, lower: -0.138},
        {range: [18, 30], upper: -0.11, lower: -0.162},
        {range: [30, 40], upper: -0.12, lower: -0.182},
        {range: [40, 50], upper: -0.13, lower: -0.192},
        {range: [50, 65], upper: -0.14, lower: -0.214},
        {range: [65, 80], upper: -0.15, lower: -0.224},
        {range: [80, 100], upper: -0.17, lower: -0.257},
        {range: [100, 120], upper: -0.18, lower: -0.267},
        {range: [120, 140], upper: -0.2, lower: -0.3},
        {range: [140, 160], upper: -0.21, lower: -0.31},
        {range: [160, 180], upper: -0.23, lower: -0.33},
        {range: [180, 200], upper: -0.24, lower: -0.355},
        {range: [200, 225], upper: -0.26, lower: -0.375},
        {range: [225, 250], upper: -0.28, lower: -0.395},
        {range: [250, 280], upper: -0.3, lower: -0.43},
        {range: [280, 315], upper: -0.33, lower: -0.46},
        {range: [315, 355], upper: -0.36, lower: -0.5},
        {range: [355, 400], upper: -0.4, lower: -0.54},
        {range: [400, 450], upper: -0.44, lower: -0.595},
        {range: [450, 500], upper: -0.48, lower: -0.635}
    ],
    'c11': [
        {range: [0, 3], upper: -0.06, lower: -0.1},
        {range: [3, 6], upper: -0.07, lower: -0.118},
        {range: [6, 10], upper: -0.08, lower: -0.138},
        {range: [10, 18], upper: -0.095, lower: -0.165},
        {range: [18, 30], upper: -0.11, lower: -0.194},
        {range: [30, 40], upper: -0.12, lower: -0.22},
        {range: [40, 50], upper: -0.13, lower: -0.23},
        {range: [50, 65], upper: -0.14, lower: -0.26},
        {range: [65, 80], upper: -0.15, lower: -0.27},
        {range: [80, 100], upper: -0.17, lower: -0.31},
        {range: [100, 120], upper: -0.18, lower: -0.32},
        {range: [120, 140], upper: -0.2, lower: -0.36},
        {range: [140, 160], upper: -0.21, lower: -0.37},
        {range: [160, 180], upper: -0.23, lower: -0.39},
        {range: [180, 200], upper: -0.24, lower: -0.425},
        {range: [200, 225], upper: -0.26, lower: -0.445},
        {range: [225, 250], upper: -0.28, lower: -0.465},
        {range: [250, 280], upper: -0.3, lower: -0.51},
        {range: [280, 315], upper: -0.33, lower: -0.54},
        {range: [315, 355], upper: -0.36, lower: -0.59},
        {range: [355, 400], upper: -0.4, lower: -0.63},
        {range: [400, 450], upper: -0.44, lower: -0.69},
        {range: [450, 500], upper: -0.48, lower: -0.73}
    ],
    'c12': [
        {range: [0, 3], upper: -0.06, lower: -0.12},
        {range: [3, 6], upper: -0.07, lower: -0.145},
        {range: [6, 10], upper: -0.08, lower: -0.17},
        {range: [10, 18], upper: -0.095, lower: -0.205},
        {range: [18, 30], upper: -0.11, lower: -0.24},
        {range: [30, 40], upper: -0.12, lower: -0.28},
        {range: [40, 50], upper: -0.13, lower: -0.29},
        {range: [50, 65], upper: -0.14, lower: -0.33},
        {range: [65, 80], upper: -0.15, lower: -0.34},
        {range: [80, 100], upper: -0.17, lower: -0.39},
        {range: [100, 120], upper: -0.18, lower: -0.4},
        {range: [120, 140], upper: -0.2, lower: -0.45},
        {range: [140, 160], upper: -0.21, lower: -0.46},
        {range: [160, 180], upper: -0.23, lower: -0.48},
        {range: [180, 200], upper: -0.24, lower: -0.53},
        {range: [200, 225], upper: -0.26, lower: -0.55},
        {range: [225, 250], upper: -0.28, lower: -0.57},
        {range: [250, 280], upper: -0.3, lower: -0.62},
        {range: [280, 315], upper: -0.33, lower: -0.65},
        {range: [315, 355], upper: -0.36, lower: -0.72},
        {range: [355, 400], upper: -0.4, lower: -0.76},
        {range: [400, 450], upper: -0.44, lower: -0.84},
        {range: [450, 500], upper: -0.48, lower: -0.88}
    ],
    'd5': [
        {range: [0, 3], upper: -0.02, lower: -0.024},
        {range: [3, 6], upper: -0.03, lower: -0.035},
        {range: [6, 10], upper: -0.04, lower: -0.046},
        {range: [10, 18], upper: -0.05, lower: -0.058},
        {range: [18, 30], upper: -0.065, lower: -0.074},
        {range: [30, 50], upper: -0.08, lower: -0.091},
        {range: [50, 80], upper: -0.1, lower: -0.113},
        {range: [80, 120], upper: -0.12, lower: -0.135},
        {range: [120, 180], upper: -0.145, lower: -0.163},
        {range: [180, 250], upper: -0.17, lower: -0.19},
        {range: [250, 315], upper: -0.19, lower: -0.213},
        {range: [315, 400], upper: -0.21, lower: -0.235},
        {range: [400, 500], upper: -0.23, lower: -0.257}
    ],
    'd6': [
        {range: [0, 3], upper: -0.02, lower: -0.026},
        {range: [3, 6], upper: -0.03, lower: -0.038},
        {range: [6, 10], upper: -0.04, lower: -0.049},
        {range: [10, 18], upper: -0.05, lower: -0.061},
        {range: [18, 30], upper: -0.065, lower: -0.078},
        {range: [30, 50], upper: -0.08, lower: -0.096},
        {range: [50, 80], upper: -0.1, lower: -0.119},
        {range: [80, 120], upper: -0.12, lower: -0.142},
        {range: [120, 180], upper: -0.145, lower: -0.17},
        {range: [180, 250], upper: -0.17, lower: -0.199},
        {range: [250, 315], upper: -0.19, lower: -0.222},
        {range: [315, 400], upper: -0.21, lower: -0.246},
        {range: [400, 500], upper: -0.23, lower: -0.27}
    ],
    'd7': [
        {range: [0, 3], upper: -0.02, lower: -0.03},
        {range: [3, 6], upper: -0.03, lower: -0.042},
        {range: [6, 10], upper: -0.04, lower: -0.055},
        {range: [10, 18], upper: -0.05, lower: -0.068},
        {range: [18, 30], upper: -0.065, lower: -0.086},
        {range: [30, 50], upper: -0.08, lower: -0.105},
        {range: [50, 80], upper: -0.1, lower: -0.13},
        {range: [80, 120], upper: -0.12, lower: -0.155},
        {range: [120, 180], upper: -0.145, lower: -0.185},
        {range: [180, 250], upper: -0.17, lower: -0.216},
        {range: [250, 315], upper: -0.19, lower: -0.242},
        {range: [315, 400], upper: -0.21, lower: -0.267},
        {range: [400, 500], upper: -0.23, lower: -0.293},
        {range: [500, 630], upper: -0.26, lower: -0.33},
        {range: [630, 800], upper: -0.29, lower: -0.37},
        {range: [800, 1000], upper: -0.32, lower: -0.41},
        {range: [1000, 1250], upper: -0.35, lower: -0.455},
        {range: [1250, 1600], upper: -0.39, lower: -0.515},
        {range: [1600, 2000], upper: -0.43, lower: -0.58},
        {range: [2000, 2500], upper: -0.48, lower: -0.655},
        {range: [2500, 3150], upper: -0.52, lower: -0.73}
    ],
    'd8': [
        {range: [0, 3], upper: -0.02, lower: -0.034},
        {range: [3, 6], upper: -0.03, lower: -0.048},
        {range: [6, 10], upper: -0.04, lower: -0.062},
        {range: [10, 18], upper: -0.05, lower: -0.077},
        {range: [18, 30], upper: -0.065, lower: -0.098},
        {range: [30, 50], upper: -0.08, lower: -0.119},
        {range: [50, 80], upper: -0.1, lower: -0.146},
        {range: [80, 120], upper: -0.12, lower: -0.174},
        {range: [120, 180], upper: -0.145, lower: -0.208},
        {range: [180, 250], upper: -0.17, lower: -0.242},
        {range: [250, 315], upper: -0.19, lower: -0.271},
        {range: [315, 400], upper: -0.21, lower: -0.299},
        {range: [400, 500], upper: -0.23, lower: -0.327},
        {range: [500, 630], upper: -0.26, lower: -0.37},
        {range: [630, 800], upper: -0.29, lower: -0.415},
        {range: [800, 1000], upper: -0.32, lower: -0.46},
        {range: [1000, 1250], upper: -0.35, lower: -0.515},
        {range: [1250, 1600], upper: -0.39, lower: -0.585},
        {range: [1600, 2000], upper: -0.43, lower: -0.66},
        {range: [2000, 2500], upper: -0.48, lower: -0.76},
        {range: [2500, 3150], upper: -0.52, lower: -0.85}
    ],
    'd9': [
        {range: [0, 3], upper: -0.02, lower: -0.045},
        {range: [3, 6], upper: -0.03, lower: -0.06},
        {range: [6, 10], upper: -0.04, lower: -0.076},
        {range: [10, 18], upper: -0.05, lower: -0.093},
        {range: [18, 30], upper: -0.065, lower: -0.117},
        {range: [30, 50], upper: -0.08, lower: -0.142},
        {range: [50, 80], upper: -0.1, lower: -0.174},
        {range: [80, 120], upper: -0.12, lower: -0.207},
        {range: [120, 180], upper: -0.145, lower: -0.245},
        {range: [180, 250], upper: -0.17, lower: -0.285},
        {range: [250, 315], upper: -0.19, lower: -0.32},
        {range: [315, 400], upper: -0.21, lower: -0.35},
        {range: [400, 500], upper: -0.23, lower: -0.385},
        {range: [500, 630], upper: -0.26, lower: -0.435},
        {range: [630, 800], upper: -0.29, lower: -0.49},
        {range: [800, 1000], upper: -0.32, lower: -0.55},
        {range: [1000, 1250], upper: -0.35, lower: -0.61},
        {range: [1250, 1600], upper: -0.39, lower: -0.7},
        {range: [1600, 2000], upper: -0.43, lower: -0.8},
        {range: [2000, 2500], upper: -0.48, lower: -0.92},
        {range: [2500, 3150], upper: -0.52, lower: -1.06}
    ],
    'd10': [
        {range: [0, 3], upper: -0.02, lower: -0.06},
        {range: [3, 6], upper: -0.03, lower: -0.078},
        {range: [6, 10], upper: -0.04, lower: -0.098},
        {range: [10, 18], upper: -0.05, lower: -0.12},
        {range: [18, 30], upper: -0.065, lower: -0.149},
        {range: [30, 50], upper: -0.08, lower: -0.18},
        {range: [50, 80], upper: -0.1, lower: -0.22},
        {range: [80, 120], upper: -0.12, lower: -0.26},
        {range: [120, 180], upper: -0.145, lower: -0.305},
        {range: [180, 250], upper: -0.17, lower: -0.355},
        {range: [250, 315], upper: -0.19, lower: -0.4},
        {range: [315, 400], upper: -0.21, lower: -0.44},
        {range: [400, 500], upper: -0.23, lower: -0.48},
        {range: [500, 630], upper: -0.26, lower: -0.54},
        {range: [630, 800], upper: -0.29, lower: -0.61},
        {range: [800, 1000], upper: -0.32, lower: -0.68},
        {range: [1000, 1250], upper: -0.35, lower: -0.77},
        {range: [1250, 1600], upper: -0.39, lower: -0.89},
        {range: [1600, 2000], upper: -0.43, lower: -1.03},
        {range: [2000, 2500], upper: -0.48, lower: -1.18},
        {range: [2500, 3150], upper: -0.52, lower: -1.38}
    ],
    'd11': [
        {range: [0, 3], upper: -0.02, lower: -0.08},
        {range: [3, 6], upper: -0.03, lower: -0.105},
        {range: [6, 10], upper: -0.04, lower: -0.13},
        {range: [10, 18], upper: -0.05, lower: -0.16},
        {range: [18, 30], upper: -0.065, lower: -0.195},
        {range: [30, 50], upper: -0.08, lower: -0.24},
        {range: [50, 80], upper: -0.1, lower: -0.29},
        {range: [80, 120], upper: -0.12, lower: -0.34},
        {range: [120, 180], upper: -0.145, lower: -0.395},
        {range: [180, 250], upper: -0.17, lower: -0.46},
        {range: [250, 315], upper: -0.19, lower: -0.51},
        {range: [315, 400], upper: -0.21, lower: -0.57},
        {range: [400, 500], upper: -0.23, lower: -0.63},
        {range: [500, 630], upper: -0.26, lower: -0.7},
        {range: [630, 800], upper: -0.29, lower: -0.79},
        {range: [800, 1000], upper: -0.32, lower: -0.88},
        {range: [1000, 1250], upper: -0.35, lower: -1.01},
        {range: [1250, 1600], upper: -0.39, lower: -1.17},
        {range: [1600, 2000], upper: -0.43, lower: -1.35},
        {range: [2000, 2500], upper: -0.48, lower: -1.58},
        {range: [2500, 3150], upper: -0.52, lower: -1.87}
    ],
    'd12': [
        {range: [0, 3], upper: -0.02, lower: -0.12},
        {range: [3, 6], upper: -0.03, lower: -0.15},
        {range: [6, 10], upper: -0.04, lower: -0.19},
        {range: [10, 18], upper: -0.05, lower: -0.23},
        {range: [18, 30], upper: -0.065, lower: -0.275},
        {range: [30, 50], upper: -0.08, lower: -0.33},
        {range: [50, 80], upper: -0.1, lower: -0.4},
        {range: [80, 120], upper: -0.12, lower: -0.47},
        {range: [120, 180], upper: -0.145, lower: -0.545},
        {range: [180, 250], upper: -0.17, lower: -0.63},
        {range: [250, 315], upper: -0.19, lower: -0.71},
        {range: [315, 400], upper: -0.21, lower: -0.78},
        {range: [400, 500], upper: -0.23, lower: -0.86},
        {range: [500, 630], upper: -0.26, lower: -1.0},
        {range: [630, 800], upper: -0.29, lower: -1.12}
    ],
    'd13': [
        {range: [0, 3], upper: -0.02, lower: -0.16},
        {range: [3, 6], upper: -0.03, lower: -0.21},
        {range: [6, 10], upper: -0.04, lower: -0.26},
        {range: [10, 18], upper: -0.05, lower: -0.32},
        {range: [18, 30], upper: -0.065, lower: -0.395},
        {range: [30, 50], upper: -0.08, lower: -0.47},
        {range: [50, 80], upper: -0.1, lower: -0.56},
        {range: [80, 120], upper: -0.12, lower: -0.66},
        {range: [120, 180], upper: -0.145, lower: -0.775},
        {range: [180, 250], upper: -0.17, lower: -0.89},
        {range: [250, 315], upper: -0.19, lower: -1.0},
        {range: [315, 400], upper: -0.21, lower: -1.1},
        {range: [400, 500], upper: -0.23, lower: -1.2}
    ],
    'e5': [
        {range: [0, 3], upper: -0.014, lower: -0.018},
        {range: [3, 6], upper: -0.02, lower: -0.025},
        {range: [6, 10], upper: -0.025, lower: -0.031},
        {range: [10, 18], upper: -0.032, lower: -0.04},
        {range: [18, 30], upper: -0.04, lower: -0.049},
        {range: [30, 50], upper: -0.05, lower: -0.061},
        {range: [50, 80], upper: -0.06, lower: -0.073},
        {range: [80, 120], upper: -0.072, lower: -0.087},
        {range: [120, 180], upper: -0.085, lower: -0.103},
        {range: [180, 250], upper: -0.1, lower: -0.12},
        {range: [250, 315], upper: -0.11, lower: -0.133},
        {range: [315, 400], upper: -0.125, lower: -0.15},
        {range: [400, 500], upper: -0.135, lower: -0.162}
    ],
    'e6': [
        {range: [0, 3], upper: -0.014, lower: -0.02},
        {range: [3, 6], upper: -0.02, lower: -0.028},
        {range: [6, 10], upper: -0.025, lower: -0.034},
        {range: [10, 18], upper: -0.032, lower: -0.043},
        {range: [18, 30], upper: -0.04, lower: -0.053},
        {range: [30, 50], upper: -0.05, lower: -0.066},
        {range: [50, 80], upper: -0.06, lower: -0.079},
        {range: [80, 120], upper: -0.072, lower: -0.094},
        {range: [120, 180], upper: -0.085, lower: -0.11},
        {range: [180, 250], upper: -0.1, lower: -0.129},
        {range: [250, 315], upper: -0.11, lower: -0.142},
        {range: [315, 400], upper: -0.125, lower: -0.161},
        {range: [400, 500], upper: -0.135, lower: -0.175},
        {range: [500, 630], upper: -0.145, lower: -0.189},
        {range: [630, 800], upper: -0.16, lower: -0.21},
        {range: [800, 1000], upper: -0.17, lower: -0.226},
        {range: [1000, 1250], upper: -0.195, lower: -0.261},
        {range: [1250, 1600], upper: -0.22, lower: -0.298},
        {range: [1600, 2000], upper: -0.24, lower: -0.332},
        {range: [2000, 2500], upper: -0.26, lower: -0.37},
        {range: [2500, 3150], upper: -0.29, lower: -0.425}
    ],
    'e7': [
        {range: [0, 3], upper: -0.014, lower: -0.024},
        {range: [3, 6], upper: -0.02, lower: -0.032},
        {range: [6, 10], upper: -0.025, lower: -0.04},
        {range: [10, 18], upper: -0.032, lower: -0.05},
        {range: [18, 30], upper: -0.04, lower: -0.061},
        {range: [30, 50], upper: -0.05, lower: -0.075},
        {range: [50, 80], upper: -0.06, lower: -0.09},
        {range: [80, 120], upper: -0.072, lower: -0.107},
        {range: [120, 180], upper: -0.085, lower: -0.125},
        {range: [180, 250], upper: -0.1, lower: -0.146},
        {range: [250, 315], upper: -0.11, lower: -0.162},
        {range: [315, 400], upper: -0.125, lower: -0.182},
        {range: [400, 500], upper: -0.135, lower: -0.198},
        {range: [500, 630], upper: -0.145, lower: -0.215},
        {range: [630, 800], upper: -0.16, lower: -0.24},
        {range: [800, 1000], upper: -0.17, lower: -0.26},
        {range: [1000, 1250], upper: -0.195, lower: -0.3},
        {range: [1250, 1600], upper: -0.22, lower: -0.345},
        {range: [1600, 2000], upper: -0.24, lower: -0.39},
        {range: [2000, 2500], upper: -0.26, lower: -0.435},
        {range: [2500, 3150], upper: -0.29, lower: -0.5}
    ],
    'e8': [
        {range: [0, 3], upper: -0.014, lower: -0.028},
        {range: [3, 6], upper: -0.02, lower: -0.038},
        {range: [6, 10], upper: -0.025, lower: -0.047},
        {range: [10, 18], upper: -0.032, lower: -0.059},
        {range: [18, 30], upper: -0.04, lower: -0.073},
        {range: [30, 50], upper: -0.05, lower: -0.089},
        {range: [50, 80], upper: -0.06, lower: -0.106},
        {range: [80, 120], upper: -0.072, lower: -0.126},
        {range: [120, 180], upper: -0.085, lower: -0.148},
        {range: [180, 250], upper: -0.1, lower: -0.172},
        {range: [250, 315], upper: -0.11, lower: -0.191},
        {range: [315, 400], upper: -0.125, lower: -0.214},
        {range: [400, 500], upper: -0.135, lower: -0.232},
        {range: [500, 630], upper: -0.145, lower: -0.255},
        {range: [630, 800], upper: -0.16, lower: -0.285},
        {range: [800, 1000], upper: -0.17, lower: -0.31},
        {range: [1000, 1250], upper: -0.195, lower: -0.36},
        {range: [1250, 1600], upper: -0.22, lower: -0.415},
        {range: [1600, 2000], upper: -0.24, lower: -0.47},
        {range: [2000, 2500], upper: -0.26, lower: -0.54},
        {range: [2500, 3150], upper: -0.29, lower: -0.62}
    ],
    'e9': [
        {range: [0, 3], upper: -0.014, lower: -0.039},
        {range: [3, 6], upper: -0.02, lower: -0.05},
        {range: [6, 10], upper: -0.025, lower: -0.061},
        {range: [10, 18], upper: -0.032, lower: -0.075},
        {range: [18, 30], upper: -0.04, lower: -0.092},
        {range: [30, 50], upper: -0.05, lower: -0.112},
        {range: [50, 80], upper: -0.06, lower: -0.134},
        {range: [80, 120], upper: -0.072, lower: -0.159},
        {range: [120, 180], upper: -0.085, lower: -0.185},
        {range: [180, 250], upper: -0.1, lower: -0.215},
        {range: [250, 315], upper: -0.11, lower: -0.24},
        {range: [315, 400], upper: -0.125, lower: -0.265},
        {range: [400, 500], upper: -0.135, lower: -0.29},
        {range: [500, 630], upper: -0.145, lower: -0.32},
        {range: [630, 800], upper: -0.16, lower: -0.36},
        {range: [800, 1000], upper: -0.17, lower: -0.4},
        {range: [1000, 1250], upper: -0.195, lower: -0.455},
        {range: [1250, 1600], upper: -0.22, lower: -0.53},
        {range: [1600, 2000], upper: -0.24, lower: -0.61},
        {range: [2000, 2500], upper: -0.26, lower: -0.7},
        {range: [2500, 3150], upper: -0.29, lower: -0.83}
    ],
    'e10': [
        {range: [0, 3], upper: -0.014, lower: -0.054},
        {range: [3, 6], upper: -0.02, lower: -0.068},
        {range: [6, 10], upper: -0.025, lower: -0.083},
        {range: [10, 18], upper: -0.032, lower: -0.102},
        {range: [18, 30], upper: -0.04, lower: -0.124},
        {range: [30, 50], upper: -0.05, lower: -0.15},
        {range: [50, 80], upper: -0.06, lower: -0.18},
        {range: [80, 120], upper: -0.072, lower: -0.212},
        {range: [120, 180], upper: -0.085, lower: -0.245},
        {range: [180, 250], upper: -0.1, lower: -0.285},
        {range: [250, 315], upper: -0.11, lower: -0.32},
        {range: [315, 400], upper: -0.125, lower: -0.355},
        {range: [400, 500], upper: -0.135, lower: -0.385},
        {range: [500, 630], upper: -0.145, lower: -0.425},
        {range: [630, 800], upper: -0.16, lower: -0.48},
        {range: [800, 1000], upper: -0.17, lower: -0.53},
        {range: [1000, 1250], upper: -0.195, lower: -0.615},
        {range: [1250, 1600], upper: -0.22, lower: -0.72},
        {range: [1600, 2000], upper: -0.24, lower: -0.84},
        {range: [2000, 2500], upper: -0.26, lower: -0.96},
        {range: [2500, 3150], upper: -0.29, lower: -1.15}
    ],
    'f3': [
        {range: [0, 3], upper: -0.006, lower: -0.008},
        {range: [3, 6], upper: -0.01, lower: -0.0125},
        {range: [6, 10], upper: -0.013, lower: -0.0155},
        {range: [10, 18], upper: -0.016, lower: -0.019},
        {range: [18, 30], upper: -0.02, lower: -0.024},
        {range: [30, 50], upper: -0.025, lower: -0.029}
    ],
    'f4': [
        {range: [0, 3], upper: -0.006, lower: -0.009},
        {range: [3, 6], upper: -0.01, lower: -0.014},
        {range: [6, 10], upper: -0.013, lower: -0.017},
        {range: [10, 18], upper: -0.016, lower: -0.021},
        {range: [18, 30], upper: -0.02, lower: -0.026},
        {range: [30, 50], upper: -0.025, lower: -0.032},
        {range: [50, 80], upper: -0.03, lower: -0.038},
        {range: [80, 120], upper: -0.036, lower: -0.046},
        {range: [120, 180], upper: -0.043, lower: -0.055},
        {range: [180, 250], upper: -0.05, lower: -0.064},
        {range: [250, 315], upper: -0.056, lower: -0.072},
        {range: [315, 400], upper: -0.062, lower: -0.08},
        {range: [400, 500], upper: -0.068, lower: -0.088}
    ],
    'f5': [
        {range: [0, 3], upper: -0.006, lower: -0.01},
        {range: [3, 6], upper: -0.01, lower: -0.015},
        {range: [6, 10], upper: -0.013, lower: -0.019},
        {range: [10, 18], upper: -0.016, lower: -0.024},
        {range: [18, 30], upper: -0.02, lower: -0.029},
        {range: [30, 50], upper: -0.025, lower: -0.036},
        {range: [50, 80], upper: -0.03, lower: -0.043},
        {range: [80, 120], upper: -0.036, lower: -0.051},
        {range: [120, 180], upper: -0.043, lower: -0.061},
        {range: [180, 250], upper: -0.05, lower: -0.07},
        {range: [250, 315], upper: -0.056, lower: -0.079},
        {range: [315, 400], upper: -0.062, lower: -0.087},
        {range: [400, 500], upper: -0.068, lower: -0.095}
    ],
    'f6': [
        {range: [0, 3], upper: -0.006, lower: -0.012},
        {range: [3, 6], upper: -0.01, lower: -0.018},
        {range: [6, 10], upper: -0.013, lower: -0.022},
        {range: [10, 18], upper: -0.016, lower: -0.027},
        {range: [18, 30], upper: -0.02, lower: -0.033},
        {range: [30, 50], upper: -0.025, lower: -0.041},
        {range: [50, 80], upper: -0.03, lower: -0.049},
        {range: [80, 120], upper: -0.036, lower: -0.058},
        {range: [120, 180], upper: -0.043, lower: -0.068},
        {range: [180, 250], upper: -0.05, lower: -0.079},
        {range: [250, 315], upper: -0.056, lower: -0.088},
        {range: [315, 400], upper: -0.062, lower: -0.098},
        {range: [400, 500], upper: -0.068, lower: -0.108},
        {range: [500, 630], upper: -0.076, lower: -0.12}
    ],
    'f7': [
        {range: [0, 3], upper: -0.006, lower: -0.016},
        {range: [3, 6], upper: -0.01, lower: -0.022},
        {range: [6, 10], upper: -0.013, lower: -0.028},
        {range: [10, 18], upper: -0.016, lower: -0.034},
        {range: [18, 30], upper: -0.02, lower: -0.041},
        {range: [30, 50], upper: -0.025, lower: -0.05},
        {range: [50, 80], upper: -0.03, lower: -0.06},
        {range: [80, 120], upper: -0.036, lower: -0.071},
        {range: [120, 180], upper: -0.043, lower: -0.083},
        {range: [180, 250], upper: -0.05, lower: -0.096},
        {range: [250, 315], upper: -0.056, lower: -0.108},
        {range: [315, 400], upper: -0.062, lower: -0.119},
        {range: [400, 500], upper: -0.068, lower: -0.131},
        {range: [500, 630], upper: -0.076, lower: -0.146},
        {range: [630, 800], upper: -0.08, lower: -0.16},
        {range: [800, 1000], upper: -0.086, lower: -0.176},
        {range: [1000, 1250], upper: -0.098, lower: -0.203},
        {range: [1250, 1600], upper: -0.11, lower: -0.235},
        {range: [1600, 2000], upper: -0.12, lower: -0.27},
        {range: [2000, 2500], upper: -0.13, lower: -0.305},
        {range: [2500, 3150], upper: -0.145, lower: -0.355}
    ],
    'f8': [
        {range: [0, 3], upper: -0.006, lower: -0.02},
        {range: [3, 6], upper: -0.01, lower: -0.028},
        {range: [6, 10], upper: -0.013, lower: -0.035},
        {range: [10, 18], upper: -0.016, lower: -0.043},
        {range: [18, 30], upper: -0.02, lower: -0.053},
        {range: [30, 50], upper: -0.025, lower: -0.064},
        {range: [50, 80], upper: -0.03, lower: -0.076},
        {range: [80, 120], upper: -0.036, lower: -0.09},
        {range: [120, 180], upper: -0.043, lower: -0.106},
        {range: [180, 250], upper: -0.05, lower: -0.122},
        {range: [250, 315], upper: -0.056, lower: -0.137},
        {range: [315, 400], upper: -0.062, lower: -0.151},
        {range: [400, 500], upper: -0.068, lower: -0.165},
        {range: [500, 630], upper: -0.076, lower: -0.186},
        {range: [630, 800], upper: -0.08, lower: -0.205},
        {range: [800, 1000], upper: -0.086, lower: -0.226},
        {range: [1000, 1250], upper: -0.098, lower: -0.263},
        {range: [1250, 1600], upper: -0.11, lower: -0.305},
        {range: [1600, 2000], upper: -0.12, lower: -0.35},
        {range: [2000, 2500], upper: -0.13, lower: -0.41},
        {range: [2500, 3150], upper: -0.145, lower: -0.475}
    ],
    'f9': [
        {range: [0, 3], upper: -0.006, lower: -0.031},
        {range: [3, 6], upper: -0.01, lower: -0.04},
        {range: [6, 10], upper: -0.013, lower: -0.049},
        {range: [10, 18], upper: -0.016, lower: -0.059},
        {range: [18, 30], upper: -0.02, lower: -0.072},
        {range: [30, 50], upper: -0.025, lower: -0.087},
        {range: [50, 80], upper: -0.03, lower: -0.104},
        {range: [80, 120], upper: -0.036, lower: -0.123},
        {range: [120, 180], upper: -0.043, lower: -0.143},
        {range: [180, 250], upper: -0.05, lower: -0.165},
        {range: [250, 315], upper: -0.056, lower: -0.186},
        {range: [315, 400], upper: -0.062, lower: -0.202},
        {range: [400, 500], upper: -0.068, lower: -0.223},
        {range: [500, 630], upper: -0.076, lower: -0.251},
        {range: [630, 800], upper: -0.08, lower: -0.28},
        {range: [800, 1000], upper: -0.086, lower: -0.316},
        {range: [1000, 1250], upper: -0.098, lower: -0.358},
        {range: [1250, 1600], upper: -0.11, lower: -0.42},
        {range: [1600, 2000], upper: -0.12, lower: -0.49},
        {range: [2000, 2500], upper: -0.13, lower: -0.57},
        {range: [2500, 3150], upper: -0.145, lower: -0.685}
    ],
    'f10': [
        {range: [0, 3], upper: -0.006, lower: -0.046},
        {range: [3, 6], upper: -0.01, lower: -0.058},
        {range: [6, 10], upper: -0.013, lower: -0.071},
        {range: [10, 18], upper: -0.016, lower: -0.086},
        {range: [18, 30], upper: -0.02, lower: -0.104},
        {range: [30, 50], upper: -0.025, lower: -0.125},
        {range: [50, 80], upper: -0.03, lower: -0.15},
        {range: [80, 120], upper: -0.036, lower: -0.175},
        {range: [120, 180], upper: -0.043, lower: -0.205},
        {range: [180, 250], upper: -0.05, lower: -0.244},
        {range: [250, 315], upper: -0.056, lower: -0.281},
        {range: [315, 400], upper: -0.062, lower: -0.327},
        {range: [400, 500], upper: -0.068, lower: -0.373},
        {range: [500, 630], upper: -0.076, lower: -0.443},
        {range: [630, 800], upper: -0.08, lower: -0.517},
        {range: [800, 1000], upper: -0.086, lower: -0.603},
        {range: [1000, 1250], upper: -0.098, lower: -0.717},
        {range: [1250, 1600], upper: -0.11, lower: -0.864},
        {range: [1600, 2000], upper: -0.12, lower: -1.006},
        {range: [2000, 2500], upper: -0.13, lower: -1.188},
        {range: [2500, 3150], upper: -0.145, lower: -1.404}
    ],
    'g3': [
        {range: [0, 3], upper: -0.002, lower: -0.004},
        {range: [3, 6], upper: -0.004, lower: -0.0065},
        {range: [6, 10], upper: -0.005, lower: -0.0075},
        {range: [10, 18], upper: -0.006, lower: -0.009},
        {range: [18, 30], upper: -0.007, lower: -0.011},
        {range: [30, 50], upper: -0.009, lower: -0.013}
    ],
    'g4': [
        {range: [0, 3], upper: -0.002, lower: -0.005},
        {range: [3, 6], upper: -0.004, lower: -0.008},
        {range: [6, 10], upper: -0.005, lower: -0.009},
        {range: [10, 18], upper: -0.006, lower: -0.011},
        {range: [18, 30], upper: -0.007, lower: -0.013},
        {range: [30, 50], upper: -0.009, lower: -0.016},
        {range: [50, 80], upper: -0.01, lower: -0.018},
        {range: [80, 120], upper: -0.012, lower: -0.022},
        {range: [120, 180], upper: -0.014, lower: -0.026},
        {range: [180, 250], upper: -0.015, lower: -0.029},
        {range: [250, 315], upper: -0.017, lower: -0.033},
        {range: [315, 400], upper: -0.018, lower: -0.036},
        {range: [400, 500], upper: -0.02, lower: -0.04}
    ],
    'g5': [
        {range: [0, 3], upper: -0.002, lower: -0.006},
        {range: [3, 6], upper: -0.004, lower: -0.009},
        {range: [6, 10], upper: -0.005, lower: -0.011},
        {range: [10, 18], upper: -0.006, lower: -0.014},
        {range: [18, 30], upper: -0.007, lower: -0.016},
        {range: [30, 50], upper: -0.009, lower: -0.02},
        {range: [50, 80], upper: -0.01, lower: -0.023},
        {range: [80, 120], upper: -0.012, lower: -0.027},
        {range: [120, 180], upper: -0.014, lower: -0.032},
        {range: [180, 250], upper: -0.015, lower: -0.035},
        {range: [250, 315], upper: -0.017, lower: -0.04},
        {range: [315, 400], upper: -0.018, lower: -0.043},
        {range: [400, 500], upper: -0.02, lower: -0.047}
    ],
    'g6': [
        {range: [0, 3], upper: -0.002, lower: -0.008},
        {range: [3, 6], upper: -0.004, lower: -0.012},
        {range: [6, 10], upper: -0.005, lower: -0.014},
        {range: [10, 18], upper: -0.006, lower: -0.017},
        {range: [18, 30], upper: -0.007, lower: -0.02},
        {range: [30, 50], upper: -0.009, lower: -0.025},
        {range: [50, 80], upper: -0.01, lower: -0.029},
        {range: [80, 120], upper: -0.012, lower: -0.034},
        {range: [120, 180], upper: -0.014, lower: -0.039},
        {range: [180, 250], upper: -0.015, lower: -0.044},
        {range: [250, 315], upper: -0.017, lower: -0.049},
        {range: [315, 400], upper: -0.018, lower: -0.054},
        {range: [400, 500], upper: -0.02, lower: -0.06},
        {range: [500, 630], upper: -0.022, lower: -0.066},
        {range: [630, 800], upper: -0.024, lower: -0.074},
        {range: [800, 1000], upper: -0.026, lower: -0.082},
        {range: [1000, 1250], upper: -0.028, lower: -0.094},
        {range: [1250, 1600], upper: -0.03, lower: -0.108},
        {range: [1600, 2000], upper: -0.032, lower: -0.124},
        {range: [2000, 2500], upper: -0.034, lower: -0.144},
        {range: [2500, 3150], upper: -0.038, lower: -0.173}
    ],
    'g7': [
        {range: [0, 3], upper: -0.002, lower: -0.012},
        {range: [3, 6], upper: -0.004, lower: -0.016},
        {range: [6, 10], upper: -0.005, lower: -0.02},
        {range: [10, 18], upper: -0.006, lower: -0.024},
        {range: [18, 30], upper: -0.007, lower: -0.028},
        {range: [30, 50], upper: -0.009, lower: -0.034},
        {range: [50, 80], upper: -0.01, lower: -0.04},
        {range: [80, 120], upper: -0.012, lower: -0.047},
        {range: [120, 180], upper: -0.014, lower: -0.054},
        {range: [180, 250], upper: -0.015, lower: -0.061},
        {range: [250, 315], upper: -0.017, lower: -0.069},
        {range: [315, 400], upper: -0.018, lower: -0.075},
        {range: [400, 500], upper: -0.02, lower: -0.083}
    ],
    'g8': [
        {range: [0, 3], upper: -0.002, lower: -0.016},
        {range: [3, 6], upper: -0.004, lower: -0.022},
        {range: [6, 10], upper: -0.005, lower: -0.027},
        {range: [10, 18], upper: -0.006, lower: -0.033},
        {range: [18, 30], upper: -0.007, lower: -0.04},
        {range: [30, 50], upper: -0.009, lower: -0.048},
        {range: [50, 80], upper: -0.01, lower: -0.056}
    ],
    'g9': [
        {range: [0, 3], upper: -0.002, lower: -0.027},
        {range: [3, 6], upper: -0.004, lower: -0.034},
        {range: [6, 10], upper: -0.005, lower: -0.041},
        {range: [10, 18], upper: -0.006, lower: -0.049},
        {range: [18, 30], upper: -0.007, lower: -0.059},
        {range: [30, 50], upper: -0.009, lower: -0.071}
    ],
    'g10': [
        {range: [0, 3], upper: -0.002, lower: -0.042},
        {range: [3, 6], upper: -0.004, lower: -0.052},
        {range: [6, 10], upper: -0.005, lower: -0.063},
        {range: [10, 18], upper: -0.006, lower: -0.076},
        {range: [18, 30], upper: -0.007, lower: -0.091},
        {range: [30, 50], upper: -0.009, lower: -0.109}
    ],
    'j5': [
        {range: [0, 3], upper: 0.002, lower: -0.002},
        {range: [3, 6], upper: 0.003, lower: -0.002},
        {range: [6, 10], upper: 0.004, lower: -0.002},
        {range: [10, 18], upper: 0.005, lower: -0.003},
        {range: [18, 30], upper: 0.005, lower: -0.004},
        {range: [30, 50], upper: 0.006, lower: -0.005},
        {range: [50, 80], upper: 0.006, lower: -0.007},
        {range: [80, 120], upper: 0.006, lower: -0.009},
        {range: [120, 180], upper: 0.007, lower: -0.011},
        {range: [180, 250], upper: 0.007, lower: -0.013},
        {range: [250, 315], upper: 0.007, lower: -0.016},
        {range: [315, 400], upper: 0.007, lower: -0.018},
        {range: [400, 500], upper: 0.007, lower: -0.02}
    ],
    'j6': [
        {range: [0, 3], upper: 0.004, lower: -0.002},
        {range: [3, 6], upper: 0.006, lower: -0.002},
        {range: [6, 10], upper: 0.007, lower: -0.002},
        {range: [10, 18], upper: 0.008, lower: -0.003},
        {range: [18, 30], upper: 0.009, lower: -0.004},
        {range: [30, 50], upper: 0.011, lower: -0.005},
        {range: [50, 80], upper: 0.012, lower: -0.007},
        {range: [80, 120], upper: 0.013, lower: -0.009},
        {range: [120, 180], upper: 0.014, lower: -0.011},
        {range: [180, 250], upper: 0.016, lower: -0.013},
        {range: [250, 315], upper: 0.016, lower: -0.016},
        {range: [315, 400], upper: 0.018, lower: -0.018},
        {range: [400, 500], upper: 0.02, lower: -0.02}
    ],
    'j7': [
        {range: [0, 3], upper: 0.006, lower: -0.004},
        {range: [3, 6], upper: 0.008, lower: -0.004},
        {range: [6, 10], upper: 0.01, lower: -0.005},
        {range: [10, 18], upper: 0.012, lower: -0.006},
        {range: [18, 30], upper: 0.013, lower: -0.008},
        {range: [30, 50], upper: 0.015, lower: -0.01},
        {range: [50, 80], upper: 0.018, lower: -0.012},
        {range: [80, 120], upper: 0.02, lower: -0.015},
        {range: [120, 180], upper: 0.022, lower: -0.018},
        {range: [180, 250], upper: 0.025, lower: -0.021},
        {range: [250, 315], upper: 0.026, lower: -0.026},
        {range: [315, 400], upper: 0.029, lower: -0.028},
        {range: [400, 500], upper: 0.031, lower: -0.032}
    ],
    'j8': [
        {range: [0, 3], upper: 0.008, lower: -0.006}
    ],
    'k3': [
        {range: [0, 3], upper: 0.002, lower: 0},
        {range: [3, 6], upper: 0.0025, lower: 0},
        {range: [6, 10], upper: 0.0025, lower: 0},
        {range: [10, 18], upper: 0.003, lower: 0},
        {range: [18, 30], upper: 0.004, lower: 0},
        {range: [30, 50], upper: 0.004, lower: 0}
    ],
    'k4': [
        {range: [0, 3], upper: 0.003, lower: 0},
        {range: [3, 6], upper: 0.005, lower: 0.001},
        {range: [6, 10], upper: 0.005, lower: 0.001},
        {range: [10, 18], upper: 0.006, lower: 0.001},
        {range: [18, 30], upper: 0.008, lower: 0.002},
        {range: [30, 50], upper: 0.009, lower: 0.002},
        {range: [50, 80], upper: 0.01, lower: 0.002},
        {range: [80, 120], upper: 0.013, lower: 0.003},
        {range: [120, 180], upper: 0.015, lower: 0.003},
        {range: [180, 250], upper: 0.018, lower: 0.004},
        {range: [250, 315], upper: 0.02, lower: 0.004},
        {range: [315, 400], upper: 0.022, lower: 0.004},
        {range: [400, 500], upper: 0.025, lower: 0.005}
    ],
    'k5': [
        {range: [0, 3], upper: 0.004, lower: 0},
        {range: [3, 6], upper: 0.006, lower: 0.001},
        {range: [6, 10], upper: 0.007, lower: 0.001},
        {range: [10, 18], upper: 0.009, lower: 0.001},
        {range: [18, 30], upper: 0.011, lower: 0.002},
        {range: [30, 50], upper: 0.013, lower: 0.002},
        {range: [50, 80], upper: 0.015, lower: 0.002},
        {range: [80, 120], upper: 0.018, lower: 0.003},
        {range: [120, 180], upper: 0.021, lower: 0.003},
        {range: [180, 250], upper: 0.024, lower: 0.004},
        {range: [250, 315], upper: 0.027, lower: 0.004},
        {range: [315, 400], upper: 0.029, lower: 0.004},
        {range: [400, 500], upper: 0.032, lower: 0.005}
    ],
    'k6': [
        {range: [0, 3], upper: 0.006, lower: 0},
        {range: [3, 6], upper: 0.009, lower: 0.001},
        {range: [6, 10], upper: 0.01, lower: 0.001},
        {range: [10, 18], upper: 0.012, lower: 0.001},
        {range: [18, 30], upper: 0.015, lower: 0.002},
        {range: [30, 50], upper: 0.018, lower: 0.002},
        {range: [50, 80], upper: 0.021, lower: 0.002},
        {range: [80, 120], upper: 0.025, lower: 0.003},
        {range: [120, 180], upper: 0.028, lower: 0.003},
        {range: [180, 250], upper: 0.033, lower: 0.004},
        {range: [250, 315], upper: 0.036, lower: 0.004},
        {range: [315, 400], upper: 0.04, lower: 0.004},
        {range: [400, 500], upper: 0.045, lower: 0.005}
    ],
    'k7': [
        {range: [0, 3], upper: 0.01, lower: 0},
        {range: [3, 6], upper: 0.013, lower: 0.001},
        {range: [6, 10], upper: 0.016, lower: 0.001},
        {range: [10, 18], upper: 0.019, lower: 0.001},
        {range: [18, 30], upper: 0.023, lower: 0.002},
        {range: [30, 50], upper: 0.027, lower: 0.002},
        {range: [50, 80], upper: 0.032, lower: 0.002},
        {range: [80, 120], upper: 0.038, lower: 0.003},
        {range: [120, 180], upper: 0.043, lower: 0.003},
        {range: [180, 250], upper: 0.05, lower: 0.004},
        {range: [250, 315], upper: 0.056, lower: 0.004},
        {range: [315, 400], upper: 0.061, lower: 0.004},
        {range: [400, 500], upper: 0.068, lower: 0.005}
    ],
    'k8': [
        {range: [0, 3], upper: 0.014, lower: 0},
        {range: [3, 6], upper: 0.018, lower: 0},
        {range: [6, 10], upper: 0.022, lower: 0},
        {range: [10, 18], upper: 0.027, lower: 0},
        {range: [18, 30], upper: 0.033, lower: 0},
        {range: [30, 50], upper: 0.039, lower: 0},
        {range: [50, 80], upper: 0.046, lower: 0},
        {range: [80, 120], upper: 0.054, lower: 0},
        {range: [120, 180], upper: 0.063, lower: 0},
        {range: [180, 250], upper: 0.072, lower: 0},
        {range: [250, 315], upper: 0.081, lower: 0},
        {range: [315, 400], upper: 0.089, lower: 0},
        {range: [400, 500], upper: 0.097, lower: 0}
    ],
    'k9': [
        {range: [0, 3], upper: 0.025, lower: 0},
        {range: [3, 6], upper: 0.03, lower: 0},
        {range: [6, 10], upper: 0.036, lower: 0},
        {range: [10, 18], upper: 0.043, lower: 0},
        {range: [18, 30], upper: 0.052, lower: 0},
        {range: [30, 50], upper: 0.062, lower: 0},
        {range: [50, 80], upper: 0.074, lower: 0},
        {range: [80, 120], upper: 0.087, lower: 0},
        {range: [120, 180], upper: 0.1, lower: 0},
        {range: [180, 250], upper: 0.115, lower: 0},
        {range: [250, 315], upper: 0.13, lower: 0},
        {range: [315, 400], upper: 0.14, lower: 0},
        {range: [400, 500], upper: 0.155, lower: 0},
        {range: [500, 630], upper: 0.175, lower: 0},
        {range: [630, 800], upper: 0.2, lower: 0},
        {range: [800, 1000], upper: 0.23, lower: 0},
        {range: [1000, 1250], upper: 0.26, lower: 0},
        {range: [1250, 1600], upper: 0.31, lower: 0},
        {range: [1600, 2000], upper: 0.37, lower: 0},
        {range: [2000, 2500], upper: 0.44, lower: 0},
        {range: [2500, 3150], upper: 0.54, lower: 0}
    ],
    'k10': [
        {range: [0, 3], upper: 0.04, lower: 0},
        {range: [3, 6], upper: 0.048, lower: 0},
        {range: [6, 10], upper: 0.058, lower: 0},
        {range: [10, 18], upper: 0.07, lower: 0},
        {range: [18, 30], upper: 0.084, lower: 0},
        {range: [30, 50], upper: 0.1, lower: 0},
        {range: [50, 80], upper: 0.12, lower: 0},
        {range: [80, 120], upper: 0.14, lower: 0},
        {range: [120, 180], upper: 0.16, lower: 0},
        {range: [180, 250], upper: 0.185, lower: 0},
        {range: [250, 315], upper: 0.21, lower: 0},
        {range: [315, 400], upper: 0.23, lower: 0},
        {range: [400, 500], upper: 0.25, lower: 0},
        {range: [500, 630], upper: 0.28, lower: 0},
        {range: [630, 800], upper: 0.32, lower: 0},
        {range: [800, 1000], upper: 0.36, lower: 0},
        {range: [1000, 1250], upper: 0.42, lower: 0},
        {range: [1250, 1600], upper: 0.5, lower: 0},
        {range: [1600, 2000], upper: 0.6, lower: 0},
        {range: [2000, 2500], upper: 0.7, lower: 0},
        {range: [2500, 3150], upper: 0.86, lower: 0}
    ],
    'k11': [
        {range: [0, 3], upper: 0.06, lower: 0},
        {range: [3, 6], upper: 0.075, lower: 0},
        {range: [6, 10], upper: 0.09, lower: 0},
        {range: [10, 18], upper: 0.11, lower: 0},
        {range: [18, 30], upper: 0.13, lower: 0},
        {range: [30, 50], upper: 0.16, lower: 0},
        {range: [50, 80], upper: 0.19, lower: 0},
        {range: [80, 120], upper: 0.22, lower: 0},
        {range: [120, 180], upper: 0.25, lower: 0},
        {range: [180, 250], upper: 0.29, lower: 0},
        {range: [250, 315], upper: 0.32, lower: 0},
        {range: [315, 400], upper: 0.36, lower: 0},
        {range: [400, 500], upper: 0.4, lower: 0},
        {range: [500, 630], upper: 0.44, lower: 0},
        {range: [630, 800], upper: 0.5, lower: 0},
        {range: [800, 1000], upper: 0.56, lower: 0},
        {range: [1000, 1250], upper: 0.66, lower: 0},
        {range: [1250, 1600], upper: 0.78, lower: 0},
        {range: [1600, 2000], upper: 0.92, lower: 0},
        {range: [2000, 2500], upper: 1.1, lower: 0},
        {range: [2500, 3150], upper: 1.35, lower: 0}
    ],
    'k12': [
        {range: [0, 3], upper: 0.1, lower: 0},
        {range: [3, 6], upper: 0.12, lower: 0},
        {range: [6, 10], upper: 0.15, lower: 0},
        {range: [10, 18], upper: 0.18, lower: 0},
        {range: [18, 30], upper: 0.21, lower: 0},
        {range: [30, 50], upper: 0.25, lower: 0},
        {range: [50, 80], upper: 0.3, lower: 0},
        {range: [80, 120], upper: 0.35, lower: 0},
        {range: [120, 180], upper: 0.4, lower: 0},
        {range: [180, 250], upper: 0.46, lower: 0},
        {range: [250, 315], upper: 0.52, lower: 0},
        {range: [315, 400], upper: 0.57, lower: 0},
        {range: [400, 500], upper: 0.53, lower: 0},
        {range: [500, 630], upper: 0.7, lower: 0},
        {range: [630, 800], upper: 0.8, lower: 0},
        {range: [800, 1000], upper: 0.9, lower: 0},
        {range: [1000, 1250], upper: 1.05, lower: 0},
        {range: [1250, 1600], upper: 1.25, lower: 0},
        {range: [1600, 2000], upper: 1.5, lower: 0},
        {range: [2000, 2500], upper: 1.75, lower: 0},
        {range: [2500, 3150], upper: 2.1, lower: 0}
    ],
    'k13': [
        {range: [0, 3], upper: 0.14, lower: 0},
        {range: [3, 6], upper: 0.18, lower: 0},
        {range: [6, 10], upper: 0.22, lower: 0},
        {range: [10, 18], upper: 0.27, lower: 0},
        {range: [18, 30], upper: 0.33, lower: 0},
        {range: [30, 50], upper: 0.39, lower: 0},
        {range: [50, 80], upper: 0.46, lower: 0},
        {range: [80, 120], upper: 0.54, lower: 0},
        {range: [120, 180], upper: 0.63, lower: 0},
        {range: [180, 250], upper: 0.72, lower: 0},
        {range: [250, 315], upper: 0.81, lower: 0},
        {range: [315, 400], upper: 0.89, lower: 0},
        {range: [400, 500], upper: 0.97, lower: 0},
        {range: [500, 630], upper: 1.1, lower: 0},
        {range: [630, 800], upper: 1.25, lower: 0},
        {range: [800, 1000], upper: 1.4, lower: 0},
        {range: [1000, 1250], upper: 1.65, lower: 0},
        {range: [1250, 1600], upper: 1.95, lower: 0},
        {range: [1600, 2000], upper: 2.3, lower: 0},
        {range: [2000, 2500], upper: 2.8, lower: 0},
        {range: [2500, 3150], upper: 3.3, lower: 0}
    ],
    'p3': [
        {range: [0, 3], upper: 0.008, lower: 0.006},
        {range: [3, 6], upper: 0.0145, lower: 0.012},
        {range: [6, 10], upper: 0.0175, lower: 0.015},
        {range: [10, 18], upper: 0.021, lower: 0.018},
        {range: [18, 30], upper: 0.026, lower: 0.022},
        {range: [30, 50], upper: 0.03, lower: 0.026},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'p4': [
        {range: [0, 3], upper: 0.009, lower: 0.006},
        {range: [3, 6], upper: 0.016, lower: 0.012},
        {range: [6, 10], upper: 0.019, lower: 0.015},
        {range: [10, 18], upper: 0.023, lower: 0.018},
        {range: [18, 30], upper: 0.028, lower: 0.022},
        {range: [30, 50], upper: 0.033, lower: 0.026},
        {range: [50, 80], upper: 0.04, lower: 0.032},
        {range: [80, 120], upper: 0.047, lower: 0.037},
        {range: [120, 180], upper: 0.055, lower: 0.043},
        {range: [180, 250], upper: 0.064, lower: 0.05},
        {range: [250, 315], upper: 0.072, lower: 0.056},
        {range: [315, 400], upper: 0.08, lower: 0.062},
        {range: [400, 500], upper: 0.088, lower: 0.068},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'p5': [
        {range: [0, 3], upper: 0.01, lower: 0.006},
        {range: [3, 6], upper: 0.017, lower: 0.012},
        {range: [6, 10], upper: 0.021, lower: 0.015},
        {range: [10, 18], upper: 0.026, lower: 0.018},
        {range: [18, 30], upper: 0.031, lower: 0.022},
        {range: [30, 50], upper: 0.037, lower: 0.026},
        {range: [50, 80], upper: 0.045, lower: 0.032},
        {range: [80, 120], upper: 0.052, lower: 0.037},
        {range: [120, 180], upper: 0.061, lower: 0.043},
        {range: [180, 250], upper: 0.07, lower: 0.05},
        {range: [250, 315], upper: 0.079, lower: 0.056},
        {range: [315, 400], upper: 0.087, lower: 0.062},
        {range: [400, 500], upper: 0.095, lower: 0.068},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'p6': [
        {range: [0, 3], upper: 0.012, lower: 0.006},
        {range: [3, 6], upper: 0.02, lower: 0.012},
        {range: [6, 10], upper: 0.024, lower: 0.015},
        {range: [10, 18], upper: 0.029, lower: 0.018},
        {range: [18, 30], upper: 0.035, lower: 0.022},
        {range: [30, 50], upper: 0.042, lower: 0.026},
        {range: [50, 80], upper: 0.051, lower: 0.032},
        {range: [80, 120], upper: 0.059, lower: 0.037},
        {range: [120, 180], upper: 0.068, lower: 0.043},
        {range: [180, 250], upper: 0.079, lower: 0.05},
        {range: [250, 315], upper: 0.088, lower: 0.056},
        {range: [315, 400], upper: 0.098, lower: 0.062},
        {range: [400, 500], upper: 0.108, lower: 0.068},
        {range: [500, 630], upper: 0.122, lower: 0.078},
        {range: [630, 800], upper: 0.138, lower: 0.088},
        {range: [800, 1000], upper: 0.156, lower: 0.1},
        {range: [1000, 1250], upper: 0.186, lower: 0.12},
        {range: [1250, 1600], upper: 0.218, lower: 0.14},
        {range: [1600, 2000], upper: 0.262, lower: 0.17},
        {range: [2000, 2500], upper: 0.305, lower: 0.195},
        {range: [2500, 3150], upper: 0.375, lower: 0.24}
    ],
    'p7': [
        {range: [0, 3], upper: 0.016, lower: 0.006},
        {range: [3, 6], upper: 0.024, lower: 0.012},
        {range: [6, 10], upper: 0.03, lower: 0.015},
        {range: [10, 18], upper: 0.036, lower: 0.018},
        {range: [18, 30], upper: 0.043, lower: 0.022},
        {range: [30, 50], upper: 0.051, lower: 0.026},
        {range: [50, 80], upper: 0.062, lower: 0.032},
        {range: [80, 120], upper: 0.072, lower: 0.037},
        {range: [120, 180], upper: 0.083, lower: 0.043},
        {range: [180, 250], upper: 0.096, lower: 0.05},
        {range: [250, 315], upper: 0.108, lower: 0.056},
        {range: [315, 400], upper: 0.119, lower: 0.062},
        {range: [400, 500], upper: 0.131, lower: 0.068},
        {range: [500, 630], upper: 0.148, lower: 0.078},
        {range: [630, 800], upper: 0.168, lower: 0.088},
        {range: [800, 1000], upper: 0.19, lower: 0.1},
        {range: [1000, 1250], upper: 0.225, lower: 0.12},
        {range: [1250, 1600], upper: 0.265, lower: 0.14},
        {range: [1600, 2000], upper: 0.32, lower: 0.17},
        {range: [2000, 2500], upper: 0.37, lower: 0.195},
        {range: [2500, 3150], upper: 0.45, lower: 0.24}
    ],
    'p8': [
        {range: [0, 3], upper: 0.02, lower: 0.006},
        {range: [3, 6], upper: 0.03, lower: 0.012},
        {range: [6, 10], upper: 0.037, lower: 0.015},
        {range: [10, 18], upper: 0.045, lower: 0.018},
        {range: [18, 30], upper: 0.055, lower: 0.022},
        {range: [30, 50], upper: 0.065, lower: 0.026},
        {range: [50, 80], upper: 0.078, lower: 0.032},
        {range: [80, 120], upper: 0.091, lower: 0.037},
        {range: [120, 180], upper: 0.106, lower: 0.043},
        {range: [180, 250], upper: 0.122, lower: 0.05},
        {range: [250, 315], upper: 0.137, lower: 0.056},
        {range: [315, 400], upper: 0.151, lower: 0.062},
        {range: [400, 500], upper: 0.165, lower: 0.068},
        {range: [500, 630], upper: 0.188, lower: 0.078},
        {range: [630, 800], upper: 0.213, lower: 0.088},
        {range: [800, 1000], upper: 0.24, lower: 0.1},
        {range: [1000, 1250], upper: 0.285, lower: 0.12},
        {range: [1250, 1600], upper: 0.335, lower: 0.14},
        {range: [1600, 2000], upper: 0.4, lower: 0.17},
        {range: [2000, 2500], upper: 0.475, lower: 0.195},
        {range: [2500, 3150], upper: 0.57, lower: 0.24}
    ],
    'p9': [
        {range: [0, 3], upper: 0.031, lower: 0.006},
        {range: [3, 6], upper: 0.042, lower: 0.012},
        {range: [6, 10], upper: 0.051, lower: 0.015},
        {range: [10, 18], upper: 0.061, lower: 0.018},
        {range: [18, 30], upper: 0.074, lower: 0.022},
        {range: [30, 50], upper: 0.088, lower: 0.026},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'p10': [
        {range: [0, 3], upper: 0.046, lower: 0.006},
        {range: [3, 6], upper: 0.06, lower: 0.012},
        {range: [6, 10], upper: 0.073, lower: 0.015},
        {range: [10, 18], upper: 0.088, lower: 0.018},
        {range: [18, 30], upper: 0.106, lower: 0.022},
        {range: [30, 50], upper: 0.126, lower: 0.026},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'n3': [
        {range: [0, 3], upper: 0.006, lower: 0.004},
        {range: [3, 6], upper: 0.0105, lower: 0.008},
        {range: [6, 10], upper: 0.0125, lower: 0.01},
        {range: [10, 18], upper: 0.015, lower: 0.012},
        {range: [18, 30], upper: 0.019, lower: 0.015},
        {range: [30, 50], upper: 0.021, lower: 0.017},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'n4': [
        {range: [0, 3], upper: 0.007, lower: 0.004},
        {range: [3, 6], upper: 0.012, lower: 0.008},
        {range: [6, 10], upper: 0.014, lower: 0.01},
        {range: [10, 18], upper: 0.017, lower: 0.012},
        {range: [18, 30], upper: 0.021, lower: 0.015},
        {range: [30, 50], upper: 0.024, lower: 0.017},
        {range: [50, 80], upper: 0.028, lower: 0.02},
        {range: [80, 120], upper: 0.033, lower: 0.023},
        {range: [120, 180], upper: 0.039, lower: 0.027},
        {range: [180, 250], upper: 0.045, lower: 0.031},
        {range: [250, 315], upper: 0.05, lower: 0.034},
        {range: [315, 400], upper: 0.055, lower: 0.037},
        {range: [400, 500], upper: 0.06, lower: 0.04},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'n5': [
        {range: [0, 3], upper: 0.008, lower: 0.004},
        {range: [3, 6], upper: 0.013, lower: 0.008},
        {range: [6, 10], upper: 0.016, lower: 0.01},
        {range: [10, 18], upper: 0.02, lower: 0.012},
        {range: [18, 30], upper: 0.024, lower: 0.015},
        {range: [30, 50], upper: 0.028, lower: 0.017},
        {range: [50, 80], upper: 0.033, lower: 0.02},
        {range: [80, 120], upper: 0.038, lower: 0.023},
        {range: [120, 180], upper: 0.045, lower: 0.027},
        {range: [180, 250], upper: 0.051, lower: 0.031},
        {range: [250, 315], upper: 0.057, lower: 0.034},
        {range: [315, 400], upper: 0.062, lower: 0.037},
        {range: [400, 500], upper: 0.067, lower: 0.04},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'n6': [
        {range: [0, 3], upper: 0.01, lower: 0.004},
        {range: [3, 6], upper: 0.016, lower: 0.008},
        {range: [6, 10], upper: 0.019, lower: 0.01},
        {range: [10, 18], upper: 0.023, lower: 0.012},
        {range: [18, 30], upper: 0.028, lower: 0.015},
        {range: [30, 50], upper: 0.033, lower: 0.017},
        {range: [50, 80], upper: 0.039, lower: 0.02},
        {range: [80, 120], upper: 0.045, lower: 0.023},
        {range: [120, 180], upper: 0.052, lower: 0.027},
        {range: [180, 250], upper: 0.06, lower: 0.031},
        {range: [250, 315], upper: 0.066, lower: 0.034},
        {range: [315, 400], upper: 0.073, lower: 0.037},
        {range: [400, 500], upper: 0.08, lower: 0.04},
        {range: [500, 630], upper: 0.088, lower: 0.044},
        {range: [630, 800], upper: 0.1, lower: 0.05},
        {range: [800, 1000], upper: 0.112, lower: 0.056},
        {range: [1000, 1250], upper: 0.132, lower: 0.066},
        {range: [1250, 1600], upper: 0.156, lower: 0.078},
        {range: [1600, 2000], upper: 0.184, lower: 0.092},
        {range: [2000, 2500], upper: 0.22, lower: 0.11},
        {range: [2500, 3150], upper: 0.27, lower: 0.135}
    ],
    'n7': [
        {range: [0, 3], upper: 0.014, lower: 0.004},
        {range: [3, 6], upper: 0.02, lower: 0.008},
        {range: [6, 10], upper: 0.025, lower: 0.01},
        {range: [10, 18], upper: 0.03, lower: 0.012},
        {range: [18, 30], upper: 0.036, lower: 0.015},
        {range: [30, 50], upper: 0.042, lower: 0.017},
        {range: [50, 80], upper: 0.05, lower: 0.02},
        {range: [80, 120], upper: 0.058, lower: 0.023},
        {range: [120, 180], upper: 0.067, lower: 0.027},
        {range: [180, 250], upper: 0.077, lower: 0.031},
        {range: [250, 315], upper: 0.086, lower: 0.034},
        {range: [315, 400], upper: 0.094, lower: 0.037},
        {range: [400, 500], upper: 0.103, lower: 0.04},
        {range: [500, 630], upper: 0.114, lower: 0.044},
        {range: [630, 800], upper: 0.13, lower: 0.05},
        {range: [800, 1000], upper: 0.146, lower: 0.056},
        {range: [1000, 1250], upper: 0.171, lower: 0.066},
        {range: [1250, 1600], upper: 0.203, lower: 0.078},
        {range: [1600, 2000], upper: 0.242, lower: 0.092},
        {range: [2000, 2500], upper: 0.285, lower: 0.11},
        {range: [2500, 3150], upper: 0.345, lower: 0.135}
    ],
    'n8': [
        {range: [0, 3], upper: 0.018, lower: 0.004},
        {range: [3, 6], upper: 0.026, lower: 0.008},
        {range: [6, 10], upper: 0.032, lower: 0.01},
        {range: [10, 18], upper: 0.039, lower: 0.012},
        {range: [18, 30], upper: 0.048, lower: 0.015},
        {range: [30, 50], upper: 0.056, lower: 0.017},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'n9': [
        {range: [0, 3], upper: 0.029, lower: 0.004},
        {range: [3, 6], upper: 0.038, lower: 0.008},
        {range: [6, 10], upper: 0.046, lower: 0.01},
        {range: [10, 18], upper: 0.055, lower: 0.012},
        {range: [18, 30], upper: 0.067, lower: 0.015},
        {range: [30, 50], upper: 0.079, lower: 0.017},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'm3': [
        {range: [0, 3], upper: 0.004, lower: 0.002},
        {range: [3, 6], upper: 0.0065, lower: 0.004},
        {range: [6, 10], upper: 0.0085, lower: 0.006},
        {range: [10, 18], upper: 0.01, lower: 0.007},
        {range: [18, 30], upper: 0.012, lower: 0.008},
        {range: [30, 50], upper: 0.013, lower: 0.009},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'm4': [
        {range: [0, 3], upper: 0.005, lower: 0.002},
        {range: [3, 6], upper: 0.008, lower: 0.004},
        {range: [6, 10], upper: 0.01, lower: 0.006},
        {range: [10, 18], upper: 0.012, lower: 0.007},
        {range: [18, 30], upper: 0.014, lower: 0.008},
        {range: [30, 50], upper: 0.016, lower: 0.009},
        {range: [50, 80], upper: 0.019, lower: 0.011},
        {range: [80, 120], upper: 0.023, lower: 0.013},
        {range: [120, 180], upper: 0.027, lower: 0.015},
        {range: [180, 250], upper: 0.031, lower: 0.017},
        {range: [250, 315], upper: 0.036, lower: 0.02},
        {range: [315, 400], upper: 0.039, lower: 0.021},
        {range: [400, 500], upper: 0.043, lower: 0.023},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'm5': [
        {range: [0, 3], upper: 0.006, lower: 0.002},
        {range: [3, 6], upper: 0.009, lower: 0.004},
        {range: [6, 10], upper: 0.012, lower: 0.006},
        {range: [10, 18], upper: 0.015, lower: 0.007},
        {range: [18, 30], upper: 0.017, lower: 0.008},
        {range: [30, 50], upper: 0.02, lower: 0.009},
        {range: [50, 80], upper: 0.024, lower: 0.011},
        {range: [80, 120], upper: 0.028, lower: 0.013},
        {range: [120, 180], upper: 0.033, lower: 0.015},
        {range: [180, 250], upper: 0.037, lower: 0.017},
        {range: [250, 315], upper: 0.043, lower: 0.02},
        {range: [315, 400], upper: 0.046, lower: 0.021},
        {range: [400, 500], upper: 0.05, lower: 0.023},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'm6': [
        {range: [0, 3], upper: 0.008, lower: 0.002},
        {range: [3, 6], upper: 0.012, lower: 0.004},
        {range: [6, 10], upper: 0.015, lower: 0.006},
        {range: [10, 18], upper: 0.018, lower: 0.007},
        {range: [18, 30], upper: 0.021, lower: 0.008},
        {range: [30, 50], upper: 0.025, lower: 0.009},
        {range: [50, 80], upper: 0.03, lower: 0.011},
        {range: [80, 120], upper: 0.035, lower: 0.013},
        {range: [120, 180], upper: 0.04, lower: 0.015},
        {range: [180, 250], upper: 0.046, lower: 0.017},
        {range: [250, 315], upper: 0.052, lower: 0.02},
        {range: [315, 400], upper: 0.057, lower: 0.021},
        {range: [400, 500], upper: 0.063, lower: 0.023},
        {range: [500, 630], upper: 0.07, lower: 0.026},
        {range: [630, 800], upper: 0.08, lower: 0.03},
        {range: [800, 1000], upper: 0.09, lower: 0.034},
        {range: [1000, 1250], upper: 0.106, lower: 0.04},
        {range: [1250, 1600], upper: 0.126, lower: 0.048},
        {range: [1600, 2000], upper: 0.15, lower: 0.058},
        {range: [2000, 2500], upper: 0.178, lower: 0.068},
        {range: [2500, 3150], upper: 0.211, lower: 0.076}
    ],
    'm7': [
        {range: [0, 3], upper: 0.012, lower: 0.002},
        {range: [3, 6], upper: 0.016, lower: 0.004},
        {range: [6, 10], upper: 0.021, lower: 0.006},
        {range: [10, 18], upper: 0.025, lower: 0.007},
        {range: [18, 30], upper: 0.029, lower: 0.008},
        {range: [30, 50], upper: 0.034, lower: 0.009},
        {range: [50, 80], upper: 0.041, lower: 0.011},
        {range: [80, 120], upper: 0.048, lower: 0.013},
        {range: [120, 180], upper: 0.055, lower: 0.015},
        {range: [180, 250], upper: 0.063, lower: 0.017},
        {range: [250, 315], upper: 0.072, lower: 0.02},
        {range: [315, 400], upper: 0.078, lower: 0.021},
        {range: [400, 500], upper: 0.086, lower: 0.023},
        {range: [500, 630], upper: 0.096, lower: 0.026},
        {range: [630, 800], upper: 0.11, lower: 0.03},
        {range: [800, 1000], upper: 0.124, lower: 0.034},
        {range: [1000, 1250], upper: 0.145, lower: 0.04},
        {range: [1250, 1600], upper: 0.173, lower: 0.048},
        {range: [1600, 2000], upper: 0.208, lower: 0.058},
        {range: [2000, 2500], upper: 0.243, lower: 0.068},
        {range: [2500, 3150], upper: 0.286, lower: 0.076}
    ],
    'm8': [
        {range: [0, 3], upper: 0.016, lower: 0.002},
        {range: [3, 6], upper: 0.022, lower: 0.004},
        {range: [6, 10], upper: 0.028, lower: 0.006},
        {range: [10, 18], upper: 0.034, lower: 0.007},
        {range: [18, 30], upper: 0.041, lower: 0.008},
        {range: [30, 50], upper: 0.048, lower: 0.009},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ],
    'm9': [
        {range: [0, 3], upper: 0.027, lower: 0.002},
        {range: [3, 6], upper: 0.034, lower: 0.004},
        {range: [6, 10], upper: 0.042, lower: 0.006},
        {range: [10, 18], upper: 0.05, lower: 0.007},
        {range: [18, 30], upper: 0.06, lower: 0.008},
        {range: [30, 50], upper: 0.071, lower: 0.009},
        {range: [50, 80], upper: 0, lower: 0},
        {range: [80, 120], upper: 0, lower: 0},
        {range: [120, 180], upper: 0, lower: 0},
        {range: [180, 250], upper: 0, lower: 0},
        {range: [250, 315], upper: 0, lower: 0},
        {range: [315, 400], upper: 0, lower: 0},
        {range: [400, 500], upper: 0, lower: 0},
        {range: [500, 630], upper: 0, lower: 0},
        {range: [630, 800], upper: 0, lower: 0},
        {range: [800, 1000], upper: 0, lower: 0},
        {range: [1000, 1250], upper: 0, lower: 0},
        {range: [1250, 1600], upper: 0, lower: 0},
        {range: [1600, 2000], upper: 0, lower: 0},
        {range: [2000, 2500], upper: 0, lower: 0},
        {range: [2500, 3150], upper: 0, lower: 0}
    ]
};

    if (shaftTolerances[toleranceClass]) {
        const table = shaftTolerances[toleranceClass];
        for (let item of table) {
            if (diameterShaft > item.range[0] && diameterShaft <= item.range[1]) {
                const upper = item.upper >= 0 ? '+' + item.upper : String(item.upper);
                const lower = String(item.lower);
                if (item.upper === 0) {
                    return `<b>${lower} мм</b>`;
                } else {
                    return `<b>${upper} / ${lower} мм</b>`;
                }
            }
        }
    }
    return '<span style="color: #FF6B6B;">Не найден</span>';
}




//Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/Gcode-helper-2.0/sw.js').then((registration) => {
        console.log('Service Worker зарегистрирован с областью:', registration.scope);
      }).catch((error) => {
        console.log('Ошибка регистрации Service Worker:', error);
      });
    });
}