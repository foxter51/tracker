const db = require('../models')
const User = db.user
const { generateToken } = require('../config/jwt.config')
const { OAuth2Client } = require("google-auth-library")
const { Op } = require("sequelize")
const dns = require('dns')

async function registerUser(userData) {
    const { firstname, lastname, username, email, password } = userData

    try {
        let user

        user = await User.findOne({ where: { username } })
        if (user) {
            throw new Error('Username is already taken')
        }

        user = await User.findOne({ where: { email } })

        if (user) {
            throw new Error('Email is already taken')
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
        const user = await User.findOne({ where: { username } })

        const isValid = await user?.validPassword(password)

        if (!isValid) {
            throw new Error('Invalid username or password')
        }

        return { token: generateToken(user.username), id: user.id }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function doRequestGoogleUrl() {
    const redirectUrl = 'http://localhost:8081/auth/google'

    const client = new OAuth2Client(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirectUrl
    )

    return client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        prompt: 'consent',
    })
}

async function approveGoogleLogin(code) {
    try {
        const redirectUrl = 'http://localhost:8081/auth/google'

        const client = new OAuth2Client(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            redirectUrl
        )

        const response = await client.getToken(code)
        await client.setCredentials(response.tokens)

        const userData = await getUserData(client.credentials.access_token)
        let username = userData.email.split('@')[0]

        let user = await User.findOne({  // if the same email exists -> get the user
            where: { email: userData.email }
        })

        if (!user) {  // if the user doesn't exist -> create a new one

            const usernamesCount = await User.count({  // if the same username exists
                where: { username: {[Op.like]: `${username}%`} }
            })

            if(+usernamesCount !== 0) username += usernamesCount  //then add its number to the end

            user = await User.create({
                username,
                email: userData.email,
                lastname: userData.family_name,
                firstname: userData.given_name,
                isThirdPartyAuth: true
            })
        }

        return { token: generateToken(user.username), id: user.id }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
    return await response.json()
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
    loginUser,
    doRequestGoogleUrl,
    approveGoogleLogin,
    checkDomain
}
