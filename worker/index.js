const redis = require('redis');

const { redisHost, redisPort } = require('./config');

const client = redis.createClient({
	host: redisHost,
	port: redisPort,
	retry_strategy: () => 1000,
});
const sub = client.duplicate();

const fib = (index) => {
	// recursive solution on purpose, because it is slow
	// so it makes sense to use worker for calculating the value
	if (index < 2) return 1;
	return fib(index - 1) + fib(index - 2);
};

sub.on('message', (channel, message) => {
	client.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
