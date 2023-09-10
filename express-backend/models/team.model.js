const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("Team", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}
