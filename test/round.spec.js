var round = require('../index');
var jsRound = require('./jsRound');

var mongojs = require('mongojs');
var db = mongojs('testDB', ['testCollection']);

describe('aggregationHelpers', function() {
	var result, errors;

	after(cleanDB);

	function cleanDB(callback) {
		db.testCollection.drop(callback);
	}

	function aggregateOperation(operation) {
		return function(callback) {
			db.testCollection.aggregate(operation, function(err, res) {
				result = res && res[0];
				callback(err);
			});
		};
	}

	function findOutputErrorsForExpected(getExpectedFunc) {
		errors = [];
		result.input.forEach(function(number, i) {
			var actual = result.output[i];
			var expected = getExpectedFunc(number);
			if (actual !== expected) {
				errors.push({number: number, actual: actual, expected: expected});
			}
		});
		errors = errors.length === 0 ? null : errors;
	}

	describe('create test document with whole range of numbers', function() {

		before(function(done) {
			var doc = { input: [] };
			for (var i = -1000; i <= 1000; i++) {
				var number = jsRound(i * 0.01);
				doc.input.push(number);
			}
			db.testCollection.save(doc, done);
		});

		describe('toCents', function() {

			function toCents(valueExpression) {
				return round({$multiply: [valueExpression, 100]});
			}

			before(aggregateOperation(
				{ $project: {
					input: 1,
					output: {
						$map: {
							input: '$input',
							as: 'number',
							in: toCents('$$number')
						}
					}
				} }
			));

			before(function() {
				findOutputErrorsForExpected(function(number) {
					return jsRound(number * 100);
				});
			});

			it('should have no errors', function() {
				expect(errors).to.be.null;
			});
		});

		describe('fromCents', function() {

			function fromCents(valueExpression) {
				return round({$divide: [valueExpression, 100]}, 2);
			}

			before(aggregateOperation(
				{ $project: {
					input: 1,
					output: {
						$map: {
							input: '$input',
							as: 'number',
							in: fromCents('$$number')
						}
					}
				} }
			));

			before(function() {
				findOutputErrorsForExpected(function(number) {
					return jsRound(number / 100);
				});
			});

			it('should have no errors', function() {
				expect(errors).to.be.null;
			});
		});

		describe('to two decimals', function() {
			before(aggregateOperation(
				{ $project: {
					input: 1,
					output: {
						$map: {
							input: '$input',
							as: 'number',
							in: round('$$number', 2)
						}
					}
				} }
			));

			before(function() {
				findOutputErrorsForExpected(function(number) {
					return jsRound(number);
				});
			});

			it('should have no errors', function() {
				expect(errors).to.be.null;
			});
		});

		describe('to zero decimals', function() {
			before(aggregateOperation(
				{ $project: {
					input: 1,
					output: {
						$map: {
							input: '$input',
							as: 'number',
							in: round('$$number')
						}
					}
				} }
			));

			before(function() {
				findOutputErrorsForExpected(function(number) {
					return number > 0 ? Math.round(Math.abs(number)) : -Math.round(Math.abs(number));
				});
			});

			it('should have no errors', function() {
				expect(errors).to.be.null;
			});
		});
	});

});
