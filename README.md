# mongo-round

{{description}}.

	npm install mongo-round

## Usage

```javascript
var round = require('mongo-round');

db.myCollection.aggregate([
	{ $project: {
		amountCents: round.toCents('$amount')
	} },
	{ $group: {
		\_id: null, amountCents: {$sum: '$amountCents'}
	} }
	{ $project: {
    	amount: round.fromCents('$amountCents')
    } }
]);
```

## License

[MIT](http://opensource.org/licenses/MIT)
