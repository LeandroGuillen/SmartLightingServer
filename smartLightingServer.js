var express = require("express");//Express Middleware
var crypto = require('crypto'); //Crypto lib http://nodejs.org/api/crypto.html
var http = express.createServer(); //HTTP Server (similar to a socket)
var fs = require("fs"); //Read files


function initHttpServer(){	
	
	var lightStatus = true;
	var streetlightStatus = true;
	var dim = 100;
	
	/*
		Validate authentication headers
	*/
	function authenticate(req, res, key, user){
		
		var md5sum = crypto.createHash('md5');
		md5sum.update(key+req.get('Date'));
		var result = md5sum.digest('hex');
		/* string_a.localeCompare(string_b);
				Returns:
				 0:  exact match
				-1:  string_a < string_b
				 1:  string_b > string_b */
		if((req.get('User-Agent').localeCompare(user))==0 && (req.get('apiKey').localeCompare(result))==0){
			return 0;
		} else {
			return 1;
		}
	}
	
	/*
		Get random temperature value between -10 and 40
	*/
	function getTemperature(){
		//First I get a value random between 1 and 100, (1 - 100)
		//After, divide by 2 (1 - 50)
		//Finally, sub 10 (-10 - 40)
		return Math.floor((Math.random()*100)+1) / 2 - 10;
		
	}
	
	/*
		Get Light status
	*/
	function getLight(){
		return lightStatus;
		
	}
	
	/*
		Set Light status
	*/
	function setLight(newStatus){
		lightStatus = newStatus;
	}
	
	/*
		Set Light Toggle 
	*/
	function setLightToggle(){
		lightStatus = !lightStatus;
		console.log('Toggle: New light status: ', lightStatus);
	}
	
	
	/*
		Get StreetLight status
	*/
	function getStreetLight(){
		return streetlightStatus;
		
	}
	
	/*
		Set StreetLight status
	*/
	function setStreetLight(newStatus){
		streetlightStatus = newStatus;
	}
	
	/*
		Set StreetLight Toggle 
	*/
	function setStreetLightToggle(){
		streetlightStatus = !streetlightStatus;
		console.log('Toggle: New streetlightStatus status: ', streetlightStatus);
	}
	
	
	/*
		Set Dim level for the street light (Value between 1 and 100) 
	*/
	function setDim(level){
		if(level=='')
			console.log('Get case');
		else if(level > 0){
			setStreetLight(true);
			if(level > 100){
				dim = 100;
			} else {
				dim = level;
			}
		} else if (level == 0){
			dim = 0;
			setStreetLight(false);
		}
	}
	
	/*
		Get Dim level for the street light (Value between 1 and 100) 
	*/
	function getDim(){
		return dim;
	}
	
	/*
		Load external resources (files)
	*/
	function getResource(req, res, route){
		//Write the header of the WebPage
		res.writeHead(200, {"Content-Type": "text/html"});
		//Get a file (useful to load external html files)
		fs.readFile(route, function(error, data){
			if(error){
				throw error;
			}
			//write the content of tile as part of the reply
			res.write(data);
			res.end();
		});
	}
	
	/*
		Configuration functions
	*/
	http.configure(function(){
		http.use(express.methodOverride());
		http.use(express.bodyParser());
		http.use(http.router);
	});
	
	
	/*
		Default ROOT directory
		getResource(req,res,string);
	*/
	http.get('/', function(req,res){
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("SmartLighting Server!");
		res.end();
	});		
	
	/*
		Status resource
	*/
	http.get('/status', function(req,res){
		
		//Check if some of the required headers for authentcation are "undefined"
		if((typeof req.get('Date') === 'undefined') ||
		(typeof req.get('apiKey') === 'undefined') ||
		(typeof req.get('User-Agent') === 'undefined')){
			console.log('Request non authenticated\n');
			res.json(215, { status: 'Operation successfully non-authenticated' });
			res.end();
		} else { //The request is authenticated
		
			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');
			
			switch(result){
				case 0: //Authentication OK
					console.log('Authentication OK\n');
					res.json(200, { status: 'Operation successfully authenticated' });
					res.end();
					break; 
				case 1: //Authentication Error
					console.log('Authentication Error\n');
					res.json(402, { status: 'Authentication error' });
					res.end();
					break; 
				default:
					console.log('Error\n');
					res.json(400, { status: 'Error' });
					res.end();
			}
		}
		

	});
	
	/*
		Test authentication
	*/
	http.get('/testauth', function(req,res){
		
		//Check if some of the required headers for authentcation are "undefined"
		if((typeof req.get('Date') === 'undefined') ||
		(typeof req.get('apiKey') === 'undefined') ||
		(typeof req.get('User-Agent') === 'undefined')){
			console.log('Request non authenticated - Error\n');
			res.json(400, { status: 'Error' });
			res.end();
		} else { //The request is authenticated
		
			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');
			
			switch(result){
				case 0: //Authentication OK
					console.log('Authentication OK\n');
					res.json(200, { status: 'Operation successful' });
					res.end();
					break; 
				case 1: //Authentication Error
					console.log('Authentication Error\n');
					res.json(402, { status: 'Authentication error' });
					res.end();
					break; 
				default:
					console.log('Error\n');
					res.json(400, { status: 'Error' });
					res.end();
			}
		}
		

	});
	
	/*
		Temp Resource
	*/
	http.get('/temp/temp0', function(req,res){
		
		//Check if some of the required headers for authentcation are "undefined"
		if((typeof req.get('Date') === 'undefined') ||
		(typeof req.get('apiKey') === 'undefined') ||
		(typeof req.get('User-Agent') === 'undefined')){
			console.log('Request non authenticated\n');
			res.json(215, { status: 'Operation successfully non-authenticated', temp: getTemperature() });
			res.end();
		} else { //The request is authenticated
		
			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');
			
			switch(result){
				case 0: //Authentication OK
					console.log('Authentication OK\n');
					
					res.json(200, { status: 'Operation successfully authenticated', temp: getTemperature() });
					
					res.end();
					break; 
				case 1: //Authentication Error
					console.log('Authentication Error\n');
					res.json(402, { status: 'Authentication error' });
					res.end();
					break; 
				default:
					console.log('Error\n');
					res.json(400, { status: 'Error' });
					res.end();
			}
		}
		

	});
	
	/*
		Light resource
	*/
	http.get('/light/light0', function(req,res){
		
		//Check if some of the required headers for authentcation are "undefined"
		if((typeof req.get('Date') === 'undefined') ||
		(typeof req.get('apiKey') === 'undefined') ||
		(typeof req.get('User-Agent') === 'undefined')){
			console.log('Request non authenticated\n');
			
			/* First check that the parameter is defiened in order to avoid errors, second that the value is true */
			if( !(typeof req.param('toggle') === 'undefined') &&
				(req.param('toggle').localeCompare('true'))==0){
					setLightToggle();
					res.json(215, { status: 'Operation successfully non-authenticated', command : 'toggle', light: getLight() });
					res.end();
			} else if ( !(typeof req.param('set') === 'undefined') &&
				(req.param('set').localeCompare('true'))==0){
					setLight(true);
					res.json(215, { status: 'Operation successfully non-authenticated', command : 'set', light: getLight() });
					res.end();
			} else if ( !(typeof req.param('set') === 'undefined') &&
				(req.param('set').localeCompare('false'))==0){
					setLight(false);
					res.json(215, { status: 'Operation successfully non-authenticated', command : 'set', light: getLight() });
					res.end();
			}
			
			res.json(215, { status: 'Operation successfully non-authenticated', command : 'get', light: getLight() });
			res.end();
		} else { //The request is authenticated
		
			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');
			
			switch(result){
				case 0: //Authentication OK
					console.log('Authentication OK\n');
								
								/* First check that the parameter is defiened in order to avoid errors, second that the value is true */
						if( !(typeof req.param('toggle') === 'undefined') &&
							(req.param('toggle').localeCompare('true'))==0){
								setLightToggle();
								res.json(200, { status: 'Operation successfully authenticated', command : 'toggle', light: getLight() });
								res.end();
						} else if ( !(typeof req.param('set') === 'undefined') &&
							(req.param('set').localeCompare('true'))==0){
								setLight(true);
								res.json(200, { status: 'Operation successfully authenticated', command : 'set', light: getLight() });
								res.end();
						} else if ( !(typeof req.param('set') === 'undefined') &&
							(req.param('set').localeCompare('false'))==0){
								setLight(false);
								res.json(200, { status: 'Operation successfully authenticated', command : 'set', light: getLight() });
								res.end();
						}
						
						res.json(200, { status: 'Operation successfully authenticated', command : 'get', light: getLight() });
						res.end();
						break;
							case 1: //Authentication Error
					console.log('Authentication Error\n');
					res.json(402, { status: 'Authentication error' });
					res.end();
					break; 
				default:
					console.log('Error\n');
					res.json(400, { status: 'Error' });
					res.end();
			}
		}
		

	});
	
	/*
		Street Light resource
		
	*/
	http.get('/streetlight/streetlight0', function(req,res){
		
		//Check if some of the required headers for authentcation are "undefined"
		if((typeof req.get('Date') === 'undefined') ||
		(typeof req.get('apiKey') === 'undefined') ||
		(typeof req.get('User-Agent') === 'undefined')){
			console.log('Request non authenticated\n');
			
			if( !(typeof req.param('lat') === 'undefined') &&
						!(typeof req.param('lon') === 'undefined') &&
						req.param('lat') >= 38.023661 &&
						req.param('lat') <= 38.024079 &&
						req.param('lon') >= -1.173911 &&
						req.param('lon') <= -1.173552){
						
						console.log('Location OK');
						
						if(!(typeof req.param('toggle') === 'undefined') &&
							(req.param('toggle').localeCompare('true'))==0){
								setStreetLightToggle();
								res.json(201, { status: 'Operation successfully geo-localized and non-authenticated', command : 'toggle', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} else if ( !(typeof req.param('set') === 'undefined') &&
							(req.param('set').localeCompare('true'))==0){
								setStreetLight(true);
								res.json(201, { status: 'Operation successfully geo-localized and non-authenticated', command : 'set', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} else if ( !(typeof req.param('set') === 'undefined') &&
							(req.param('set').localeCompare('false'))==0){
								setStreetLight(false);
								res.json(201, { status: 'Operation successfully geo-localized and non-authenticated', command : 'set', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} else if ( !(typeof req.param('dim') === 'undefined')){
								setDim(req.param('dim'));
								res.json(201, { status: 'Operation successfully geo-localized and non-authenticated', command : 'dim', streetlight: getStreetLight(),
								dim: getDim(),
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} else {
								res.json(201, { status: 'Operation successfully geo-localized and non-authenticated', command : 'get', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							}
						
						console.log('Geo-Location OK but authentication was non-included\n');
			} else {
				res.json(400, { status: 'Error'});
				res.end();
			}
		} else { //The request is authenticated
		
			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');
			
			switch(result){
				case 0: //Authentication OK
					console.log('Authentication OK\n');
					
					/* Now verifies geo-location */
					if( !(typeof req.param('lat') === 'undefined') &&
						!(typeof req.param('lon') === 'undefined') &&
						req.param('lat') >= 38.023661 &&
						req.param('lat') <= 38.024079 &&
						req.param('lon') >= -1.173911 &&
						req.param('lon') <= -1.173552){
						
						console.log('Geo-Location OK\n');
						
							if(!(typeof req.param('toggle') === 'undefined') &&
							(req.param('toggle').localeCompare('true'))==0){
								setStreetLightToggle();
								res.json(200, { status: 'Operation successfully authenticated and geo-localized', command : 'toggle', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} else if ( !(typeof req.param('set') === 'undefined') &&
							(req.param('set').localeCompare('true'))==0){
								setStreetLight(true);
								res.json(200, { status: 'Operation successfully authenticated and geo-localized', command : 'set', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} else if ( !(typeof req.param('set') === 'undefined') &&
							(req.param('set').localeCompare('false'))==0){
								setStreetLight(false);
								res.json(200, { status: 'Operation successfully authenticated and geo-localized', command : 'set', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} else if ( !(typeof req.param('dim') === 'undefined')){
								setDim(req.param('dim'));
								res.json(200, { status: 'Operation successfully geo-localized and non-authenticated', command : 'dim', streetlight: getStreetLight(),
								dim: getDim(),
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							} 
							else {
								res.json(200, { status: 'Operation successfully authenticated and geo-localized', command : 'get', streetlight: getStreetLight() ,
								geo: { lat: req.param('lat'),
								lon: req.param('lon') }});
								res.end();
							}
						} else {
							res.json(403, { status: 'Geo-location error' });
							res.end();
						}
				
					
					
					break; 
				case 1: //Authentication Error
					console.log('Authentication Error\n');
					res.json(402, { status: 'Authentication error' });
					res.end();
					break; 
				default:
					console.log('Error\n');
					res.json(400, { status: 'Error' });
					res.end();
			}
		}
		

	});

	
	http.get('/test', function(req,res){
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("ok");
		res.end();
	});		
	
	/*
		Resources can be located in the following subdirectories (images, files, etc.)
	*/
	http.use(express.static(__dirname + '/web'));
	http.use(express.static(__dirname + '/web/public'));
	http.use(express.static(__dirname + '/web/public/images'));
	
	
 	http.listen(8080);
	console.log("HTTP Server initiated!");

}

exports.initHttpServer = initHttpServer;


