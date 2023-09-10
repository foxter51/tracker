const db = require('../models')

db.user.hasMany(db.userRole)
db.user.belongsTo(db.team)

db.userRole.belongsTo(db.user)
db.userRole.belongsTo(db.team)
db.userRole.belongsTo(db.role)

db.team.hasMany(db.project)
db.team.hasMany(db.userRole)

db.project.hasOne(db.productBacklog)
db.project.hasMany(db.sprint, { as: 'sprints' })
db.project.hasOne(db.sprint, { as: 'currentSprint' })
db.project.belongsTo(db.team)

db.sprint.belongsTo(db.project)
db.sprint.hasOne(db.sprintBacklog)

db.sprintBacklog.belongsTo(db.sprint)
db.sprintBacklog.hasMany(db.userStory)

db.userStory.belongsTo(db.epic)
db.userStory.belongsTo(db.user, { as: 'owner' })
db.userStory.hasMany(db.task)

db.epic.belongsTo(db.productBacklog)
db.epic.hasMany(db.userStory)

db.task.belongsTo(db.userStory)
db.task.belongsTo(db.user, { as: 'assignee' })

db.productBacklog.belongsTo(db.project)
db.productBacklog.belongsTo(db.user, { as: 'owner' })
db.productBacklog.hasMany(db.epic)

module.exports = db