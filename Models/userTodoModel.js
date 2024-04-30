import mongoose from "mongoose";

const userTodo = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const userTodoModel = mongoose.model("userTodo", userTodo);

export default userTodoModel;
