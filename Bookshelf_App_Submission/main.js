
document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('addBookForm');
    const searchBookForm = document.getElementById('searchBookForm');
    searchBookForm.addEventListener('submit', event => {
        event.preventDefault();

    });


    addBookForm.addEventListener("submit", events => {
        events.preventDefault();
        addBookData()
        alert('tombol ini diklik')
    });

    if (isStorageExist) {
        loadDataFromStorage()
    }

})

const STORAGE_KEY = "Bookshelf_Apps";
const RENDER_EVENT = 'render-books'
const SAVED_EVENT = 'Saved-book'

function saveDataBooks() {
    if (isStorageExist) {
        const parsed = JSON.stringify(booksData);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }

}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        return false;

    }
    alert('mendukung local')
    return true;
}

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
    alert('data anda telah disimpan')
});

function loadDataFromStorage() {
    const showDataOnRefresh = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(showDataOnRefresh);

    if (data !== null) {
        for (const showBooks of data) {
            booksData.push(showBooks)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const booksData = [];
function addBookData() {
    const dataBookId = generateIdBook();
    const bookFormTitle = document.getElementById('bookFormTitle').value;
    const bookFormAuthor = document.getElementById('bookFormAuthor').value;
    const bookFormYear = document.getElementById('bookFormYear').value;
    const isCompleted = document.getElementById('bookFormIsComplete').checked;
    const bookObject = generateBookObject(dataBookId, bookFormTitle, bookFormAuthor,  bookFormYear, isCompleted);
    booksData.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataBooks()
};

function generateIdBook() {
    return new Date().getTime();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
};

document.addEventListener(RENDER_EVENT, () => {

    const containerIncompleteBookList = document.getElementById('containerIncompleteBookList')
    containerIncompleteBookList.innerHTML = '';

    const containerCompleteBookList = document.getElementById('containerCompleteBookList')
    containerCompleteBookList.innerHTML = '';

    for (const bookItem of booksData) {
        const booksElements = makeBookCards(bookItem)
        if (!bookItem.isComplete) {
            containerIncompleteBookList.appendChild(booksElements)
        } else {
            containerCompleteBookList.appendChild(booksElements);
        };

    };
});

function makeBookCards(bookObject) {
    console.log(bookObject);
    const titleBook = document.createElement('h3');
    titleBook.setAttribute('data-testid', 'bookItemTitle');
    titleBook.innerText = `Judul buku: ${bookObject.title}`;

    const bookAuthor = document.createElement('p')
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
    bookAuthor.innerText = `Penulis: ${bookObject.author}`;

    const bookYear = document.createElement('p');
    bookYear.setAttribute('data-testid', 'bookItemYear');
    bookYear.innerText = `Tahun: ${bookObject.year}`;

    const checkbox = document.getElementById('bookFormIsComplete')
    checkbox.checked = bookObject.isComplete;

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            addBookToCompleted(bookObject.isComplete)
        } else {
            addBookToUncompleted(bookObject.isComplete)
        }
    });

    const cardBookList = document.createElement('div')
    cardBookList.classList.add('cardBookList');
    cardBookList.setAttribute('data-bookid', `${bookObject.id}`)
    cardBookList.setAttribute('data-testid', 'bookItem')
    cardBookList.append(titleBook, bookAuthor, bookYear,);

    if (bookObject.isComplete) {
        const bookUncompletedButton = document.createElement('button')
        bookUncompletedButton.classList.add('bookUncompletedButton')
        bookUncompletedButton.setAttribute('data-testid', 'bookItemIsCompleteButton')
        bookUncompletedButton.innerText = 'Belum selesai dibaca'
        bookUncompletedButton.addEventListener('click', () => {
            addBookToUncompleted(bookObject.id)
        });

        const bookDeleteButton = document.createElement('button');
        bookDeleteButton.classList.add('bookItemDeleteButton');
        bookDeleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        bookDeleteButton.innerText = 'Hapus buku';
        bookDeleteButton.addEventListener('click', () => {
            removeBook(bookObject.id);
        });

        const buttonGroup = document.createElement('div')
        buttonGroup.classList.add('buttonGroup');
        buttonGroup.append(bookUncompletedButton, bookDeleteButton);

        cardBookList.append(buttonGroup);

    } else {
        const bookCompleteButton = document.createElement('button');
        bookCompleteButton.classList.add('bookItemIsCompleteButton');
        bookCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton')
        bookCompleteButton.innerText = 'Selesai dibaca'
        bookCompleteButton.addEventListener('click', () => {
            addBookToCompleted(bookObject.id);
        });

        const bookDeleteButton = document.createElement('button');
        bookDeleteButton.classList.add('bookItemDeleteButton');
        bookDeleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        bookDeleteButton.innerText = 'Hapus buku';
        bookDeleteButton.addEventListener('click', () => {
            removeBook(bookObject.id);
        });

        const buttonGroup = document.createElement('div')
        buttonGroup.classList.add('buttonGroup');
        buttonGroup.append(bookCompleteButton, bookDeleteButton);

        cardBookList.append(buttonGroup);
    }
    return cardBookList
}

function addBookToCompleted(id) {
    const bookTarget = findBook(id)
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataBooks()
}

function findBook(id) {
    for (const bookItems of booksData) {
        if (bookItems.id == id) {
            return bookItems
        };
    };

    return null
};

function addBookToUncompleted(id) {
    const bookTarget = findBook(id)
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataBooks()
}

function removeBook(id) {
    const bookTarget = findBookIndex(id)
    if (bookTarget !== -1) {
        booksData.splice(bookTarget, 1)
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDataBooks()
    }
}

function findBookIndex(id) {
    for (const index in booksData) {
        if (booksData[index].id === id) {
            return index
        }
    }
    return -1;
}

const searchSubmitButton = document.getElementById('searchSubmit')
searchSubmitButton.addEventListener('click', () => {
    searchBookFromStorage()
    alert('tombol search ditekan')
})


function searchBookFromStorage() {
    const searchBookTitle = document.getElementById('searchBookTitle').value.trim().toLowerCase();
    const containerIncompleteBookList = document.getElementById('containerIncompleteBookList');
    const containerCompleteBookList = document.getElementById('containerCompleteBookList');

    containerIncompleteBookList.innerHTML = '';
    containerCompleteBookList.innerHTML = '';

    let foundBooks = false

    for (const books of booksData) {
        if (books.title.toLowerCase().includes(searchBookTitle)) {
            const bookCard = makeBookCards(books)
            if (books.isComplete) {
                containerCompleteBookList.appendChild(bookCard)
            } else {
                containerIncompleteBookList.appendChild(bookCard)
            }

            return foundBooks = true;
        }
    }

    if (!foundBooks) {
        const noResultMessage = document.createElement("p")
        noResultMessage.innerText = 'Buku Tidak di Temukan!'
        noResultMessage.style.textAlign = 'center'
        noResultMessage.style.fontWeight = 'bold'
        noResultMessage.style.fontFamily = 'Arial'
        noResultMessage.style.fontSize = '1.5rem'
        noResultMessage.style.color = 'red'
        containerIncompleteBookList.appendChild(noResultMessage)
    }
}
//Incompleted
