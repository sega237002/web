// ожидание загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const themeToggle = document.getElementById('theme-toggle');
    const galleryTitle = document.getElementById('gallery-title');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetBtn = document.getElementById('reset-styles');
    const statusPanel = document.getElementById('status-panel');
    const selectedCounter = document.getElementById('selected-counter');
    const hiddenCounter = document.getElementById('hidden-counter');
    const imageBoxes = document.querySelectorAll('.image-box');
    const selectBtns = document.querySelectorAll('.select-btn');
    const hideBtns = document.querySelectorAll('.hide-btn');

    // Функция обновления счетчиков и статус панели
    function updateCountersAndAlert() {
        const selectedCount = document.querySelectorAll('.image-box.selected').length;
        const hiddenCount = document.querySelectorAll('.image-box.hidden').length;
        selectedCounter.textContent = `Выбрано изображений: ${selectedCount}`;
        hiddenCounter.textContent = `Скрыто изображений: ${hiddenCount}`;
        
        if (selectedCount > 1) {
            statusPanel.classList.add('status-alert');
        } else {
            statusPanel.classList.remove('status-alert');
        }
    }

    // управление темами
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        galleryTitle.classList.toggle('highlighted-title');
        
        if (document.body.classList.contains('dark-theme')) {
            this.textContent = 'Светлая тема';
        } else {
            this.textContent = 'Темная тема';
        }
    });

    // выбор изображений
    selectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const imageBox = this.parentElement;
            const description = imageBox.querySelector('.image-description');
            
            imageBox.classList.toggle('selected');
            description.classList.toggle('highlighted-text');
            
            updateCountersAndAlert();
        });
    });

    // скрытие изображений
    hideBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const imageBox = this.parentElement;
            imageBox.classList.toggle('hidden');
            
            // при скрытии выбранного — снимается выбор
            if (imageBox.classList.contains('selected')) {
                imageBox.classList.remove('selected');
                imageBox.querySelector('.image-description').classList.remove('highlighted-text');
            }
            
            // замена текста кнопки
            this.textContent = imageBox.classList.contains('hidden') ? 'Показать' : 'Скрыть';
            
            updateCountersAndAlert();
        });
    });

    // управление масштабом
    zoomInBtn.addEventListener('click', function() {
        imageBoxes.forEach(box => {
            box.classList.add('zoom-large');
            box.classList.remove('zoom-small');
        });
    });

    zoomOutBtn.addEventListener('click', function() {
        imageBoxes.forEach(box => {
            box.classList.add('zoom-small');
            box.classList.remove('zoom-large');
        });
    });

    // сброс стилей
    resetBtn.addEventListener('click', function() {
        imageBoxes.forEach(box => {
            // полный сброс классов через className
            box.className = 'image-box';
        });
        
        // сброс описаний
        document.querySelectorAll('.image-description').forEach(desc => {
            desc.classList.remove('highlighted-text');
        });
        
        // сброс кнопок скрытия
        document.querySelectorAll('.hide-btn').forEach(btn => {
            btn.textContent = 'Скрыть';
        });
        
        // сброс панели
        statusPanel.classList.remove('status-alert');
        
        // обновление счетчиков
        updateCountersAndAlert();
    });

    // динамические стили
    imageBoxes.forEach(box => {
        // наведение
        box.addEventListener('mouseenter', function() {
            this.style.borderColor = '#FF6B6B';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.borderColor = '';
        });
        
        // двойной клик на изображение
        const img = box.querySelector('img');
        img.addEventListener('dblclick', function() {
            this.style.transition = 'filter 0.5s';
            this.style.filter = this.style.filter === 'sepia(100%)' ? '' : 'sepia(100%)';
        });
    });

    // инициализация счетчиков
    updateCountersAndAlert();
});