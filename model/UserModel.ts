import { Sequelize, DataTypes, Dialect } from "sequelize";
import {sequelize} from "./connection";
const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    fileUrls: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "usersequelize",
  }
);
export default User;
