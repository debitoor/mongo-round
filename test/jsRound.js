module.exports = function round(value) {
	var decimals = 2;
	var isNegative = value < 0;
	//round off to 6 decimals, then round of to "decimals" number of decimals
	var absolute = Math.round(
			Math.round(
				Math.abs(value) * Math.pow(10, (6))
			) / Math.pow(10, 6 - decimals)
		) / Math.pow(10, decimals);
	return isNegative ? -absolute : absolute;
};
