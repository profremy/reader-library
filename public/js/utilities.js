const $ = require('jquery');
const self = (module.exports = {
  alertTimeout: null,
  removeBookModal: $('#removeBookModal'),
  bookDetailsModal: $('#bookDetailsModal'),
  searchBooksForm: $('#search-books-form'),
  bookSearch: $('#book-search'),
  defaultBookImage: '/static/img/bookcover.jpg',
  showLoader: () => {
    document.getElementById('loadingSpinner').classList.toggle('show');
  },
  showAlert: (type, msg, callback) => {
    const alertStr = `
      <div class="alert alert-${type} fade show" role="alert">
        ${msg}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
    $('body').prepend(alertStr);
    self.removeAlert(callback);
  },
  removeAlert: (callback) => {
    self.alertTimeout = setTimeout(() => {
      $('.alert').alert('close');
      if (callback) callback();
    }, 4000);
  },
});
