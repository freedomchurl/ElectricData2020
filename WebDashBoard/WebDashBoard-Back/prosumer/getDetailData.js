var pool = require('../setting/mysql_create'); // Caching이 된다.

//선택된 프로슈머 최근 1달 데이터 가져와서 가공해서 주기
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
        // select * from userdata where timestampdiff(month,time,NOW()) <= 0 order by time;  -> 오름차순 
        // control data도 가져와야한다.
        var exec = conn.query('select * from userdata where pID=? and timestampdiff(month,time,NOW()) <= 0 order by time',pID, function (err, result) {
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