const express = require("express");
const app = express();

const cors = require("cors");
const fileUpload = require("express-fileupload");
const expressErrHandler = require("./lib/expressErrHandler");
const apiRoutes = require("./routes");
const tryRequire = require("./lib/tryRequire");
const limitUtils = require("./lib/limiter");
const checkSettings = require("./lib/settings/checkSettings");

const env = require("./lib/nodeEnv");

checkSettings();

app.use(expressErrHandler); //for errors from Express like Body-parser.
app.use(express.json({ limit: "5mb" }));
app.use(
    fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },
    })
);

app.use(cors());

app.use("/src", express.static("public"));
app.use("/api/v1", limitUtils.limiter, apiRoutes);

app.listen(3001);

console.log("Server is started as " + env);

//This is for developing, makes easy to test anything.
//If you want to use it,
//create testSpace.js at the same directory.
if (env === "development")
    (tryRequire(require, "./testSpace") ?? function () {})();
