import express from "express";
import customerRoutes from "./route/customerRoutes";
import userRoute from "./route/userRoutes";
import dotenv from 'dotenv';
dotenv.config();
const app: express.Application = express();
const port: number = parseInt(process.env.PORT as string) || 3000; // Use 3000 as default if PORT is not defined
app.use(express.json()); // Use built-in express.json() middleware for JSON request bodies
app.use("/", customerRoutes);
app.use("/user",userRoute);
app.listen(port, () => {
  console.log("Server start");
});
