import userModel from "../model/userModel";
import { Request, Response } from "express";
import { encryptPassword } from "../encryption";
import jwt from "jsonwebtoken";

interface ExtendedRequest extends Request {
  decoded?: { username?: string };
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
      const token = jwt.sign({ username }, "random", {
        expiresIn: "1h", // Set the expiration time of the token
      });
      res.json({
        message: "Login successful",
        token,
      });
    });
  }

  static getUserDetails(req: ExtendedRequest, res: Response) {
    const { username } = req.decoded || {};

    if (!username) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    userModel.getUserDetails(username, (err, result) => {
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
        // Add more details as needed
      };

      res.json({ message: "User details retrieved successfully", userDetails });
    });
  }
}

export default userController;
