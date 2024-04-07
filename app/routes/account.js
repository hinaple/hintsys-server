//Probably gonna refactor. This file is soooo much spagetti. 🍝🍝
//https://github.com/hinaple/hintsys-server/tree/main?tab=readme-ov-file#account-1

const Router = require("express").Router();
const { Op } = require("sequelize");

const models = require("../models");
const authEndpoint = require("../lib/authEndpoint");
const getAllowed = require("../lib/getAllowed");
const makeSafeObj = require("../lib/makeSafeObj");
const SafeKeys = require("../lib/makeSafeObj/safeKeys.json");
const tryJsonParse = require("../lib/tryJsonParse");
const makeNewPw = require("../lib/security/makeNewPw");

const PASSWD_SALT_LEN = 4;

Array.prototype.haveCommonWith = function (secondArr) {
    return this.some((v) => secondArr.includes(v));
};
Array.prototype.intersection = function (secondArr) {
    return this.filter((v) => secondArr.includes(v));
};

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

                const { salt, pwHash } = await makeNewPw(
                    password,
                    PASSWD_SALT_LEN
                );

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

authEndpoint(
    "/id/:id([a-zA-Z0-9]+)",
    {
        get: {
            callback: async (req, res, account) => {
                const targetId = req.params.id.trim();
                const headerId = req.headers["authentication-id"].trim();

                if (targetId === headerId)
                    return [200, makeSafeObj(account, "account")];

                if (account.level < 5) return [403];
                const result = await models.accounts.findOne({
                    attributes: SafeKeys.account,
                    where: {
                        id: targetId,
                        //target account must have lower security level than request account
                        level: { [Op.lt]: account.level },
                    },
                });

                if (!result) return [404];

                const allowed = getAllowed(account);
                const targetAllowed = getAllowed(result);
                if (allowed) {
                    delete result.data;
                    result.allowed = allowed.intersection(targetAllowed || []);
                    if (!result.allowed.length) return [404];
                } else result.allowed = targetAllowed;

                return [200, result];
            },
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)",
    {
        patch: {
            callback: async (req, res, { level }) => {
                const targetIdx = +req.params.idx;

                const updateData = req.body?.updateData;

                const SafeUpdateData = makeSafeObj(updateData, "account", true);
                if (!updateData || !Object.keys(SafeUpdateData).length)
                    return [400, 1];

                if (SafeUpdateData.level && isNaN(+SafeUpdateData.level))
                    return [
                        400,
                        {
                            message: "The level value is NaN.",
                        },
                    ];
                if (SafeUpdateData.level && +SafeUpdateData.level >= level)
                    return [
                        400,
                        {
                            message:
                                "Setting an account level higher than request account is not allowed",
                        },
                    ];
                const result = await models.accounts.update(SafeUpdateData, {
                    where: {
                        idx: targetIdx,
                        level: { [Op.lt]: level },
                    },
                });

                if (!result[0]) return [404];
                return [201, { affectedKeys: Object.keys(SafeUpdateData) }];
            },
            authLevel: 6,
        },
    },
    Router
);

authEndpoint(
    "/:idx(\\d+)/pwchange",
    {
        patch: {
            callback: async (req, res, account) => {
                const targetIdx = +req.params.idx;

                const password = req.body?.password.trim();

                if (password.length < 4)
                    return [400, { message: "Password must be longer than 4" }];

                const { salt, pwHash } = await makeNewPw(
                    password,
                    PASSWD_SALT_LEN
                );

                const result = await models.accounts.update(
                    { password: pwHash, salt },
                    {
                        where: {
                            idx: targetIdx,
                            level: { [Op.lt]: account.level },
                        },
                    }
                );
                if (!result[0]) return [404]; //0 row affected or not authorized

                return [201, 1];
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
            callback: async (req, res, account) => {
                const { level: targetLevel, theme_idx: tidx } = req.query;

                let targetThemeIdx = null;
                if (tidx) targetThemeIdx = +tidx;

                const allowed = getAllowed(account);
                if (
                    targetThemeIdx &&
                    allowed &&
                    !allowed.includes(targetThemeIdx)
                )
                    return [200, []]; //Not searched allowed themeIdx

                // if (targetLevel && account.level <= targetLevel) 1;

                const result = await models.accounts.findAll({
                    attributes: SafeKeys.account,
                    where: {
                        [Op.or]: [
                            {
                                level: {
                                    [Op.lt]: account.level,
                                },
                            },
                            { idx: account.idx },
                        ],
                        ...(targetLevel ? { level: targetLevel } : {}),
                    },
                });

                let filteredResult = [];

                if (!allowed && !targetThemeIdx) filteredResult = result;
                else
                    result.forEach((a) => {
                        const currentAllowed = getAllowed(a);

                        //current account is high-ranked but request account is not
                        if (allowed && !currentAllowed) return;

                        if (
                            //there is no search theme idx
                            targetThemeIdx &&
                            !(
                                currentAllowed &&
                                currentAllowed.includes(targetThemeIdx)
                            )
                        )
                            return;

                        if (
                            //finds intersection
                            allowed &&
                            currentAllowed &&
                            !targetThemeIdx &&
                            !currentAllowed.haveCommonWith(allowed)
                        )
                            return;

                        const currentObj = makeSafeObj(a, "account");
                        currentObj.allowed = currentAllowed || [];
                        if (allowed) {
                            delete currentObj.data;
                            currentObj.allowed = allowed.intersection(
                                currentObj.allowed
                            );
                        }
                        filteredResult.push(currentObj);
                    });

                return [200, filteredResult];
            },
            authLevel: 5,
        },
    },
    Router
);

module.exports = Router;
