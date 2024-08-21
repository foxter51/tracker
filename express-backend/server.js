const app = require('./app')
require('./database')
const routes = require('./routes')
const { PORT } = require('./config')
const server = createHttpServer()
const io = require('./config/socket')

app.use('/api', routes)

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