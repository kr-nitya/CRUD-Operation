// import * as mysql from "mysql";
// import dotenv from 'dotenv';
// dotenv.config();
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });
// connection.connect((err: mysql.MysqlError | null) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL!");
// });
// export default connection;
import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

 const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT as Dialect,
  }
);
export { sequelize };