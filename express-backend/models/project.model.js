const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("Project", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 32]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [3, 512]
            }
        },
        githubLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        githubRepoName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}
