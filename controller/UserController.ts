import UserModel from "../model/UserModel";
import { Request, Response } from "express";
import { encryptPassword } from "../utility/encryption";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { uploadToCloudinary } from "../utility/cloudinary";
dotenv.config();

export interface ExtendedRequest extends Request {
  decodedUsername?: string;
  file?: Express.Multer.File; 
}
class UserController {
  static registerUser(req: Request, res: Response) {
    const { name, address, phone, password, username } = req.body;
    if (!name || !address || !phone || !password || !username) {
      res.status(400).json({ error: "All Fields are required" });
      return;
    }
    const encryptedPassword = encryptPassword(password);
    UserModel.registerUser(
      name,
      address,
      phone,
      encryptedPassword,
      username,
      (err: any, result: any) => {
        if (err) {
          console.error("Error in Registration:", err);
          // Check for duplicate entry error (ER_DUP_ENTRY)
          if (err.code === "ER_DUP_ENTRY") {
            if (err.message.includes("username")) {
              return res.status(409).json({ error: "Username already exists" });
            } else if (err.message.includes("phone")) {
              return res
                .status(409)
                .json({ error: "Phone number already exists" });
            }
          }

          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        res.json({
          message: "Register successfully",
          insertedId: result.insertId,
        });
      }
    );
  }
  static loginUser(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!password || !username) {
      res.status(400).json({ error: "All Fields are required" });
      return;
    }
    const encryptedPassword = encryptPassword(password);
    UserModel.loginUser(username, encryptedPassword, (err, result) => {
      if (err) {
        console.error("Error in Login:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      if (!result) {
        res.status(401).json({ error: "Invalid username/phone or password" });
        return;
      }
      // Generate JWT token
      const secretKey = process.env.SECRET_KEY || "";
      const token = jwt.sign({ username }, secretKey, {
        expiresIn: "1h", // Set the expiration time of the token
      });
      res.json({
        message: "Login successful",
        token,
      });
    });
  }
  static getUserDetails(req: ExtendedRequest, res: Response) {
    const { decodedUsername } = req;

    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    UserModel.getUserDetails(decodedUsername, (err, result) => {
      if (err) {
        console.error("Error fetching user details:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const userDetails = {
        name: result[0].name,
        address: result[0].address,
        phone: result[0].phone,
        username: result[0].username,
      };
      res.json({ message: "User details retrieved successfully", userDetails });
    });
  }
  static updateUserName(req: ExtendedRequest, res: Response) {
    const { decodedUsername } = req;
    const { name } = req.params;

    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    UserModel.updateUserName(decodedUsername, name, (err, result) => {
      if (err) {
        console.error("Error updating user's name:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "User not found or name not updated" });
      }

      res.json({ message: "User name updated successfully" });
    });
  }
  static updateAddress(req: ExtendedRequest, res: Response) {
    const { decodedUsername } = req;
    const { address } = req.params;
    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    UserModel.updateAddress(decodedUsername, address, (err, result) => {
      if (err) {
        console.error("Error updating user's address:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "User not found or address not updated" });
      }

      res.json({ message: "address updated successfully" });
    });
  }
  static async uploadUserImage(req: ExtendedRequest, res: Response) {
    const { decodedUsername, file } = req;
  
    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  
    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }
  
    try {
      // Upload image to Cloudinary
      const result1 = await uploadToCloudinary(file.buffer);
  
      // Store image URL in the database
      UserModel.updateUserProfileImage(decodedUsername, result1.secure_url, (err, result) => {
        if (err) {
          console.error("Error updating user's profile image:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        res.json({
          message: "User image uploaded and URL stored successfully",
          url: result1.secure_url,
        });

      });
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async uploadMultipleFiles(req: ExtendedRequest, res: Response) {
    const { decodedUsername, files } = req;
  
    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }
  
    try {
      const fileUrls = await Promise.all(
        (files as Express.Multer.File[]).map(async (file: Express.Multer.File) => {
          const result = await uploadToCloudinary(file.buffer);
          return result.secure_url;
        })
      );
  
      // Store file URLs in the database
      UserModel.updateUserFileUrls(decodedUsername, fileUrls, (err, result) => {
        if (err) {
          console.error("Error updating user's file URLs:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        res.json({
          message: "Files uploaded and URLs stored successfully",
          fileUrls,
        });
      });
    } catch (error) {
      console.error("Error uploading files to Cloudinary:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default UserController;
