var pool = require('../setting/mysql_create'); // Caching이 된다.

//선택한 프로슈머 정보 가져오기 ( pID, 이름, 메모 ) - detail 페이지용
//GET, key -> pID
var getDetail = function (req, res) {
    let pID = req.query.pID;
    // pID를 가져온다. 

    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            throw err;
        }
        // GET, 파라미터 pID.
        var exec = conn.query('select * from prosumer_info where pID=?',pID, function (err, result) {
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
};


module.exports = getDetail;