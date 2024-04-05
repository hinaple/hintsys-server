const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hints', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    theme_idx: {
      type: DataTypes.INTEGER,
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
        name: "theme idx_idx",
        using: "BTREE",
        fields: [
          { name: "theme_idx" },
        ]
      },
    ]
  });
};
