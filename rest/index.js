const producer = require('./producer.js');

const express = require('express');
const app = express();

app.get('/create', producer.addToQueue);

const PORT = Number(process.env?.PORT) || 3000;

app.get('/messages', producer.addClient);

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`);
});
