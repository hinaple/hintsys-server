const tryJsonParse = require("./tryJsonParse");
const isLowRanked = require("./isLowRanked");

/**
 * make account data to Array of allowed indexes,
 * if the account is not low-ranked returns `false`.
 * */
module.exports = ({ level, data }) => {
    if (!isLowRanked(level)) return false;
    return tryJsonParse(data)?.allowed ?? [];
};
