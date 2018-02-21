import Sequelize from 'sequelize';

export const attributes = {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9]+$/i,
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING,
  },
};

export const options = {
  freezeTableName: true,
};

export const serializeUser = user => (
  {
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }
);
