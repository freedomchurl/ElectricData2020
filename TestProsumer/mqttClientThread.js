const cluster = require('cluster');
const mqtt = require('mqtt');
var cron = require('node-cron');


if (cluster.isMaster) {

    for (var i = 0; i < 3; i += 1) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
      //console.log("Yay, the worker responded after it was forked");
    });

    cluster.on('exit', function (worker ,code, signal) {
        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        console.log(`worker ${worker.process.pid} died`);
    });
}else{
    var client  = mqtt.connect('mqtt://localhost');
    const options = {
      host: '127.0.0.1',
      port: 1883,
      protocol: 'mqtts',
      //username:"root",
      //password:"password",
    };


    // second minute hour day-of-month month day-of-week
    cron.schedule('55 * * * * *', function(){
      output = Math.random();
      demand = Math.random();
      storage = Math.random();

      var msg = {"pID":String(cluster.worker.id), "output":output,"storage":storage,"demand":demand}

      var msg_json = JSON.stringify(msg);
      //console.log(msg_json.toString())
      console.log("User Input is " + msg_json.toString())
      client.publish('topic', msg_json.toString())
    });

    client.on("connect", () => {
      console.log("connected"+ client.connected + " PROSUMER" + cluster.worker.id);
    })

    client.subscribe('topic2', 0)

    client.on('message', (topic, message, packet) => {
    	console.log("Conrol Message is "+ message);
    });

}
