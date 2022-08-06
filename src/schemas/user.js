const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    userTimeZone: String, 
});

module.exports = model("User", userSchema, "users");