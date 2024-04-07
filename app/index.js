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

// if (env === "production")
checkSettings();

app.use(expressErrHandler); //for errors from Express like Body-parser.
app.use(express.json({ limit: "5mb" }));
app.use(fileUpload());

// app.use(cors()); //for access from the android app

app.use("/api/v1", limitUtils.limiter, apiRoutes);

app.listen(3001);

//This is for developing, makes easy to test anything.
//If you want to use it,
//create testSpace.js at the same directory.
if (env === "development")
    (tryRequire(require, "./testSpace") ?? function () {})();
