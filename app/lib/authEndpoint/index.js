const checkHeadAuth = require("./checkHeaderAuth");
const METHODS = require("../HTTPmethods.json");
const autoResolve = require("./autoResolve");

const env = require("../nodeEnv");

/**
 * Make endpoints to be requiring authentication.
 *
 * @param {String} path Path string
 * @param {{
 *  post: Endpoint|EndpointCB,
 *  get: Endpoint|EndpointCB,
 *  put: Endpoint|EndpointCB,
 *  patch: Endpoint|EndpointCB,
 *  delete: Endpoint|EndpointCB,
 *  head: Endpoint|EndpointCB,
 *  connect: Endpoint|EndpointCB,
 *  options: Endpoint|EndpointCB
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
                typeof EP === "function" ? 0 : EP.authLevel,
                typeof EP === "function" ? null : EP.authCallback,
                req
            );

            if (statusCode) {
                autoResolve(statusCode, res, msgIdx);
                return;
            } //the code must be 401 or 403(Authentication problem)

            const cbResult = (typeof EP === "function" ? EP : EP.callback)(
                req,
                res,
                accountInfo
            );
            let resultData;

            if (!cbResult) return;
            else if (cbResult.then) {
                //If the callback function is an Async or a Promise
                const prom = cbResult.then((data) => {
                    [statusCode, resultData] = data;
                });
                if (env === "production")
                    await prom.catch((error) => {
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
                    });
                else await prom.then();
            } else [statusCode, resultData] = cbResult;

            if (!resultData) {
                //If there is a status code but no message
                autoResolve(statusCode, res);
            } else if (typeof resultData === "number") {
                //If resultData is number,
                //it means the message is a standard but not default.
                autoResolve(statusCode, res, resultData);
            } else res.status(+statusCode).json(resultData);
        });
    });
};

/**
 * @typedef {Object} Endpoint
 *
 * @property {EndpointCB} callback
 * @property {Number} authLevel
 * @property {import("./checkAccount").ConditionCB} [authCallback]
 */

/**
 * @callback EndpointCB
 *
 * @param {Object} request An express request object
 * @param {Object} resolve An express resolve object
 * @param {Object} account A signed in account info
 *
 * @returns {Int|{
 *  code: Int,
 *  data: Object
 * }}
 * If the endpoint returns Number,
 * it resolve it as HTTP status code and add a message automatically
 * if there is a message data corresponding to the code.
 */
