'use strict';
module.exports = function(sequelize, DataTypes) {
    const purchase_items = sequelize.define('purchase_items', {
        purchase_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        price: DataTypes.DOUBLE,
        quantity: DataTypes.INTEGER,
        state: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
                purchase_items.belongsTo(models.purchases);
                purchase_items.belongsTo(models.products);
            }
        }
    });
    return purchase_items;
};


