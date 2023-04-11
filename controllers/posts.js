const Post = require('../models/post');

module.exports = (app) => {
    // CREATE
    app.post('/posts/new', (req, res) => {
      const post = new Post(req.body);
      post.save()
        .then(() => {
          res.redirect('/')
        })
        .catch(err => console.log(err))
    });
  };
