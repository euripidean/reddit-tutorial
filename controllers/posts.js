const Post = require('../models/post');
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
      return res.status(200).render('posts-new', {currentUser: req.user});
    } catch (err) {
      console.log(err.message);
    }
  })

  // CREATE
  app.post('/posts/new', async (req, res) => {
    const errorMessage = "You must be logged in to create a post.";
    try {
      if (req.user) {
        const userId = req.user._id;
        const post = new Post(req.body);
        post.author = userId;
        await post.save();
        const user = await User.findById(userId);
        user.posts.unshift(post);
        await user.save();
        req.flash('success', 'Post created successfully!')
        return res.status(200).redirect(`/posts/${post._id}`);
      } else {
        return res.status(401).render('posts-new', { flashMessages: { error: errorMessage} }); // UNAUTHORIZED
      }
    }
    catch (err) {
      console.log(err.message);
    }
  });

  // SHOW
  app.get('/posts/:id', (req, res) => {
    const currentUser = req.user;
    Post.findById(req.params.id).populate('comments').lean()
      .then((post) => res.render('posts-show', { post, currentUser }))
      .catch((err) => {
        console.log(err.message);
      });
  });

  // SUBREDDIT
  app.get('/n/:subreddit', (req, res) => {
    const { user } = req;
    Post.find({ subreddit: req.params.subreddit }).lean()
      .then((posts) => res.render('posts-index', { posts, user }))
      .catch((err) => {
        console.log(err);
      });
  });
};

