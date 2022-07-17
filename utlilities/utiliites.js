//breaks *** by split types
function splitArr(type) {
	let result = SplitInfo.filter((entity) => {
		return entity.SplitType == type;
	});
	return result;
}
function pushResult(id, amt) {
	SplitBreakdown.push({
		SplitEntityId: id,
		Amount: amt,
	});
}

// module.exports = { splitArr, pushResult };
