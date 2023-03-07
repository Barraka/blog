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
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      admin: { type: Boolean, required: true },
    })
  );

module.exports = {db, User};