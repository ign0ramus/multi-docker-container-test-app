const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');

const {
	redisHost,
	redisPort,
	pgHost,
	pgPort,
	pgUser,
	pgPassword,
	pgDatabase,
} = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

const pgClient = new Pool({
	user: pgUser,
	host: pgHost,
	database: pgDatabase,
	password: pgPassword,
	port: pgPort,
});

pgClient.on('connect', () => {
	pgClient
		.query('CREATE TABLE IF NOT EXISTS values (number INT)')
		.catch(console.log);
});

const client = redis.createClient({
	host: redisHost,
	port: redisPort,
	retry_strategy: () => 1000,
});
const pub = client.duplicate();

app.get('/', (req, res) => {
	res.send('Hi');
});

app.get('/values/all', async (req, res) => {
	const values = await pgClient.query('SELECT * FROM values');
	res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
	client.hgetall('values', (err, values) => {
		res.send(values || {});
	});
});

app.post('/values', async (req, res) => {
	const { index } = req.body;
	if (parseInt(index) > 40) {
		return res.status(422).send('Index too high!');
	}
	client.hset('values', index, 'nothing yet');
	pub.publish('insert', index);
	await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
	res.send({ working: true });
});

app.listen(5000, () => {
	console.log('Listening on port 5000');
});
