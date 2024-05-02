// implement your server here
const express = require('express')

const server = express()

server.use(express.json())
// require your posts router and connect it here

module.exports = server