const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testBookId; // To store the book id for further tests

  suite('POST /api/books => create book object/expect book object', function() {

    test('Test POST /api/books with title', function(done) {
      chai.request(server).post('/api/books').send({title: 'Test Book'}).end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.title, 'Test Book');
        assert.property(res.body, '_id');
        testBookId = res.body._id; // Store _id for further tests
        done();
      });
    });

    test('Test POST /api/books with no title given', function(done) {
      chai.request(server).post('/api/books').send({}).end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'missing required field title');
        done();
      });
    });

  });

  suite('GET /api/books => array of books', function() {

    test('Test GET /api/books', function(done) {
      chai.request(server).get('/api/books').end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        if (res.body.length > 0) {
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], 'commentcount');
        }
        done();
      });
    });

  });

  suite('GET /api/books/[id] => book object with [id]', function() {

    test('Test GET /api/books/[id] with id not in db', function(done) {
      chai.request(server).get('/api/books/invalidid123456').end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'no book exists');
        done();
      });
    });

    test('Test GET /api/books/[id] with valid id in db', function(done) {
      chai.request(server).get('/api/books/' + testBookId).end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.property(res.body, 'comments');
        assert.isArray(res.body.comments, 'comments should be an array');
        done();
      });
    });

  });

  suite('POST /api/books/[id] => add comment/expect book object with id', function() {

    test('Test POST /api/books/[id] with comment', function(done) {
      chai.request(server).
          post('/api/books/' + testBookId).
          send({comment: 'This is a test comment'}).
          end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.include(res.body.comments, 'This is a test comment');
            done();
          });
    });

    test('Test POST /api/books/[id] without comment field', function(done) {
      chai.request(server).post('/api/books/' + testBookId).send({}).end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'missing required field comment');
        done();
      });
    });

    test('Test POST /api/books/[id] with comment, id not in db', function(done) {
      chai.request(server).
          post('/api/books/invalidid123456').
          send({comment: 'This should fail'}).
          end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
    });

  });

  suite('DELETE /api/books/[id] => delete book object id', function() {

    test('Test DELETE /api/books/[id] with valid id in db', function(done) {
      chai.request(server).delete('/api/books/' + testBookId).end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'delete successful');
        done();
      });
    });

    test('Test DELETE /api/books/[id] with id not in db', function(done) {
      chai.request(server).delete('/api/books/invalidid123456').end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'no book exists');
        done();
      });
    });

  });

  suite('DELETE /api/books => delete all books', function() {

    test('Test DELETE /api/books', function(done) {
      chai.request(server).delete('/api/books').end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'complete delete successful');
        done();
      });
    });

  });

});
