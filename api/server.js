// implement your server here
const express = require('express')
const postRouter = require('./posts/posts-router')

const server = express()

// require your posts router and connect it here
server.use(express.json())
server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
    res.send(`
      <h2>Posts API</h>
      <p>Welcome to the Posts API</p>
    `);
  });

module.exports = server