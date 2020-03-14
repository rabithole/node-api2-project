const express = require('express');

const postsRouter = require('./posts/posts-router.js');

const server = express();

server.use(express.json()); // express middleware
server.use('/api/posts', postsRouter);

// endpoints

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Posts API</h>
    <p>Welcome to the Lambda Posts API</p>
  `);
});

module.exports = server;