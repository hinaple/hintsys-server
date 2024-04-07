const CodeToMsg = require("./CodeToMsg.json");

/**
 * Auto resolve a message with an offered code.
 */
module.exports = (statusCode, res, msgIdx = 0) => {
    if (!res) {
        throw new Error("There is no Express resolve Object!");
    }
    statusCode = statusCode.toString();
    if (!CodeToMsg[statusCode]) statusCode = "500";
    return res.status(+statusCode).json({
        message: CodeToMsg[statusCode][msgIdx] ?? "",
    });
};
