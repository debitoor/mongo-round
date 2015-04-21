# mongo-round

Helper functions to perform rounding of numbers when working with [mongoDB Aggregation Framework](http://docs.mongodb.org/manual/aggregation).

	npm install mongo-round

## Usage

```javascript
var round = require('mongo-round');
```
To zero decimal places:
```javascript
db.myCollection.aggregate([
	{ $project: {
		roundValue: round.toZeroDecimals('$value')
	} }
]);
```
To two decimal places:
```javascript
db.myCollection.aggregate([
	{ $project: {
		roundAmount: round.toTwoDecimals('$amount')
	} }
]);
```
To cents and from cents - saves from rounding errors for armithmetic operations on financial data:
```javascript
db.myCollection.aggregate([
	{ $project: {
		amountCents: round.toCents('$amount') // multiplies by 100 and rounds to zero decimals
	} },
	{ $group: {
		_id: null, amountCents: {$sum: '$amountCents'}
	} }
	{ $project: {
    	amount: round.fromCents('$amountCents') // divides by 100 and rounds to two decimals
    } }
]);
```

Note that for negative numbers rounding is done using absolute values, which is fitting for financial data:
```
round.toZeroDecimals(-0.5) will give -1
```

## License

[MIT](http://opensource.org/licenses/MIT)
