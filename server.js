const express = require('express');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json()); // express middleware
server.use('/api/hubs', hubsRouter);
server.use('/junk', hubsRouter);

// endpoints

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

module.exports = server;