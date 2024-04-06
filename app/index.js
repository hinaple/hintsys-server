const express = require("express");
const app = express();

const cors = require("cors");
const fileUpload = require("express-fileupload");
const Routes = require("./routes");
const tryRequire = require("./lib/tryRequire");

const env = require("./lib/nodeEnv");

app.use(express.json());
app.use(express.json({ limit: "2mb" }));
app.use(fileUpload());
if (env === "development") app.use(cors());

Routes(app);

app.listen(3001);

//This is for developing, makes easy to test anything.
//If you want to use it,
//create testSpace.js at the same directory.
if (env === "development")
    (tryRequire(require, "./testSpace") ?? function () {})();
