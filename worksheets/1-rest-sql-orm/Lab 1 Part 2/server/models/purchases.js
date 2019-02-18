'use strict';
module.exports = function(sequelize, DataTypes) {
  const purchases = sequelize.define('purchases', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          purchases.belongsTo(models.users);
      }
    }
  });
  return purchases;
};

