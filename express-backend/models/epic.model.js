const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Epic = sequelize.define("Epic", {
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

    Epic.prototype.addUserStory = function (userStory) {
        return this.addUserStories(userStory)
    }

    return Epic
}
