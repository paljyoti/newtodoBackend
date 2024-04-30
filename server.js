import express from "express";
import connect from "./database/connectdb.js";
import userRoute from "./Routers/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import todoRoute from "./Routers/todoRoutes.js";
import jwt from "jsonwebtoken";
import userModel from "./Models/usermodel.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use("/api", userRoute);
app.use("/api", todoRoute);


app.get("/checkAuth", async (req, res) => {
  try {
    if (req.cookies.token) {
      const { token } = req.cookies;

      const verifyToken = await jwt.verify(token, "todoApp");

      if (verifyToken) {

        const user = await userModel.findOne({_id: verifyToken.id}); 

        if (!user) {
          return res
            .status(401)
            .json({ status: false, message: "Invalid Auth: User not found" });
        } else {
          return res.status(201).json({status: true, message: "user is logged in"})
        }
      }
    }

    res.status(401).json({ error: "Unauthorized user please login first" });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ status: false, message: " Invalid Auth" });
  }
})

connect()
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log("server is  running on 5000");
});
