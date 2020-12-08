const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateCommentInput = (data) => {
	let errors = {};
	// console.log("data passed in")
	// console.log(data)

	let { body } = data;
	// console.log("text before:")
	// console.log(body)
	// console.log(JSON.stringify(body))
	// Converts empty fields to empty string as validator function works only with strings
	body = !isEmpty(body) ? body : '';
	// console.log("text after:")
	// console.log(body)

	if (Validator.isEmpty(body)) {
		errors.body = 'Text is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
