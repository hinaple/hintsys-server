const SaltChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

module.exports = (len) => {
    let salt = "";
    for (let i = 0; i < len; i++) {
        salt += SaltChars[Math.floor(Math.random() * SaltChars.length)];
    }
    return salt;
};
