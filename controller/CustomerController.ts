// import CustomerModel from "../model/CustomerModel";
// import { Request, Response } from "express";

// class CustomerController {
//   static getAllCustomers(req: Request, res: Response) {
//     CustomerModel.getAllCustomers((err: any, result: any) => {
//       if (err) {
//         console.error("Error in fetching:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//         return;
//       }
//       console.log("Result from getAllCustomers:", result);
//       res.json(result);
//     });
//   }

//   static updateCustomerAddress(req: Request, res: Response) {
//     const username: string = req.params.name;
//     const address: string = req.params.address;

//     CustomerModel.updateCustomerAddress(
//       username,
//       address,
//       (err: any, result: any) => {
//         if (err) {
//           console.error("Error updating address:", err);
//           res.status(500).json({ error: "Internal Server Error" });
//           return;
//         }

//         if (result.affectedRows === 0) {
//           res.status(404).json({ error: "Name not found" });
//           return;
//         } else {
//           res.json({ message: "Address updated successfully" });
//         }
//       }
//     );
//   }

//   static deleteCustomer(req: Request, res: Response) {
//     const username: string = req.params.name;

//     CustomerModel.deleteCustomer(username, (err: any, result: any) => {
//       if (err) throw err;

//       if (result.affectedRows === 0) {
//         res.status(404).json({ error: "Name not found" });
//         return;
//       } else {
//         const deletedRows: string = result.affectedRows.toString();
//         res.json({ message: `Deleted ${deletedRows} row(s) successfully` });
//       }
//     });
//   }

//   static insertCustomer(req: Request, res: Response) {
//     const { name, address } = req.body;

//     if (!name || !address) {
//       res.status(400).json({ error: "Name and address are required" });
//       return;
//     }

//     CustomerModel.insertCustomer(name, address, (err: any, result: any) => {
//       if (err) {
//         console.error("Error inserting row:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//         return;
//       }

//       res.json({
//         message: "Row inserted successfully",
//         insertedId: result.insertId,
//       });
//     });
//   }
// }

// export default CustomerController;
import { Request, Response } from "express";
import Customer from "../model/CustomerModel";
import { Op } from "sequelize";

export interface ExtendedRequest extends Request {
  decodedUsername?: string;
}

class CustomerController {
  static async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (error) {
      console.error("Error in fetching customers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateCustomerAddress(req: Request, res: Response) {
    const { name } = req.params;
    const { address } = req.body;
    try {
      const [_, updatedCustomer] = await Customer.update(
        { address },
        {
          where: {
            [Op.or]: [{ name }, { address }],
          },
          returning: true,
        }
      );

      if (!updatedCustomer || updatedCustomer.length === 0) {
        return res
          .status(404)
          .json({ error: "Customer not found or address not updated" });
      }

      res.json({ message: "Customer address updated successfully" });
    } catch (error) {
      console.error("Error updating customer's address:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteCustomer(req: Request, res: Response) {
    const { name } = req.params;

    try {
      const deletedRows = await Customer.destroy({
        where: {
          [Op.or]: [{ name }],
        },
      });

      if (deletedRows === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }

      res.json({
        message: `Deleted ${deletedRows} customer(s) successfully`,
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async insertCustomer(req: Request, res: Response) {
    const { name, address } = req.body;

    if (!name || !address) {
      res.status(400).json({ error: "Name and address are required" });
      return;
    }

    try {
      const customer = await Customer.create({ name, address });
      res.json({
        message: "Customer inserted successfully",
        insertedId: customer.getDataValue("id"),
      });
    } catch (error) {
      console.error("Error inserting customer:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default CustomerController;
