const express = require('express');
const router = express.Router();

const pool = require('../db');

const retrieveBookSql = `
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

// When you add sql comment to a query string like
// in the books search string below, it may result to 'OKPacket' at
// the end of the result which is equal 0 result
// The follow function is used to ignore OKPacket and instead use the
// 'RowDataPacket' to display results.

const getJson = (sqlResult) => {
  const jsonArr = [];

  const checkType = (item) => {
    if (item.constructor.name.toLowerCase() === 'array') {
      item.forEach((obj) => {
        checkType(obj);
      });
    } else if (item.constructor.name.toLowerCase() === 'rowdatapacket') {
      jsonArr.push(item);
    }
  };

  checkType(sqlResult);
  return jsonArr;
};
// Books home route (http://localhost:5000/books)
// pool.query is an async function there must use async await
router.get('/', async (req, res) => {
  // LIMIT n will display n number of records.
  const sql = `${retrieveBookSql} LIMIT 0;`;

  let err;
  const books = await pool.query(sql).catch((e) => (err = e));
  if (err) {
    res.render('books', { books: [], errorMsg: 'There was an error retrieving your books, please reload this page.' });
  } else {
    res.render('books', { books });
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

  //res.render('books', { books });
});

router.get('/searchbooks', async (req, res) => {
  // trim removes extra white spaces before or after term

  // this line is vulnerable to SQL injection attacks
  const term = req.query.booksearch; //.trim();

  // Fix the vulnerability by using the escape() method
  const s = pool.escape(`%${req.query.booksearch.trim()}%`);
  //console.log('BookSearch term is: ', s);
  //res.send('Inside the /searchbooks route');

  if (term === '') return res.render('books', { books: [], errorMsg: 'Please enter a search term.' });

  const sql = `${retrieveBookSql}
      WHERE book.author LIKE ${s} OR book.title LIKE ${s} OR book_type.type LIKE ${s} OR book_sub_type.sub_type LIKE ${s} OR book_language.language LIKE ${s} OR book_location.location LIKE ${s} ORDER BY book_type.type, book_sub_type.sub_type, book.author;
      -- Query to retrieve books by search term`;

  let err;
  const booksResult = await pool.query(sql).catch((e) => (err = e));
  const books = getJson(booksResult);

  //console.log('Books Result from the database: ', booksResult);

  if (err) {
    res.render('books', { books: [], errorMsg: 'There was an error with the search term, please try again.' });
  } else {
    // res.render('books', { books: booksResult });
    res.render('books', { books });
  }
});

router.get('/getbookinfo', (req, res) => {
  res.send('Inside the /getbookinfo route');
});

router.get('/addbook', async (req, res) => {
  //res.send('Inside the /addbooks route');
  const sql = `
    SELECT * FROM book_type;
    SELECT * FROM book_sub_type;
    SELECT * FROM book_language;
    SELECT * FROM book_location;
  `;

  let err;
  const results = await pool.query(sql).catch((e) => (err = e));

  if (err) {
    console.log('Sql error: ', err);
    res.render('books', { books: [], errorMsg: 'There was an error adding book, please try again.' });
  } else {
    const templateData = {
      types: results[0],
      subTypes: results[1],
      languages: results[2],
      locations: results[3],
    };
    res.render('addbook', templateData);
  }
});

router.post('/insertbook', async (req, res) => {
  //res.send('Inside the /insertbook route');

  const book = {
    author: req.body.author.trim(),
    title: req.body.title.trim(),
    book_type_id: req.body.type,
    book_sub_type_id: req.body.sub_type,
    book_language_id: req.body.language,
    book_location_id: req.body.location,
  };

  let err;
  // Using SET ? insert into proper location in book
  const sql = 'INSERT INTO book SET ?';
  const result = await pool.query(sql, book).catch((e) => (err = e));

  if (err) {
    console.error('Sql error: ', err);
    res.redirect('/books/addbook?:success=0');
  } else {
    res.redirect('/books/addbook?:success=1');
  }
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
