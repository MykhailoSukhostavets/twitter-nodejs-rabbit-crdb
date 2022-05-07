const amqp = require('amqplib');
const queueName = process.env?.QUEUE || 'tasks';
let clients = [];
let channel;

async function connectToRabbit() {
  while (!channel) {
    try {
      const connection = await amqp.connect('amqp://rabbitmq');
      channel = await connection.createChannel();
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
    console.log(clients);
    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ message, clients: [clients[0].write] }))
    );
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

function addClient(request, response) {
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

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

module.exports = {
  addToQueue,
  addClient,
};
