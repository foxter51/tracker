const { DataTypes } = require("sequelize")
const argon2 = require("argon2")

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: [3, 32]
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false,
            validate: {
                len: [3, 64]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [6, 64]
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 32]
            }
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 32]
            }
        }
    }, {
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await argon2.hash(user.password)
                }
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    user.password = await argon2.hash(user.password)
                }
            },
        }
    })

    User.prototype.validPassword = async function (password) {
        return await argon2.verify(this.password, password)
    }

    return User
}