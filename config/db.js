const mongoose = require("mongoose");

const uri =
  "mongodb+srv://bhagyabeeb:j9jVKIZWMd5WYgKp@cluster0.dl8w4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = () => {
  return mongoose
    .connect(uri)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log("error connecting to db");
    });
};

module.exports = connectDb;
