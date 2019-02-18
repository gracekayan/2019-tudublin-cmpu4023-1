'use strict';
module.exports = function (sequelize, DataTypes) {
    const products = sequelize.define('products', {
        title: DataTypes.STRING,
        price: DataTypes.DOUBLE,
        deleted_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return products;
};

