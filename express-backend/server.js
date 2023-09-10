const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

let corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require('./models')
db.sequelize.sync()
    .then(() => {
        console.log('Synced db.')
    })
    .catch((err) => {
        console.log('Failed to sync db: ' + err.message)
    })

const apiRouter = express.Router()
app.use('/api', apiRouter)

apiRouter.use(require('./routes/auth.routes'))
apiRouter.use(require('./routes/messages.routes'))
apiRouter.use(require('./routes/user.routes'))
apiRouter.use(require('./routes/teams.routes'))
apiRouter.use(require('./routes/project.routes'))
apiRouter.use(require('./routes/task.routes'))
apiRouter.use(require('./routes/userRole.routes'))
apiRouter.use(require('./routes/epic.routes'))
apiRouter.use(require('./routes/productBacklog.routes'))
apiRouter.use(require('./routes/sprint.routes'))
apiRouter.use(require('./routes/sprintBacklog.routes'))
apiRouter.use(require('./routes/role.routes'))
apiRouter.use(require('./routes/userStory.routes'))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})