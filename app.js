const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('express-handlebars');
const hbsHelpers = require('./views/helpers');
//const favicon = require('serve-favicon');

// This was use to create and run the database for the first time
// It is no longer needer here since the database is created already
// Moved to books.js

// const pool = require('./db');

const app = express();

const PORT = process.env.PORT || 5000; // HEROKU supports this for hosting
// app.get('/', (req, res) => {
//   res.render('helloworld');
// });

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Setup express routes
const mainRoutes = require('./routes');
const booksRoutes = require('./routes/books');
const musicRoutes = require('./routes/music');
const moviesRoutes = require('./routes/movies');
const comicsRoutes = require('./routes/comics');

app.use(mainRoutes);
app.use('/books', booksRoutes);
app.use('/music', musicRoutes);
app.use('/movies', moviesRoutes);
app.use('/comics', comicsRoutes);

//makes it possible to access library bundles
app.use('/static', express.static('public'));

// Middleware for favicon image
//app.use(favicon(path.resolve(__dirname, 'public', 'library-logo.png')));

/*
// This routed is needed to run once to create and initially populate DB
app.get('/createandseedtables', async (req, res) => {
  const sql = `
            CREATE DATABASE IF NOT EXISTS library;

            USE library;

            CREATE TABLE IF NOT EXISTS book_type(id INT AUTO_INCREMENT, type VARCHAR(255), PRIMARY KEY(id));
            CREATE TABLE IF NOT EXISTS book_sub_type(id INT AUTO_INCREMENT, sub_type VARCHAR(255), PRIMARY KEY(id));
            CREATE TABLE IF NOT EXISTS book_language(id INT AUTO_INCREMENT, language VARCHAR(255), PRIMARY KEY(id));
            CREATE TABLE IF NOT EXISTS book_location(id INT AUTO_INCREMENT, location VARCHAR(255), PRIMARY KEY(id));

            CREATE TABLE IF NOT EXISTS book(
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                author VARCHAR(255),
                title VARCHAR(255),
                book_type_id INT NOT NULL,
                book_sub_type_id INT,
                book_language_id INT NOT NULL,
                book_location_id INT NOT NULL,
                FOREIGN KEY(book_type_id) REFERENCES book_type(id),
                FOREIGN KEY(book_sub_type_id) REFERENCES book_sub_type(id),
                FOREIGN KEY(book_language_id) REFERENCES book_language(id),
                FOREIGN KEY(book_location_id) REFERENCES book_location(id)
            );

            INSERT INTO book_type (id, type)
            VALUES
            (DEFAULT, 'Architecture'),
            (DEFAULT, 'Art'),
            (DEFAULT, 'Biology'),
            (DEFAULT, 'Cinema'),
            (DEFAULT, 'Communication'),
            (DEFAULT, 'Cultural Studies'),
            (DEFAULT, 'Engineering'),
            (DEFAULT, 'Fiction'),
            (DEFAULT, 'Food'),
            (DEFAULT, 'Games'),
            (DEFAULT, 'Geography'),
            (DEFAULT, 'History'),
            (DEFAULT, 'Humor'),
            (DEFAULT, 'Literature'),
            (DEFAULT, 'Management'),
            (DEFAULT, 'Music'),
            (DEFAULT, 'Pets'),
            (DEFAULT, 'Philosophy'),
            (DEFAULT, 'Photography'),
            (DEFAULT, 'Politics'),
            (DEFAULT, 'Psychology'),
            (DEFAULT, 'Reference'),
            (DEFAULT, 'Religion'),
            (DEFAULT, 'Science'),
            (DEFAULT, 'Travel'),
            (DEFAULT, 'True Crime');
             
            INSERT INTO book_sub_type (id, sub_type)
            VALUES
            (DEFAULT, 'American'),
            (DEFAULT, 'American Revolution'),
            (DEFAULT, 'Ancient'),
            (DEFAULT, 'Antarctica'),
            (DEFAULT, 'Asia'),
            (DEFAULT, 'Biology'),
            (DEFAULT, 'Bridge'),
            (DEFAULT, 'Buddhism'),
            (DEFAULT, 'Business'),
            (DEFAULT, 'Cats'),
            (DEFAULT, 'Chess'),
            (DEFAULT, 'Christian'),
            (DEFAULT, 'Civil'),
            (DEFAULT, 'Civil War'),
            (DEFAULT, 'Construction'),
            (DEFAULT, 'Cookbook'),
            (DEFAULT, 'Dictionary'),
            (DEFAULT, 'Dogs'),
            (DEFAULT, 'Economics'),
            (DEFAULT, 'Europe'),
            (DEFAULT, 'Finance'),
            (DEFAULT, 'Football'),
            (DEFAULT, 'Health'),
            (DEFAULT, 'Hinduism'),
            (DEFAULT, 'History'),
            (DEFAULT, 'Horses'),
            (DEFAULT, 'Landscape'),
            (DEFAULT, 'Language'),
            (DEFAULT, 'Law'),
            (DEFAULT, 'Mathematics'),
            (DEFAULT, 'Mechanical/Electrical'),
            (DEFAULT, 'Middle East'),
            (DEFAULT, 'Military'),
            (DEFAULT, 'Modern'),
            (DEFAULT, 'Mystery'),
            (DEFAULT, 'Mythology'),
            (DEFAULT, 'Oceania'),
            (DEFAULT, 'Opera'),
            (DEFAULT, 'Philosophy'),
            (DEFAULT, 'Physics'),
            (DEFAULT, 'Reference'),
            (DEFAULT, 'Russia'),
            (DEFAULT, 'South America'),
            (DEFAULT, 'Safety'),
            (DEFAULT, 'Veterinary'),
            (DEFAULT, 'Vietnam'),
            (DEFAULT, 'Western'),
            (DEFAULT, 'Wine'),
            (DEFAULT, 'W.W.I'),
            (DEFAULT, 'W.W.II');
            
            INSERT INTO book_language (id, language)
            VALUES
            (DEFAULT, 'English'),
            (DEFAULT, 'French'),
            (DEFAULT, 'German'),
            (DEFAULT, 'Italian'),
            (DEFAULT, 'Spanish');

            INSERT INTO book_location (id, location)
            VALUES
            (DEFAULT, 'Bonus Room'),
            (DEFAULT, 'Den'),
            (DEFAULT, 'Dinning Room'),
            (DEFAULT, 'Family Room'),
            (DEFAULT, 'Garage'),
            (DEFAULT, 'Kitchen'),
            (DEFAULT, 'Living Room'),
            (DEFAULT, 'Master Bedroom'),
            (DEFAULT, 'Office'),
            (DEFAULT, 'Storage');
            
            INSERT INTO book (id, author, title, book_type_id, book_sub_type_id, book_language_id, book_location_id)
            VALUES
            (DEFAULT, 'MORGAN, Gwyn', '69 A. D. -  The Year of Four Emperors', 12, 5, 1, 6),
            (DEFAULT, 'MANN, Charles', '1491 -  New Revelations of the America before Columbus', 12, 3, 1, 6);
        `;

  let err;
  const result = await pool.query(sql).catch((e) => (err = e));
  if (err) {
    console.error('Sql error:', err);
    res.send('Sql error: ' + err);
  }
  res.send('Tables successfully created and seeded...');
});
*/

// setup handlebars template engine
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: './views/layouts',
    partialsDir: './views/includes',
    helpers: {
      if_equal: hbsHelpers.isEqualHelper,
    },
  })
);

app.set('view engine', 'hbs');

// 404 middleware
app.use((req, res, next) => {
  const err = new Error(`The requested URL ${req.originalUrl} was not found on this server.`);
  err.status = 404;
  next(err);
});

// Error handler middleware
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status).render('error', { err });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
