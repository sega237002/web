// ==== Основные элементы DOM ====
const container = document.querySelector('#notes-container');
const addBtn = document.querySelector('#add-btn');
const clearBtn = document.querySelector('#clear-btn');
const statsBtn = document.querySelector('#stats-btn');
const statsPanel = document.querySelector('#stats-panel');

let noteCounter = 0; // счётчик для нумерации (увеличивается при создании)

// ==== Функция обновления статистики ====
function updateStatistics() {
    const allNotes = document.querySelectorAll('.note');
    const totalCount = allNotes.length;

    let editedCount = 0;
    let savedCount = 0;

    for (let note of allNotes) {
        const contentDiv = note.querySelector('.note-content');
        if (!contentDiv) continue;
        const text = contentDiv.textContent || '';

        if (text.includes('Отредактированная')) editedCount++;
        if (text.includes('Сохраненная')) savedCount++;
    }

    statsPanel.innerHTML = `
        <p>Всего заметок: ${totalCount}</p>
        <p>Отредактировано: ${editedCount}</p>
        <p>Сохранено: ${savedCount}</p>
    `;
}

function createNoteElement() {
    noteCounter++;
    const currentNumber = noteCounter;

    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';

    //innerHTML для структуры
    noteDiv.innerHTML = `
        <div class="note-header">
            <span class="note-title">Заметка #${currentNumber}</span>
            <div class="note-actions">
                <div class="action-btn edit-btn">Редактировать</div>
                <div class="action-btn delete-btn">Удалить</div>
            </div>
        </div>
        <div class="note-content">Содержание заметки #${currentNumber}</div>
    `;

    const editBtn = noteDiv.querySelector('.edit-btn');
    const contentDiv = noteDiv.querySelector('.note-content');

    editBtn.addEventListener('click', function (event) {
        event.stopPropagation();

        //текущая заметку через closest
        const currentNote = this.closest('.note');
        const noteTitle = currentNote.querySelector('.note-title');
        const noteNumber = noteTitle.textContent.split('#')[1]; // например, "Заметка #3" → "3"

        if (this.textContent === 'Редактировать') {
            // режим редактирования текста и кнопки
            contentDiv.textContent = `Отредактированная заметка #${noteNumber}`;
            this.textContent = 'Сохранить';
        } else {
            // режим сохранения
            contentDiv.textContent = `Сохраненная заметка #${noteNumber}`;
            this.textContent = 'Редактировать';
        }
    });

    const deleteBtn = noteDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        const noteToRemove = this.closest('.note');
        // Удаление через outerHTML
        noteToRemove.outerHTML = '';

        // Если заметок не осталось — показывается заглушка
        if (document.querySelectorAll('.note').length === 0) {
            container.innerHTML = 'Заметок нет. Добавьте первую!';
        }
    });

    return noteDiv;
}

function addNote() {
    // Если сейчас заглушка "Заметок нет...", то она удаляется
    if (container.textContent.includes('Заметок нет. Добавьте первую!')) {
        container.innerHTML = ''; // очищение, чтобы убрать текстовую заглушку
    }

    const newNote = createNoteElement();
    container.appendChild(newNote); // добавление в конец
}

// Очистка всех заметок
function clearAllNotes() {
    container.innerHTML = 'Заметок нет. Добавьте первую!';
    // Не сбрасывается noteCounter
}

// Привязка обработчиков
addBtn.addEventListener('click', function () {
    addNote();
});

clearBtn.addEventListener('click', function () {
    clearAllNotes();
});

statsBtn.addEventListener('click', function () {
    updateStatistics();
});
