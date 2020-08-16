var pool = require('../setting/mysql_create'); // Caching이 된다.
const { get } = require('../setting/redis');


var getDetail = function (req, res) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            throw err;
        }
        // GET, 파라미터 pID.
        var exec = conn.query('select count(*) prosumernum from prosumer_info',function(err,result){
        //var exec = conn.query('select * from userdata where timestampdiff(day,time,NOW()) <= 1 order by time', function (err, result) {
            conn.release();

            res.header("Access-Control-Allow-Headers", "Authorization");
            res.header("Access-Control-Expose-Headers", "*");
            if (err) {
                res.send({ status: false, payload: null });
            }
            else {

                let resData = { status: true, payload:result[0]};
                res.send(resData);
                //res.send({ status: true, payload: result });
            }
        });
    });
}


module.exports = getDetail;