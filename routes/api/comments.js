const express = require('express');
const router = express.Router({ mergeParams: true });
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const passport = require('passport');
const validateCommentInput = require('../../validation/comment');
var middleware = require('../../middleware');

router.post('/:id/create', passport.authenticate('jwt', { session: false }), (req, res) => {
	// console.log("comment receive req:"+JSON.stringify(req));
	// console.log(req);
	// console.log(req.params.id);
	// console.log(req.user._id);
	// console.log(req.user.user_name);
	// console.log(req.body.body);
	Post.findById(req.params.id, function(err, post) {
		// console.log(post);
		if (err) {
			// console.log(err);
			res.status(400).json({ create: 'Error fetching comment by id' });
		} else {
			// console.log(req.user.user_name);
			// console.log(req.body.body);
			// console.log(post);
			const authorID = req.user._id;
			const authorName = req.user.user_name;
			const comment = req.body;
			// console.log(comment);
			const { errors, isValid } = validateCommentInput(comment);
			// console.log(isValid);
			// console.log(errors);
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const newComment = new Comment(comment);
			newComment.author.id = authorID;
			newComment.author.user_name = authorName;
			newComment.text = comment.body;
			// console.log("newComment");
			// console.log(newComment);
			newComment
				.save()
				.then((doc) => res.json(doc))
				.catch((err) => res.status(400).json({ create: 'Error creating new comment' }));
			// .catch((err) => console.log({ create: 'Error creating new comment' }));
			// .catch((err) => console.log(err));

			post.comments.push(newComment);
			// console.log("!!!");
			// console.log(post);

			post.save().catch((err) => res.status(400).json({ create: 'Error creating new comment' }));
			// post.save().catch((err) => console.log({ create: 'Error creating new comment' }));
			// console.log("after save!!!");
			// console.log(post);
			// newPost.save().then((doc) => res.json(doc)).catch((err) => console.log({ create: 'Error creating new post' }));
		}
	});
});

// router.get('/get/:id', (req, res) => {
// 	// console.log("start");
// 	Comment.find({ _id: req.params.id })
// 	.then((post) => res.status(200).json(post))
// 	// .then((post) => res.send(post))
// 	.catch((err) => res.status(400).json({ id: 'Error fetching post by id' }));
// });

router.patch(
	'/update/:comment_id',
	passport.authenticate('jwt', { session: false }),
	middleware.checkCommentOwnership,
	(req, res) => {
		const { errors, isValid } = validateCommentInput(req.body);
		if (!isValid) {
			return res.status(400).json(errors);
		}
		const { text } = req.body;
		Comment.findOneAndUpdate({ _id: req.params.comment_id }, { $set: { text } }, { new: true })
			.then((doc) => res.status(200).json(doc))
			.catch((err) => res.status(400).json({ update: 'Error updating existing comment' }));
	}
);

router.delete(
	'/delete/:comment_id',
	passport.authenticate('jwt', { session: false }),
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findOneAndDelete({ _id: req.params.comment_id })
			.then((doc) => res.status(200).json(doc))
			.catch((err) => res.status(400).json({ delete: 'Error deleting a comment' }));
	}
);

module.exports = router;
