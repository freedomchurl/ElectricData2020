var pool = require('../setting/mysql_create'); // Caching이 된다.
var client = require('../setting/redis');
//const USERNUM = 3;

var getDetail = function (req, res) {
    var USERNUM = req.query.usernum;
    console.log(USERNUM);
    const multi = client.multi(); // multi-exec를 위한 메소드
    for (var i = 1; i <= USERNUM; i++) {
        let key = 'prosumer:'
        multi.lrange(key + i + ':output', 0, 1);
        multi.lrange(key + i + ':demand', 0, 1);
        //multi.lrange(key + i + ':user_storage', 0, 1);
    }

    multi.exec(function (err, result) {
        if (err) {
            console.log(err);
            res.send({ status: false }) // 오류 전송
        }
        else {
            /*
            여기서, 각 유저들에 대해서, 데이터를 가공해서 배열로 넘겨주어야 한다.
            */
            let returnData = [];
            for (var i = 0; i < USERNUM; i++) {
                var tmpUser = {};

                tmpUser.output = result[i * 2][0];
                tmpUser.demand = result[i * 2 + 1][0];

                if (result[i * 2][0] > result[i * 2][1]) // 가장 최신게 더 증가하였으면,
                    tmpUser.up_output = 2;
                else if (result[i * 2][0] == result[i * 2][1])
                    tmpUser.up_output = 1;
                else
                    tmpUser.up_output = 0;
                
                // 2 - 증가, 1 - 유지, 0 - 감소
                if (result[i * 2+1][0] > result[i * 2+1][1]) // 가장 최신게 더 증가하였으면,
                    tmpUser.up_demand = 2;
                else if (result[i * 2+1][0] == result[i * 2+1][1])
                    tmpUser.up_demand = 1;
                else
                    tmpUser.up_demand = 0;
                
                

                returnData.push(tmpUser);
            }
            //console.log('Call Detail Live');
            //console.log(returnData);
            //console.log(JSON.stringify(returnData));
            let resData = { status: true, payload: returnData };
            //let resData = { status: true, output: avg_output.reverse(), demand: avg_demand.reverse(), storage: avg_user_storage.reverse() };
            //console.log(resData);
            res.send(resData);
        }
    })
}


module.exports = getDetail;