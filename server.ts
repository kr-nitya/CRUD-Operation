import express from "express";
import customerRoutes from "./route/customerRoutes";
import userRoute from "./route/userRoutes";
const app: express.Application = express();
const port: number = 8080;

app.use(express.json()); // Use built-in express.json() middleware for JSON request bodies
app.use("/", customerRoutes);
app.use("/user",userRoute);
app.listen(port, () => {
  console.log("Server start");
});
