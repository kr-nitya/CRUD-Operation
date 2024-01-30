import * as mysql from "mysql";
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nitya_23",
  database: "mydb",
});

connection.connect((err: mysql.MysqlError) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL of User!");
});

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
    const sql =
      "SELECT * FROM users WHERE (username=? OR phone=?)";
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
}

export default userModel;
