const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {
 // CREATE Comment
 app.post("/posts/:postId/comments", async (req, res) => {
    const errorMessage = "You must be logged in to comment";
    const successMessage = "Comment successfully created";
    try {
        if (req.user) {
            const comment = new Comment(req.body);
            const post = await Post.findById(req.params.postId);
            comment.author = req.user._id;
            comment.post = post._id;
            await comment.save();
            
            post.comments.unshift(comment);
            await post.save();

            const user = await User.findById(req.user._id);
            user.comments.unshift(comment);

            await user.save();
            
            req.flash('success', successMessage);
        return res.redirect(`/posts/${post._id}`);
        } else {
            req.flash('error', errorMessage);
            return res.status(401).redirect(req.get('referer'));
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
};
