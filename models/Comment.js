var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentModel = {
	text: {
		type: String,
		required: true
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: true
		},
		user_name: {
			type: String,
			required: true
		}
	},
	date: { type: Date, default: Date.now, required: true }
};

const CommentSchema = new Schema(commentModel);
module.exports = mongoose.model('comments', CommentSchema);
