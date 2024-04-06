const processPw = require("./processPw");

module.exports = async (str, salt, targetHash) => {
    return targetHash === (await processPw(str, salt));
};
