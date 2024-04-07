const SafeKeys = require("./safeKeys.json");
const FixedKeys = require("./fixedKeys.json");
const leaveSomeKeys = require("../leaveSomeKeys");

/**
 * @param {Boolean} userChanging
 * `true` when user changing values directly so some keys have to be fixed
 */
module.exports = (obj, type, userChanging = false) => {
    if (typeof type === "string" && !SafeKeys[type]) return false;
    return leaveSomeKeys(
        obj,
        Array.isArray(type) ? type : SafeKeys[type],
        userChanging ? FixedKeys : []
    );
};
