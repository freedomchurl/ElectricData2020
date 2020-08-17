const cluster = require('cluster');
const mqtt = require('mqtt');
var cron = require('node-cron');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

var output_arr = [];
var demand_arr = [];

function randomCreator(){
  // a + b + c + d = 1 인 랜덤 생성.
  result = []
  a = Math.random()
  b = Math.random() * (1-a)
  c = Math.random() * (1-a-b)
  d = 1-a-b-c

  result.push(a)
    result.push(b)
      result.push(c)
        result.push(d)

        return result
}


    if (cluster.isMaster) {

        for (var i = 0; i < 10; i += 1) {
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
      Promise.all([readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Prosumer_Generated_input\\renewable_1.csv', "utf-8"),
      readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Prosumer_Generated_input\\renewable_2.csv', "utf-8"),
      readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Prosumer_Generated_input\\renewable_3.csv', "utf-8"),
      readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Prosumer_Generated_input\\renewable_4.csv', "utf-8")])
        .then(data => {
          for(var i = 0 ; i< 4; i++){
            var dataArray = data[i].split("\n");
            output_arr.push(dataArray);
          }

          })
          .then(content => {
            return Promise.all([readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Demand_input\\demand_1.csv', 'utf8'),
            readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Demand_input\\demand_2.csv', 'utf8'),
            readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Demand_input\\demand_3.csv', 'utf8'),
            readFile('C:\\Users\\JIMIN\\Desktop\\ElectricData2020\\TestProsumer\\Demand_input\\demand_4.csv', 'utf8')])
          })
          .then(data =>{
            for(var i = 0 ; i< 4; i++){
              var dataArray = data[i].split("\n");
              demand_arr.push(dataArray);
            }

          })
          .then(content =>{
        var client  = mqtt.connect('mqtt://localhost');
        const options = {
          host: '127.0.0.1',
          port: 1883,
          protocol: 'mqtts',
          //username:"root",
          //password:"password",
        };



        var storage = Math.random()*100 + 200; // 초기 저장량
        var timeslot = 0
        // second minute hour day-of-month month day-of-week
        cron.schedule('55 * * * * *', function(){
          //output = Math.random();
          //demand = Math.random();
          thisRand = randomCreator()

          output = thisRand[0]*output_arr[0][timeslot] + thisRand[1]*output_arr[1][timeslot] + thisRand[2]*output_arr[2][timeslot] + thisRand[3]*output_arr[3][timeslot]
          demand = thisRand[0]*demand_arr[0][timeslot] + thisRand[1]*demand_arr[1][timeslot] + thisRand[2]*demand_arr[2][timeslot] + thisRand[3]*demand_arr[3][timeslot]
//console.log(thisRand[0] + " " + output_arr[0][timeslot]  + " " +  thisRand[1]  + " " +  output_arr[1][timeslot])
//console.log(thisRand[0] + " " + demand_arr[0][timeslot]  + " " +  thisRand[1] + " " + demand_arr[1][timeslot])
          timeslot += 1;

          var msg = {"pID":String(cluster.worker.id), "output":output,"storage":storage,"demand":demand}

          var msg_json = JSON.stringify(msg);
          //var msg_json = JSON.parse(msg);

          //console.log(msg_json.toString())
            if(cluster.worker.id == 1){



                console.log("\n사용자 데이터");
                console.log("---------------------------------------")
                console.log("생산량 | " + msg.output);
                console.log("수요량 | " + msg.demand);
                console.log("저장량 | " + msg.storage);
                  console.log("---------------------------------------\n")



                //console.log("User Input is " + msg_json.toString())
            }
          client.publish('topic', msg_json.toString())
        });

        client.on("connect", () => {
          if(cluster.worker.id == 1){

            //  console.log(output_arr[0])
            //  console.log(demand_arr[0])
              console.log("\n\nPROSUMER 01");
          }

            console.log("connected"+ client.connected + " PROSUMER" + cluster.worker.id);
          //if(cluster.worker.id == 1)
            //console.log("connected"+ client.connected + " PROSUMER" + cluster.worker.id);
        })

        client.subscribe('topic'+cluster.worker.id, 0)

        client.on('message', (topic, message, packet) => {
          if(cluster.worker.id == 1){
            const obj = JSON.parse(message);
          	//console.log("Conrol Message is "+ message);  console.log("\n제어 데이터");
            if(obj.pID == String(cluster.worker.id)){
                console.log("---------------------------------------")
                console.log("타운 내 판매량 | " + obj.sales_town);
                console.log("전력거래소 판매량 | " + obj.sales_ex);
                console.log("타운 내 구매량 | " + obj.purchase_town);
                console.log("전력거래소 구매량 | " + obj.purchase_ex);
                console.log("저장량 변동 | " + obj.storage);

                console.log("---------------------------------------")
                storage += obj.storage

                console.log("\n\n현재 저장량 >>>>>>> " + storage +"\n");
                console.log("---------------------------------------\n")
              }
          }
        });
    });
  }
