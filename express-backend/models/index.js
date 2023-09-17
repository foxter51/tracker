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

db.user.hasMany(db.userRole, { as: 'userRoles', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
db.user.belongsTo(db.team)

db.userRole.belongsTo(db.user)
db.userRole.belongsTo(db.team)
db.userRole.belongsTo(db.role)

db.team.hasMany(db.project, { as: 'projects', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
db.team.hasMany(db.userRole, { as: 'userRoles', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

db.project.hasOne(db.productBacklog)
db.project.hasMany(db.sprint, { as: 'sprints', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
db.project.hasOne(db.sprint, { as: 'currentSprint', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
db.project.belongsTo(db.team)

db.sprint.belongsTo(db.project)
db.sprint.hasOne(db.sprintBacklog)

db.sprintBacklog.belongsTo(db.sprint)
db.sprintBacklog.hasMany(db.userStory, { as: 'userStories', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

db.userStory.belongsTo(db.epic)
db.userStory.belongsTo(db.user, { as: 'owner' })
db.userStory.hasMany(db.task, { as: 'tasks', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

db.epic.belongsTo(db.productBacklog)
db.epic.hasMany(db.userStory, { as: 'userStories', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

db.task.belongsTo(db.userStory)
db.task.belongsTo(db.user, { as: 'assignee' })

db.productBacklog.belongsTo(db.project)
db.productBacklog.belongsTo(db.user, { as: 'owner' })
db.productBacklog.hasMany(db.epic, { as: 'epics', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

module.exports = db