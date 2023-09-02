const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

let corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})