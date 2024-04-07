//https://github.com/hinaple/hintsys-server/tree/main?tab=readme-ov-file#account-1

const Router = require("express").Router();

const models = require("../models");
const authEndpoint = require("../lib/authEndpoint");
const isAllowedIdx = require("../lib/isAllowedIdx");
const getAllowed = require("../lib/getAllowed");
const makeSafeObj = require("../lib/makeSafeObj");
const SafeKeys = require("../lib/makeSafeObj/safeKeys.json");
const tryJsonParse = require("../lib/tryJsonParse");
const makeNewPw = require("../lib/security/makeNewPw");

authEndpoint(
    "/",
    {
        post: {
            callback: async (req, res, account) => {
                let {
                    id,
                    password,
                    alias = null,
                    level = 0,
                    data = null,
                } = req.body;
                if (!id || !password) return [400, 1];
                id = id.trim();
                password = password.trim();

                if (id.length < 4 || id.length > 16)
                    return [
                        400,
                        {
                            message:
                                "ID must be shorter than 16 and longer than 4.",
                        },
                    ];
                if (password.length < 4)
                    return [
                        400,
                        {
                            message: "Password must be longer than 4.",
                        },
                    ];
                if (id.match(/[^a-zA-Z0-9]/))
                    return [
                        400,
                        {
                            message:
                                "ID can only include alphabets and numbers(a-zA-Z0-9).",
                        },
                    ];

                if (level && isNaN(+level))
                    return [
                        400,
                        {
                            message: "Level value must be a number.",
                        },
                    ];
                if (level && +level >= account.level)
                    return [
                        400,
                        {
                            message:
                                "Creating accounts which have higher or same security level" +
                                " with requested account is not allowed.",
                        },
                    ];

                const sameAccountCnt = await models.accounts.count({
                    where: { id },
                });
                if (sameAccountCnt)
                    return [409, { message: "The ID is duplicated." }];

                const { salt, pwHash } = await makeNewPw(password, 4);

                if (data && typeof data === "string") data = tryJsonParse(data);
                else if (data && typeof data !== "object") data = null;
                const result = await models.accounts.create({
                    id,
                    password: pwHash,
                    salt,
                    alias,
                    level: level ? +level : 0,
                    data: data ? JSON.stringify(data) : null,
                });

                return [201, { idx: result.idx }];
            },
            authLevel: 6,
        },
    },
    Router
);

module.exports = Router;
