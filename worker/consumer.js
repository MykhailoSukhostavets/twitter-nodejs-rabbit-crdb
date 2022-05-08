const Sequelize = require('sequelize-cockroachdb');
const amqp = require('amqplib');

let Message;

const queueName = process.env?.QUEUE || 'tasks';

async function connect() {
  try {
    const connectionString =
      'postgresql://root@crdb-0:26257/defaultdb?sslmode=disable';

    let sequelize;
    while (!sequelize) {
      try {
        sequelize = new Sequelize(connectionString);
      } catch {
        await wait(2000);
      }
    }
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
    await Message.sync();
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

      // fetch data from localhost
      await channel.assertQueue('send');
      const check = channel.sendToQueue(
        'send',
        Buffer.from(JSON.stringify({ message: input.message }))
      );
      console.log('CHECK ' + check);
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
};
