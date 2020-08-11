var setting = require('../setting/setting.json')
var mysql = require('mysql');

var pool = mysql.createPool(setting.mysql)


module.exports = pool;