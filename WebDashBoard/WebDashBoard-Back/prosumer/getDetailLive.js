var pool = require('../setting/mysql_create'); // Caching이 된다.
var client = require('../setting/redis');
const USERNUM = 3;
//선택한 프로슈머의 최근 6시간
//GET, key -> pID
var getDetail = function (req, res) {
    //let pID = req.query.pID;
    // pID를 가져온다. 
    
    const multi = client.multi(); // multi-exec를 위한 메소드
        for (var i = 1; i <= USERNUM; i++) {
            let key = 'prosumer:'
            multi.lrange(key + i + ':output', 0, -1);
            multi.lrange(key + i + ':demand', 0, -1);
            multi.lrange(key + i + ':user_storage', 0, -1);
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
                for(var i=0;i<USERNUM;i++)
                {
                    var tmpUser = {};
                    //tmpUser.output = parseFloat(result[i * 3]);
                    //tmpUser.demand = parseFloat(result[i*3+1]);
                    //tmpUser.storage = parseFloat(result[i*3+2]); 
                    tmpUser.output = result[i*3];
                    tmpUser.demand = result[i*3+1];
                    tmpUser.storage = result[i*3+2];
                    returnData.push(tmpUser);
                }
                //console.log('Call Detail Live');
                //console.log(returnData);
                //console.log(JSON.stringify(returnData));
                let resData = {status:true,payload:returnData};
                //let resData = { status: true, output: avg_output.reverse(), demand: avg_demand.reverse(), storage: avg_user_storage.reverse() };
                //console.log(resData);
                res.send(resData);
            }
        })
};


module.exports = getDetail;