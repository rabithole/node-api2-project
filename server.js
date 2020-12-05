const express = require('express');

// Pulls router in from the specific url. 
const postsRouter = require('./posts/posts-router.js');

// Creates a server with express. 
const server = express();

// Formats output as a json file. 
server.use(express.json()); // express middleware

// Designates an end point url using the postRouter declared above. 
server.use('/api/posts', postsRouter);
server.use('/api/comments', postsRouter);


// endpoints
server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Posts API</h>
    <p>Welcome to the Lambda Posts API, dude!</p>
  `);
});

module.exports = server;