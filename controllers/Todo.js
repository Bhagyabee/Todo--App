const getTodos = require("./getTodos");
const fs = require("fs");
const todosFile = require("../todoFile");
const Todo = require("../models/todo");
const User = require("../models/User");

const getAllTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const todos = await Todo.find({ userId });
    todos.sort((a, b) => a.completed - b.completed);
    const _id = userId;
    const user = await User.findOne({ _id });

    console.log("User in todo/", req.user, user);
    res.render("index", { todos, user });
  } catch (error) {
    res.status(500).json({ error: "Error geting all todos" });
  }
};

const addTodo = async (req, res) => {
  try {
    const { newTodo } = req.body;
    const userId = req.user.userId;
    if (newTodo.trim()) {
      const todo = new Todo({
        text: newTodo,
        completed: false,
        userId: userId,
      });

      await todo.save();
      console.log(todo);
      console.log("added todo");
      console.log(req.user);
      res.redirect("/api/todo");
    } else {
      res.status(400).json({ error: "Todo cannot be empty" });
    }
  } catch (error) {
    console.log("error adding a todo");
    res.status(500).json({ error: "Error adding a Todo" });
  }
};

const doneTodo = async (req, res) => {
  try {
    const { id } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        $set: { completed: true },
      },
      {
        new: true,
      }
    );

    if (!todo) {
      return res.status(404).json({ error: "todo not found" });
    }
    res.redirect("/api/todo");
  } catch (error) {
    res.status(500).json({ error: "Error in marking done a Todo" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.body;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ error: "todo not found" });
    }
    console.log("Todo deleted:", todo);
    res.redirect("/api/todo");
  } catch (error) {
    res.status(500).json({ error: "Error in deleting a Todo" });
  }
};

module.exports = {
  getAllTodos,
  addTodo,
  doneTodo,
  deleteTodo,
};
