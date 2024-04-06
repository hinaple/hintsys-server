const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('accounts', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.CHAR(16),
      allowNull: false,
      unique: "alias_UNIQUE"
    },
    password: {
      type: DataTypes.CHAR(88),
      allowNull: false
    },
    salt: {
      type: DataTypes.CHAR(4),
      allowNull: false
    },
    alias: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    data: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'accounts',
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
        name: "alias_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
