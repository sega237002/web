//Global State
let activeElement = null; // Прямая ссылка на активный DOM-узел

//DOM Elements
const blocksContainer = document.getElementById('blocks-container');
const toolsContainer = document.getElementById('tools-container');
const attributesListDiv = document.getElementById('attributes-list');
const actionLogContent = document.getElementById('action-log-content');
const activeBlockNameSpan = document.getElementById('active-block-name');

//Initial Blocks Data
const blocksData = [
    { id: 'block-1', classes: 'wooden-block', innerText: 'Базовый блок #1', attributes: { 'data-type': 'basic', 'title': 'Базовый блок' } },
    { id: 'block-2', classes: 'wooden-block special', innerText: 'Специальный блок', attributes: { 'data-type': 'special', 'data-color': 'natural' } },
    { id: 'block-3', classes: 'wooden-block', innerText: 'Скрытый блок', attributes: { 'data-type': 'interactive', 'hidden': '' } },
    { id: 'block-4', classes: 'wooden-block', innerText: 'Счётчик: 0', attributes: { 'data-type': 'counter', 'data-count': '0', 'data-max-value': '5' } },
    { id: 'block-5', classes: 'wooden-block', innerText: 'Информационный блок', attributes: { 'data-type': 'info', 'lang': 'ru', 'data-valid': 'true' } }
];

//Tools Configuration
const toolsConfig = [
    { name: 'inspect', text: '🔍 Проверить блок', func: inspectElement },
    { name: 'find-attr', text: '❓ Найти атрибут', func: findAttribute },
    { name: 'show-data', text: '📊 Показать data-атрибуты', func: showDataAttributes },
    { name: 'add-change', text: '✏️ Добавить/Изменить', func: addChangeAttribute },
    { name: 'toggle-visibility', text: '👁️ Переключить видимость', func: toggleVisibility },
    { name: 'increment-counter', text: '🔢 Увеличить счётчик', func: incrementCounter },
    { name: 'toggle-lang', text: '🌐 Изменить язык', func: changeLanguage },
    { name: 'clear-block', text: '🧹 Очистить блок', func: clearBlock }
];
// 1. INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    initializeBlocks();
    initializeTools();
    addToLog('Приложение загружено. Выберите блок для работы.');
});

/**
 * Создает DOM элементы блоков из blocksData и добавляет их на панель
 */
function initializeBlocks() {
    blocksContainer.innerHTML = ''; // Очистка
    blocksData.forEach(data => {
        const block = document.createElement('div');
        block.className = data.classes;
        block.id = data.id;
        block.textContent = data.innerText;

        // Установка всех атрибутов
        for (const [key, value] of Object.entries(data.attributes)) {
            block.setAttribute(key, value);
        }

        // Добавляем обработчик клика для выбора блока
        block.addEventListener('click', onBlockClick);

        blocksContainer.appendChild(block);
    });
}

/**
 * Создает кнопки инструментов из toolsConfig и добавляет их на панель
 */
function initializeTools() {
    toolsContainer.innerHTML = ''; // Очистка
    toolsConfig.forEach(tool => {
        const button = document.createElement('button');
        button.className = 'tool-button';
        button.textContent = tool.text;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // Добавляем небольшую анимацию к кнопке
            button.classList.add('pulse-animation');
            setTimeout(() => button.classList.remove('pulse-animation'), 400);
            // Вызов функции инструмента
            tool.func();
        });
        toolsContainer.appendChild(button);
    });
}
// 2. SELECTION MECHANISM (Часть 4)
/**
 * Обработчик клика по блоку
 */
function onBlockClick(event) {
    const clickedBlock = event.currentTarget;

    // Снимаем выделение со всех блоков
    document.querySelectorAll('.wooden-block').forEach(block => {
        block.classList.remove('active');
    });

    // Добавляем выделение текущему
    clickedBlock.classList.add('active');
    
    // Сохраняем ссылку на активный элемент
    activeElement = clickedBlock;

    // Обновляем информацию в панели
    updateActiveInfo();
    updateInspector();
    addToLog(`Выбран блок: ${activeElement.id}`);
}

