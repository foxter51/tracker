const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("SprintBacklog", {
        storyPointsTotal: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
}
