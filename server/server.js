var express = require('express');
var app = express();
var fs = require('fs');
var cors = require('cors');

app.get('/get-maps', cors(), function (req, res) {
	var maps = [];
	fs.readdir(__dirname, (err, files) => {
		files.forEach((file) => {
			if (!file.match(/server/gim)){
				var stats = fs.statSync(__dirname+"/"+file);
				maps.push({
					name: file,
					size: stats.size,
					mtime: stats.mtime
				});
			}
		});
		res.end(JSON.stringify({
			status: 200,
			maps: maps
		}));
	});
});

app.post('/save-map', cors(), function (req, res) {
	var body = '';
	filePath = __dirname + '/map.json';
	req.on('data', function(data) {
		body += data;
	});

	req.on('end', function (){

		data = JSON.parse(body);

		//
		filePath = __dirname + `/map.${data.mapName}.json`;

		fs.writeFile(filePath, body, function() {
			console.log("Map saved. Length: "+body.length);
			res.end(JSON.stringify({
				status: 200,
				file: `${data.mapName}.json`,
				message: "Map saved. Length: "+body.length,
				data: data
			}));
		});
	});
});

app.listen(3000, function () {
	console.log('Server started at port 3000');
});

