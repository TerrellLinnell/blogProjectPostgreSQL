//all posts route   /api/posts use get method and post method in this route
var express = require('express');
var User = require('../models/user');
var Post = require('../models/Post');
var Comment = require('../models/Comment');


var Router = new express.Router();

Router.route('/posts')
.get(function (req, res) {
  Post.find(function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.json(posts);
    }
  });
})
.post(function (req, res) {
  var post = new Post({
    author: req.user._id,
    text: req.body.text
    // date: req.body.date,
  });
  post.save(function (err, post) {
    if (err) {
      res.json({message: 'There was an error saving this user'});
    } else {
      res.json(post);
    }
  });
});

Router.route('/posts/:id')
  .get(function (req, res) {
    Post.findById(req.params.id)
      .populate({
        path: 'comments',
        populate: {path: author}
      })
      .exec(function (err, post) {
        if (err) {
          res.json({ message: 'there was an error finding this post' });
        } else {
          res.json(post);
        }
      })
    })
  .put(function (req, res) {
    Post.findById(req.params.id, function (err, post) {
      if (err) {
        res.json({message: 'could not find Post.'});
      } else {
        post.author = req.body.author ? req.body.author : post.author;
        post.text = req.body.text ? req.body.text : post.text;
        post.comments = req.body.comments ? req.body.comments : post.comments;
        post.date = req.body.date ? req.body.date : post.date;
        post.save(function (err) {
          if (err) {
            res.json(err)
          } else {
            res.json({message: 'Post updated'})
          }
        })
      }
    })
  })
  .delete(function (req, res) {
    User.findById(req.user._id, function (err, user) {
      if (user.role === 'admin') {
        Post.remove({ _id: req.params.id }, function (err, data){
          if (err ){
            console.log(err);
          } else {
          res.json({message: 'post deleted'});
          }
        });
      } else {
        res.json({message: 'only admins can delete posts'})
      }
    })
  });

Router.route('/posts/:id/comments')
.post(function (req, res) {
  var comment = new Comment({
    author: req.user._id,
    text: req.body.text
    // date: req.body.date,
  });
  comment.save(function (err, comment) {
    if (err) {
      res.json({message: 'There was an error posting this comment'});
    } else {
      Post.findById(req.params.id, function (err, post) {
        if (err) {
          res.json({ message: 'there was an error finding this post' });
        } else {
          post.comments.push(comment._id)
          post.save(function (err, data) {
            if (err) {
              res.json({message: 'error posting this comment'})
            } else {
              res.json(post)
            }
          });
        }
      });
    }
  });
});

Router.route('/posts/comments/:commentId')
.get(function (req, res) {
  console.log('looking for a comment');
  Comment.findById(req.params.commentId)
    .populate('author')
    .exec(function (err, comment) {
      if (err) {
        res.json({ message: 'there was an error finding this comment' });
      } else {
        res.json(comment);
      }
    });
  })
.put(function (req, res) {
  Comment.findById(req.params.commentId, function (err, comment) {
    if (err) {
      console.log('Error finding comment');
      res.json({'error' : err})
    } else {
      if (req.user) {
      if (comment.author.toString() === req.user._id.toString()) {
        comment.text = req.body.text ? req.body.text : comment.text;
        comment.save(function (err, data) {
          if(err) {
            res.json({error: err})
          } else {
            res.json({message: 'updated comment'})
          }
        });
      } else {
        res.json({message: 'you are not allowed to update this comment'})
      }
    } else {
      res.json({error: 'you must be logged in to update comments'})
    }
    }
  })
});

module.exports = Router;
