const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {
 // CREATE Comment
 app.post("/posts/:postId/comments", async (req, res) => {
    const errorMessage = req.flash('errorMessage', 'You must be logged in to comment.');
    try {
        if (req.user) {

        const comment = new Comment(req.body);
        comment.author = req.user._id;
        await comment.save();
        const post = await Post.findById(req.params.postId);
        post.comments.unshift(comment);
        await post.save();
        const user = await User.findById(req.user._id);
        user.comments.unshift(comment);
        await user.save();
        return res.redirect(`/posts/${post._id}`);
        } else {
            return res.status(401).render(`/posts/${post._id}`, { errorMessage }); // UNAUTHORIZED
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
};
