require('dotenv').config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Mongo connection
const mongoDb=process.env.MONGODB;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
    "User",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true },
      email: { type: String, required: true },
      admin: { type: Boolean, required: true },
    })
);

const Blogpost = mongoose.model(
    "Blogpost",
    new Schema({
        author: { type: String, required: true },
        title: { type: String, required: true },
        email: { type: String, required: true },
        text: { type: String, required: true },
        publish: { type: Boolean, required: true },
        timestamp: { type: Date, required: true },
        _id: { type: String, required: true },
    })
);

const Comment = mongoose.model(
    "Comment", 
    new Schema({
        author: { type: String, required: true },
        comment: { type: String, required: true },
        blogId: { type: String, required: true },
        timestamp: { type: Date, required: true },
        _id: { type: String, required: true },
    })
);

module.exports = {db, User, Blogpost, Comment};