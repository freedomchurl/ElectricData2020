const redis = require('redis');
const client = redis.createClient(6379, '192.168.0.29');

//client.rpush('fruits1', 'apple', 'orange', 'apple');
//client.lpush('fruits1', 'banana', 'pear');

//client.rpush('fruits2', 'apple2', 'orange', 'apple');
//client.lpush('fruits2', 'banana', 'pear');


const multi = client.multi();
multi.lrange('prosumer:1:output', 0, -1);
multi.lrange('prosumer:2:output', 0, -1);

multi.exec(function (err, result) {
  if (err) {
    console.log(err);
  }
  else {
    console.log(result);
    let sum = []
    //let sum = new Array(result[0].length);
    console.log(sum);
   
    for (var i = 0; i < result[0].length; i++) {
      let tmpsum = 0;
      for (var j = 0; j < 2; j++){
        console.log(parseFloat(result[j][i]));
        tmpsum += parseFloat(result[j][i]);
      }
      sum[i] = tmpsum
    }
   
    console.log(sum);
   
  }
})
//client.mul


// client.lrange('fruits1', 0, 3, (err, arr) => {
//   console.log(arr); // ['pear', 'banana', 'apple', 'orange', 'apple']
// });
// client.lrange('fruits2', 0, -1, (err, arr) => {
//   console.log(arr); // ['pear', 'banana', 'apple', 'orange', 'apple']
// });
// // getObjects: function(keys, callback) {

// //   const multi = redis.multi();

// //   for(var i=0; i < keys.length; i++) {
// //       console.log('key =', keys[i]);

// //       multi.hgetall(keys[i]);
// //   }
// //   multi.exec(function(err, result){
// //       if(err){
// //           console.log(err);
// //           callback(err);
// //       }          

// //       callback(null, result);
// //   });
// // }