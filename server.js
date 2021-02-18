const express = require("express");

const payerRouter = require("./payer/payer-router");

const server = express();

server.use(express.json());

server.use("/api/", payerRouter);

module.exports = server;
