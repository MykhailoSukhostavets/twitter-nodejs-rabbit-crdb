const addToQueue = require('./producer.js');
const consumer = require('./consumer.js');
consumer.connect();
const express = require('express');
const app = express();

app.get('/create', async (request, response) => {
  try {
    await addToQueue(request.query.message);
    response.sendStatus(200);
  } catch (error) {
    response.status(500).json({ error });
  }
});

const PORT = 3000;

function eventsHandler(request, response) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  consumer.clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    consumer.clients = consumer.clients.filter(
      (client) => client.id !== clientId
    );
  });
}

app.get('/messages', eventsHandler);

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`);
});
