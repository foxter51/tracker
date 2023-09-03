const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Team = sequelize.define("Team", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    Team.prototype.addUserAndRole = function (userAndRole) {
        return this.addUsersAndRole(userAndRole)
    }

    return Team
}
