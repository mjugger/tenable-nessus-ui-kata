var express = require('express');
var path = require('path');
var faker = require('faker');
var app = express();
var fakeDatabase = [
	{
		name:'host1',
		hostname:'nessus-ntp.lab.com',
		port:1241,
		username:'toto'
	},
	{
		name:'host2',
		hostname:'nessus-xml.lab.com',
		port:3384,
		username:'admin'
	}
];

function generateFakeDB(dbSize){
	for (var i = 0; i < dbSize; i++) {
		fakeDatabase.push({
			name:faker.name.findName(),
			hostname:faker.internet.url(),
			port:faker.random.number(),
			username:faker.internet.userName()
		});
	};
};

function requestDBRecords(amount){
	if(amount){
		return fakeDatabase.slice(0,amount);
	}else{
		return [];
	}
}

app.use(express.static('public'));

app.get('/',function(req,res){
	res.status(200).json({message:"no page"});
});

app.get('/download/request',function(req,res){
	res.status(200).json({configurations:requestDBRecords(req.query.host)});
});

app.listen(3005,function(){
	generateFakeDB(9998);
	console.log('express server listening on port: ',this.address().port);
});