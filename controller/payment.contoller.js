const { json } = require('body-parser');

const splitPayment = (req, res) => {
	let { Amount, SplitInfo, ID } = req.body;
	let balance = Amount;
	let SplitBreakdown = [];
	let runningRatioSum = 0;

	let ratioSum = 0;

	let percentageArray = [];
	let ratioArray = [];

	SplitInfo.map((item) => {
		if (item.SplitType === 'FLAT') {
			balance -= item.SplitValue;
			pushResult(item.SplitEntityId, item.SplitValue);
		} else if (item.SplitType === 'PERCENTAGE') {
			percentageArray.push(item);
		} else {
			ratioArray.push(item);
			ratioSum += item.SplitValue;
		}
	});
	//compute split balance  logic

	percentageArray.map((item) => {
		let deduction = item.SplitValue * 0.01 * balance;
		balance -= deduction;
		pushResult(item.SplitEntityId, deduction);
	});
	// amount before the ratio sum is deducted from the balance
	let openingRatioBalance = balance;

	ratioArray.map((item) => {
		let deduction = openingRatioBalance * (item.SplitValue / ratioSum);
		//realtime adding of all the ratio-deduction values to
		runningRatioSum += deduction;
		pushResult(item.SplitEntityId, deduction);
	});

	// balance = balance ( @ lin 33) - runningRatioSum
	balance -= runningRatioSum;
	res.status(200).send({
		status: true,
		message: 'the split balance succesfully computed',
		data: { ID: ID, Balance: balance, SplitBreakdown },
	});

	//this is for pushing into the splitBreakdown array
	function pushResult(id, amt) {
		SplitBreakdown.push({
			SplitEntityId: id,
			Amount: amt,
		});
	}
};

module.exports = {
	splitPayment,
};
