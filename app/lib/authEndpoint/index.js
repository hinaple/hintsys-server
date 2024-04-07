const checkHeadAuth = require("./checkHeaderAuth");
const METHODS = require("../HTTPmethods.json");
const autoResolve = require("./autoResolve");

const env = require("../nodeEnv");

/**
 * Make endpoints to be requiring authentication.
 *
 * @param {String} path Path string
 * @param {{
 *  post: Endpoint,
 *  get: Endpoint,
 *  put: Endpoint,
 *  patch: Endpoint,
 *  delete: Endpoint,
 *  head: Endpoint,
 *  connect: Endpoint,
 *  options: Endpoint,
 *  patch: Endpoint
 * }} endpoints endpoint methods and callbacks
 * @param {Object} Router express Router Object
 */
module.exports = (path, endpoints, Router) => {
    if (!Router) throw new Error("There is no Express Router Object!");

    Object.keys(endpoints).forEach((method) => {
        const EP = endpoints[method]; //Current Endpoint. EP stands for EndPoint anyway.

        if (!METHODS.includes(method.toLowerCase())) {
            throw new Error(
                "There is no such HTTP method: " + method.toLowerCase()
            );
        }

        Router[method](path, async (req, res) => {
            let statusCode = 0,
                accountInfo,
                msgIdx;

            const HeaderAuth = [
                req.headers["authentication-id"],
                req.headers["authentication-pw"],
            ];

            [statusCode, accountInfo, msgIdx = 0] = await checkHeadAuth(
                HeaderAuth,
                EP.authLevel,
                EP.authCallback,
                req
            );

            if (statusCode) {
                autoResolve(statusCode, res, msgIdx);
                return;
            } //the code must be 401 or 403(Authentication problem)

            const cbResult = EP.callback(req, res, accountInfo);
            let resultData;

            if (!cbResult) return;
            else if (cbResult.then)
                //If the callback function is an Async or a Promise
                await cbResult
                    .then((data) => {
                        [statusCode, resultData] = data;
                    })
                    .catch((error) => {
                        console.log("An error occurred:");
                        console.log(error.name, "-", error.message);

                        if (
                            error.message
                                .toLowerCase()
                                .includes("data too long")
                        ) {
                            statusCode = 413;
                            resultData = 1;
                        } else statusCode = 500;

                        if (env !== "production") throw new Error(error);
                    });
            else [statusCode, resultData] = cbResult;

            if (!resultData) {
                //If there is a status code but no message
                autoResolve(statusCode, res);
            } else if (typeof resultData === "number") {
                //If resultData is number,
                //it means the message is a standard but not default.
                autoResolve(statusCode, res, resultData);
            } else res.status(statusCode).json(resultData);
        });
    });
};

/**
 * @typedef {Object} Endpoint
 *
 * @property {EndpointCB} callback
 * @property {Integer} authLevel
 * @property {import("./checkAccount").ConditionCB} authCallback
 */

/**
 * @callback EndpointCB
 *
 * @param {Object} request An express request object
 * @param {Object} resolve An express resolve object
 * @param {Object} account A signed in account info
 *
 * @returns {Integer|{{
 *  code: Integer,
 *  data: Object
 * }}}
 * If the endpoint returns Number,
 * it resolve it as HTTP status code and add a message automatically
 * if there is a message data corresponding to the code.
 */
