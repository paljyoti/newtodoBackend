import jwt from "jsonwebtoken";
import userModel from "../Models/usermodel.js";


const protectedRoute = async (req, res, next) => {
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
            }
    
            req.user = user;
    
            return next();
          }
        }
    
        res.status(401).json({ error: "Unauthorized user please login first" });
      } catch (error) {
        return res.status(401).json({ status: false, message: " Invalid Auth" });
      }
}


export { protectedRoute }