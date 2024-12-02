function checkStorage() {
    if (typeof Storage !== undefined) {
        return true
    } else {
        return false
    }
}

const bookForm = document.getElementById('bookForm')
const bookFormId = document.getElementById('bookFormId')
const bookFormTitle = document.getElementById('bookFormTitle')
const bookFormAuthor = document.getElementById('bookFormAuthor')
const bookFormYear = document.getElementById('bookFormYear')
const bookFormIsComplete = document.getElementById('bookFormIsComplete')
const bookItems = []

const searchSubmit = document.getElementById('searchSubmit')
const sectionSearchBook = document.querySelector('.cari-buku')
const formSearchBook = document.getElementById('searchBook')
const searchBookContainer = document.createElement('div')


function makeBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        'year' : Number(year),
        isComplete
    }
}

function saveToStorage(bookObject) {
    bookItems.push(bookObject)
    localStorage.setItem('books', JSON.stringify(bookItems))
}

function loadFromStorage() {
    const books = JSON.parse(localStorage.getItem('books'))

    if (books !== null) {
        for (const book of books) {
            bookItems.push(book)
        }
    }
}

function makeBookElement(book) {
    // inside book element/container
    const bookContainer = document.createElement('div')
    const bookTitle = document.createElement('h3')
    const bookAuthor = document.createElement('p')
    const bookYear = document.createElement('p')
    const buttonContainer = document.createElement('div')
    const isCompleteButton = document.createElement('button')
    const deleteButton = document.createElement('button')
    const editButton = document.createElement('button')

    // set button attribute data-testid
    isCompleteButton.setAttribute('data-testid','bookItemIsCompleteButton')
    isCompleteButton.addEventListener('click', function() {
        addToCompleteOrIncomplete(book.id)
    })

    deleteButton.addEventListener('click', function() {
        deleteBook(book.id)
    })
    if (book.isComplete) {
        isCompleteButton.innerText = 'Belum selesai dibaca'
    } else {
        isCompleteButton.innerText = 'Selesai dibaca'
    }
    deleteButton.setAttribute('data-testid','bookItemDeleteButton')
    deleteButton.innerText = 'Hapus Buku'
    deleteButton.style = 'background-color : red'
    
    editButton.setAttribute('data-testid','bookItemEditButton')
    editButton.innerText = 'Edit Buku'
    editButton.style = 'background-color : blue'
    editButton.addEventListener('click', function() {
        editBook(book.id)
    })

    
    bookContainer.setAttribute('data-bookid', book.id)
    bookContainer.setAttribute('data-testid', 'bookItem')
    
    bookTitle.setAttribute('data-testid', 'bookItemTitle')
    bookTitle.innerText = book.title

    bookAuthor.setAttribute('data-testid', 'bookItemAuthor')
    bookAuthor.innerText = "Penulis: " +  book.author

    bookYear.setAttribute('data-testid', 'bookItemYear')
    bookYear.innerText = "Tahun: "+book.year

    buttonContainer.append(isCompleteButton,deleteButton,editButton)

    bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer)

    return bookContainer
}

function findBook(id) {
    for (const bookItem of bookItems) {
        if (bookItem.id == id) {
            return bookItem
        }
    }
    return
}

function addToCompleteOrIncomplete(id) {
    const book = findBook(id)
    book.isComplete = !book.isComplete

    localStorage.setItem('books', JSON.stringify(bookItems))
    document.dispatchEvent(new Event('RENDER_BOOKS'))
}

function deleteBook(id) {
    const book = findBook(id)
    const index = bookItems.indexOf(book)

    bookItems.splice(index, 1)
    localStorage.setItem('books', JSON.stringify(bookItems))
    document.dispatchEvent(new Event('RENDER_BOOKS'))
}

function editBook(id) {
    const book = findBook(id)
    
    bookFormId.value = book.id
    bookFormTitle.value = book.title
    bookFormAuthor.value = book.author
    bookFormYear.value = Number(book.year)
    bookFormIsComplete.checked = book.isComplete   
}

function makeSearchBookElement(book) {
    // inside book element/container
    const bookContainer = document.createElement('div')
    const bookTitle = document.createElement('h3')
    const bookAuthor = document.createElement('p')
    const bookYear = document.createElement('p')

    bookTitle.innerText = book.title
    bookAuthor.innerText = "Penulis: " +  book.author
    bookYear.innerText = "Tahun: "+book.year
    bookContainer.append(bookTitle, bookAuthor, bookYear)

    return bookContainer
}

function searchBook() {
    const searchBookTitle = document.getElementById('searchBookTitle').value
    const foundBooks = bookItems.filter((book) => book.title.toUpperCase() == searchBookTitle.toUpperCase())

    searchBookContainer.innerHTML = ''

    for (const foundBook of foundBooks) {
        console.log(foundBook)
        searchBookContainer.append(makeSearchBookElement(foundBook))
    }

    sectionSearchBook.append(searchBookContainer)

}

formSearchBook.addEventListener('submit', function(event) {
    event.preventDefault()
    searchBook()
    document.dispatchEvent(new Event('RENDER_BOOKS'))
})

// document.addEventListener('RENDER_SEARCH_BOOK', function() {
//     const sectionSearchBook = document.querySelector('.cari-buku')

// })

document.addEventListener('RENDER_BOOKS', function() {
    const incompleteBookListDiv = document.getElementById('incompleteBookList')
    const completeBookListDiv = document.getElementById('completeBookList')

    
    completeBookListDiv.innerHTML = ''
    incompleteBookListDiv.innerHTML = ''
    
    for (const bookItem of bookItems) {
        const book = makeBookElement(bookItem)
        // const h1 = document.createElement('h1')
        // h1.innerText = 'kntol'
        if (bookItem.isComplete) {
                completeBookListDiv.append(book)
            } else {
                incompleteBookListDiv.append(book)
        }
    }
    
})

document.addEventListener('DOMContentLoaded', function() {
    if (checkStorage()) {
        bookForm.addEventListener('submit', function(event) {
            if (bookFormId.value !== '') {

                for (const bookItem of bookItems) {
                    if (bookItem.id == bookFormId.value) {
                        bookItem.title = bookFormTitle.value 
                        bookItem.author = bookFormAuthor.value
                        bookItem.year = bookFormYear.value
                        bookItem.isComplete = bookFormIsComplete.checked
                    }
                }

                event.target.reset()
                localStorage.setItem('books', JSON.stringify(bookItems))
                document.dispatchEvent(new Event('RENDER_BOOKS'))
            } else {
                const bookObject = makeBookObject(Date.now(), bookFormTitle.value, bookFormAuthor.value, bookFormYear.value, bookFormIsComplete.checked)
                
                saveToStorage(bookObject)
                
                event.target.reset()
                
                // console.log(bookObject)
                document.dispatchEvent(new Event('RENDER_BOOKS'))
            }
            event.preventDefault()
        })
        loadFromStorage()
        document.dispatchEvent(new Event('RENDER_BOOKS'))
    } else {
        alert('browser tidak mendukung storage')
    }
})