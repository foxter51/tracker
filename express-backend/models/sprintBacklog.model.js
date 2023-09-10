const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("SprintBacklog", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        storyPointsTotal: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
}
