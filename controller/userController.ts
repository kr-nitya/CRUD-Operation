import userModel from "../model/userModel";
import { Request, Response } from "express";
import { encryptPassword } from "../utility/encryption";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { Multer } from "multer";
dotenv.config();
export interface ExtendedRequest extends Request {
  decodedUsername?: string;
  file?: Express.Multer.File; // Use Express.Multer.File instead of Multer.File
}
class userController {
  static registerUser(req: Request, res: Response) {
    const { name, address, phone, password, username } = req.body;
    if (!name || !address || !phone || !password || !username) {
      res.status(400).json({ error: "All Fields are required" });
      return;
    }
    const encryptedPassword = encryptPassword(password);
    userModel.registerUser(
      name,
      address,
      phone,
      encryptedPassword,
      username,
      (err: any, result: any) => {
        if (err) {
          console.error("Error in Registration:", err);
           // Check for duplicate entry error (ER_DUP_ENTRY)
           if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('username')) {
              return res.status(409).json({ error: "Username already exists" });
            } else if (err.message.includes('phone')) {
              return res.status(409).json({ error: "Phone number already exists" });
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
    userModel.loginUser(username, encryptedPassword, (err, result) => {
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
      const secretKey = process.env.SECRET_KEY || ''; 
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

    userModel.getUserDetails(decodedUsername, (err, result) => {
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

    userModel.updateUserName(decodedUsername, name, (err, result) => {
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
    userModel.updateAddress(decodedUsername, address, (err, result) => {
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
 
}

export default userController;
