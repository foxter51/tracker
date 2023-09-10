const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("Project", {
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
