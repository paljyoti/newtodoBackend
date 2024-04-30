import express from "express";
const router = express.Router();
import {
  changeStatus,
  createTodo,
  deleteTodo,
  getTodo,
  searchTodo,
  updateTodo,
} from "../Controllers/todocontroller.js";
import { protectedRoute } from "../Middlewares/protectedRoute.js";

router.post("/createTodo", protectedRoute, createTodo);
router.get("/getTodo", protectedRoute, getTodo);
router.delete("/deleteTodo/:id", protectedRoute, deleteTodo);
router.put("/updateTodo", protectedRoute, updateTodo);
router.patch("/changestatus/:id", protectedRoute, changeStatus);
router.get("/searchTodo", protectedRoute, searchTodo);

export default router;
