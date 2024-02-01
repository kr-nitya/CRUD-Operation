import express from "express";
import userController from "../controller/userController";
import { verifyToken } from "../middleware/authMiddleware";
import multer from 'multer';
const userRoute = express.Router();
userRoute.post("/register", userController.registerUser);
userRoute.get("/login", userController.loginUser);
// Middleware for verifying JWT token
userRoute.use(verifyToken);
userRoute.get("/profile", userController.getUserDetails);
userRoute.put("/profile/update/name/:name", userController.updateUserName);
userRoute.put("/profile/update/address/:address", userController.updateAddress);
export default userRoute;
