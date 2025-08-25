//https://github.com/hinaple/hintsys-server/blob/main/readme.md#hint-1

const Router = require("express").Router();
const { Op } = require("sequelize");

const models = require("../models");
const authEndpoint = require("../lib/authEndpoint");
const isAllowedIdx = require("../lib/isAllowedIdx");
const getAllowed = require("../lib/getAllowed");
const makeSafeObj = require("../lib/makeSafeObj");

async function getLastHintOrder(theme_idx) {
    const lastHint = await models.hints.findOne({
        attributes: ["order"],
        where: { theme_idx },
        order: [["order", "DESC"]],
    });
    if (!lastHint) return -1;
    return lastHint.order;
}

authEndpoint(
    "/:idx(\\d+)",
    {
        post: {
            callback: async (req) => {
                try {
                    const targetIdx = +req.params.idx;

                    let { code = "TEST", progress, order } = req.body;
                    if (isNaN(+order)) {
                        //set order as last
                        order = (await getLastHintOrder(targetIdx)) + 1;
                    } else {
                        //Increase orders of hints after current hint
                        order = +order;
                        await models.hints.increment(
                            { order: 1 },
                            {
                                where: {
                                    theme_idx: targetIdx,
                                    order: {
                                        [Op.gte]: order,
                                    },
                                },
                            }
                        );
                    }

                    let result = await models.hints.create({
                        theme_idx: targetIdx,
                        code,
                        progress,
                        order,
                    });

                    return [201, { idx: result.dataValues.idx }];
                } catch (err) {
                    console.error(err);
                    return [500];
                }
            },
            authLevel: 5,
            authCallback: isAllowedIdx,
        },
        patch: {
            callback: async (req, res, account) => {
                try {
                    const targetIdx = +req.params.idx;
                    const allowed = getAllowed(account);

                    const updateData = req.body?.updateData;
                    if (!updateData || !Object.keys(updateData).length)
                        return [400, 1];

                    const SafeUpdateData = makeSafeObj(
                        updateData,
                        "hint",
                        true
                    );

                    const result = await models.hints.update(SafeUpdateData, {
                        where: {
                            idx: targetIdx,
                            ...(allowed ? { theme_idx: allowed } : {}), //for low ranked
                        },
                    });
                    if (!result[0]) return [404]; //0 row has been affected
                    else
                        return [
                            201,
                            { affectedKeys: Object.keys(SafeUpdateData) },
                        ];
                } catch (err) {
                    console.error(err);
                    return [500];
                }
            },
            authLevel: 5,
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)/setorder",
    {
        patch: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;

                const order = req.body?.order;
                if (isNaN(+order)) return [400, 1];

                const allowed = getAllowed(account);

                const originHint = await models.hints.findOne({
                    where: {
                        idx: targetIdx,
                        ...(allowed ? { theme_idx: allowed } : {}), //for low ranked
                    },
                });
                if (!originHint) return [404];

                if (originHint.order === +order)
                    return [201, { message: "Same Value" }];

                await models.hints.update(
                    { order },
                    { where: { idx: targetIdx } }
                );
                if (order < originHint.order)
                    await models.hints.increment(
                        { order: 1 },
                        {
                            where: {
                                order: {
                                    [Op.gte]: order,
                                    [Op.lt]: originHint.order,
                                },
                                idx: { [Op.not]: targetIdx },
                            },
                        }
                    );
                else
                    await models.hints.increment(
                        { order: -1 },
                        {
                            where: {
                                order: {
                                    [Op.gt]: originHint.order,
                                    [Op.lte]: order,
                                },
                                idx: { [Op.not]: targetIdx },
                            },
                        }
                    );

                return [201, 1];
            },
            authLevel: 5,
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)/contents",
    {
        patch: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;
                const contents = req.body?.contents;
                console.log(contents);
                if (!contents || !Array.isArray(contents)) return [400, 0];

                const allowed = getAllowed(account);

                if (allowed) {
                    const tempHint = await models.hints.findOne({
                        where: { idx: targetIdx, theme_idx: allowed },
                    });
                    if (!tempHint) return [404];
                }
                const r = await models.hint_contents.bulkCreate(
                    contents.map((c) => {
                        return {
                            hint_idx: targetIdx,
                            ...makeSafeObj(c, "hint_content"),
                        };
                    }),
                    {
                        updateOnDuplicate: ["contents"],
                    }
                );
                return [201];
            },
            authLevel: 5,
        },
    },
    Router
);

authEndpoint(
    "/content/:idx(\\d+)",
    {
        post: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;
                const allowed = getAllowed(account);

                const TargetHintCnt = await models.hints.count({
                    where: {
                        idx: targetIdx,
                        ...(allowed ? { theme_idx: allowed } : {}), //for low ranked
                    },
                });
                if (!TargetHintCnt) return [404]; //no hint data(or not authorized)

                const { contents, step } = req.body;
                const result = await models.hint_contents.create({
                    hint_idx: targetIdx,
                    contents,
                    step,
                });

                return [201, { idx: result.idx }];
            },
            authLevel: 5,
        },
        patch: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;
                const allowed = getAllowed(account);

                const { contents, step } = req.body;
                if (!contents && !step) return [400, 1];

                const TargetHintCnt = await models.hint_contents.count({
                    where: {
                        idx: targetIdx,
                    },
                    ...(allowed //for low ranked
                        ? {
                              include: [
                                  {
                                      model: models.hints,
                                      as: "hint_idx_hint",
                                      attributes: ["theme_idx"],
                                      where: { theme_idx: allowed },
                                  },
                              ],
                          }
                        : {}),

                    raw: false,
                });
                if (!TargetHintCnt) return [404]; //no hint data(or not authorized)

                const result = await models.hint_contents.update(
                    { contents, step },
                    { where: { idx: targetIdx } }
                );
                if (!result[0]) return [404]; //0 row has been affected

                return [201, 1];
            },
            authLevel: 5,
        },
    },
    Router
);

module.exports = Router;
