//https://github.com/hinaple/hintsys-server/tree/main?tab=readme-ov-file#system

const Router = require("express").Router();
const { Op } = require("sequelize");
const { randomUUID } = require("crypto"); //for upload file name

const models = require("../models");
const authEndpoint = require("../lib/authEndpoint");
const SafeKeys = require("../lib/makeSafeObj/safeKeys.json");
const changeSettings = require("../lib/settings/changeSettings");
const uploadFile = require("../lib/upload/uploadFile");

authEndpoint(
    "/setting",
    {
        get: async (req, res, account) => {
            const settings = await models.settings.findAll({
                attributes: SafeKeys.setting,
                where: {
                    read_level: { [Op.lte]: account.level },
                },
            });
            settings.forEach((s) => {
                if (s.edit_level > account.level) delete s.edit_level;
            });

            return [200, settings];
        },
        patch: {
            callback: async (req, res, account) => {
                const updateData = req.body?.updateData;
                const result = await changeSettings(updateData, account.level);

                return [201, { affectedLabels: result }];
            },
            authLevel: 5,
        },
    },
    Router
);
authEndpoint(
    "/upload",
    {
        post: {
            callback: async (req) => {
                const file = req.files.file;

                if (!file) return [400, 1];

                const newFileName = randomUUID();
                const result = await uploadFile(newFileName, file);

                if (!result)
                    return [
                        415,
                        {
                            message:
                                "The file is too big or has unacceptable extension",
                        },
                    ];
                return [201, { filename: result }];
            },
            authLevel: 5,
        },
    },
    Router
);

module.exports = Router;
