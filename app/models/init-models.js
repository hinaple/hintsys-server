var DataTypes = require("sequelize").DataTypes;
var _accounts = require("./accounts");
var _hint_contents = require("./hint_contents");
var _hints = require("./hints");
var _play_infos = require("./play_infos");
var _player_infos = require("./player_infos");
var _settings = require("./settings");
var _themes = require("./themes");

function initModels(sequelize) {
  var accounts = _accounts(sequelize, DataTypes);
  var hint_contents = _hint_contents(sequelize, DataTypes);
  var hints = _hints(sequelize, DataTypes);
  var play_infos = _play_infos(sequelize, DataTypes);
  var player_infos = _player_infos(sequelize, DataTypes);
  var settings = _settings(sequelize, DataTypes);
  var themes = _themes(sequelize, DataTypes);

  hint_contents.belongsTo(hints, { as: "hint_idx_hint", foreignKey: "hint_idx"});
  hints.hasMany(hint_contents, { as: "hint_contents", foreignKey: "hint_idx"});
  player_infos.belongsTo(play_infos, { as: "play_info_idx_play_info", foreignKey: "play_info_idx"});
  play_infos.hasMany(player_infos, { as: "player_infos", foreignKey: "play_info_idx"});
  hints.belongsTo(themes, { as: "theme_idx_theme", foreignKey: "theme_idx"});
  themes.hasMany(hints, { as: "hints", foreignKey: "theme_idx"});
  play_infos.belongsTo(themes, { as: "theme_idx_theme", foreignKey: "theme_idx"});
  themes.hasMany(play_infos, { as: "play_infos", foreignKey: "theme_idx"});

  return {
    accounts,
    hint_contents,
    hints,
    play_infos,
    player_infos,
    settings,
    themes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
