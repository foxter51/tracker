require('dotenv').config()
const db = require('./models')

db.sequelize.sync()
    .then(() => {
        console.log('Synced db.')
    })
    .catch((err) => {
        console.log('Failed to sync db: ' + err.message)
    })

module.exports = db