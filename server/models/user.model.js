module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    firstname: {
      type: Sequelize.STRING,
    },
    lastname: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
    changePassFlag: {
      type: Sequelize.BOOLEAN,
    },
    failedLoginAttempts: {
      type: Sequelize.INTEGER,
    },
  });

  return User;
};
