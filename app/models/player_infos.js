const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('player_infos', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    play_info_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'play_infos',
        key: 'idx'
      }
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING(12),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'player_infos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx" },
        ]
      },
      {
        name: "toPlayInfo_idx",
        using: "BTREE",
        fields: [
          { name: "play_info_idx" },
        ]
      },
    ]
  });
};
