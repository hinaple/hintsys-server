"use strict";

const Sequelize = require("sequelize");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const initModels = require("./init-models.js");

let sequelize;
sequelize = new Sequelize(
    config.database,
    config.username,
    config.password || process.env.MYSQL_ROOT_PASSWORD,
    config
);

const db = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
