const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("UserStory", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        storyPoints: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}
