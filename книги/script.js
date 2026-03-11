
// Библиотека случайных книг для генерации
const books_database = {
    titles: [
        "Мастер и Маргарита", "Преступление и наказание", "Война и мир", "Анна Каренина",
        "Мёртвые души", "Евгений Онегин", "Отцы и дети", "Герой нашего времени",
        "Идиот", "Братья Карамазовы", "Тихий Дон", "Доктор Живаго",
        "1984", "Убить пересмешника", "Великий Гэтсби", "Над пропастью во ржи",
        "Повелитель мух", "Фауст", "Дон Кихот", "Гамлет",
        "Моби Дик", "Гордость и предубеждение", "Ярмарка тщеславия", "Маленькие женщины"
    ],
    authors: [
        "Михаил Булгаков", "Фёдор Достоевский", "Лев Толстой", "Александр Пушкин",
        "Николай Гоголь", "Иван Тургенев", "Михаил Лермонтов", "Антон Чехов",
        "Иван Бунин", "Александр Солженицын", "Максим Горький", "Владимир Набоков",
        "Джордж Оруэлл", "Харпер Ли", "Фрэнсис Скотт Фицджеральд", "Джером Сэлинджер",
        "Уильям Голдинг", "Иоганн Гёте", "Мигель де Сервантес", "Уильям Шекспир",
        "Герман Мелвилл", "Джейн Остин", "Уильям Теккерей", "Луиза Мэй Олкотт"
    ],
    // Год генерируется как массив из строк, состоящих из 4 цифр в диапазоне 1800-1999
    years: Array.from({ length: 200 }, (_, i) => (1800 + i).toString()),
    genres: ["Роман", "Поэма", "Повесть", "Рассказ", "Драма", "Трагедия", "Комедия"]
};

// Конфигурация всех кнопок
const buttonsConfig = [
    {
        id: 'add-random',
        text: 'Добавить случайную книгу',
        title: 'Добавить одну книгу со случайными данными',
    },
    {
        id: 'show-all',
        text: 'Показать все книги',
        title: 'Показать все книги без фильтрации',
    },
    {
        id: 'show-read',
        text: 'Показать прочитанные',
        title: 'Показать только прочитанные книги',
    },
    {
        id: 'clear-all',
        text: 'Очистить список',
        title: 'Удалить все книги из библиотеки',
    }
];

// Цветовые палитры для системы уведомлений
const typeStyles = {
    success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        borderColor: '#c3e6cb'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderColor: '#f5c6cb'
    },
    info: {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        borderColor: '#bee5eb'
    },
    warning: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderColor: '#ffeeba'
    }
};

// Лимит книг для демонстрации
const MAX_BOOKS = 20;

let library = {
    books: [],
    nextId: 1,
    activeFilter: 'all', // 'all' или 'read'

    // Метод для добавления книги
    addBook(book) {
        this.books.push(book);
        this.nextId = Math.max(this.nextId, book.id + 1);
    },

    // Метод для удаления книги
    removeBook(bookId) {
        const index = this.books.findIndex(b => b.id === bookId);
        if (index !== -1) {
            this.books.splice(index, 1);
            return true;
        }
        return false;
    },

    // Метод для переключения статуса
    toggleReadStatus(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            book.read = !book.read;
            return book;
        }
        return null;
    },

    // Метод для получения отфильтрованных книг
    getFilteredBooks() {
        if (this.activeFilter === 'read') {
            return this.books.filter(book => book.read === true);
        }
        return this.books;
    },

    // Метод для очистки библиотеки
    clearBooks() {
        this.books = [];
        this.activeFilter = 'all';
    }
};

// Генерация случайного числа в диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Проверка уникальности книги
function isBookUnique(title, author) {
    return !library.books.some(book => book.title === title && book.author === author);
}

