const Router = require("express").Router();
const theme = require("./theme");
const hint = require("./hint");
const playinfo = require("./playinfo");
const account = require("./account");
const system = require("./system");

Router.use("/theme", theme);
Router.use("/hint", hint);
Router.use("/playinfo", playinfo);
Router.use("/account", account);
Router.use("/system", system);
Router.get("/test", (req, res) => {
    res.json({ message: "hi!" });
});

module.exports = Router;
