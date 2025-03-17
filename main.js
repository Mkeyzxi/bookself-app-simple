// // Do your work here...
// console.log('Hello, world!');

// function generateId() {
// 	return +new Date();
// }
// const RENDER_EVENT = 'render-books';
// const books = [];

// const makeBook = (judul, penulis, tahun, selesaiDibaca) => {
// 	return {
// 		judul, penulis, tahun, selesaiDibaca
// 	}
// }

// const updateBook = (e) => {
// 	console.log(e)
// 	// const parentTarget = e.target.parent;
// 	// console.log(parentTarget)
// }



// document.addEventListener('DOMContentLoaded', () => {
// 	const bookForm = document.getElementById('bookForm');
// 	bookForm.addEventListener('submit', (e) => {
// 		e.preventDefault();
// 		const judul = document.getElementById('bookFormTitle').value;
// 		const penulis = document.getElementById('bookFormAuthor').value;
// 		const tahun = document.getElementById('bookFormYear').value;
// 		const selesaiDibaca = document.getElementById('bookFormIsComplete').checked;
// 		const tambahBuku = makeBook(judul, penulis, tahun, selesaiDibaca);
// 		books.push(tambahBuku);
// 		console.log(books);
// 		// renderBooks();
// 		document.dispatchEvent(new Event(RENDER_EVENT));



// 	});
// 	const bukuBelumDibaca = document.getElementById('incompleteBookList');
// 	const bukuSudahDibaca = document.getElementById('completeBookList');
// 	document.addEventListener(RENDER_EVENT, () => {

// 		bukuBelumDibaca.innerHTML = '';
// 		bukuSudahDibaca.innerHTML = '';

// 		books.map((e, i) => {
// 			const templateDaftar = `<div data-bookid="${generateId()}" data-testid="bookItem">
// 					<h3 data-testid="bookItemTitle">${e.judul}</h3>
// 					<p data-testid="bookItemAuthor">Penulis: ${e.penulis}</p>
// 					<p data-testid="bookItemYear">Tahun: ${e.tahun}</p>
// 					<div>
// 						<button name="updateButton" data-testid="bookItemIsCompleteButton" >${e.selesaiDibaca ? 'selesai dibaca' : 'belum dibaca'}</button>
// 						<button data-testid="bookItemDeleteButton">Hapus Buku</button>
// 						<button data-testid="bookItemEditButton">Edit Buku</button>
// 					</div>
// 				</div>`;

// 			if (e.selesaiDibaca) {
// 				bukuSudahDibaca.innerHTML += templateDaftar;
// 			} else {
// 				bukuBelumDibaca.innerHTML += templateDaftar;
// 			}
// 		});

// 		// Tambahkan listener SETELAH render selesai
// 		const buttonComplete = document.getElementsByName('updateButton');
// 		buttonComplete.forEach(btn => {
// 			btn.addEventListener('click', () => {
// 				// const index = event.target.getAttribute('data-index');
// 				// updateBook(parseInt(index));
// 				console.log(btn)
// 				const parentBtn = btn.parentElement
// 				const parentparentbtn = parentBtn.parentElement
// 				console.log(parentBtn)
// 				console.log(parentparentbtn)
// 				console.log(event)
// 			});
// 		});

// 	});
// 	// const buttonComplete = document.getElementsByName('updateButton')
// 	// buttonComplete.forEach(e => {
// 	// 	e.addEventListener('click', () => {
// 	// 		console.log(e);
// 	// 	})
// 	// })





// });


// non template literal
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, selesaiDibaca) {
  return { id, judul, penulis, tahun, selesaiDibaca };
}

function findBook(bookId) {
  return books.find(book => book.id === bookId) || null;
}

function findBookIndex(bookId) {
  return books.findIndex(book => book.id === bookId);
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBookElement(bookObject) {
  const { id, judul, penulis, tahun, selesaiDibaca } = bookObject;

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = judul;
  bookTitle.setAttribute('data-testid', 'bookItemTitle');

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Penulis: ${penulis}`;
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${tahun}`;
  bookYear.setAttribute('data-testid', 'bookItemYear');

  const toggleButton = document.createElement('button');
  toggleButton.innerText = selesaiDibaca ? 'Belum selesai' : 'Selesai dibaca';
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.addEventListener('click', function () {
    toggleBookStatus(id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', function () {
    removeBook(id);
  });

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit Buku';
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.addEventListener('click', function () {
    const newTitle = prompt('Judul baru:', judul);
    const newAuthor = prompt('Penulis baru:', penulis);
    const newYear = prompt('Tahun baru:', tahun);
    if (newTitle && newAuthor && newYear) {
      editBook(id, newTitle, newAuthor, newYear);
    }
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.append(toggleButton, deleteButton, editButton);

  const container = document.createElement('div');
  container.setAttribute('data-bookid', id);
  container.setAttribute('data-testid', 'bookItem');
  container.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  return container;
}

function addBook() {
  const judul = document.getElementById('bookFormTitle').value;
  const penulis = document.getElementById('bookFormAuthor').value;
  const tahun = document.getElementById('bookFormYear').value;
  const selesaiDibaca = document.getElementById('bookFormIsComplete').checked;

  const id = generateId();
  const bookObject = generateBookObject(id, judul, penulis, tahun, selesaiDibaca);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function toggleBookStatus(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.selesaiDibaca = !bookTarget.selesaiDibaca;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId, newTitle, newAuthor, newYear) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.judul = newTitle;
  bookTarget.penulis = newAuthor;
  bookTarget.tahun = newYear;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
    bookForm.reset();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('searchBookTitle').value.toLowerCase();
    searchBooks(query);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBookElement(book);
    if (book.selesaiDibaca) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
});

function searchBooks(query) {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const filteredBooks = books.filter(book => book.judul.toLowerCase().includes(query));
  for (const book of filteredBooks) {
    const bookElement = makeBookElement(book);
    if (book.selesaiDibaca) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}
