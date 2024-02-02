import express from "express";
import CustomerController from "../controller/CustomerController";

const customerRoutes = express.Router();

customerRoutes.get("/read", CustomerController.getAllCustomers);
customerRoutes.put("/update/:name/:address", CustomerController.updateCustomerAddress);
customerRoutes.delete("/delete/:name", CustomerController.deleteCustomer);
customerRoutes.post("/insert", CustomerController.insertCustomer);

export default customerRoutes;
