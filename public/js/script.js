require('../css/styles.css');
const $ = require('jquery');
import 'bootstrap/dist/js/bootstrap.bundle';
//const Utilities = require('./utilities');
import { removeAlert, removeBookModal, bookDetailsModal, searchBooksForm, bookSearch, defaultBookImage, showAlert, showLoader } from './utilities';

//console.log($);

// Remove any visible alerts. Note two different ways to implement this
// window.onload = () => {
//   Utilities.removeAlert();
// };
window.onload = () => {
  removeAlert();
};

// Start: sticky search box functionality
$(document).scroll(() => {
  let scrollTop = $(document).scrollTop();

  if (scrollTop > 175) {
    searchBooksForm.addClass('sticky');
  } else {
    searchBooksForm.removeClass('sticky');
  }
});
$(document).trigger('scroll');

// End: sticky search box functionality
// Function to remove actual book
const removeBook = async (elem) => {
  const id = elem.getAttribute('data-bookid');

  try {
    const result = await fetch(`/books/deletebook/${id}`, { method: 'DELETE' });
    const jsonResponse = await result.json();
    //console.log(jsonResponse.msg);
    //$('#removeBookModal').modal('hide');

    // Close the modal popup after yes is clicked
    removeBookModal.modal('hide');
    showAlert('danger', jsonResponse.msg, () => {
      // Reload the page to refresh list of books
      window.location.reload(true);
    });
  } catch (err) {
    console.error('Fetch error: ', err);
    showAlert('danger', err.msg);
  }
};

// Function to get book info from google book API
const getBookInfo = async (elem) => {
  showLoader();
  try {
    const bookResponse = await fetch(`/books/getbookinfo?bookquery=${elem.getAttribute('data-query')}`);
    const bookData = await bookResponse.json();

    //console.log(bookData);
    if (!bookData) {
      showAlert('danger', 'Sorry, but we are unable to retrieve information on that volume.');
      showLoader();
      return false;
    }
    const title = bookData.volumeInfo.title || '';
    const subtitle = bookData.volumeInfo.subtitle || '';
    const imageUrl = bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.smallThumbnail : false;
    const publishedDate = bookData.volumeInfo.publishedDate || '';
    const pageCount = bookData.volumeInfo.pageCount || '';
    const description = bookData.volumeInfo.description || '';
    const categories = bookData.volumeInfo.categories ? bookData.volumeInfo.categories.join(', ') : '';
    const authors = bookData.volumeInfo.authors ? bookData.volumeInfo.authors.join(', ') : '';

    bookDetailsModal.find('.modal-title').text(`${title} ${subtitle}`);
    bookDetailsModal.find('img').prop('src', imageUrl ? imageUrl : defaultBookImage);
    bookDetailsModal.find('.published').text(publishedDate);
    bookDetailsModal.find('.pages').text(pageCount);
    bookDetailsModal.find('.categories').text(categories);
    bookDetailsModal.find('.authors').text(authors);
    bookDetailsModal.find('.description').text(description);

    showLoader();
    bookDetailsModal.modal('show');
  } catch (err) {
    console.error('Fetch error: ', err);
    showAlert('danger', err.message);
    showLoader();
  }
};
// Function to extract book ID from data-bookid in books.hbs
const setDataAttribute = (elem) => {
  const id = elem.getAttribute('data-bookid');
  document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};

$('#search-books-submit').on('click', (event) => {
  event.preventDefault();

  if (bookSearch.val().trim()) {
    searchBooksForm.submit();
  } else {
    showAlert('danger', 'Please enter a search term first.');
  }
});

$('#books-table').on('click', '.get-book-info', (event) => {
  //call getBookInfo function
  getBookInfo(event.currentTarget);
});

$('#book-cards-list').on('click', '.get-book-info', (event) => {
  //call getBookInfo function
  getBookInfo(event.currentTarget);
});

$('#books-table').on('click', '.remove-book', (event) => {
  //call setDataAttribute function
  setDataAttribute(event.currentTarget);
});

$('#book-cards-list').on('click', '.remove-book', (event) => {
  //call setDataAttribute function
  setDataAttribute(event.currentTarget);
});

// This event is triggered from "removeBookModal" Yes button
$('#removeBookConfirm').on('click', (event) => {
  removeBook(event.currentTarget);
  //console.log(event.currentTarget);
});
