const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'postgresql://root@crdb-0:26257/defaultdb?sslmode=disable'
);
sequelize.define('messages', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: Sequelize.TEXT,
  },
});

sequelize.define('client', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: Sequelize.TEXT,
  },
});

const setUpDatabase = async () => {
  console.log('Starting setting up');
  const messages = [
    { text: 'Existing message 1' },
    { text: 'Existing message 2' },
    { text: 'Existing message 3' },
    { text: 'Existing message 4' },
  ];
  await Promise.all(
    messages.map((msg) => sequelize.models.messages.create(msg))
  );
};

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PG');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Sync complite');
    return setUpDatabase();
  })
  .then(() => console.log('Data preset ready'))
  .catch((e) => console.error(e));

module.exports = sequelize;
