const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Project = sequelize.define("Project", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    Project.prototype.addSprint = function (sprint) {
        return this.addSprints(sprint)
    }

    return Project
}
