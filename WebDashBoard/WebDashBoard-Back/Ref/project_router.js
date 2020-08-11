var express = require('express');
var router = express.Router();

var adminrouter = require('./admin.js');
var projectinfo = require('./projectinfo.js');

var cors = require('cors');

router.use(express.json());
router.use('/admin',adminrouter);
router.use('/projectinfo',projectinfo);

module.exports = router;
