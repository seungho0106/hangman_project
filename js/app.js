var http = require('http');
var url = require('url');
var result = 'no result';
var error = 'no errors';



try{
    var express = require("express");
    var mysql = require('mysql');
    var app = express();
    var con = mysql.createConnection({
    	host     : 'localhost',
        user     : 'kxwpdetu_user1',
        password : '7s@iZR$ZVringKN7pzS*',
        database : 'kxwpdetu_hang1',
    });
    
    
    con.connect(function(err) {
    	if(!err) {
    	    result = 'Connected to database! \n';
    		console.log("Database is connected ... \n\n");
    	} else {
    		console.log("Error connecting to database ... \n\n");
            result = 'Error connecting to database! \ne';
    	}
    });
    
    function query_handler(callback, error, result) {
        if(error) { console.log(error); callback(null); }
        else callback(result);
        
    }
    
    var getWords = function(callback, n = 10, i = 0) {
        let sql_select = `SELECT * FROM words LIMIT ${n} OFFSET ${i};`;
	    con.query(sql_select, (err,res) => query_handler(callback, err, res));
    }
    
    var words = [];
    getWords(
        res => {
    		if(res) {
    		    for(o of res){
    		        result += `${o.word} `;
    		        words.push(o.word);
    		    }
    		}
    		else{
    		    result += res;
    		}
        },
	n=20, i=0);
	
    var server = http.createServer(function(req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        if( query['f'] == 'getWords' && req.method != 'GET'){
            query = 'yes';
            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"
              );
            res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS"
              );
            //res.end( JSON.stringify({a : 1}) );
            res.end( JSON.stringify({words}) );
        }
        else{
            query = 'no';
        }
        
        if( req.method == 'POST' ){
    		req.on('data', function(data) {
    			response = `${data}`;
    		});
    		req.on('end', function() {
    			res.writeHead(200, {'Content-Type': 'text/html'});
    		    res.end(response);
    		});
    	} else {
    	    //let ip = request.connection.remoteAddress;
    	    //result += `${ip}`;
    		let method  = `${req.method}\n`;
    		res.writeHead(200, {'Content-Type': 'text/plain'});
    		var message = 'It works!\n',
            	version = 'NodeJS ' + process.versions.node + '\n',
            	response = [error, message, method, query, version, result].join('\n');
        	res.end(response);
    	}
    });

	
	


} catch(e) {
    error = e;
}


server.listen();
