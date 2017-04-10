'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    author : DataTypes.STRING,
    title  : DataTypes.STRING,
    text   : DataTypes.STRING,
    date   : DataTypes.STRING
  }, {
    classMethods: {
      associate : (models) => {
        Post.hasMany(models.Comment, {
          foreignKey : 'postId',
          as         : 'postComments'
        });
      }
    }
  });
  return Post;
};
