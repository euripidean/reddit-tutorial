const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = (app) => {
 // CREATE Comment
 app.post("/posts/:postId/comments", async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        const post = await Post.findById(req.params.postId);
        post.comments.unshift(comment);
        await post.save();
        return res.redirect(`/`);
    }
    catch (err) {
        console.log(err.message);
    }
});
};
