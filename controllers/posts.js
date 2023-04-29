const Post = require('../models/post');

module.exports = (app) => {

  // INDEX
  app.get('/', async (req, res) => {
    const currentUser = req.user;
    const successMessage = req.flash('successMessage');
    const showMessage = req.query.success;
    try {
      const posts = await Post.find({}).lean();
      return res.render('posts-index', { posts, successMessage, showMessage, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  })

  // NEW
  app.get('/posts/new', async (req, res) => {
    try {
      return res.render('posts-new', {currentUser: req.user});
    } catch (err) {
      console.log(err.message);
    }
  })

  // CREATE
  app.post('/posts/new', async (req, res) => {
    const errorMessage = req.flash('errorMessage', 'You must be logged in to create a post.');
    try {
      if (req.user) {
        const post = new Post(req.body);
        await post.save();
        return res.redirect(`/`, {currentUser: req.user});
      } else {
        return res.status(401).render('/posts/new', { errorMessage }); // UNAUTHORIZED
      }
    }
    catch (err) {
      console.log(err.message);
    }
  });

  // SHOW
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).lean().populate('comments');
      return res.render('posts-show', { post, currentUser: req.user });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SUBREDDIT
  app.get('/n/:subreddit', async (req, res) => {
    try {
      const posts = await Post.find({ subreddit: req.params.subreddit }).lean();
      return res.render('posts-index', { posts, currentUser: req.user });
    } catch (err) {
      console.log(err.message);
    }
  });
};

