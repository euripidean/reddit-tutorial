const Post = require('../models/post');

module.exports = (app) => {

  // INDEX
  app.get('/', async (req, res) => {
    try {
      const posts = await Post.find({}).lean();
      return res.render('posts-index', { posts });
    } catch (err) {
      console.log(err.message);
    }
  })

  // NEW
  app.get('/posts/new', async (req, res) => {
    try {
      return res.render('posts-new');
    } catch (err) {
      console.log(err.message);
    }
  })

  // CREATE
  app.post('/posts/new', async (req, res) => {
    try {
      const post = new Post(req.body);
      await post.save();
      return res.redirect(`/`);
    }
    catch (err) {
      console.log(err.message);
    }
  });

  // SHOW
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).lean().populate('comments');
      return res.render('posts-show', { post });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SUBREDDIT
  app.get('/n/:subreddit', async (req, res) => {
    try {
      const posts = await Post.find({ subreddit: req.params.subreddit }).lean();
      return res.render('posts-index', { posts });
    } catch (err) {
      console.log(err.message);
    }
  });
};

