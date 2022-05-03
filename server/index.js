const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');
const keys = require('./keys');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient.on('connect', (client) => {
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
    url: keys.redisUrl
});

(async () => {
    await redisClient.connect();
})();

const redisPublisher = redisClient.duplicate();
(async () => {
    await redisPublisher.connect();
})();

app.get('/', (req, res) => {
    res.send('hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    try {
        const values = await redisClient.hGetAll('values');
        res.send(values);
    } catch (err) {
        console.log(err);
        res.send({ message: 'error' });
    }
});

app.post('/values', async (req, res) => {
    try {
        const index = req.body.index;

        if (parseInt(index) > 40) {
            return res.status(422).send('Index too high');
        }
        await redisClient.hSet('values', index, 'Nothing yet!');
        redisPublisher.publish('insert', index);
        pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

        res.send({ working: true });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.listen(5000, () => console.log('listening'));
