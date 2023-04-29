const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = (app) => {

  // INDEX
  app.get('/', async (req, res) => {
    const currentUser = req.user;
    const successMessage = req.flash('successMessage');
    const showMessage = req.query.success;
    try {
      const posts = await Post.find({}).lean().populate({path: 'author', select: 'username'});
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
        const userId = req.user._id;
        const post = new Post(req.body);
        post.author = userId;
        await post.save();
        const user = await User.findById(userId);
        user.posts.unshift(post);
        await user.save();
        return res.redirect(`/posts/${post._id}`);
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
      const post = await Post.findById(req.params.id).lean().populate('comments').populate('author').populate({path: 'comments', populate: {path: 'author', select: 'username'}});
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

