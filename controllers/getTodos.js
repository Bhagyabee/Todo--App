const fs = require("fs");
// const todosFile = require("../todoFile");
const Todo = require("../models/todo");

const getTodos = async () => {
  try {
    const todos = await Todo.find();
    return todos;
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = getTodos;
