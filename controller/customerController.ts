import CustomerModel from "../model/customerModel";
import { Request, Response } from "express";

class CustomerController {
  static getAllCustomers(req: Request, res: Response) {
    CustomerModel.getAllCustomers((err: any, result: any) => {
      if (err) {
        console.error("Error in fetching:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log("Result from getAllCustomers:", result);
      res.json(result);
    });
  }

  static updateCustomerAddress(req: Request, res: Response) {
    const username: string = req.params.name;
    const address: string = req.params.address;

    CustomerModel.updateCustomerAddress(
      username,
      address,
      (err: any, result: any) => {
        if (err) {
          console.error("Error updating address:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        if (result.affectedRows === 0) {
          res.status(404).json({ error: "Name not found" });
          return;
        } else {
          res.json({ message: "Address updated successfully" });
        }
      }
    );
  }

  static deleteCustomer(req: Request, res: Response) {
    const username: string = req.params.name;

    CustomerModel.deleteCustomer(username, (err: any, result: any) => {
      if (err) throw err;

      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Name not found" });
        return;
      } else {
        const deletedRows: string = result.affectedRows.toString();
        res.json({ message: `Deleted ${deletedRows} row(s) successfully` });
      }
    });
  }

  static insertCustomer(req: Request, res: Response) {
    const { name, address } = req.body;

    if (!name || !address) {
      res.status(400).json({ error: "Name and address are required" });
      return;
    }

    CustomerModel.insertCustomer(name, address, (err: any, result: any) => {
      if (err) {
        console.error("Error inserting row:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({
        message: "Row inserted successfully",
        insertedId: result.insertId,
      });
    });
  }
}

export default CustomerController;
