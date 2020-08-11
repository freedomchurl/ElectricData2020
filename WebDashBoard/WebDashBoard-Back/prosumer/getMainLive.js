var pool = require('../setting/mysql_create'); // Caching이 된다.
var client = require('../setting/redis');
// redis - client 

//선택한 프로슈머 정보 가져오기 ( pID, 이름, 메모 ) - detail 페이지용
//GET, key -> pID
var getDetail = function (req, res) {
    let period = req.query.time;
    // period를 가져온다. 
    // 이 시간동안의 평균값 계산.
    if (period != '1d') // 하루가 아닌 경우에는 redis
    {
        // Redis로부터 가져 온다.
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