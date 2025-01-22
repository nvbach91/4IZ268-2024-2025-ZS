//console.log("Hello World!")
// link của API
// Tiêu đề: https://openlibrary.org/search.json?title=
// Bìa: https://covers.openlibrary.org/b/id/${book-cover}-M.jpg


// API and required information from  Open Library
const BASE_API_URL = "https://openlibrary.org/search.json?title=";
const headers = new Headers({
  "User-Agent": "MyReadingList/1.0 (vietanh200x@gmail.com)", // Custom user agent for the API
});
const options = {
  method: "GET",
  headers: headers,
};

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector('input[name="searchValue"]');

//Helper function - change from space to "+" in order to fit with the search of Open Library API
//For example: the lord of the ring will be the+lord+of+the+rings
const removeWhiteSpaces = (searchTerm) => {
  return searchTerm.split(" ").join("+");
};

//Search results box
const searchResultsContainer = document.querySelector("#search-results");

// EventListener helps prevent reload the website after everytime submit the title of searching book
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = removeWhiteSpaces(searchInput.value);

  // Alerting user if the input is empty
  if (!searchValue) {
    Swal.fire({
      icon: "error",
      title: "Please enter a search term",
    });
    return;
  }

  fetchBookSearchResults(searchValue);
});

// Fetching data. While waiting for it, user will see a spinner and it disappear after the results show
const fetchBookSearchResults = async (searchValue) => {
  showSpinner();
  try {
    const url = `${BASE_API_URL}${searchValue}`;
    const res = await fetch(url, options);
    const data = await res.json();
    hideSpinner();

    // Telling the user that there is no result
    if (data.docs.length === 0) {
      Swal.fire({
        title: "No book found!",
        icon: "info",
        text: "Please try another title!",
        draggable: true,
      });
    }

    renderBooksResult(data);

    //Showing message that cannot fetch.
  } catch (error) {
    console.error("Error fetching books:", error); // Log for debugging
    hideSpinner();
    searchResultsContainer.innerHTML =
      "<p>Error loading books. Please try again...</p>";
  }
};

//Using let for readingList array in order to change it (adding or removing books from My Reading List)
let readingList = [];

// Showing Books result
const renderBooksResult = (data) => {
  const books = data.docs
    .map((book) => {
      // Showing the results. Each book will display its cover, title, author's name and a button to add book to My Reading List
      const html = `
            <div class="card col-4">
                <div class="card-body">
                <div id="book-cover-container">
                    <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" class="card-img-top img-fluid rounded"  alt="${book.title}"> 
                    </div>
                    <div id="book">
                    <h5 class="card-title">${book.title}</h5> 
                
                    <h6 class="card-title">${book.author_name}</h6> 
                    </div>
                    <button  
                        id="button"
                        class="btn btn-primary book-adding-btn"
                         data-title="${book.title}"
                         data-author="${book.author_name}" >
                        Add to my list </button>
                </div>
            </div>
            `;

      return html;
    })
    .join("");

  searchResultsContainer.innerHTML = books;

  // Managing the button "Add to my list"
  document.querySelectorAll(".book-adding-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const title = event.target.dataset.title;
      const author = event.target.dataset.author;

      //Adding books to my reading list
      const bookAlreadyAdded = readingList.find(
        (bookList) => bookList.title === title && bookList.author === author
      );

      // Checking the book if it already on the list. It is not then the book will be added to the list
      if (bookAlreadyAdded) {
        Swal.fire({
          title: "Book is already on the list!",
          icon: "warning",
          draggable: true,
        });
      } else {
        addToReadingList(title, author);
        Swal.fire({
          title: "Added successfully!",
          icon: "success",
          draggable: true,
        });
      }
    });
  });
};

//console.log(readingList);

// Adding books from search results to the reading list
const addToReadingList = (title, author) => {
  readingList.push({ title, author }); // Adding book object to list
  renderReadingList(); // Refreshing the list in the DOM
};

//Displaying books in the reading list
const renderReadingList = () => {
  const readingListContainer = document.querySelector("#my-reading-list");
  const readingListItems = readingList
    .map(
      // Creating My Reading List. Each book in a list contains the title and the author's name, as well as the button delete it from the list
      (book, index) => ` 
    <li class="list-group-item"> 
    <div id= "list-added-books" >
    <b>${book.title}</b> by ${book.author} 
    </div>
    <button type="button" class="btn-close " aria-label="Close" data-index = "${index}"> </button>  
    </li>
    `
    )
    .join("");

  readingListContainer.innerHTML = `<ul class="list-group list-group-flush list-group-numbered">${readingListItems}</ul>`;

  // Removing the book from the list
  document.querySelectorAll(".btn-close").forEach((button) => {
    button.addEventListener("click", (event) => {
      const bookIndex = event.target.dataset.index;
      removeBookFromList(bookIndex);

      Swal.fire({
        title: "Book is removed from the list!",
        icon: "info",
        draggable: true,
      });
    });
  });
};

//Showing spinner while waiting for the data from Open Library
const showSpinner = () => {
  searchResultsContainer.innerHTML = `
  <div class="d-flex justify-content-center">
<div id="spinner" class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>`;
};

// Spinner goes after receiving the results
const hideSpinner = () => {
  searchResultsContainer.innerHTML = "";
};

// Removing the book after delete it from a list
const removeBookFromList = (index) => {
  readingList.splice(index, 1);
  renderReadingList();
};