/**
 * Обновляет текстовую информацию об активном блоке
 */
function updateActiveInfo() {
    if (activeElement) {
        const blockName = activeElement.id || 'Без id';
        activeBlockNameSpan.textContent = blockName;
    } else {
        activeBlockNameSpan.textContent = 'Не выбран';
    }
}

// 3. INSPECTOR PANEL (Часть 6)
/**
 * Полностью перерисовывает панель инспектора атрибутов
 */
function updateInspector() {
    if (!activeElement) {
        attributesListDiv.innerHTML = '<p class="placeholder">Выберите блок для просмотра</p>';
        return;
    }

    let html = '';
    const attrs = activeElement.attributes;

    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        const value = activeElement.getAttribute(attr.name);
        const isDataAttr = attr.name.startsWith('data-');
        const typeBadge = isDataAttr ? '<span class="attr-type-badge">data</span>' : '<span class="attr-type-badge">std</span>';

        html += `<div class="attr-item">
            <span class="attr-name">${attr.name} ${typeBadge}</span>
            <span class="attr-value">"${value}"</span>
        </div>`;
    }

    if (attrs.length === 0) {
        html = '<p class="placeholder">Нет атрибутов (кроме стандартных)</p>';
    }

    attributesListDiv.innerHTML = html;
}
// 4. ACTION LOG (Часть 7)
/**
 * Добавляет запись в журнал действий. Хранит последние 10 записей.
 * @param {string} message - Описание действия
 */
function addToLog(message) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-message">${message}</span>`;
    
    // Добавляем в начало (для flex-direction: column-reverse это будет снизу)
    actionLogContent.prepend(logEntry);

    // Ограничение на 10 записей
    if (actionLogContent.children.length > 10) {
        actionLogContent.removeChild(actionLogContent.lastElementChild);
    }
}

// 5. HELPER FUNCTIONS (Визуальные эффекты, обновления)

/**
 * Обновляет цвет блока на основе атрибута data-color (Часть 8.1)
 * @param {HTMLElement} element 
 */
function updateBlockColor(element) {
    if (!element || !element.hasAttribute('data-color')) return;
    
    const colorValue = element.getAttribute('data-color');
    let cssColor;
    
    switch(colorValue) {
        case 'natural': cssColor = '#deb887'; break;
        case 'red': cssColor = '#e74c3c'; break;
        case 'green': cssColor = '#27ae60'; break;
        case 'blue': cssColor = '#3498db'; break;
        default: cssColor = colorValue; // Для прямых цветов типа 'yellow'
    }
    
    element.style.backgroundColor = cssColor;
    element.style.transition = 'background-color 0.3s';
    
    // Анимация пульсации (Часть 8.2)
    element.classList.add('pulse-animation');
    setTimeout(() => element.classList.remove('pulse-animation'), 400);
}

/**
 * Обновляет текст блока на основе атрибута lang (для #block-5)
 * @param {HTMLElement} element 
 */
function updateElementTextByLang(element) {
    if (!element || element.id !== 'block-5') return;
    
    const lang = element.getAttribute('lang');
    if (lang === 'en') {
        element.textContent = 'Information block';
    } else {
        element.textContent = 'Информационный блок';
    }
}

/**
 * Обновляет текст счетчика для блока #4
 * @param {HTMLElement} element 
 */
function updateCounterText(element) {
    if (!element || element.id !== 'block-4') return;
    
    const count = element.getAttribute('data-count') || '0';
    element.textContent = 'Счётчик: ' + count;
}

// 6. TOOL FUNCTIONS (Часть 3)

/**
 * Проверка активного элемента для всех инструментов
 * @returns {boolean} - true если элемент выбран
 */
function checkActiveElement() {
    if (!activeElement) {
        addToLog('❌ Ошибка: Не выбран блок');
        return false;
    }
    return true;
}

/**
 * Инструмент 1: Проверить блок
 */
