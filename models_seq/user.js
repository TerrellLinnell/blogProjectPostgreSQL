'use strict';
module.exports = (sequelize, DataTypes) => {
  var User     = sequelize.define('User', {
    username     : DataTypes.STRING,
    password     : DataTypes.STRING,
    email        : DataTypes.STRING,
    role         : DataTypes.STRING,
    loggedIn     : DataTypes.BOOLEAN,
    firstName    : DataTypes.STRING,
    lastName     : DataTypes.STRING
  }, {
    classMethods : {
      associate  : (models) => {
      }
    }
  });
  return User;
};
