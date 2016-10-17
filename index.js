var express = require('express')();
var path = require('path');
var faker = require('faker');
var fakeDatabase = [];

(function generateFakeDB(dbSize){
	for (var i = 0; i < dbSize; i++) {
		fakeDatabase.push({
			name:faker.name.findName(),
			hostname:faker.internet.url(),
			port:faker.random.number(),
			username:faker.internet.userName()
		});
	};
})(10000);

express.set('views', path.join(__dirname, 'views'));
express.set('view engine', 'jade');

express.get('/download/request',function(req,res){
	res.status(200).json({configurations:fakeDatabase});
});

express.listen(3005,function(){
	console.log('express server listening on port: ',this.address().port);
});