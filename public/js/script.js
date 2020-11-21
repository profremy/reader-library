require('../css/styles.css');
const $ = require('jquery');
import 'bootstrap/dist/js/bootstrap.bundle';

//console.log($);

// Function to remove actual book
const removeBook = async (elem) => {
  const id = elem.getAttribute('data-bookid');

  try {
    const result = await fetch(`/books/deletebook/${id}`, { method: 'DELETE' });
    const jsonResponse = await result.json();
    console.log(jsonResponse.msg);
    $('#removeBookModal').modal('hide');
  } catch (err) {
    console.error('Fetch error: ', err);
  }
};

// Function to extract book ID from data-bookid in books.hbs
const setDataAttribute = (elem) => {
  const id = elem.getAttribute('data-bookid');
  document.getElementById('removeBookConfirm').setAttribute('data-bookid', id);
};
$('#books-table').on('click', '.remove-book', (event) => {
  console.log(event.currentTarget);
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
