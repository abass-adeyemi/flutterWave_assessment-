require('dotenv').config();
const { json } = require('body-parser');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { splitArr, pushResult } = require('../utlilities/utiliites');
// const { customAlphabet } = require('nanoid/async');
// const nanoid = customAlphabet('1234567890abcdef', 10);

const splitPayment = (req, res) => {
	let { Amount, SplitInfo, ID } = req.body;
	// console.log('payload=>', req.body);
	let balance = Amount;
	let SplitBreakdown = [];
	let runningRatioSum = 0;

	let ratioSum = 0;

	// let flatArray = splitArr('FLAT');
	// let percentageArray = splitArr('PERCENTAGE');
	// let ratioArray = splitArr('RATIO');
	let flatArray = [];
	let percentageArray = [];
	let ratioArray = [];

	// seprating into different arrays
	SplitInfo.map((item) => {
		if (item.SplitType === 'FLAT') {
			flatArray.push(item);
		} else if (item.SplitType === 'PERCENTAGE') {
			percentageArray.push(item);
		} else {
			ratioArray.push(item);
		}
	});
	//compute balance  logic
	flatArray.map((item) => {
		balance -= item.SplitValue;
		pushResult(item.SplitEntityId, item.SplitValue);
	});
	// percentage calculation
	percentageArray.map((item) => {
		let deduction = item.SplitValue * 0.01 * balance;
		// if (deduction > Amount)
		// 	throw Error('Cannot be less than transaction Amount');
		balance -= deduction;
		pushResult(item.SplitEntityId, deduction);
	});
	//ratio calculation
	let openingRatioBalance = balance;
	ratioArray.map((item) => (ratioSum += item.SplitValue));

	ratioArray.map((item) => {
		let deduction = openingRatioBalance * (item.SplitValue / ratioSum);
		runningRatioSum += deduction;
		pushResult(item.SplitEntityId, deduction);
	});

	balance -= runningRatioSum;
	res.status(200).send({
		status: true,
		message: 'the split balance succesfully computed',
		data: { ID: ID, Balance: balance, SplitBreakdown },
	});

	//breaks *** by split types
	// function splitArr(type) {
	// 	let result = SplitInfo.filter((entity) => {
	// 		return entity.SplitType == type;
	// 	});
	// 	return result;
	// }
	// go through the array
	// and select the diffenet Split type into the difeernet unqie array
	//

	// function splitArr(type) {
	// 	let result = SplitInfo.map(

	// 		(entity) => {
	// 		return entity.SplitType == type;
	// 	});
	// 	return result;
	// }
	function pushResult(id, amt) {
		SplitBreakdown.push({
			SplitEntityId: id,
			Amount: amt,
		});
	}
	// let data = { ID: payload.ID, Balance: balance, SplitBreakdown };
	// console.log(data);
};

module.exports = {
	splitPayment,
};
