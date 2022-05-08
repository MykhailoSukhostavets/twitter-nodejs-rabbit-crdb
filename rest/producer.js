const sequelize = require('./sequelize.js');
const amqp = require('amqplib');

const queueName = process.env?.QUEUE || 'tasks';
let clients = [];
let channel;

async function connectToRabbit() {
  while (!channel) {
    try {
      const connection = await amqp.connect(process.env?.RABBIT);
      channel = await connection.createChannel();
      await channel.assertQueue('send');
      channel.consume('send', async (message) => {
        const input = JSON.parse(message.content.toString());
        clients.forEach((client) => {
          client.response.write(`${input.message}\n\n`);
        });
      });
    } catch {
      await wait(500);
    }
  }
}

async function addToQueue(request, response) {
  try {
    const message = request.query.message;
    if (!channel) await connectToRabbit();
    await channel.assertQueue(queueName);

    console.log('Start publishing');
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ message })));
    console.log('End publishing');
    response.sendStatus(200);
  } catch (error) {
    response.status(500).json({ error });
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function addClient(request, response) {
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

  clients.push(newClient);
  const pgClient = await sequelize();
  const msg = (await pgClient.models.messages.findAll()).map((message) =>
    message.get()
  );
  msg.forEach((message) => {
    response.write(`${message.text}\n\n`);
  });
  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

module.exports = {
  addToQueue,
  addClient,
};
