const checkAccount = require("./checkAccount");

module.exports = async (HeaderAuth, authLevel, authCallback, cbData = {}) => {
    // if (!HeaderAuth[0] || !HeaderAuth[1]) return [401, null];

    return await checkAccount(
        HeaderAuth[0],
        HeaderAuth[1],
        authLevel,
        authCallback,
        cbData
    );
};
