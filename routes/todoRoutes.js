const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  getAllTodos,
  addTodo,
  doneTodo,
  deleteTodo,
} = require("../controllers/Todo");

router.get("/", authenticate, getAllTodos);
router.post("/add", authenticate, addTodo);

router.post("/done", doneTodo);

router.post("/delete", deleteTodo);

module.exports = router;
