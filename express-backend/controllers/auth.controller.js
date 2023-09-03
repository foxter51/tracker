const authService = require('../services/auth.service')

async function register(req, res) {
    const { username, email, password, lastname, firstname } = req.body

    try {
        const userData = {
            username,
            email,
            password,
            lastname,
            firstname,
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

module.exports = {
    register,
    login,
}