// Генерация случайной книги
function generateRandomBook() {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        const title = books_database.titles[getRandomInt(0, books_database.titles.length - 1)];
        const author = books_database.authors[getRandomInt(0, books_database.authors.length - 1)];
        const year = books_database.years[getRandomInt(0, books_database.years.length - 1)];

        if (isBookUnique(title, author)) {
            return {
                id: library.nextId,
                title: title,
                author: author,
                year: year,
                read: Math.random() > 0.5 // Случайный статус прочтения
            };
        }
        attempts++;
    }
    return null; // Если не удалось найти уникальную комбинацию
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('#message-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Применяем стили из typeStyles
    const styles = typeStyles[type] || typeStyles.info;
    for (const [key, value] of Object.entries(styles)) {
        notification.style[key] = value;
    }

    // Добавляем возможность закрыть уведомление
    notification.addEventListener('click', function(e) {
        if (e.target === notification) {
            notification.remove();
        }
    });

    // Автоматическое удаление через 3 секунды
    container.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Обновление счетчика в футере
function updateFooterCounter() {
    const counterSpan = document.querySelector('#total-counter');
    if (counterSpan) {
        counterSpan.textContent = library.books.length;
    }
}

// Обновление статистики
function updateStatistics() {
    const statsContainer = document.querySelector('#statistics');
    if (!statsContainer) return;

    const filteredBooks = library.getFilteredBooks();
    const totalBooks = filteredBooks.length;
    const readBooks = filteredBooks.filter(book => book.read).length;
    const unreadBooks = totalBooks - readBooks;

    statsContainer.innerHTML = `
        <h2>Статистика</h2>
        <div class="stat-item">
            <span class="stat-label">Всего книг:</span>
            <span class="stat-value">${totalBooks}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Прочитано:</span>
            <span class="stat-value">${readBooks}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Не прочитано:</span>
            <span class="stat-value">${unreadBooks}</span>
        </div>
    `;
}

// Отрисовка списка книг
function renderBookList() {
    const bookListContainer = document.querySelector('#book-list');
    if (!bookListContainer) return;

    const filteredBooks = library.getFilteredBooks();

    let booksHTML = '<h2>Список книг</h2>';

    if (filteredBooks.length === 0) {
        booksHTML += '<div class="empty-message">Библиотека пуста. Добавьте первую книгу.</div>';
    } else {
        booksHTML += '<ol id="books">';

        for (const book of filteredBooks) {
            booksHTML += `
                <li class="book-item" data-book-id="${book.id}">
                    <div class="book-info">
                        <span class="title">${book.title}</span> - ${book.author} (${book.year})
                        ${book.read ? '<span class="read-badge">ПРОЧИТАНО</span>' : ''}
                    </div>
                    <div class="book-actions">
                        <button class="delete-btn" title="Удалить книгу">Удалить</button>
                        <button class="toggle-read-btn" title="Изменить статус прочтения">${book.read ? 'Не прочитано' : 'Прочитано'}</button>
                    </div>
                </li>
            `;
        }

        booksHTML += '</ol>';
    }

    bookListContainer.innerHTML = booksHTML;

    // Обновляем статистику и счетчик
    updateStatistics();
    updateFooterCounter();
}

function initializeInterface() {
    // Инициализация секции списка книг
    const bookListDiv = document.querySelector('#book-list');
    if (bookListDiv) {
        bookListDiv.innerHTML = '<h2>Список книг</h2><ol id="books"></ol>';
    }

    // Инициализация секции формы добавления
    const bookFormDiv = document.querySelector('#book-form');
    if (bookFormDiv) {
        bookFormDiv.innerHTML = `
            <h2>Добавить книгу</h2>
            <button id="add-random-btn" class="control-btn" title="${buttonsConfig[0].title}">${buttonsConfig[0].text}</button>
        `;
    }

    // Инициализация панели управления
    const controlsDiv = document.querySelector('#controls');
    if (controlsDiv) {
        controlsDiv.innerHTML = '<h2>Управление библиотекой</h2>';
        
        // Создаем кнопки из конфигурации (пропускаем первую, так как она уже в форме)
        for (let i = 1; i < buttonsConfig.length; i++) {
            const config = buttonsConfig[i];
            const button = document.createElement('button');
            button.id = config.id;
            button.className = 'control-btn';
            button.textContent = config.text;
            button.title = config.title;
            button.dataset.active = 'false';
            controlsDiv.appendChild(button);
        }
    }

    // Инициализация статистики
    const statsDiv = document.querySelector('#statistics');
    if (statsDiv) {
        statsDiv.innerHTML = '<h2>Статистика</h2>';
    }

    // Инициализация контейнера уведомлений
    const messageContainer = document.querySelector('#message-container');
    if (messageContainer) {
        messageContainer.innerHTML = '<h2>Уведомления</h2>';
    }
}

function initializeData() {
    // Добавляем 2-3 примерные книги
    const sampleBooks = [
        { id: library.nextId++, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', year: '1967', read: true },
        { id: library.nextId++, title: 'Преступление и наказание', author: 'Фёдор Достоевский', year: '1866', read: false },
        { id: library.nextId++, title: 'Война и мир', author: 'Лев Толстой', year: '1869', read: true }
    ];

    for (const book of sampleBooks) {
        library.addBook(book);
    }

    // Первоначальная отрисовка
    renderBookList();

    // Показываем приветственное уведомление
    showNotification('Добро пожаловать в вашу цифровую библиотеку!', 'info');
}

// Обработчик добавления случайной книги
function handleAddRandomBook() {
    if (library.books.length >= MAX_BOOKS) {
        showNotification('Превышен лимит добавления книг', 'error');
        const addButton = document.querySelector('#add-random-btn');
        if (addButton) {
            addButton.disabled = true;
        }
        return;
    }

    const newBook = generateRandomBook();
    if (newBook) {
        library.addBook(newBook);
        renderBookList();
        showNotification(`Добавлена книга: "${newBook.title}"`, 'success');

        // Возвращаем фокус на добавленный элемент
        setTimeout(() => {
            const newBookElement = document.querySelector(`[data-book-id="${newBook.id}"]`);
            if (newBookElement) {
                newBookElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newBookElement.style.backgroundColor = '#e8f4fd';
                setTimeout(() => {
                    newBookElement.style.backgroundColor = '';
                }, 1000);
            }
        }, 100);
    } else {
        showNotification('Не удалось создать уникальную книгу. Попробуйте еще раз.', 'warning');
    }
}

// Обработчик удаления книги
function handleDeleteBook(bookId) {
    const book = library.books.find(b => b.id === bookId);
    if (book && library.removeBook(bookId)) {
        renderBookList();
        showNotification(`Книга "${book.title}" удалена`, 'info');
    }
}

// Обработчик изменения статуса книги
function handleToggleRead(bookId) {
    const book = library.toggleReadStatus(bookId);
    if (book) {
        renderBookList();
        showNotification(`Статус книги "${book.title}" изменен`, 'info');
    }
}

// Обработчик фильтрации
function handleFilter(filterType) {
    library.activeFilter = filterType;
    
    // Обновляем активное состояние кнопок
    const showAllBtn = document.querySelector('#show-all');
    const showReadBtn = document.querySelector('#show-read');
    
    if (showAllBtn) showAllBtn.dataset.active = (filterType === 'all').toString();
    if (showReadBtn) showReadBtn.dataset.active = (filterType === 'read').toString();
    
    renderBookList();
}

// Обработчик очистки списка
function handleClearAll() {
    if (library.books.length === 0) {
        showNotification('Библиотека уже пуста', 'info');
        return;
    }

    const userConfirmed = confirm(`Удалить все книги (${library.books.length} шт.)?`);
    if (userConfirmed) {
        const deletedCount = library.books.length;
        library.clearBooks();
        renderBookList();
        showNotification(`Удалено ${deletedCount} книг из библиотеки`, 'warning');

        // Активируем кнопку добавления, если она была отключена
        const addButton = document.querySelector('#add-random-btn');
        if (addButton) {
            addButton.disabled = false;
        }
    }
}

// Основной обработчик кликов (делегирование событий)
function setupEventListeners() {
    document.addEventListener('click', function(e) {
        const target = e.target;

        // Обработка кнопки добавления случайной книги
        if (target.id === 'add-random-btn') {
            handleAddRandomBook();
        }

        // Обработка кнопки "Показать все книги"
        if (target.id === 'show-all') {
            handleFilter('all');
        }

        // Обработка кнопки "Показать прочитанные"
        if (target.id === 'show-read') {
            handleFilter('read');
        }

        // Обработка кнопки "Очистить список"
        if (target.id === 'clear-all') {
            handleClearAll();
        }

        // Обработка кнопки удаления внутри карточки книги
        if (target.classList.contains('delete-btn')) {
            const bookElement = target.closest('[data-book-id]');
            if (bookElement) {
                const bookId = parseInt(bookElement.dataset.bookId);
                handleDeleteBook(bookId);
            }
        }

        // Обработка кнопки изменения статуса внутри карточки книги
        if (target.classList.contains('toggle-read-btn')) {
            const bookElement = target.closest('[data-book-id]');
            if (bookElement) {
                const bookId = parseInt(bookElement.dataset.bookId);
                handleToggleRead(bookId);
            }
        }
    });

    // Добавляем эффекты наведения для кнопок
    const allButtons = document.querySelectorAll('button');
    for (const button of allButtons) {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeInterface();
    initializeData();
    setupEventListeners();
});