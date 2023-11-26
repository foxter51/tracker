const db = require('../models')
const User = db.user
const { generateToken } = require('../config/jwt.config')
const dns = require('dns')

async function registerUser(userData) {
    const { username, email, password, lastname, firstname } = userData

    try {
        let user

        user = await User.findOne({ where: { username: username } })
        if (user) {
            throw new Error('Username is already taken')
        }

        let validDomainName

        await checkDomain(email.split('@')[1]).then(() => {
            validDomainName = true
        }).catch(() => {
            validDomainName = false
        }).finally(() => {
            if (!validDomainName) {
                throw new Error('Invalid email domain')
            }
        })

        user = await User.findOne({ where: { email: email } })

        if (user) {
            throw new Error('Email is already taken')
        }

        user = await User.create({
            username,
            email,
            password,
            lastname,
            firstname,
        })

        return { token: generateToken(user.username), id: user.id }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function loginUser(username, password) {
    try {
        const user = await User.findOne({ where: { username: username } })

        if (!user || !user.validPassword(password)) {
            throw new Error('Invalid username or password')
        }

        return { token: generateToken(user.username), id: user.id }
    } catch (err) {
        throw new Error(err.message)
    }
}

function checkDomain(domain) {
    return new Promise((resolve, reject) => {
        dns.resolve(domain, 'MX', (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

module.exports = {
    registerUser,
    loginUser
}
