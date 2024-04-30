import userModel from "../Models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register
const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; //object destructing

    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide name" });
    }

    const exist = await userModel.findOne({ email: email });

    if (exist) {
      return res
        .status(422)
        .json({ status: false, message: "user exist please login" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hash,
    });

    const response = await newUser.save();
    return res.status(201).json({
      status: true,
      message: "successfully registered",
      response: response,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "internal server error", error: error });
  }
};

// login

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ status: false, message: " provide all the required fields" });
    }

    const exist = await userModel.findOne({ email: email });

    if (!exist) {
      return res
        .status(404)
        .json({ status: false, message: "user not exist please register " });
    }

    const checkPassword = bcrypt.compareSync(password, exist.password);

    if (exist.email === email && checkPassword) {
      const token = jwt.sign({ id: exist._id }, "todoApp", {
        expiresIn: 86400,
      });
      res.cookie("token", token, { maxAge: 9000000, httpOnly: true, secure: true });
      return res
        .status(201)
        .json({ status: true, message: " Login successfully" });
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid Auth. Email or password is incorrect",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "internal server error", error: error });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the token by setting an expired cookie
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.status(201).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to logout", err: error });
  }
};

export { RegisterUser, LoginUser, logout };
