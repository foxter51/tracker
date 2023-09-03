const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const UserStory = sequelize.define("UserStory", {
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

    UserStory.prototype.addTask = function (task) {
        return this.addTasks(task)
    }

    return UserStory
}
