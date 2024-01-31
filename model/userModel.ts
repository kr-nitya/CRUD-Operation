import * as mysql from "mysql";
import connection from "./connection";
class userModel {
  static registerUser(
    name: string,
    address: string,
    phone: string,
    password: string,
    username: string,
    callback: mysql.queryCallback
  ) {
    const sql: string = "INSERT INTO users values (?,?,?,?,?)";
    connection.query(sql, [name, address, phone, password, username], callback);
  }

  static loginUser(
    username: string,
    password: string,
    callback: mysql.queryCallback
  ) {
    const sql = "SELECT * FROM users WHERE (username=? OR phone=?)";
    connection.query(sql, [username, username], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }

      if (results.length === 0) {
        // No user found with the given username/phone
        callback(null, null);
        return;
      }
      // Check if the provided password matches the stored encrypted password
      const storedPassword: string = results[0].password;
      if (password === storedPassword) {
        callback(null, results);
      } else {
        callback(null, null); // Passwords do not match
      }
    });
  }
  static getUserDetails(username: string, callback: mysql.queryCallback) {
    const sql = "SELECT * FROM users WHERE username=?";
    connection.query(sql, [username], callback);
  }
  static updateUserName(
    username: string,
    newName: string,
    callback: mysql.queryCallback
  ) {
    const sql = "UPDATE users SET name=? WHERE (username=? OR phone=?)";
    connection.query(sql, [newName, username, username], callback);
  }
  static updateAddress(
    username: string,
    address: string,
    callback: mysql.queryCallback
  ) {
    const sql = "UPDATE users SET address=? WHERE (username=? OR phone=?)";
    connection.query(sql, [address, username, username], callback);
  }
 
}

export default userModel;
