const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const ApiRouter = require("./api.js");

app.use(express.json());
app.use(cookieParser());

app.use("/api", ApiRouter);

app.listen(3001);
