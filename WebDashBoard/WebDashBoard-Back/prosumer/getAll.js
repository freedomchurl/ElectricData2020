var pool = require('../setting/mysql_create'); // Caching이 된다.

//전체 프로슈머 정보 가져오기 ( 이름 및 pID만 ) - prosumer 페이지용,
//GET, parameter 없음
var getAll = function (req, res) {

    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            throw err;
        }
        // GET, 파라미터 없음. 그대로 모든 유저 가져오기
        var exec = conn.query('select pID,name from prosumer_info', function (err, result) {
            conn.release();

            res.header("Access-Control-Allow-Headers", "Authorization");
            res.header("Access-Control-Expose-Headers", "*");
            if (err) {
                res.send({ status: false ,payload:null });
            }
            else {
                res.send({ status: true, payload:result });
            }
        });

    });

}


module.exports = getAll;