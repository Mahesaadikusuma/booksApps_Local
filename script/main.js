const loginKey = "username";
const username = localStorage.getItem(loginKey);
const welcome = document.getElementById("welcome");
welcome.innerText = `Selamat Datang ${username ?? "user"}!`;

// console.log(`Username: ${username}`);

// formBook
const books = [];
const RENDER_EVENT = "render-books";
const STORAGE_KEY = "Books_App";
const SAVED_EVENT = "Save_Books";
function generateId() {
  return +new Date();
}

function generateObjectBooks(id, title, author, years, isComplete) {
  return {
    id,
    title,
    author,
    years,
    isComplete,
  };
}

function addTodo() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const years = parseInt(document.getElementById("year").value);
  const checkReading = document.getElementById("isComplete").checked;

  //   console.log(checkbok);

  //   const checkReading = checkbox.checked;
  const generatedID = generateId();

  const booksObject = generateObjectBooks(
    generatedID,
    title,
    author,
    years,
    checkReading
  );

  books.push(booksObject);

  // Setelah disimpan pada array, kita panggil sebuah custom event RENDER_EVENT menggunakan method dispatchEvent(). Custom event ini akan kita terapkan untuk me-render data yang telah disimpan pada array todos.
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const formBook = document.getElementById("formBook");
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    filterBooks(searchTerm);
  });

  formBook.addEventListener("submit", function (e) {
    e.preventDefault();

    addTodo();
    resetForm();
    saveData();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function filterBooks(search) {
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.years.toString().includes(search)
  );

  renderBooks(filteredBooks);
}

function renderBooks(bookList) {
  const uncompletedBookList = document.getElementById("uncompletedReading");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completedReading");
  completedBookList.innerHTML = "";

  for (const book of bookList) {
    const elementBook = showBook(book);

    if (book.isComplete) {
      completedBookList.append(elementBook);
    } else {
      uncompletedBookList.append(elementBook);
    }
  }
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("isComplete").checked = false;
}

//  menampilkan buku
function showBook(bookObject) {
  const title = document.createElement("h3");
  title.innerText = `Judul: ${bookObject.title}`;

  const author = document.createElement("p");
  author.innerText = `Author: ${bookObject.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${bookObject.years}`;

  const container = document.createElement("div");
  container.classList.add("list-item");

  const article = document.createElement("article");
  const containerBody = document.createElement("div");
  containerBody.setAttribute("class", "flex-col");
  containerBody.append(title, author, year);

  //   INI ACTION UNTUK BUTTON

  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    console.log("completed");

    const containerAction = document.createElement(`div`);
    const actionBodyDelete = document.createElement("button");
    actionBodyDelete.innerText = "Hapus Buku";
    actionBodyDelete.classList.add("text-red-500");
    actionBodyDelete.setAttribute("id", bookObject.id);

    actionBodyDelete.addEventListener("click", function () {
      removeBookList(bookObject.id);
    });

    const actionBodyCompleted = document.createElement("button");
    actionBodyCompleted.innerText = "Belum selesai dibaca";
    actionBodyCompleted.classList.add("text-green-500");
    actionBodyCompleted.setAttribute("id", bookObject.id);

    actionBodyCompleted.addEventListener("click", function () {
      undoButtonCompleted(bookObject.id);
    });

    containerAction.setAttribute("class", "action-reading");
    containerAction.append(actionBodyDelete, actionBodyCompleted);

    article.append(containerBody);

    container.append(article, containerAction);
  } else {
    const containerAction = document.createElement(`div`);
    const actionBodyDelete = document.createElement("button");
    actionBodyDelete.innerText = "Hapus Buku";
    actionBodyDelete.classList.add("text-red-500");
    actionBodyDelete.setAttribute("id", bookObject.id);

    actionBodyDelete.addEventListener("click", function () {
      removeBookList(bookObject.id);
    });

    const actionBodyCompleted = document.createElement("button");
    actionBodyCompleted.innerText = "Selesai dibaca Buku";
    actionBodyCompleted.classList.add("text-green-500");
    actionBodyCompleted.setAttribute("id", bookObject.id);

    actionBodyCompleted.addEventListener("click", function () {
      booksCompleted(bookObject.id);
    });

    containerAction.setAttribute("class", "action-reading");
    containerAction.append(actionBodyDelete, actionBodyCompleted);

    article.append(containerBody);

    container.append(article, containerAction);
  }

  return container;
}

// FUNGSI FindBookIndex itu untuk mendelete data s
function findBookIndex(todoId) {
  for (const index in books) {
    if (books[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

// sedangkan findBook untuk mencari data buku berdasarkan idnya
// fungsi ini untuk undoButtonCompleted() dan booksCompleted()
function findBook(booksId) {
  for (const BookItem of books) {
    if (BookItem.id === booksId) {
      return BookItem;
    }
  }
  return null;
}
function undoButtonCompleted(booksId) {
  const BookTarget = findBook(booksId);

  if (BookTarget == null) return;

  BookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookList(booksId) {
  const bookTarget = findBookIndex(booksId);

  if (bookTarget == -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function booksCompleted(booksId) {
  const BookTarget = findBook(booksId);

  if (BookTarget == null) return;

  BookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Web Storage
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// render event custom yang berfungsi untuk merender
// Semua fungsi yang dibutuhkan sudah selesai ditulis. Untuk memastikan bahwa fungsi diatas bisa berhasil, kita perlu membuat listener dari RENDER_EVENT, dengan menampilkan array todos menggunakan console.log().s
document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  renderBooks(books);
  const uncompletedBookList = document.getElementById("uncompletedReading");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completedReading");
  completedBookList.innerHTML = "";

  for (const book of books) {
    const elementBook = showBook(book);
    // ini sudah tidak dipakai karena sudah di step ketika iscomplete
    // console.log(book);
    // uncompletedBookList.append(elementBook);

    if (book.isComplete) {
      completedBookList.append(elementBook);
    } else {
      uncompletedBookList.append(elementBook);
    }
  }

  // books.map((book) => {
  //   if (!book.isCompleted) {
  //     const elementBook = showBook(book);
  //     uncompletedBookList.append(elementBook);
  //   }
  // });
});
