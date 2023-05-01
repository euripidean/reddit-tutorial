const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, select: false, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    // ENCRYPT PASSWORD
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      console.log(err.message);
    }
  });

userSchema.methods.comparePassword = async function(password) {
    try {
        const user = this;
        return await bcrypt.compare(password, user.password);
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = model('User', userSchema);
