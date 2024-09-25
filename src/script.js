document.getElementById("defaultOpen").click();

function openMainTab(evt, tabName) {
    document.getElementById("mainButtons").style.display = "none";
    document.getElementById("backButton").style.display = "block";
    document.getElementById(tabName).style.display = "block";
}

function goBack() {
    var tabcontents = document.getElementsByClassName("main-tabcontent");
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }
    document.getElementById("mainButtons").style.display = "block";
    document.getElementById("backButton").style.display = "none";
}

function showTab(tabName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

function calculateDistance() {
    const diameterInput = document.getElementById("diameter");
    const distanceToTopInput = document.getElementById("distanceToTop");
    const indexInput = document.getElementById("index");
    const resultElement = document.getElementById("gapResultHeight");
    const resultElement = document.getElementById("gapResultHeight");

    const diameter = parseFloat(diameterInput.value);
    const distanceToTop = parseFloat(distanceToTopInput.value);
    const index = parseFloat(indexInput.value);

    if (isNaN(diameter) || diameter <= 0 || isNaN(distanceToTop) || distanceToTop < 0 || isNaN(index) || index < 0) {
        resultElement.textContent = "Пожалуйста, введите корректные данные.";
        return;
    }

    const distanceToCenter = calculateDistanceToCenter(diameter, distanceToTop, index);
    resultElement.textContent = "Расстояние от центра диаметра до вершины паза: " + distanceToCenter.toFixed(3);
}

function calculateGapWidth() {
    const gapWidthInput = document.getElementById("gapWidth");
    const indexInputtwo = document.getElementById("indextwo");
    const resultElement = document.getElementById("gapResultWidth");
    const resultElement = document.getElementById("gapResultWidth");

    const gapWidth = parseFloat(gapWidthInput.value);
    const indextwo = parseFloat(indexInputtwo.value);

    if (isNaN(gapWidth) || gapWidth < 0 || isNaN(indextwo) || indextwo < 0) {
        resultElement.textContent = "Пожалуйста, введите корректные данные.";
        return;
    }

    const gapWidthCalculated = calculateGapWidthValue(gapWidth, indextwo);
    resultElement.textContent = "Ширина паза: " + gapWidth + " мм, Допуск: " + indextwo + " мм, Середина паза равна: " + gapWidthCalculated.toFixed(4) + " мм.";
    resultElement.textContent = "Ширина паза: " + gapWidth + " мм, Допуск: " + indextwo + " мм, Середина паза равна: " + gapWidthCalculated.toFixed(4) + " мм.";
}

function calculateDistanceToCenter(diameter, distanceToTop, index) {
    const slot = distanceToTop - diameter;
    const radius = diameter / 2;
    const coefficient = index / 2;

    return slot + radius + coefficient;
}

function calculateGapWidthValue(gapWidth, index) {
    const mediumWidth = gapWidth / 2;
    const coefficient1 = index / 4;
function calculateGapWidthValue(gapWidth, index) {
    const mediumWidth = gapWidth / 2;
    const coefficient1 = index / 4;

    return coefficient1 + mediumWidth;
}

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
        resultElement.textContent = "Пожалуйста, введите корректные данные.";
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

    resultElement.textContent = `Координаты точки: X = ${x.toFixed(2)}, Y = ${y.toFixed(2)}`;
}

function calculateHoleCoordinates() {
    const pitchDiameterInput = document.getElementById("pitchDiameter");
    const angleInput = document.getElementById("angleHole");
    const resultElement = document.getElementById("resultHole");

    const pitchDiameter = parseFloat(pitchDiameterInput.value);
    const angle = parseFloat(angleInput.value);

    if (isNaN(pitchDiameter) || pitchDiameter <= 0 || isNaN(angle) || angle < 0 || angle > 360) {
        resultElement.textContent = "Пожалуйста, введите корректные данные.";
        return;
    }

    const radius = pitchDiameter / 2;
    const angleInRadians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);

    resultElement.textContent = `Координаты отверстия: X = ${x.toFixed(2)}, Y = ${y.toFixed(2)}`;
}

// script.js
function calculateGear() {
    // Получение входных данных
    const numTeeth = parseFloat(document.getElementById('numTeeth').value);
    const module = parseFloat(document.getElementById('module').value);
    const diameterNom = parseFloat(document.getElementById('diameterHeight').value);

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
        
    const inv = - (rollerDiameter / numTeeth / module/ Math.cos(profile)) +
    (Math.tan(profile) - profile) +
    ((Math.PI / 2 + 2 * 0.45 * Math.tan(profile)) / numTeeth);

    // Угол профиля  в точке на концентрической окружности зубчатого колеса, проходящей через центр ролика(шарика)

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
    document.getElementById('displacementCoefficient').textContent = `Коэффициент смещения исходного контура: ${displacementCoefficient.toFixed(2)}`;
    document.getElementById('pitchCircle').textContent = `Делительный диаметр (мм): ${pitchCircle.toFixed(2)}`;
    document.getElementById('rollerDiameter').textContent = `Диаметр ролика (мм): ${rollerDiameter.toFixed(2)}`;
    document.getElementById('distanceBetweenRollers').textContent = `Расстояние между роликами (мм): ${distanceBetweenRollers.toFixed(3)}`;
    document.getElementById('teethOnNormal').textContent = `Число зубьев на длине общей нормали: ${teethOnNormalIntValue}`;
    document.getElementById('normalLength').textContent = `Длинна общей нормали (мм): ${normalLength.toFixed(3)}`;
    document.getElementById('FaskaVtulki').textContent = `Фаска или радиус притупления продольной кромки: ${FaskaVtulki.toFixed(2)}`;
}