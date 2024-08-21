const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("UserStory", {
        title: {
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
