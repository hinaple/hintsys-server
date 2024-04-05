const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('settings', {
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    edit_level: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 5
    },
    read_level: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'settings',
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
    ]
  });
};
