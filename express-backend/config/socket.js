const { Server } = require("socket.io")

const io = new Server({
    cors: {
        origin: "http://localhost:8081"
    }
})

module.exports = io