const booksData = [];
const SAVED_EVENT = 'save-data';
const STORAGE_KEY = 'storage-data';
const RENDER_EVENT = 'render-books';

window.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
        loadBooksDataFromStorage();
    } else {
        alert('Maaf, Browser yang anda gunakan tidak mendukung local storage');
    }
});


const bookSubmitForm = document.getElementById('inputBook');
bookSubmitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
})

const search = document.getElementById('searchBook');
search.addEventListener('submit', function (event) {
    event.preventDefault();
    const search = document.getElementById("searchBookTitle").value;
    searchBooks(search);
});

function searchBooks(search) {
    const title = document.getElementsByTagName('h3');

    for (let i = 0; i < title.length; i++) {
        const titleText = title[i].innerText;
        if (titleText.toLowerCase().indexOf(search.toLowerCase()) > -1) {
            title[i].closest('.book_item').style.display = '';
        } else {
            title[i].closest('.book_item').style.display = 'none';
        }
    }
}

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete');
    const bookId = +new Date;
    let readStatus;

    if (bookIsComplete.checked) {
        readStatus = true;
    } else {
        readStatus = false;
    }

    const bookObject = { id: bookId, title: bookTitle, author: bookAuthor, year: Number(bookYear), isComplete: readStatus };
    booksData.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBooksData();
}

document.addEventListener(RENDER_EVENT, function () {
    const inCompleteRead = document.getElementById('incompleteBookshelfList');
    inCompleteRead.innerHTML = '';

    const completeRead = document.getElementById('completeBookshelfList');
    completeRead.innerHTML = '';

    for (const book of booksData) {
        const renderBooksData = renderBookElement(book);
        if (!book.isComplete) {
            inCompleteRead.append(renderBooksData);
        } else {
            completeRead.append(renderBooksData);
        }
    }
});

function renderBookElement(booksData) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = booksData.title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${booksData.author}`;
    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${booksData.year}`;
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.setAttribute('id', `book-${booksData.id}`);
    container.append(textTitle, textAuthor, textYear);

    if (booksData.isComplete == true) {
        const unfinishReadButton = document.createElement('button');
        unfinishReadButton.innerText = 'Belum selesai dibaca';
        unfinishReadButton.classList.add('green');

        unfinishReadButton.addEventListener('click', function () {
            moveToUncompletedBookList(booksData.id);
        });

        const deleteBookButton = document.createElement('button');
        deleteBookButton.innerText = 'Hapus buku';
        deleteBookButton.classList.add('red');

        deleteBookButton.addEventListener('click', function () {
            deleteBookFromCompletedList(booksData.id);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(unfinishReadButton, deleteBookButton);
        container.append(buttonContainer);
    } else {
        const finishedButton = document.createElement('button');
        finishedButton.innerText = 'Selesai dibaca';
        finishedButton.classList.add('green');

        finishedButton.addEventListener('click', function () {
            moveToCompletedList(booksData.id);
        });

        const deleteBookButton = document.createElement('button');
        deleteBookButton.innerText = 'Hapus buku';
        deleteBookButton.classList.add('red');

        deleteBookButton.addEventListener('click', function () {
            deleteBookFromCompletedList(booksData.id);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(finishedButton, deleteBookButton);
        container.append(buttonContainer);
    }
    return container;
}

function moveToCompletedList(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBooksData();
}

function findBook(bookId) {
    for (const book of booksData) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function deleteBookFromCompletedList(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    booksData.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBooksData();
}

function findBookIndex(bookId) {
    for (const index in booksData) {
        if (booksData[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function moveToUncompletedBookList(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBooksData();
}

function saveBooksData() {
    if (isStorageExist()) {
        const parsedBooksData = JSON.stringify(booksData);
        localStorage.setItem(STORAGE_KEY, parsedBooksData);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Maaf, Browser yang anda gunakan tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadBooksDataFromStorage() {
    const booksDataModel = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(booksDataModel);
    console.log(data);
    if (data !== null) {
        for (const book of data) {
            booksData.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}


