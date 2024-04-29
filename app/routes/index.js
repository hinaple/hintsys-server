const Router = require("express").Router();
const theme = require("./theme");
const hint = require("./hint");
const playinfo = require("./playinfo");
const account = require("./account");
const system = require("./system");
const control = require("./control");

Router.use("/theme", theme);
Router.use("/hint", hint);
Router.use("/playinfo", playinfo);
Router.use("/account", account);
Router.use("/system", system);
Router.use("/control", control);
Router.get("/test", (req, res) => {
    res.json({ message: "hi!" });
});

module.exports = Router;
