var pool = require('../setting/mysql_create'); // Caching이 된다.
var client = require('../setting/redis');
// 예측 데이터 용
//GET, key -> pID
var getDetail = function (req, res) {
    let pID = req.query.pID;
    // pID를 가져온다. 

    
};


module.exports = getDetail;