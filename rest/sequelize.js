const Sequelize = require('sequelize');

const setUpDatabase = async () => {
  const sequelize = new Sequelize(process.env?.BD_LINK);
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
  await sequelize.sync();
  console.log('Starting setting up');
  await sequelize.models.messages.destroy({
    where: {},
  });

  const messages = [
    { text: 'Existing message 1' },
    { text: 'Existing message 2' },
    { text: 'Existing message 3' },
    { text: 'Existing message 4' },
  ];
  await Promise.all(
    messages.map((msg) => sequelize.models.messages.create(msg))
  );

  return sequelize;
};

module.exports = setUpDatabase;
