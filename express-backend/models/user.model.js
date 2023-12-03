const { DataTypes } = require("sequelize")
const bcrypt = require("bcrypt")

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
                if(user.password) {
                    const salt = await bcrypt.genSaltSync(10, null)
                    user.password = await bcrypt.hashSync(user.password, salt)
                }
            },
            beforeUpdate: async (user) => {
                if(user.password) {
                    const salt = await bcrypt.genSaltSync(10, null)
                    user.password = await bcrypt.hashSync(user.password, salt)
                }
            },
        }
    })

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password)
    }

    return User
}