const passport = require('passport');
var Post = require('../models/Post');
var Comment = require('../models/Comment');
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
	Post.findById(req.params.id, function(err, foundPost) {
		if (err) {
			res.status(400).json({ id: 'Error fetching post by id' });
		} else {
			if (foundPost.author.id.equals(req.user._id)) {
				next();
			} else {
				res.status(400).json({ id: 'No permission to this post' });
			}
		}
	});
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.status(400).json({ id: 'Error fetching comment by id' });
		} else {
			if (foundComment.author.id.equals(req.user._id)) {
				next();
			} else {
				res.status(400).json({ id: 'No permission to this comment' });
			}
		}
	});
};

module.exports = middlewareObj;
