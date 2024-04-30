import { response } from "express";
import userTodoModel from "../Models/userTodoModel.js";

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field properly",
      });
    }

    const newtoDo = new userTodoModel({
      userId: req.user._id,
      title: title,
      description: description,
      status: false,
    });

    const response = await newtoDo.save();

    if (response) {
      return res
        .status(201)
        .json({ status: true, message: "To do Created", data: response });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", err: error });
  }
};

const getTodo = async (req, res) => {
  try {
    const data = await userTodoModel
      .find({ userId: req.user._id })
      .populate("userId");

    if (data.length < 0) {
      return res
        .status(404)
        .json({ status: false, message: "Empty Todo List" });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully fetch to do list",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", err: error });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide id to delete" });
    }

    const deleteResponse = await userTodoModel.deleteOne({ _id: id });

    if (deleteResponse.acknowledged === true) {
      return res.status(200).json({ status: false, message: "To do Delete" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", err: error });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, description } = req.body;

    if (!id) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide id to update" });
    }

    if (!title || !description) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field properly",
      });
    }

    const exitUser = await userTodoModel.updateOne(
      { _id: id },
      { $set: { title: title, description: description } }
    );

    if (exitUser.acknowledged === true) {
      return res.status(201).json({
        status: false,
        message: "to do successfully updated",
        data: response,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", err: error });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res
        .status(422)
        .json({ status: false, mesage: "Please provide id to change status" });
    }

    if (status === undefined || status === null) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide status" });
    }

    const changeUpdate = await userTodoModel.updateOne(
      { _id: id },
      { $set: { status: status } }
    );

    if (changeUpdate.acknowledged) {
      return res.status(201).json({ status: true, message: "Status changed" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
  }
};

const searchTodo = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide valid keyword" });
    }

    const data = await userTodoModel.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: keyword, $options: "i" } }, // 'i' option for case-insensitive matching
        { description: { $regex: keyword, $options: "i" } }, // 'i' option for case-insensitive matching
      ],
    });

    if (data.length < 0) {
      return res.status(404).json({ status: false, message: "No to do found" });
    }

    return res.status(200).json({
      status: true,
      message: "successfully fetch search data",
      data: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error: error });
  }
};

export {
  createTodo,
  getTodo,
  deleteTodo,
  updateTodo,
  changeStatus,
  searchTodo,
};
