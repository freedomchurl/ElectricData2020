const redis = require('redis');
const client = redis.createClient({port:6377,host:'49.50.167.74',password:'dlcjf'});
//const client = redis.createClient(6379,'192.168.0.29');
//client.rpush('fruits', 'apple', 'orange', 'apple');
//client.lpush('fruits', 'banana', 'pear');
// client.lrange('prosumer:1:output', 0, -1, (err, arr) => {
//   console.log(arr); // ['pear', 'banana', 'apple', 'orange', 'apple']
// });

module.exports = client;