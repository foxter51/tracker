const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("Role", {
        scrumRole: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}
