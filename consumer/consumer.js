const Sequelize = require('sequelize-cockroachdb');
const amqp = require('amqplib');
let clients = [];
let Message;
const queueName = 'tasks';

async function connect() {
  try {
    const connectionString =
      'postgresql://root@crdb-0:26257/defaultdb?sslmode=disable';
    const sequelize = new Sequelize(connectionString);

    Message = sequelize.define('messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: Sequelize.TEXT,
      },
    });

    // Create the "messages" table.
    await Message.sync({
      force: true,
    });
    let connection;
    while (!connection) {
      try {
        connection = await amqp.connect('amqp://rabbitmq');
      } catch {
        await wait(2000);
      }
    }

    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    channel.consume(queueName, async (message) => {
      const input = JSON.parse(message.content.toString());
      await Message.create({ text: input.message });

      clients.forEach((client) => {
        client.response.write(`New message: ${input.message}\n\n`);
      });
      channel.ack(message);
    });
    console.log(`Waiting for messages...`);
  } catch (ex) {
    console.error(ex);
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  connect,
  clients,
};
