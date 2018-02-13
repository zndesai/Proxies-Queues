var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
	client.lpush("recentURL", req.url);
    client.ltrim("recentURL", 0, 4);
	next(); // Passing the request to the next handler in the stack.
});

app.get('/', function(req, res) {
	res.send('hello world')
});

app.get('/test', function(req, res) {
	{
		res.writeHead(200, {'content-type':'text/html'});
		res.write("<h3>test</h3>");
   		res.end();
	}
})

app.get('/set/:key', function(req, res){
	client.set("ExpireTest", req.params.key);
	client.expire("ExpireTest", 10); 
	res.send("Key set to "+ req.params.key+". Key will expire in 10 seconds"); 
});

app.get('/set', function(req, res){
	client.set("ExpireTest","Message");
	client.expire("ExpireTest", 10); 
	res.send("this message will self-destruct in 10 seconds"); 
});

app.get('/get', function(req, res){
	client.get("ExpireTest", function(err,value){ 
		res.send(value);
	});
});

app.get('/recent', function(req, res){
	client.lrange("recentURL", 0, -1, function(err, value){
		res.send(value);
	});
});

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }

    callback(null, lines[+line_no]);
}

 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
            client.lpush("catimage",img)
 		});
 	}
    res.status(204).end()
 }]);

 app.get('/meow', function(req, res) {
     client.lpop("catimage", function(err, value){
        if (err) throw err;
        res.writeHead(200, {'content-type':'text/html'});
        res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+value+"'/>");
        res.end();
	});
 })

var cachingFeature = true;
app.get('/catfact/:num', function(req, res){ 
var start = process.hrtime();
	if(cachingFeature){
        client.exists(req.params.num, function(err, reply) {
    		if (reply === 1) {
       			console.log('Stored in redis');
			client.get(req.params.num, function(err,value){ 
			var end = process.hrtime(start);
			res.send(value + " :: Stored Time :: " + end[0] + end[1]/1000000);
			});
   		 } else {
       	    console.log('First time');
			get_line('./catfacts.txt',req.params.num,function(err, line)
            {
                if (err) throw err;
                client.set(req.params.num, line);
                client.expire(req.params.num, 10);
                var end = process.hrtime(start);
                res.send(line +" :: First Time :: "+ end[0] + end[1]/1000000);
		    });
   			 }
		});
	}else{
			get_line('./catfacts.txt',req.params.num,function(err, line)
            {
                if (err) throw err;
                client.set(req.params.num, line);
                client.expire(req.params.num, 10);
                var end = process.hrtime(start);
                res.send(line + " :: Time :: "+ end[0] + end[1]/1000000);
		    });

	}
});

app.get('/toggleCacheFeature', function(req, res){ 
	cachingFeature = !cachingFeature;
	res.send("");
});

// HTTP SERVER
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
