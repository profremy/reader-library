const express = require('express');
const router = express.Router();

const pool = require('../db');

// Books home route (http://localhost:5000/books)
// pool.query is an async function there must use async await
router.get('/', async (req, res) => {
  const sql = `
    SELECT
      book.id,
      book.author,
      book.title,
      book_type.type,
      book_sub_type.sub_type,
      book_location.location,
      book_language.language

    FROM book
    INNER JOIN book_type ON book.book_type_id = book_type.id
    INNER JOIN book_sub_type ON book.book_sub_type_id = book_sub_type.id
    INNER JOIN book_location ON book.book_location_id = book_location.id
    INNER JOIN book_language ON book.book_language_id = book_language.id
    `;

  let err;
  const books = await pool.query(sql).catch((e) => (err = e));
  if (err) {
    res.render('books', { books: [], errorMsg: 'There was an error retrieving your books, please reload this page.' });
  }

  /*
  const book = {
    id: 1,
    author: 'Miguel Cervantes',
    title: 'Don Quixote',
    type: 'Fiction',
    sub_type: 'Novel',
    location: 'Office',
    language: 'English',
  };
  res.render('books', { book });
  */

  res.render('books', { books });
});

router.get('/searchbooks', (req, res) => {
  res.send('Inside the /searchbooks route');
});

router.get('/getbookinfo', (req, res) => {
  res.send('Inside the /getbookinfo route');
});

router.get('/addbooks', (req, res) => {
  res.send('Inside the /addbooks route');
});

router.post('/insertbook', (req, res) => {
  res.send('Inside the /insertbook route');
});

router.get('/updatebook', (req, res) => {
  res.send('Inside the /updatebook route');
});

router.post('/updatebookbyid/:id', (req, res) => {
  res.send('Inside the /updatebookbyid route');
});

router.delete('/deletebookbyid/:id', (req, res) => {
  res.send('Inside the /updatebookbyid route');
});

module.exports = router;
