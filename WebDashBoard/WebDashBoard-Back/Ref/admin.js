var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors');

var pool = mysql.createPool({
connectionLimit : 20,
host : 'localhost',
user : 'root',
password : 'dlcjf2779!',
database : 'kubiot',
debug: true,
charset : 'utf8'
});


router.use(express.json());
router.post('/signup',function(req,res){
		// admin 가입
		var id = req.body.adminid;
		var pwd = req.body.adminpwd;
		// ID랑 PWD를 가져온다.
		console.log(id + ' ' + pwd);
		pool.getConnection(function(err,conn){
				if(err){
				if(conn){
				conn.release();
				}
				throw err;		
				}
				data = {id:id,pass:pwd};
				var exec = conn.query('insert into admin set ?',data,function(err,result){
						conn.release();

						res.header("Access-Control-Allow-Headers","Authorization");
						res.header("Access-Control-Expose-Headers","*");
						if(err){
						res.send({status:false});
						}
						else{
						res.send({status:true});
						}
						});

		});

});


router.post('/signin',function(req,res){
	var id = req.body.adminid;
	var pwd = req.body.adminpwd;

	pool.getConnection(function(err,conn){
		if(err){
			if(conn){
				conn.release();
			}
			throw err;
		}
		//data = {id:id,pass:pwd};
		data = "id=" + id + " and " + "pass=" + pwd;
		data = [id, pwd];
		var exec = conn.query('select * from admin where id=? and pass=?',data,function(err,result){
			conn.release();
			res.header("Access-Control-Allow-Headers","Authorization");
			res.header("Access-Control-Expose-Headers","*");
			if(err){
				res.send({status:false});
			}
			else{
				console.log(result.length);
				console.log(result);	
				if(result.length == 1){
					res.send({status:true});
				}
				else{
					res.send({status:false});
				}
			}
		});

		

	});
});


module.exports = router;
