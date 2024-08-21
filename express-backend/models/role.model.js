const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Role = sequelize.define("Role", {
        scrumRole: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    Role.sync()
        .then(() => {
            Role.findOrCreate({
                where: { scrumRole: 'Product Owner' },
                defaults: { scrumRole: 'Product Owner' }
            }).then(() => {
                Role.findOrCreate({
                    where: { scrumRole: 'Scrum Master' },
                    defaults: { scrumRole: 'Scrum Master' }
                })
            }).then(() => {
                Role.findOrCreate({
                    where: { scrumRole: 'Developer' },
                    defaults: { scrumRole: 'Developer' }
                })
            })
        })
        .catch(error => {
            console.error("Error syncing role model:", error)
        })

    return Role
}
