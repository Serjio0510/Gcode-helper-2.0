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

    const gapWidth = parseFloat(gapWidthInput.value);
    const indextwo = parseFloat(indexInputtwo.value);

    if (isNaN(gapWidth) || gapWidth < 0 || isNaN(indextwo) || indextwo < 0) {
        resultElement.textContent = "Пожалуйста, введите корректные данные.";
        return;
    }

    const gapWidthCalculated = calculateGapWidthValue(gapWidth, indextwo);
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
