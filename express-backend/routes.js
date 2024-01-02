const apiRouter = require('express').Router()

apiRouter.use(require('./routes/auth.routes'))
apiRouter.use(require('./routes/user.routes'))
apiRouter.use(require('./routes/teams.routes'))
apiRouter.use(require('./routes/project.routes'))
apiRouter.use(require('./routes/task.routes'))
apiRouter.use(require('./routes/epic.routes'))
apiRouter.use(require('./routes/productBacklog.routes'))
apiRouter.use(require('./routes/sprint.routes'))
apiRouter.use(require('./routes/sprintBacklog.routes'))
apiRouter.use(require('./routes/role.routes'))
apiRouter.use(require('./routes/userStory.routes'))

module.exports = apiRouter