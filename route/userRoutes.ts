import express from "express";
import UserController from "../controller/UserController";
import { verifyToken } from "../middleware/authMiddleware";
import multer from "multer";
// Set up multer storage for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const userRoute = express.Router();
userRoute.post("/register", UserController.registerUser);
userRoute.get("/login", UserController.loginUser);
// Middleware for verifying JWT token
userRoute.use(verifyToken);
userRoute.get("/profile", UserController.getUserDetails);
userRoute.put("/profile/update/name/:name", UserController.updateUserName);
userRoute.put("/profile/update/address/:address", UserController.updateAddress);
// Upload user image
userRoute.post("/profile/upload/image", upload.single("image"), UserController.uploadUserImage);
userRoute.post("/profile/upload/files", upload.array("files", 5), UserController.uploadMultipleFiles);

export default userRoute;