function inspectElement() {
    if (!checkActiveElement()) return;
    
    updateInspector(); // Уже обновляет все атрибуты
    addToLog(`🔍 Проверка блока ${activeElement.id}: найдено атрибутов: ${activeElement.attributes.length}`);
}

/**
 * Инструмент 2: Найти атрибут
 */
function findAttribute() {
    if (!checkActiveElement()) return;
    
    const attrName = prompt('Введите имя атрибута для поиска:', 'data-type');
    if (!attrName) return; // Отмена
    
    const exists = activeElement.hasAttribute(attrName);
    const message = exists ? 
        `✅ Атрибут "${attrName}" найден. Значение: "${activeElement.getAttribute(attrName)}"` : 
        `❌ Атрибут "${attrName}" не найден у элемента ${activeElement.id}`;
    
    addToLog(`🔎 Поиск атрибута: ${message}`);
    alert(message);
}

/**
 * Инструмент 3: Показать data-атрибуты
 */
function showDataAttributes() {
    if (!checkActiveElement()) return;
    
    const dataAttrs = [];
    for (let i = 0; i < activeElement.attributes.length; i++) {
        const attr = activeElement.attributes[i];
        if (attr.name.startsWith('data-')) {
            dataAttrs.push(`${attr.name}="${activeElement.getAttribute(attr.name)}"`);
        }
    }
    
    // Показываем также через dataset (Часть 3.5)
    const datasetProps = [];
    for (const key in activeElement.dataset) {
        datasetProps.push(`dataset.${key} = "${activeElement.dataset[key]}"`);
    }
    
    const message = `Data-атрибуты: ${dataAttrs.join(', ') || 'нет'}\nDataset: ${datasetProps.join(', ') || 'нет'}`;
    addToLog(`📊 Показаны data-атрибуты для ${activeElement.id}`);
    alert(message);
    
    // Обновляем инспектор (хотя мы фильтруем, но в инспекторе покажем всё)
    updateInspector();
}

/**
 * Инструмент 4: Добавить/Изменить
 */
function addChangeAttribute() {
    if (!checkActiveElement()) return;
    
    const attrName = prompt('Введите имя атрибута:', 'data-test');
    if (!attrName) return;
    
    const attrValue = prompt('Введите значение атрибута:', 'новое значение');
    if (attrValue === null) return; // Отмена, пустая строка допустима
    
    const oldValue = activeElement.getAttribute(attrName);
    activeElement.setAttribute(attrName, attrValue);
    
    // Визуальные эффекты
    if (attrName === 'data-color') updateBlockColor(activeElement);
    if (attrName === 'lang') updateElementTextByLang(activeElement);
    if (attrName === 'data-count') updateCounterText(activeElement);
    
    updateInspector();
    addToLog(`✏️ Атрибут "${attrName}" изменён: "${oldValue || 'не был'}" → "${attrValue}"`);
    
    // Анимация блока
    activeElement.classList.add('pulse-animation');
    setTimeout(() => activeElement.classList.remove('pulse-animation'), 400);
}

/**
 * Инструмент 5: Переключить видимость (hidden)
 */
function toggleVisibility() {
    if (!checkActiveElement()) return;
    
    if (activeElement.hasAttribute('hidden')) {
        activeElement.removeAttribute('hidden');
        addToLog(`👁️ Блок ${activeElement.id} стал видимым (hidden удалён)`);
    } else {
        activeElement.setAttribute('hidden', '');
        addToLog(`👁️ Блок ${activeElement.id} скрыт (hidden добавлен)`);
    }
    
    updateInspector();
}

/**
 * Инструмент 6: Увеличить счётчик (для блока #4)
 */
