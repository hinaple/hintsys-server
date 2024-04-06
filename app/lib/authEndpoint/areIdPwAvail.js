const models = require("../../models");
const compare = require("../security/comparePw");

module.exports = async (id, pw) => {
    //no id or password
    if (!id.length || !pw.length) return false;

    const account = await models.accounts.findOne({ where: { id } });

    return [
        !!account && (await compare(pw, account.salt, account.password)),
        account,
    ];
};
