var pool = require('../setting/mysql_create'); // Caching이 된다.

//선택된 프로슈머 이름, 메모 수정하기 - detail 페이지 수정용
//POST, body -> pID, name, memo
var getDetail = function (req, res) {
    let pID = req.body.pID; 
    let name = req.body.name;
    let memo = req.body.memo;
    console.log(req);
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            throw err;
        }
        // POST
        let updateData = [name,memo,pID];
        var exec = conn.query('update prosumer_info set name=?, memo=? where pID=?',updateData, function (err, result) {
            conn.release();

            res.header("Access-Control-Allow-Headers", "Authorization");
            res.header("Access-Control-Expose-Headers", "*");
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true});
            }
        });

    });
};


module.exports = getDetail;