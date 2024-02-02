import { DataTypes} from "sequelize";
import {sequelize} from "./connection";

const Customer = sequelize.define(
  "Customer",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "customersequelize", 
  }
);
Customer.sync();
export default Customer;
