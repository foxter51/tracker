require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8080
const server = createHttpServer()
let io = require('./config/socket')

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

io.listen(server)

io.on("connection", () => {
    console.log("Client connected!");
})

io.on('connection', (socket) => {
    socket.on('task update', data => {
        console.log('Updating user story status')
        io.emit('user story update', {
            userStoryId: data.userStoryId,
            status: data.status
        })
    })

    socket.on('user story update', data => {
        console.log('Updating epic status')
        io.emit('epic update', {
            epicId: data.epicId,
            status: data.status
        })
    })
})

function createHttpServer() {
    const httpServer = app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`)
    })
    return httpServer
}

module.exports = app