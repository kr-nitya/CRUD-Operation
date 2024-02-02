import { Request, Response } from "express";
import { encryptPassword } from "../utility/encryption";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utility/cloudinary";
import User from "../model/UserModel";
import { Op } from "sequelize";

export interface ExtendedRequest extends Request {
  decodedUsername?: string;
  file?: Express.Multer.File;
}

class UserController {
  static async registerUser(req: Request, res: Response) {
    const { name, address, phone, password, username } = req.body;

    if (!name || !address || !phone || !password || !username) {
      res.status(400).json({ error: "All Fields are required" });
      return;
    }

    const encryptedPassword = encryptPassword(password);

    try {
      const user = await User.create({
        name,
        address,
        phone,
        password: encryptedPassword,
        username,
      });

      res.json({
        message: "Register successfully",
        
      });
    } catch (error:any) {
      console.error("Error in Registration:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        if (error.fields.includes("username")) {
          return res.status(409).json({ error: "Username already exists" });
        } else if (error.fields.includes("phone")) {
          return res.status(409).json({ error: "Phone number already exists" });
        }
      }

      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async loginUser(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!password || !username) {
      res.status(400).json({ error: "All Fields are required" });
      return;
    }

    const encryptedPassword = encryptPassword(password);

    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { phone: username }],
        },
      });

      if (!user || user.getDataValue("password") !== encryptedPassword) {
        res.status(401).json({ error: "Invalid username/phone or password" });
        return;
      }

      const secretKey = process.env.SECRET_KEY || "";
      const token = jwt.sign({ username }, secretKey, {
        expiresIn: "1h",
      });

      res.json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error("Error in Login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getUserDetails(req: ExtendedRequest, res: Response) {
    const { decodedUsername } = req;

    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    try {
      const user = await User.findOne({
        where: { username: decodedUsername },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userDetails = {
        name: user.getDataValue("name"),
        address: user.getDataValue("address"),
        phone: user.getDataValue("phone"),
        username: user.getDataValue("username"),
      };

      res.json({ message: "User details retrieved successfully", userDetails });
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateUserName(req: ExtendedRequest, res: Response) {
    const { decodedUsername } = req;
    const { name } = req.params;

    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    try {
      const [_, updatedUser] = await User.update(
        { name },
        {
          where: {
            [Op.or]: [{ username: decodedUsername }, { phone: decodedUsername }],
          },
          returning: true,
        }
      );

      if (!updatedUser || updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found or name not updated" });
      }

      res.json({ message: "User name updated successfully" });
    } catch (error) {
      console.error("Error updating user's name:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateAddress(req: ExtendedRequest, res: Response) {
    const { decodedUsername } = req;
    const { address } = req.params;

    if (!decodedUsername) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    try {
      const [_, updatedUser] = await User.update(
        { address },
        {
          where: {
            [Op.or]: [{ username: decodedUsername }, { phone: decodedUsername }],
          },
          returning: true,
        }
      );

      if (!updatedUser || updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found or address not updated" });
      }

      res.json({ message: "Address updated successfully" });
    } catch (error) {
      console.error("Error updating user's address:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
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
      const result = await uploadToCloudinary(file.buffer);

      // Store image URL in the database
      const [_, updatedUser] = await User.update(
        { imageUrl: result.secure_url },
        {
          where: {
            [Op.or]: [{ username: decodedUsername }, { phone: decodedUsername }],
          },
          returning: true,
        }
      );

      if (!updatedUser || updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found or image URL not updated" });
      }

      res.json({
        message: "User image uploaded and URL stored successfully",
        url: result.secure_url,
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
      const [_, updatedUser] = await User.update(
        { fileUrls },
        {
          where: {
            [Op.or]: [{ username: decodedUsername }, { phone: decodedUsername }],
          },
          returning: true,
        }
      );
  
      if (!updatedUser || updatedUser.length === 0) {
        return res.status(404).json({ error: "User not found or file URLs not updated" });
      }
  
      res.json({
        message: "Files uploaded and URLs stored successfully",
        fileUrls,
      });
    } catch (error) {
      console.error("Error uploading files to Cloudinary:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default UserController;
