document.getElementById("defaultOpen").click();

function openMainTab(evt, tabName) {
    var tabcontents = document.getElementsByClassName("main-tabcontent");
    var tabButtons = document.getElementsByClassName("tab-button");

    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
        tabButtons[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
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
        alert ("Пожалуйста, введите корректные данные.");
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
        alert ("Пожалуйста, введите корректные данные.");
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
        alert ("Пожалуйста, заполните все поля!");
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
            alert('Пожалуйста, заполните все поля!');
            return;
        }

            //* Расчёты угла по X и Y
        const RadianFask = (CoordinateAngle * Math.PI) / 180;
        const AngCoodinateTan = Math.tan(RadianFask);
        const ResultCoordinate = AngCoodinateTan * CoordinateOsi

        //Выводим значение в элемент с id "TreugolnickResult"
        const ResultFix = ResultCoordinate.toFixed(4);

        document.getElementById('FaskaAngleResult').innerHTML = `Координата оси: <strong>${ResultFix}°</strong>`;
    }

        // select three
    
        function calculateTreugolnick() {
        // Находим данные формы в зависимости от типа окна
        const CoordinateX = parseFloat(document.getElementById('CoordinateX').value);
        const CoordinateY = parseFloat(document.getElementById('CoordinateY').value);
    
        if (!CoordinateX || !CoordinateY) {
            alert('Пожалуйста, заполните все поля!');
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
        alert("Пожалуйста, введите корректные данные.");
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
        alert('Пожалуйста, заполните все поля!');
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
        alert ("Пожалуйста, введите корректные данные.");
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
        alert ("Пожалуйста, введите корректные данные.");
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
function calculateTolerance() {
    const diameterDop = parseFloat(document.getElementById('diameterDop').value);
    const toleranceClass = document.getElementById('toleranceClass').value;
    let tolerance = '';

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

        document.getElementById('result').innerHTML = `Диаметр: ${diameterDop} мм <br>Класс точности: ${toleranceClass}<br> Допуск: ${tolerance}`;
    } else {
        alert ('Введите диаметр в пределах от 0 до 3150 мм');
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
    const options = select.options;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const txtValue = option.text.toLowerCase();
        option.style.display = txtValue.includes(filter) ? '' : 'none';
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
        alert('Пожалуйста, заполните все поля!');
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
            alert('Пожалуйста, заполните все поля!');
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
            alert('Пожалуйста, заполните все поля!');
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
                alert('Пожалуйста, заполните все поля!');
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

/// тёмная и светлая тема
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Проверяем, есть ли сохранённая тема в localStorage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
} else {
    body.classList.add('light-theme');
}

// Обработчик события для переключения темы
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');

    // Сохраняем выбранную тему в localStorage
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggleButton.textContent = '☀️'; // Изменяем иконку на солнце
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleButton.textContent = '🌙'; // Изменяем иконку на луну
    }
});

//serviceWorker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/Gcode-helper-2.0/sw.js').then((registration) => {
        console.log('Service Worker зарегистрирован с областью:', registration.scope);
      }).catch((error) => {
        console.log('Ошибка регистрации Service Worker:', error);
      });
    });
  }