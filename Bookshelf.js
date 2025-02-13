const RENDER_BOOKS = 'render-books';
const Bookshelf = [];
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS_APPS';

document.addEventListener(RENDER_BOOKS, function(){
  const incompletedBooklist = document.getElementById('incompleteBookList');
  incompletedBooklist.innerHTML = '';

  const completedBooklist = document.getElementById('completeBookList');
  completedBooklist.innerHTML = '';

  for (const bookItem of Bookshelf){
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete)
      incompletedBooklist.append(bookElement);
    else
      completedBooklist.append(bookElement);
  }
});

document.addEventListener('DOMContentLoaded', function(){
  const submitBooks = document.getElementById('bookForm');
  submitBooks.addEventListener('submit', function(event){
    event.preventDefault();
    addBook();
  });
});

document.addEventListener('DOMContentLoaded', function(){
  if(isStorageExist()){
    const data = localStorage.getItem(STORAGE_KEY);
    if(data){
      const parsedData = JSON.parse(data);
      Bookshelf.push(...parsedData);
      document.dispatchEvent(new Event(RENDER_BOOKS));
  }
}
});

function generateID(){
  return +new Date();
};

function generateBookObject(id, title, author, year, isComplete){
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function addBook(){
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = parseInt(document.getElementById('bookFormYear').value);

  const id = generateID();
  const bookObject = generateBookObject(id, bookTitle, bookAuthor, bookYear, false);

  Bookshelf.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData(); // Pastikan fungsi saveData didefinisikan
}

function findBookIndex(BookId) {
  for (const index in Bookshelf) {
    if (Bookshelf[index].id === BookId) {
      return index;
    }
  }
  return -1;
}

function addBookToCompleted(BookId) {
  const BookTarget = findBook(BookId);
  if (BookTarget == null) return;
  BookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

function findBook(BookId) {
  for (const book of Bookshelf) {
    if (book.id === BookId) {
      return book;
    }
  }
  return null;
}

function removeBookFromCompleted(BookId) {
  const bookIndex = findBookIndex(BookId);
  if (bookIndex === -1) return;
  Bookshelf.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function undoTaskFromCompleted(BookId) {
  const BookTarget = findBook(BookId);
  if (BookTarget == null) return;
  BookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

function makeBook(bookObject) {
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', bookObject.id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const bookTitle = document.createElement('h3');
  bookTitle.setAttribute('data-testid', 'bookItemTitle');
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;

  const bookYear = document.createElement('p');
  bookYear.setAttribute('data-testid', 'bookItemYear');
  bookYear.innerText = `Tahun: ${parseInt(bookObject.year)}`;

  const bookIsCompleteButton = document.createElement('button');
  bookIsCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  bookIsCompleteButton.innerText = 'Selesai dibaca';

  bookIsCompleteButton.addEventListener('click', function(){
    addBookToCompleted(bookObject.id);
    saveData(); 
  });

  const bookDeleteButton = document.createElement('button');
  bookDeleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  bookDeleteButton.innerText = 'Hapus Buku';

  bookDeleteButton.addEventListener('click', function(){
    removeBookFromCompleted(bookObject.id);
    deleteData();
  });

  if(bookObject.isComplete){
    bookIsCompleteButton.innerText = 'Ulang Membaca';
bookIsCompleteButton.addEventListener('click', function(){
  undoTaskFromCompleted(bookObject.id);
});
  }
  

  bookContainer.append(bookTitle, bookAuthor, bookYear, bookIsCompleteButton, bookDeleteButton);

  return bookContainer;
}

function saveData(){
  if(isStorageExist()){
    const parsed = JSON.stringify(Bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function isStorageExist() /* boolean */ {
  if(typeof(Storage) === undefined){
alert('Browser kamu tidak mendukung local storage');
return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadData(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null)
    Bookshelf = data;

  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function deleteData(){
localStorage.removeItem(STORAGE_KEY);
};