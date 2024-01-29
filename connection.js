"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nitya_23",
    database: "mydb",
});
connection.connect(function (err) {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL!");
});
exports.default = connection;
