const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Post');
const passport = require('passport');
const validatePostInput = require('../../validation/post');
var middleware = require('../../middleware');
const post = require('../../validation/post');

router.get('/', (req, res) => {
	// console.log(req);
	Post.find({})
		.then((posts) => res.status(200).json(posts))
		.catch((err) => res.status(400).json({ user: 'Error fetching posts of logged in user' }));
});

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
	// console.log(req);
	const authorID = req.user._id;
	const authorName = req.user.user_name;
	const post = req.body;
	const { errors, isValid } = validatePostInput(post);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	// post.author = author;
	var newPost = new Post(post);
	newPost.author.id = authorID;
	newPost.author.user_name = authorName;
	newPost.save().then((doc) => res.json(doc)).catch((err) => console.log({ create: 'Error creating new post' }));
});

router.get('/post/:id', (req, res) => {
	// console.log(req);
	Post.find({ _id: req.params.id }).populate('comments').exec(function(err, post) {
		if (err) {
			res.status(400).json({ id: 'Error fetching post by id' });
		} else {
			res.status(200).json(post);
			console.log(post);
			console.log(post.comments);
		}
	});
});

router.patch(
	'/update/:id',
	passport.authenticate('jwt', { session: false }),
	middleware.checkPostOwnership,
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);
		if (!isValid) {
			return res.status(400).json(errors);
		}
		const { title, body } = req.body;
		Post.findOneAndUpdate({ _id: req.params.id }, { $set: { title, body } }, { new: true })
			.then((doc) => res.status(200).json(doc))
			.catch((err) => res.status(400).json({ update: 'Error updating existing post' }));
	}
);

router.delete(
	'/delete/:id',
	passport.authenticate('jwt', { session: false }),
	middleware.checkPostOwnership,
	(req, res) => {
		Post.findOneAndDelete({ _id: req.params.id })
			.then((doc) => res.status(200).json(doc))
			.catch((err) => res.status(400).json({ delete: 'Error deleting a post' }));
	}
);

module.exports = router;
