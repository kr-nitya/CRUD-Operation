import express from "express";
import userController from "../controller/userController";
import jwt from "jsonwebtoken";

const userRoute = express.Router();

userRoute.post("/register", userController.registerUser);
userRoute.get("/login", userController.loginUser);
// userRoute.get("/profile");
// Middleware for verifying JWT token
userRoute.use("/profile", (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }
  jwt.verify(token, "random", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    next();
  });
});
userRoute.get("/profile", userController.getUserDetails);

export default userRoute;
