const genSalt = require("./genSalt");
const processPw = require("./processPw");

module.exports = async (str, saltLen) => {
    const salt = genSalt(saltLen);
    const pwHash = await processPw(str, salt);
    return { salt, pwHash };
};
