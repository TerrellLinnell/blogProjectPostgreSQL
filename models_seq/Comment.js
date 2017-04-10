'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
    title            : DataTypes.STRING,
    body             : DataTypes.STRING,
    author           : DataTypes.STRING,
    picture          : DataTypes.STRING,
    modified         : {
      type           : DataTypes.BOOLEAN,
      defaultValue   : false
    },
    date             : DataTypes.STRING
  }, {
    classMethods     : {
      associate      : (models) => {
        Comment.belongsTo(models.Post, {
          foreignKey : 'postId',
          onDelete   : 'CASCADE'
        });
      }
    }
  });
  return Comment;
};
