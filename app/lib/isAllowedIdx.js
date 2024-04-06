const getAllowed = require("./getAllowed");

/**
 * Use as callback when the endpoint has to be allowed to specific accounts.
 */
module.exports = ({ level, data }, targetIdx) => {
    if (typeof targetIdx === "object") targetIdx = +targetIdx.params.idx;
    const allowedIdx = getAllowed({ level, data });

    if (allowedIdx && !allowedIdx.includes(targetIdx)) return [false, 1];
    else return true;
};
