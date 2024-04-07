const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('play_infos', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    theme_idx: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'themes',
        key: 'idx'
      }
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pausedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    add_sec: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      defaultValue: 0
    },
    device_info: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'play_infos',
    timestamps: true,
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
        name: "THEME_PLAY_idx",
        using: "BTREE",
        fields: [
          { name: "theme_idx" },
        ]
      },
    ]
  });
};
