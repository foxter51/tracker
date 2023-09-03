const dbConfig = require('../config/db.config.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user.model.js')(sequelize)
db.userRole = require('./userRole.model.js')(sequelize)
db.role = require('./role.model.js')(sequelize)
db.team = require('./team.model.js')(sequelize)
db.project = require('./project.model.js')(sequelize)
db.productBacklog = require('./productBacklog.model.js')(sequelize)
db.epic = require('./epic.model.js')(sequelize)
db.userStory = require('./userStory.model.js')(sequelize)
db.sprint = require('./sprint.model.js')(sequelize)
db.sprintBacklog = require('./sprintBacklog.model.js')(sequelize)
db.task = require('./task.model.js')(sequelize)

module.exports = db