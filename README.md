# mongo-round [![Build Status](https://travis-ci.org/e-conomic/mongo-round.svg?branch=master)](https://travis-ci.org/e-conomic/mongo-round)

Helper function to perform rounding of numbers when working with [mongoDB Aggregation Framework](http://docs.mongodb.org/manual/aggregation).

	npm install mongo-round

## Usage

```javascript
var round = require('mongo-round');
```
To zero decimal places:
```javascript
db.myCollection.aggregate([
	{ $project: {
		roundValue: round('$value')
	} }
]);
```
To two decimal places:
```javascript
db.myCollection.aggregate([
	{ $project: {
		roundAmount: round('$amount', 2)
	} }
]);
```
To cents and from cents - saves from rounding errors for armithmetic operations on financial data:
```javascript
db.myCollection.aggregate([
	{ $project: {
		amountCents: round({$multiply:['$amount', 100]})
	} },
	{ $group: {
		_id: null, amountCents: {$sum: '$amountCents'}
	} }
	{ $project: {
    	amount: round({$divide:['$amountCents', 100]}, 2)
    } }
]);
```

Note that for negative numbers rounding is done using absolute values, which is fitting for financial data:
```
round(-0.5) will give -1
```

## License

[MIT](http://opensource.org/licenses/MIT)
