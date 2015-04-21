function toZeroDecimals(valueExpression) {
	return {
		$let: {
			vars: {
				valAdjusted: {
					$add: [
						valueExpression,
						{$cond: [{$gte: [valueExpression, 0]}, 0.5, -0.5]}
					]
				}
			},
			in: {
				$subtract: ['$$valAdjusted', {$mod: ['$$valAdjusted', 1]}]
			}
		}
	};
}

function toTwoDecimals(valueExpression) {
	return {
		$let: {
			vars: {
				val100adjusted: {
					$add: [
						{$multiply: [valueExpression, 100]},
						{$cond: [{$gte: [valueExpression, 0]}, 0.5, -0.5]}
					]
				}
			},
			in: {
				$divide: [
					{$subtract: ['$$val100adjusted', {$mod: ['$$val100adjusted', 1]}]},
					100
				]
			}
		}
	};
}

function toCents(valueExpression) {
	return toZeroDecimals({$multiply: [valueExpression, 100]});
}

function fromCents(valueExpression) {
	return toTwoDecimals({$divide: [valueExpression, 100]});
}

module.exports = {
	toCents: toCents,
	fromCents: fromCents,
	toTwoDecimals: toTwoDecimals,
	toZeroDecimals: toZeroDecimals
};
