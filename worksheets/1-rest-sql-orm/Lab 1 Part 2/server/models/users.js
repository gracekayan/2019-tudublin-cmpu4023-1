'use strict';
module.exports = function(sequelize, DataTypes) {
    const users = sequelize.define('users', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        details: DataTypes.STRING,
        deleted_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return users;
};


