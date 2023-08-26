"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_config_1 = __importDefault(require("./config/db_config"));
var jwt = require('jsonwebtoken');
const app_config_1 = __importDefault(require("./config/app_config"));
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: db_config_1.default.host,
    user: db_config_1.default.user,
    password: db_config_1.default.password,
    database: db_config_1.default.database
});
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.post('/register', (req, res) => {
    const { name, pass } = req.body;
    const query = `INSERT INTO user ( name, pass )  VALUES ( '${name}', '${pass}' ) `;
    connection.connect();
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.error(error);
            return;
        }
        ;
        return;
    });
    connection.end();
    res.status(201).json({});
});
app.post('/login', (req, res) => {
    connection.connect();
    const { name, pass } = req.body;
    if (name != undefined && name != "" && pass != undefined && pass != "") {
        const query = `SELECT * FROM user WHERE name='${name}' AND pass='${pass}'`;
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.error(error);
                return;
            }
            ;
            if (results.length == 0) {
                res.status(400).json({ message: "invalid pass or name" });
            }
            else {
                var token = jwt.sign({ name, pass }, app_config_1.default.secret);
                res.status(200).json({ "acceessToken": token });
            }
        });
    }
    else {
        res.status(400).json({ message: "server cannot handle this request" });
    }
    connection.end();
});
app.get('/product/:id', (req, res) => {
    connection.connect();
    if (verifyToken(req, res)) {
        const query = `SELECT * FROM product WHERE id = ${req.params.id}`;
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.error(error);
                return;
            }
            ;
            res.status(200).json({ products: results, });
        });
    }
    connection.end();
});
const verifyToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    // Pastikan header Authorization ada dan memiliki format Bearer <token>
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Memisahkan token dari string "Bearer <token>"
        const token = authHeader.slice(7);
        return jwt.verify(token, app_config_1.default.secret, function (err, decoded) {
            if (err) {
                res.status(400).json({ message: "token invalid" });
                return null;
            }
            else {
                return true;
            }
        });
    }
    else {
        res.status(400).json({ message: "token invalid" });
        return null;
    }
};
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
