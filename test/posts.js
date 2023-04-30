// test/posts.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('../server');
chai.use(chaiHttp);
const agent = chai.request.agent(app);

// Import the Post model from our models folder so we
// we can use it in our tests.
const Post = require('../models/post');
// Import User model to create users for post testing
const User = require('../models/user');

const should = chai.should();

describe('Posts', function () {
  // Post that we'll use for testing purposes
  const newPost = {
    title: 'post title',
    url: 'https://www.google.com',
    summary: 'post summary',
    subreddit: 'test1, test2',
  };
  // User that we'll use for testing purposes
  const user = {
    username: 'poststest',
    password: 'testposts',
  };
  before(function (done) {
    agent
      .post('/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(user)
      .then(function () {
        done();})
      .catch(function (err) {
        done(err);
      });
  });


  it('Should create with valid attributes at POST /posts/new', function(done) {
    // Checks how many posts there are now
    Post.estimatedDocumentCount()
      .then(function (initialDocCount) {
        agent
          .post('/posts/new')
          // This line fakes a form post,
          // since we're not actually filling out a form
          .set('content-type', 'application/x-www-form-urlencoded')
          // Make a request to create another
          .send(newPost)
          .then(function (res) {
            Post.estimatedDocumentCount()
              .then(function (newDocCount) {
                // Check that the database has status 200
                res.should.have.status(200);
                // Check that the database has one more post in it
                newDocCount.should.equal(initialDocCount + 1)
                done();
              })
              .catch(function (err) {
                done(err);
              });
          })
          .catch(function (err) {
            done(err);
          });
      })
      .catch(function (err) {
          done(err);
      });
  });
  after(function (done) {
    Post.findOneAndDelete(newPost)
    .then(function () {
      agent.close();
  
      User
        .findOneAndDelete({
          username: user.username,
        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });
    })
    .catch(function (err) {
      done(err);
    });
  });
});
