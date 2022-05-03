const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({ url: keys.redisUrl });

(async () => await redisClient.connect())();

const sub = redisClient.duplicate();
(async () => await sub.connect())();

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

(async () =>
    await sub.subscribe('insert', (message) => {
        console.log('came here with ', message);
        redisClient.hSet('values', message, fib(parseInt(message)));
    }))();
