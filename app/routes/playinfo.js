//https://github.com/hinaple/hintsys-server/tree/main?tab=readme-ov-file#play-information

const Router = require("express").Router();

const models = require("../models");
const authEndpoint = require("../lib/authEndpoint");
const isAllowedIdx = require("../lib/isAllowedIdx");
const getAllowed = require("../lib/getAllowed");
const makeSafeObj = require("../lib/makeSafeObj");
const SafeKeys = require("../lib/makeSafeObj/safeKeys.json");

authEndpoint(
    "/:idx(\\d+)",
    {
        post: {
            callback: async (req) => {
                const targetIdx = +req.params.idx;
                let objStartedAt;

                const { status = 0, startedAt, add_sec = 0 } = req.body;
                objStartedAt = new Date(startedAt ? startedAt : null);

                if (isNaN(objStartedAt.valueOf()))
                    return [
                        400,
                        {
                            message: `'startedAt: ${startedAt}' is an invalid date.`,
                        },
                    ];

                const result = await models.play_infos.create({
                    theme_idx: targetIdx,
                    status,
                    startedAt: startedAt ?? new Date().toString(),
                    add_sec,
                });

                return [201, { idx: result.idx }];
            },
            authLevel: 3,
            authCallback: isAllowedIdx,
        },
        patch: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;

                const updateData = req.body?.updateData;
                if (!updateData || !Object.keys(updateData).length)
                    return [400, 1];

                const SafeUpdateData = makeSafeObj(
                    updateData,
                    "play_info",
                    true
                );

                let beforeDate = SafeUpdateData.startedAt;
                if (beforeDate) {
                    SafeUpdateData.startedAt = new Date(beforeDate);
                }
                if (beforeDate && isNaN(SafeUpdateData.startedAt.valueOf()))
                    return [
                        400,
                        {
                            message: `'startedAt: ${beforeDate}' is an invalid date.`,
                        },
                    ];

                const allowed = getAllowed(account);
                const result = await models.play_infos.update(SafeUpdateData, {
                    where: {
                        idx: targetIdx,
                        ...(allowed ? { theme_idx: allowed } : {}), //for low ranked
                    },
                });

                if (!result[0]) return [404]; //0 row has been affected
                else
                    return [201, { affectedKeys: Object.keys(SafeUpdateData) }];
            },
            authLevel: 3,
        },
    },
    Router
);

async function getList(req, account, noSearch) {
    const { count = 20, page = 0 } = req.query;
    let targetIdx = +req.params.idx;
    const { status } = req.query;

    if (noSearch) targetIdx = getAllowed(account);

    const result = await models.play_infos.findAll({
        where: {
            ...(targetIdx ? { theme_idx: targetIdx } : {}),
            ...(status ? { status } : {}),
        },
        attributes: SafeKeys.play_info,
        order: [["createdAt", "DESC"]],
        limit: count,
        offset: count * page,
    });

    return [200, result];
}

authEndpoint(
    "/list",
    {
        get: {
            callback: (req, res, account) => getList(req, account, true),
            authLevel: 3,
        },
    },
    Router
);

authEndpoint(
    "/list/:idx(\\d*)",
    {
        get: {
            callback: (req, res, account) => getList(req, account, false),
            authLevel: 3,
            authCallback: isAllowedIdx,
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)/addseconds",
    {
        patch: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;
                const { add_sec, reset = false } = req.body;

                const allowed = getAllowed(account);

                const result = await models.play_infos[
                    reset ? "update" : "increment" //if reset is true, just UPDATE the value.
                ](
                    { add_sec },
                    {
                        where: {
                            idx: targetIdx,
                            ...(allowed ? { theme_idx: allowed } : {}), //for low ranked
                        },
                    }
                );
                if ((reset && !result[0]) || (!reset && !result[0][1]))
                    return [404]; //0 row has been affected

                return [201, 1];
            },
            authLevel: 3,
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)/players",
    {
        get: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;

                const allowed = getAllowed(account);

                const result = await models.player_infos.findAll({
                    attributes: SafeKeys.player_info,
                    where: {
                        play_info_idx: targetIdx,
                    },
                    ...(allowed //for low ranked
                        ? {
                              include: [
                                  {
                                      model: models.play_infos,
                                      as: "play_info_idx_play_info",
                                      attributes: ["theme_idx"],
                                      where: { theme_idx: allowed },
                                  },
                              ],
                          }
                        : {}),

                    raw: false,
                });

                return [
                    200,
                    result.map((r) => {
                        return {
                            name: r.dataValues.name,
                            tel: r.dataValues.tel,
                        };
                    }),
                ];
            },
            authLevel: 5,
        },
    },
    Router
);

module.exports = Router;
