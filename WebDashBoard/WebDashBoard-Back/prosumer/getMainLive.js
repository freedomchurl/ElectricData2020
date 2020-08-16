var pool = require('../setting/mysql_create'); // Caching이 된다.
var client = require('../setting/redis');
// redis - client 
USERNUM = 3; // 100명이라고 가정한다.
//선택한 프로슈머 정보 가져오기 ( pID, 이름, 메모 ) - detail 페이지용
//GET, key -> pID
var getDetail = function (req, res) {
    let period = req.query.time;
    // period를 가져온다. 
    // 이 시간동안의 평균값 계산.
    if (period != '1d') // 하루가 아닌 경우에는 redis
    {
        // Redis로부터 가져 온다. 그리고 평균 값을 산출해 주어야 함.
        let endindex = 0;
        if (period == '1h')
            endindex = 11;
        else if (period == '2h')
            endindex = 23;
        else if (period == '3h')
            endindex = 35;
        else if (period == '6h')
            endindex = -1;
        // 시간에 따른 endindex,




        const multi = client.multi(); // multi-exec를 위한 메소드
        for (var i = 1; i <= USERNUM; i++) {
            let key = 'prosumer:'
            multi.lrange(key + i + ':output', 0, endindex);
            multi.lrange(key + i + ':demand', 0, endindex);
            multi.lrange(key + i + ':user_storage', 0, endindex);
        }

        multi.exec(function (err, result) {
            if (err) {
                console.log(err);
                res.send({ status: false }) // 오류 전송
            }
            else {
                let avg_output = []
                let avg_demand = [];
                let avg_user_storage = [];
                
                //console.log(result);
                //console.log(result[0].length);
                for (var i = 0; i < result[0].length; i++) {
                    let sum_output = 0;
                    let sum_demand = 0;
                    let sum_user_storage = 0;
                    for (var j = 0; j < USERNUM; j++) {
                        sum_output += parseFloat(result[j * 3][i]);
                        sum_demand += parseFloat(result[j * 3 + 1][i]);
                        sum_user_storage += parseFloat(result[j * 3 + 2][i]);
                    }
                    avg_output[i] = sum_output / USERNUM;
                    avg_demand[i] = sum_demand / USERNUM;
                    avg_user_storage[i] = sum_user_storage / USERNUM;
                }

                /*------
                // 여기서 Respone을 보내야 한다. // 추후 형식에 대한 고민 필요 // 
                status:true,
                output:avg_output,
                demand:avg_demand,
                storage:avg_user_storage
                -------*/

                let resData = { status: true, output: avg_output.reverse(), demand: avg_demand.reverse(), storage: avg_user_storage.reverse() };
                //console.log(resData);
                res.send(resData);
            }
        })

    }
    else {
        pool.getConnection(function (err, conn) {
            if (err) {
                if (conn) {
                    conn.release();
                }
                throw err;
            }
            // GET, 파라미터 pID.
            var exec = conn.query('select avg(output) avg_output, avg(demand) avg_demand, avg(storage) avg_storage from userdata group by UNIX_TIMESTAMP(time) DIV 60 order by UNIX_TIMESTAMP(time) DIV 60 desc limit 288',function(err,result){
            //var exec = conn.query('select * from userdata where timestampdiff(day,time,NOW()) <= 1 order by time', function (err, result) {
                conn.release();

                res.header("Access-Control-Allow-Headers", "Authorization");
                res.header("Access-Control-Expose-Headers", "*");
                if (err) {
                    res.send({ status: false, payload: null });
                }
                else {

                    let avg_output = []
                    let avg_demand = [];
                    let avg_user_storage = [];
                    
                    for(var i =0; i<result.length;i++)
                    {
                        avg_output.push(result[i].avg_output);
                        avg_demand.push(result[i].avg_demand);
                        avg_user_storage.push(result[i].avg_storage);
                    }

                    let resData = { status: true, output: avg_output.reverse(), demand: avg_demand.reverse(), storage: avg_user_storage.reverse() };
                    res.send(resData);
                    //res.send({ status: true, payload: result });
                }
            });

        });
    }
};


module.exports = getDetail;