function incrementCounter() {
    if (!checkActiveElement()) return;
    
    if (activeElement.id !== 'block-4') {
        addToLog(`⚠️ Инструмент "Увеличить счётчик" работает только с block-4`);
        alert('Этот инструмент работает только с блоком #4 (Счётчик)');
        return;
    }
    
    if (!activeElement.hasAttribute('data-count')) {
        activeElement.setAttribute('data-count', '0');
    }
    
    let currentCount = parseInt(activeElement.getAttribute('data-count'), 10) || 0;
    const maxValue = parseInt(activeElement.getAttribute('data-max-value'), 10) || Infinity;
    
    if (currentCount >= maxValue) {
        addToLog(`⛔ Достигнут максимум (${maxValue}) для счётчика`);
        alert(`Максимальное значение: ${maxValue}`);
        return;
    }
    
    currentCount++;
    activeElement.setAttribute('data-count', currentCount.toString());
    updateCounterText(activeElement);
    updateInspector();
    addToLog(`🔢 Счётчик увеличен: ${currentCount - 1} → ${currentCount}`);
    
    // Визуальный эффект
    activeElement.classList.add('pulse-animation');
    setTimeout(() => activeElement.classList.remove('pulse-animation'), 400);
}

/**
 * Инструмент 7: Изменить язык (для блока #5)
 */
function changeLanguage() {
    if (!checkActiveElement()) return;
    
    if (activeElement.id !== 'block-5') {
        addToLog(`⚠️ Инструмент "Изменить язык" оптимизирован для block-5`);
        // Всё равно позволяем, но с предупреждением
    }
    
    const currentLang = activeElement.getAttribute('lang') || 'ru';
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    
    activeElement.setAttribute('lang', newLang);
    updateElementTextByLang(activeElement);
    updateInspector();
    addToLog(`🌐 Язык изменён: ${currentLang} → ${newLang} для ${activeElement.id}`);
    
    // Визуальный эффект
    activeElement.classList.add('pulse-animation');
    setTimeout(() => activeElement.classList.remove('pulse-animation'), 400);
}

/**
 * Инструмент 8: Очистить блок (удалить все пользовательские атрибуты)
 */
function clearBlock() {
    if (!checkActiveElement()) return;
    
    const attrs = activeElement.attributes;
    const attrsToRemove = [];
    
    // Собираем имена для удаления (предотвращает проблему live коллекции)
    for (let i = 0; i < attrs.length; i++) {
        const attrName = attrs[i].name;
        if (attrName !== 'id' && attrName !== 'class') {
            attrsToRemove.push(attrName);
        }
    }
    
    // Удаляем
    attrsToRemove.forEach(attrName => {
        activeElement.removeAttribute(attrName);
    });
    
    // Восстанавливаем базовое состояние для специальных блоков
    if (activeElement.id === 'block-4') {
        activeElement.setAttribute('data-type', 'counter');
        activeElement.setAttribute('data-count', '0');
        activeElement.setAttribute('data-max-value', '5');
        updateCounterText(activeElement);
    } else if (activeElement.id === 'block-5') {
        activeElement.setAttribute('data-type', 'info');
        activeElement.setAttribute('lang', 'ru');
        activeElement.setAttribute('data-valid', 'true');
        updateElementTextByLang(activeElement);
    } else if (activeElement.id === 'block-2') {
        activeElement.setAttribute('data-type', 'special');
        activeElement.setAttribute('data-color', 'natural');
        updateBlockColor(activeElement);
    } else if (activeElement.id === 'block-3') {
        activeElement.setAttribute('data-type', 'interactive');
        // hidden не восстанавливаем, т.к. это "очистка" - пользователь мог хотеть убрать скрытие
    } else if (activeElement.id === 'block-1') {
        activeElement.setAttribute('data-type', 'basic');
        activeElement.setAttribute('title', 'Базовый блок');
    }
    
    // Сброс цвета, если data-color был удалён
    if (!activeElement.hasAttribute('data-color')) {
        activeElement.style.backgroundColor = '#deb887';
    }
    
    updateInspector();
    addToLog(`🧹 Блок ${activeElement.id} очищен (удалены пользовательские атрибуты)`);
    
    // Визуальный эффект
    activeElement.classList.add('pulse-animation');
    setTimeout(() => activeElement.classList.remove('pulse-animation'), 400);
}