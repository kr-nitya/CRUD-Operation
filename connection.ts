import * as mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nitya_23",
  database: "mydb",
});

connection.connect((err: mysql.MysqlError | null) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

export default connection;
