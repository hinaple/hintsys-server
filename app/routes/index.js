const expressErrHandler = require("./expressErrHandler");
const theme = require("./theme");
const hint = require("./hint");
const playinfo = require("./playinfo");
const account = require("./account");
const system = require("./system");

module.exports = (app) => {
    app.use(expressErrHandler); //for errors from Express like Body-parser.
    app.use("/api/theme", theme);
    app.use("/api/hint", hint);
    app.use("/api/playinfo", playinfo);
    app.use("/api/account", account);
    app.use("/api/system", system);
};
