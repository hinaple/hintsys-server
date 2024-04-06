//https://github.com/hinaple/hintsys-server/blob/main/readme.md#theme-1

const Router = require("express").Router();

const models = require("../models");
const authEndpoint = require("../lib/authEndpoint");
const isAllowedIdx = require("../lib/isAllowedIdx");
const getAllowed = require("../lib/getAllowed");
const makeSafeObj = require("../lib/makeSafeObj");
const SafeKeys = require("../lib/makeSafeObj/safeKeys.json");

authEndpoint(
    "/",
    {
        post: {
            callback: async (req) => {
                const title = req.body?.name ?? "New Theme";
                let result = await models.themes.create({ name: title });

                return [201, { idx: result.dataValues.idx }];
            },
            authLevel: 6,
        },
    },
    Router
);

authEndpoint(
    "/list",
    {
        get: {
            callback: async (req, res, { data, level }) => {
                const alloweds = getAllowed({ level, data });

                const themes = await models.themes.findAll({
                    attributes: SafeKeys.theme,
                    where: alloweds ? { idx: alloweds } : {},
                }); //filtering for low-ranks

                return [200, themes];
            },
            authLevel: 1,
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)",
    {
        get: {
            callback: async (req) => {
                const targetIdx = +req.params.idx;

                const resultTheme = await models.themes.findAll({
                    where: { idx: targetIdx },
                    attributes: SafeKeys.theme,
                    include: [
                        {
                            model: models.hints, //with hints
                            as: "hints",
                            attributes: SafeKeys.hint,
                            order: [["order", "ASC"]],
                            include: [
                                {
                                    model: models.hint_contents,
                                    as: "hint_contents",
                                    attributes: SafeKeys.hint_content, //with contents
                                    order: [["step", "ASC"]],
                                },
                            ],
                        },
                    ],
                    raw: false,
                });
                if (!resultTheme) return [404]; //No theme data

                return [200, resultTheme[0].dataValues];
            },
            authLevel: 1,
            authCallback: isAllowedIdx,
        },
        patch: {
            callback: async (req) => {
                const targetIdx = +req.params.idx;

                const updateData = req.body?.updateData;
                if (!updateData || !Object.keys(updateData).length)
                    return [400, 1];

                const SafeUpdateData = makeSafeObj(updateData, "theme", true);

                await models.themes.update(SafeUpdateData, {
                    where: { idx: targetIdx },
                });
                return [201, 1];
            },
            authLevel: 5,
            authCallback: isAllowedIdx,
        },
    },
    Router
);

module.exports = Router;
