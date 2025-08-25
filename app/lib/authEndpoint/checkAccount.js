const areIdPwAvail = require("./areIdPwAvail");

/**
 * It checks if the user's input account is available and meet the security condition.
 *
 * @param {String} id Input Target Account Id
 * @param {String} pw Input Target Account PW
 * @param {Integer} [authLevel = 0] Allowed lowest level
 * @param {ConditionCB} [authCallback]
 *
 * @returns {Array} `[
 *  HTTP_status_code(0 when it's authorized),
 *  account_info
 * ]`
 */
module.exports = async (id, pw, authLevel = 0, authCallback, cbData = {}) => {
    const [availResult, account] =
        id && pw ? await areIdPwAvail(id, pw) : [null, null];
    //unavailable account information
    if (authLevel && !availResult) return [401, null];

    if (authLevel && (account.level ?? 0) < authLevel) return [403, account];

    if (authCallback) {
        //some additional condition
        const cbResult = authCallback(account, cbData);

        if (Array.isArray(cbResult) && !cbResult[0])
            return [403, account, cbResult[1]];
        else if (!cbResult) return [403, account];
    }

    return [0, account];
};

/**
 * @callback ConditionCB
 * @param {Object} account account info
 * @param {Object} request An Express request object
 *
 * @returns {Array|Boolean}
 * `Array` - [ is_authorized, message_idx, data? ]
 * `Boolean` - is_authorized
 */
