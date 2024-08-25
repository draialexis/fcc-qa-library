'use strict';

const {v4: uuidv4} = require('uuid');

let books = []; // In-memory storage for books

module.exports = function(app) {

  // GET /api/books: Get an array of all books
  app.route('/api/books').get(function(req, res) {
    const response = books.map(book => ({
      _id: book._id,
      title: book.title,
      commentcount: book.comments.length,
    }));
    res.json(response);
  });

  // POST /api/books: Add a new book
  app.route('/api/books').post(function(req, res) {
    const title = req.body.title;

    if (!title) {
      return res.json('missing required field title');
    }

    const newBook = {
      _id: uuidv4(),
      title: title,
      comments: [],
    };
    books.push(newBook);

    res.json({_id: newBook._id, title: newBook.title});
  });

  // DELETE /api/books: Delete all books
  app.route('/api/books').delete(function(req, res) {
    books = []; // Clear all books
    res.json('complete delete successful');
  });

  // GET /api/books/:id: Get a specific book by _id
  app.route('/api/books/:id').get(function(req, res) {
    const bookId = req.params.id;
    const book = books.find(b => b._id === bookId);

    if (!book) {
      return res.json('no book exists');
    }

    res.json({
      _id: book._id,
      title: book.title,
      comments: book.comments,
    });
  });

  // POST /api/books/:id: Add a comment to a specific book
  app.route('/api/books/:id').post(function(req, res) {
    const bookId = req.params.id;
    const comment = req.body.comment;

    if (!comment) {
      return res.json('missing required field comment');
    }

    const book = books.find(b => b._id === bookId);

    if (!book) {
      return res.json('no book exists');
    }

    book.comments.push(comment);

    res.json({
      _id: book._id,
      title: book.title,
      comments: book.comments,
    });
  });

  // DELETE /api/books/:id: Delete a specific book by _id
  app.route('/api/books/:id').delete(function(req, res) {
    const bookId = req.params.id;
    const bookIndex = books.findIndex(b => b._id === bookId);

    if (bookIndex === -1) {
      return res.json('no book exists');
    }

    books.splice(bookIndex, 1);
    res.json('delete successful');
  });

};
