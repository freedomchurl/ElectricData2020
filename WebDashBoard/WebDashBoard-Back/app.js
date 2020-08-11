var express = require('express');
var app = express();
var cors = require('cors');

port = 7272;

app.use(cors());
//var DeviceRoutes = require('./routes/device/device_router.js');
//var ProjectRoutes = require('./routes/project/project_router.js');
var ProsumerRoutes = require('./routes/prosumer_router.js');

app.use(express.json());

// app.use('/device',DeviceRoutes);
// app.use('/project',ProjectRoutes);
app.use('/prosumer',ProsumerRoutes); 

app.listen(port,function(){
        console.log('connected');
});