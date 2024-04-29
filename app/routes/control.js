//This is temporary router.
//this is just for control hint devices remotely,
//but not perfect so there is no informations of it in readme.

const Router = require("express").Router();

const authEndpoint = require("../lib/authEndpoint");
const getAllowed = require("../lib/getAllowed");
const { getRooms, execute } = require("../lib/socket");

authEndpoint(
    "/list",
    {
        get: {
            callback: async (req, res, account) => {
                const allowed = getAllowed(account);
                let themeRooms = getRooms()
                    .filter((n) => n.startsWith("theme_"))
                    .map((n) => +n.replace(/theme_(.+)/, "$1"));

                if (allowed)
                    themeRooms = themeRooms.filter((n) => allowed.includes(n));
                return [200, themeRooms];
            },
            authLevel: 3,
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)/:method(start|pause|reset)",
    {
        patch: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;
                const method = req.params.method;
                const allowed = getAllowed(account);

                if (allowed && !allowed.includes(targetIdx)) return [403, 1];

                if (!getRooms().includes(`theme_${targetIdx}`))
                    return [201, { result: false, reason: "noroom" }];
                const result = await execute(method, targetIdx).catch(
                    () => false
                );
                return [
                    201,
                    { result: !!result, reason: result ? "" : "noreply" },
                ];
            },
            authLevel: 3,
        },
    },
    Router
);

module.exports = Router;
