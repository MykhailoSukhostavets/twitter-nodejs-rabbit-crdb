const amqp = require('amqplib');
const queueName = 'tasks';
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

module.exports = async function (message) {
  try {
    if (!channel) await connectToRabbit();
    await channel.assertQueue(queueName);

    console.log('Start publishing');
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ message })));
    console.log('End publishing');
  } catch (ex) {
    console.error(ex);
  }
};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
