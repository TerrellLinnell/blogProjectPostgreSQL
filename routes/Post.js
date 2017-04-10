const express     = require('express');
const Post        = require('../models').Post;
const Comment     = require('../models').Comment;
const commentAuth = require('../myMiddleware/commentAuth');
const moment      = require('moment');

const Router = new express.Router();

Router.use((req, res, next) => {
  return next();
});

Router.route('/posts')
  .get((req, res) => {
    Post.findAll({
      include: [{
        model: Comment,
        as   : 'postComments'
      }]
    })
    .then(Posts => {
      res.json({Posts})
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })
  .post((req, res) => {
    const date = moment().format("MMM Do YY")
    User.findById(req.body.author, function (err, user) {
      if (user.role === 'admin') {
        Post.create({
          author : req.body.author,
          title  : req.body.title,
          text   : req.body.text,
          date   : date
        })
        .then (Post => {
          res.json({Post})
        })
        .catch(error => {
          res.status(500).send(error, {message: 'only the admin can create a post'});
        })
      }
    })
  })

Router.route('/posts/:id')
  .get((req, res) => {
    Post.findById(req.body.author, {
      include: [{
        model: Comment,
        as   : 'postComments'
      }]
    })
    .then(Post => {
      res.json({Post})
    })
    .catch(error => {
      res.status(500).send(error, {message: 'There was an error finding this post'})
    })
  })
  .put((req, res) => {
    const date = moment().format("MMM Do YY")
    if (user.role === 'admin') {
      Post.findById(req.params.id)
      .then(Post => {
        Post.update({
          author  : req.body.author ? req.body.author : post.author,
          title   : req.body.title  ? req.body.title  : Post.Title,
          text    : req.body.text   ? req.body.text   : Post.text,
          date    : date
        })
        .then(Post => {
          res.json({Post})
        })
        .catch(error => {
          res.status(500).send(error, {message: 'failed to update post'})
        })
      })
      .catch(error => {
        res.status(500).send(error, {message: 'Could not find post to update'})
      })
    } else {
      res.json({message: 'only the admin can update a post'})
    }
  })
  .delete((req, res) => {
    if (user.role === 'admin') {
      Post.findById(req.params.id)
      .then(Post => {
        Post.destroy()
        .then(() => {
          res.json({Message: 'Post deleted'})
        })
        .catch(error => {
          res.status(500).send(error, {message: 'failed to delete post'})
        })
      })
      .catch(error => {
        res.status(500).send(error, {message: 'failed to find post'})
      })
    } else {
      res.json({message: 'only the admin can delete a post'})
    }
  })

Router.route('/posts/:id/comments')
  .get((req, res) => {
    Comment.findAll({
      where: {
        postId: req.params.id
      }
    })
    .then(Comment => {
      res.json({Comment})
    })
    .catch(error => {
      res.status(500).send(error, {message: "Failed to find Comments"})
    })
  })
  .post((req, res) => {
    const date = moment().format("MMM Do YY")
    if(req.user) {
      Comment.create({
        title   : req.body.title,
        body    : req.body.text,
        author  : req.body.author,
        picture : req.body.picture,
        postId  : req.params.id,
        date    : date
      })
      .then(Comment => {
        res.json({Comment})
      })
      .catch(error => {
        res.status(500).send(error, {message: 'failed to create comment'})
      })
    } else {
      res.status(500).send(error, {message: 'You must be logged in to comment'})
    }
  });

Router.route('/posts/comments/:commentId')
  .get((req, res) => {
    Comment.findById(req.params.commentId)
    .then(Comment => {
      res.json({Comment})
    })
    .catch(error => {
      res.status(500).send(error, {message: 'failed to get this specific comment'})
    })
  })
  .put((req, res) => {
    const user = req.body.user;
    if (user) {
      Comment.findById(req.params.commentId)
      .then(Comment => {
        if (user === comment.author || user.role === 'admin') {
          Comment.update({
            body     : req.body.text  ? req.body.text  : Comment.body,
            title    : req.body.title ? req.body.title : Comment.title,
            modified : true
          })
          .then(Comment => {
            res.json({Comment})
          })
          .catch(error => {
            res.status(500).send(error, {message: 'Failed to update comment'})
          })
        } else {
          res.status(500).send({message: 'you are not allowed to update this comment'})
        }
      })
      .catch(error => {
        res.status(500).send(error, {message: 'failed to find this comment'})
      })
    } else {
      res.status(500).send({message: 'you must be logged in to update your comments'})
    }
  })
  .delete((req, res) => {
    const user = req.body.user
    if (user === comment.author || user.role === 'admin') {
      Comment.findById(req.params.commentId)
      .then(Comment => {
        Comment.destroy()
        .then(() => {
          res.json({message: 'comment deleted'})
        })
        .catch(error => {
          res.status(500).send(error, {message: 'failed t delete comment'})
        })
      })
      .catch(error => {
        res.status(500).send(error, {message: 'failed to find this comment'})
      })
    } else {
      res.json({message: 'only the creator of the comment or admin can delete this comment'})
    }
  });

module.exports = Router;
