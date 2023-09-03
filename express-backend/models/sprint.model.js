const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("Sprint", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        goal: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}
