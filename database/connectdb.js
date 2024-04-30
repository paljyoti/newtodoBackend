import mongoose, { Mongoose } from "mongoose";

const connect = () => {
  try {
    return mongoose.connect("mongodb+srv://jyot2999:245689@cluster0.4fcacvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/todo");
  } catch (error) {
    throw new Error(`something went wrong ${error}`);
  }
};

export default connect;
