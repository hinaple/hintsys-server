const rateLimit = require("express-rate-limit");
const changeEvt = require("./settings/changeEvt");

let LIMIT = 50;

const limiter = rateLimit({
    windowMs: 60000,
    limit: () => +LIMIT,
});

changeEvt.add("max-req-per-min", {
    cb: (v) => {
        if (isNaN(v)) return;
        LIMIT = +v;
        console.log(`\n### RATE LIMIT IS ${v} NOW. ###\n`);
    },
    init: true,
});

module.exports = {
    limiter,
    LIMIT,
};
