const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const SprintBacklog = sequelize.define("SprintBacklog", {
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

    SprintBacklog.prototype.addUserStory = function (userStory) {
        return this.addUserStories(userStory)
    }

    return SprintBacklog
}
