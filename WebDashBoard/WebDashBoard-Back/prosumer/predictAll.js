var pool = require('../setting/mysql_create'); // Caching이 된다.
var client = require('../setting/redis');
// 예측 데이터 용
//GET, key -> pID
var getDetail = function (req, res) {
    let pID = req.query.pID;
    // pID를 가져온다. 
    console.log(pID);
    const multi = client.multi(); // multi-exec를 위한 메소드
    // multi.lrange(key + i + ':output', 0, -1);
    // multi.lrange(key + i + ':demand', 0, -1);
    // multi.lrange(key + i + ':user_storage', 0, -1);
    /*
    가격 예측 get predict-price => {"data": 배열}
생산 예측 get prosumer:1:predict_output => {"data":배열}
수요 예측 get prosumer:1:predict_demand => {"data":배열}
*/
    multi.get('predict-price')
    multi.get('prosumer:' + pID + ':predict_output')
    multi.get('prosumer:' + pID + ':predict_demand')


    multi.exec(function (err, result) {
        if (err) {
            console.log(err);
            res.send({ status: false }) // 오류 전송
        }
        else {
            /*
            여기서, 각 유저들에 대해서, 데이터를 가공해서 배열로 넘겨주어야 한다.
            */
           console.log(result);
            let returnData = {};
            returnData.retail = JSON.parse(result[0]).data
            returnData.output = JSON.parse(result[1]).data
            returnData.demand = JSON.parse(result[2]).data
            console.log(returnData);
            //console.log('Call Detail Live');
            //console.log(returnData);
            //console.log(JSON.stringify(returnData));
            let resData = { status: true, payload: returnData };
            //let resData = { status: true, output: avg_output.reverse(), demand: avg_demand.reverse(), storage: avg_user_storage.reverse() };
            //console.log(resData);
            res.send(resData);
        }
    })
};


module.exports = getDetail;