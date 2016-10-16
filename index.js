var express = require('express')();
var path = require('path');
express.set('views', path.join(__dirname, 'views'));
express.set('view engine', 'jade');

express.get('/download/request',function(req,res){
	res.status(200).json({message:req.query.host});
});

express.listen(3005,function(){
	console.log('express server listening on port: ',this.address().port);
});