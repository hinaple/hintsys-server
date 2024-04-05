const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hints', {
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
    code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    progress: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    order: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'hints',
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
        name: "hint theme link_idx",
        using: "BTREE",
        fields: [
          { name: "theme_idx" },
        ]
      },
    ]
  });
};
