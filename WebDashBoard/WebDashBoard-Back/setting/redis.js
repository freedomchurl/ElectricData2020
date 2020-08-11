const redis = require('redis');
const client = redis.createClient(6379,'49.50.175.17');

//client.rpush('fruits', 'apple', 'orange', 'apple');
//client.lpush('fruits', 'banana', 'pear');
// client.lrange('prosumer:1:output', 0, -1, (err, arr) => {
//   console.log(arr); // ['pear', 'banana', 'apple', 'orange', 'apple']
// });

module.exports = client;