const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("ProductBacklog", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}
