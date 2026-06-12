/**
 * Arc Calculator Application Initialization
 */

let arcAppState = null;
let arcUIController = null;

function initializeArcCalculator() {
  try {
    // Создаем новый state
    arcAppState = new AppState();
    
    // НЕ инициализируем с дефолтными значениями - поля должны быть пустыми
    // Пользователь вводит свои параметры
    
    // Создаем UI controller
    arcUIController = new UIController(arcAppState);
    
    // Привязываем обработчики событий
    arcUIController.attachEventListeners();
    
    // Первый рендер
    arcUIController.render();
    
    console.log('Arc Calculator initialized successfully');
  } catch (error) {
    console.error('Arc Calculator initialization failed:', error);
    if (document.getElementById('errorBox')) {
      document.getElementById('errorBox').style.display = 'flex';
      document.getElementById('errorText').textContent = '❌ Ошибка инициализации: ' + error.message;
    }
  }
}

function openArcTab() {
  if (!arcAppState || !arcUIController) {
    initializeArcCalculator();
  } else {
    arcUIController.render();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeArcCalculator, openArcTab };
}
