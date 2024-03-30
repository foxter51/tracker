const jwt = require('jsonwebtoken')

function generateToken(username) {
    const payload = { username }
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '12h' })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if(token == null) return res.status(401).send('Unauthorized')

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send('Forbidden')
        req.user = user
        next()
    })
}

module.exports = {
    generateToken,
    authenticateToken
}