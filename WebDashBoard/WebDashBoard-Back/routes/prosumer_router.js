var express = require('express')
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors');

//var pool = require('../setting/mysql_create'); // Caching이 된다.

//import All from '../prosumer/getAll';
// ES6 version import.
let getAll = require('../prosumer/getAll');
let getDetail = require('../prosumer/getDetail');
let modifyDetail = require('../prosumer/modifyDetail');
let getDetailData = require('../prosumer/getDetailData');
let getMainLive = require('../prosumer/getMainLive');
let getDetailLive = require('../prosumer/getDetailLive');
let predictAll = require('../prosumer/predictAll');
let getNum = require('../prosumer/getNum');
let getSide = require('../prosumer/getSide');

router.use(express.json());

router.get('/getmainside',getSide);

router.get('/getnum',getNum);

router.get('/all',getAll);
// getAll function.

router.get('/getdetail',getDetail);
// getDetail

router.post('/modifydetail',modifyDetail);
// ------------
router.get('/getdetaildata',getDetailData);
//------ 여기까지 완료 

router.get('/getmainlive',getMainLive);

router.get('/getdetaillive',getDetailLive);

router.get('/predictall',predictAll);





module.exports = router;




