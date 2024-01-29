"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var connection_1 = require("./connection");
//import * as bodyParser from "body-parser";
var body_parser_1 = require("body-parser");
var app = (0, express_1.default)();
var port = 3000;
app.use(body_parser_1.default.json()); // Use body-parser middleware to parse JSON request bodies
//Select
app.get("/read", function (req, res) {
    var sql = "select * from customer";
    connection_1.default.query(sql, function (err, result) {
        console.log(result);
        res.json(result);
    });
});
//Update
app.put("/update/:name/:address", function (req, res) {
    var username = req.params.name;
    var address = req.params.address;
    var sql = "update customer set address = ? where name = ?";
    connection_1.default.query(sql, [address, username], function (err, result) {
        if (err) {
            console.error("Error updating address:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Name not found" });
            return;
        }
        else {
            res.json({ message: "Address updated successfully" });
        }
    });
});
//Delete
app.delete("/delete/:name", function (req, res) {
    var username = req.params.name;
    var sql = "delete from customer where name = ?";
    connection_1.default.query(sql, [username], function (err, result) {
        if (err)
            throw err;
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Name not found" });
            return;
        }
        else {
            var deletedRows = result.affectedRows;
            res.json({ message: "Deleted ".concat(deletedRows, " row(s) successfully") });
        }
    });
});
//Insert
app.post("/insert", function (req, res) {
    var _a = req.body, name = _a.name, address = _a.address; //JSON data
    if (!name || !address) {
        res.status(400).json({ error: "Name and address are required" });
        return;
    }
    var sql = "INSERT INTO customer (name, address) VALUES (?, ?)";
    connection_1.default.query(sql, [name, address], function (err, result) {
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
});
app.listen(port, function () {
    console.log("Server start");
});
