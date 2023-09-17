const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("Team", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    })
}
