var pool = require('../setting/mysql_create'); // Caching이 된다.
var client = require('../setting/redis');
// redis - client 
USERNUM = 100; // 100명이라고 가정한다.
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
        else if (preiod == '6h')
            endindex = -1;
        // 시간에 따른 endindex,

        const multi = client.multi(); // multi-exec를 위한 메소드
        for (var i = 0; i < USERNUM; i++) {
            let key = 'prosumer:'
            multi.lrange(key + i + 'output', 0, -1);
            multi.lrange(key + i + 'demand', 0, -1);
            multi.lrange(key + i + 'user_storage', 0, -1);
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

                for (var i = 0; i < result[0].length; i++) {
                    let sum_output = 0;
                    let sum_demand =0;
                    let sum_user_storage = 0;
                    for (var j = 0; j < USERNUM; j++) {
                        sum_output += parseFloat(result[j*3][i]);
                        sum_demand += parseFloat(result[j*3+1][i]);
                        sum_user_storage += parseFloat(result[j*3+2][i]);
                    }
                    avg_output[i] = sum_output / result[0].length;
                    avg_demand[i] = sum_demand / result[0].length;
                    avg_user_storage[i] = sum_user_storage / result[0].length;
                }
                
                /*------
                // 여기서 Respone을 보내야 한다. // 추후 형식에 대한 고민 필요 // 
                status:true,
                output:avg_output,
                demand:avg_demand,
                storage:avg_user_storage
                -------*/
                let resData = {status:true,output:avg_output,demand:avg_demand,storage:avg_user_storage};
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
            var exec = conn.query('select * from userdata where timestampdiff(hour,time,NOW()) <= ? order by time', pID, function (err, result) {
                conn.release();

                res.header("Access-Control-Allow-Headers", "Authorization");
                res.header("Access-Control-Expose-Headers", "*");
                if (err) {
                    res.send({ status: false, payload: null });
                }
                else {
                    res.send({ status: true, payload: result });
                }
            });

        });
    }
};


module.exports = getDetail;