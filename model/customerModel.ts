import * as mysql from "mysql";
import connection from "./connection";
class CustomerModel {
  static getAllCustomers(callback: mysql.queryCallback) {
    const sql: string = "SELECT * FROM customer";
    connection.query(sql, callback);
  }

  static updateCustomerAddress(
    username: string,
    address: string,
    callback: mysql.queryCallback
  ) {
    const sql: string = "UPDATE customer SET address = ? WHERE name = ?";
    connection.query(sql, [address, username], callback);
  }

  static deleteCustomer(username: string, callback: mysql.queryCallback) {
    const sql: string = "DELETE FROM customer WHERE name = ?";
    connection.query(sql, [username], callback);
  }

  static insertCustomer(
    name: string,
    address: string,
    callback: mysql.queryCallback
  ) {
    const sql: string = "INSERT INTO customer (name, address) VALUES (?, ?)";
    connection.query(sql, [name, address], callback);
  }
}

export default CustomerModel;
