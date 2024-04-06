// ⚠️ Please make your own encryptPw.js file.
//   It isn't opened in the public for security.
// ⚠️ If there is no encryptPw.js,
//   this file never encrypt password at all.

const tryRequire = require("../tryRequire");
const encryptPw = tryRequire(require, "./encryptPw");

async function defaultEncrypt(str, salt) {
    return str + salt;
}

module.exports = (str, salt = "") => {
    return (encryptPw ?? defaultEncrypt)(str, salt);
};
