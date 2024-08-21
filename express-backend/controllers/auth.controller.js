const authService = require('../services/auth.service')

async function register(req, res) {
    const { firstname, lastname, username, email, password } = req.body

    try {
        const userData = {
            firstname,
            lastname,
            username,
            email,
            password
        }
        const registeredUserToken = await authService.registerUser(userData)
        res.json(registeredUserToken)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function login(req, res) {
    const { username, password } = req.body

    try {
        const authenticatedUserToken = await authService.loginUser(username, password)
        res.json(authenticatedUserToken)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function doRequestGoogleUrl(req, res) {
    try {
        const url = await authService.doRequestGoogleUrl()
        res.json({ url })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function approveGoogleLogin(req, res) {
    const code = req.query.code

    try {
        const authenticatedUserToken = await authService.approveGoogleLogin(code)
        res.json(authenticatedUserToken)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    register,
    login,
    doRequestGoogleUrl,
    approveGoogleLogin
}
