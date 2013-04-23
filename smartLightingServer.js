var express = require("express"); //Express Middleware
var crypto = require('crypto'); //Crypto lib http://nodejs.org/api/crypto.html
var http = express(); //HTTP Server (similar to a socket)
var fs = require("fs"); //Read files
var recursos = require("./res/recursos");
var usersDBAccess = require("./users/usuarios");


function initHttpServer() {
	/*
		Load external resources (files)
	*/
	function getResource(req, res, route) {
		//Write the header of the WebPage
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		//Get a file (useful to load external html files)
		fs.readFile(route, function(error, data) {
			if (error) {
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
	http.configure(function() {
		http.use(express.methodOverride());
		http.use(express.bodyParser());
		http.use(http.router);
	});


	/**
	 *	Autentica un usuario y devuelve una cookie para acceso posterior
	 *
	 *
	 */
	http.get('/auth', function(req, res) {


		if (!comprobarCamposHTTP(req)) {

			// Solicitamos la autenticacion al adaptador
			usersDBAccess.authenticate(req.get('User-Agent'), req.get('apiKey'), req.get('Date'), function(cookie) {

				//PARA PRUEBAS CON RESTCLIENT usersDBAccess.authenticate(req.get('User'), digest, req.get('Dates'), function(cookie) {

				// Se devuelve una respuesta en funcion del resultado de la peticion
				if (cookie.length) {
					res.writeHead(200, {
						"Content-Type": "text/html",
						"Cookie": cookie
					});
					// PARA PRUEBAS CON RESTCLIENT res.write("Bienvenido de nuevo " + req.get('User'));
					res.write("Bienvenido " + req.get('User-Agent'));

					res.end();
				} else {
					res.json(402, {
						status: 'Authentication error. Usuario o contraseña incorrectos'
					});
					res.end();
				}



			});

		} else {

			res.json(402, {
				status: 'Request HTTP incorrecta'
			});
			res.end();

		}

	});

	// Comprueba que no falta ningun campo necesario para la autenticacion

	function comprobarCamposHTTP(req) {
		return (typeof req.get('Date') === 'undefined') || (typeof req.get('apiKey') === 'undefined') || (typeof req.get('User-Agent') === 'undefined');
	}

	/*
		Status resource
	*/
	http.get('/status', function(req, res) {

		//Check if some of the required headers for authentcation are "undefined"
		if (comprobarCamposHTTP(req)) {
			console.log('Request non authenticated\n');
			res.json(215, {
				status: 'Operation successfully non-authenticated'
			});
			res.end();
		} else { //The request is authenticated

			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');

			switch (result) {
				case 0:
					//Authentication OK
					console.log('Authentication OK\n');
					res.json(200, {
						status: 'Operation successfully authenticated'
					});
					res.end();
					break;
				case 1:
					//Authentication Error
					console.log('Authentication Error\n');
					res.json(402, {
						status: 'Authentication error'
					});
					res.end();
					break;
				default:
					console.log('Error\n');
					res.json(400, {
						status: 'Error'
					});
					res.end();
			}
		}


	});

	/*
		Test authentication
	*/
	http.get('/testauth', function(req, res) {

		//Check if some of the required headers for authentcation are "undefined"
		if (comprobarCamposHTTP(req)) {
			console.log('Request non authenticated - Error\n');
			res.json(400, {
				status: 'Error'
			});
			res.end();
		} else { //The request is authenticated

			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');

			switch (result) {
				case 0:
					//Authentication OK
					console.log('Authentication OK\n');
					res.json(200, {
						status: 'Operation successful'
					});
					res.end();
					break;
				case 1:
					//Authentication Error
					console.log('Authentication Error\n');
					res.json(402, {
						status: 'Authentication error'
					});
					res.end();
					break;
				default:
					console.log('Error\n');
					res.json(400, {
						status: 'Error'
					});
					res.end();
			}
		}


	});


	/*
		Light resource
	*/
	http.get('/light/light0', function(req, res) {

		//Check if some of the required headers for authentcation are "undefined"
		if (comprobarCamposHTTP(req)) {
			console.log('Request non authenticated\n');

			/* First check that the parameter is defiened in order to avoid errors, second that the value is true */
			if (!(typeof req.param('toggle') === 'undefined') && (req.param('toggle').localeCompare('true')) == 0) {
				setLightToggle();
				res.json(215, {
					status: 'Operation successfully non-authenticated',
					command: 'toggle',
					light: getLight()
				});
				res.end();
			} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('true')) == 0) {
				setLight(true);
				res.json(215, {
					status: 'Operation successfully non-authenticated',
					command: 'set',
					light: getLight()
				});
				res.end();
			} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('false')) == 0) {
				setLight(false);
				res.json(215, {
					status: 'Operation successfully non-authenticated',
					command: 'set',
					light: getLight()
				});
				res.end();
			}

			res.json(215, {
				status: 'Operation successfully non-authenticated',
				command: 'get',
				light: getLight()
			});
			res.end();
		} else { //The request is authenticated

			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');

			switch (result) {
				case 0:
					//Authentication OK
					console.log('Authentication OK\n');

					/* First check that the parameter is defiened in order to avoid errors, second that the value is true */
					if (!(typeof req.param('toggle') === 'undefined') && (req.param('toggle').localeCompare('true')) == 0) {
						setLightToggle();
						res.json(200, {
							status: 'Operation successfully authenticated',
							command: 'toggle',
							light: getLight()
						});
						res.end();
					} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('true')) == 0) {
						setLight(true);
						res.json(200, {
							status: 'Operation successfully authenticated',
							command: 'set',
							light: getLight()
						});
						res.end();
					} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('false')) == 0) {
						setLight(false);
						res.json(200, {
							status: 'Operation successfully authenticated',
							command: 'set',
							light: getLight()
						});
						res.end();
					}

					res.json(200, {
						status: 'Operation successfully authenticated',
						command: 'get',
						light: getLight()
					});
					res.end();
					break;
				case 1:
					//Authentication Error
					console.log('Authentication Error\n');
					res.json(402, {
						status: 'Authentication error'
					});
					res.end();
					break;
				default:
					console.log('Error\n');
					res.json(400, {
						status: 'Error'
					});
					res.end();
			}
		}


	});

	/*
		Street Light resource
		
	*/
	http.get('/streetlight/streetlight0', function(req, res) {

		//Check if some of the required headers for authentcation are "undefined"
		if (comprobarCamposHTTP(req)) {
			console.log('Request non authenticated\n');

			if (!(typeof req.param('lat') === 'undefined') && !(typeof req.param('lon') === 'undefined') && req.param('lat') >= 38.023661 && req.param('lat') <= 38.024079 && req.param('lon') >= -1.173911 && req.param('lon') <= -1.173552) {

				console.log('Location OK');

				if (!(typeof req.param('toggle') === 'undefined') && (req.param('toggle').localeCompare('true')) == 0) {
					setStreetLightToggle();
					res.json(201, {
						status: 'Operation successfully geo-localized and non-authenticated',
						command: 'toggle',
						streetlight: getStreetLight(),
						geo: {
							lat: req.param('lat'),
							lon: req.param('lon')
						}
					});
					res.end();
				} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('true')) == 0) {
					setStreetLight(true);
					res.json(201, {
						status: 'Operation successfully geo-localized and non-authenticated',
						command: 'set',
						streetlight: getStreetLight(),
						geo: {
							lat: req.param('lat'),
							lon: req.param('lon')
						}
					});
					res.end();
				} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('false')) == 0) {
					setStreetLight(false);
					res.json(201, {
						status: 'Operation successfully geo-localized and non-authenticated',
						command: 'set',
						streetlight: getStreetLight(),
						geo: {
							lat: req.param('lat'),
							lon: req.param('lon')
						}
					});
					res.end();
				} else if (!(typeof req.param('dim') === 'undefined')) {
					setDim(req.param('dim'));
					res.json(201, {
						status: 'Operation successfully geo-localized and non-authenticated',
						command: 'dim',
						streetlight: getStreetLight(),
						dim: getDim(),
						geo: {
							lat: req.param('lat'),
							lon: req.param('lon')
						}
					});
					res.end();
				} else {
					res.json(201, {
						status: 'Operation successfully geo-localized and non-authenticated',
						command: 'get',
						streetlight: getStreetLight(),
						geo: {
							lat: req.param('lat'),
							lon: req.param('lon')
						}
					});
					res.end();
				}

				console.log('Geo-Location OK but authentication was non-included\n');
			} else {
				res.json(400, {
					status: 'Error'
				});
				res.end();
			}
		} else { //The request is authenticated

			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated\n');

			switch (result) {
				case 0:
					//Authentication OK
					console.log('Authentication OK\n');

					/* Now verifies geo-location */
					if (!(typeof req.param('lat') === 'undefined') && !(typeof req.param('lon') === 'undefined') && req.param('lat') >= 38.023661 && req.param('lat') <= 38.024079 && req.param('lon') >= -1.173911 && req.param('lon') <= -1.173552) {

						console.log('Geo-Location OK\n');

						if (!(typeof req.param('toggle') === 'undefined') && (req.param('toggle').localeCompare('true')) == 0) {
							setStreetLightToggle();
							res.json(200, {
								status: 'Operation successfully authenticated and geo-localized',
								command: 'toggle',
								streetlight: getStreetLight(),
								geo: {
									lat: req.param('lat'),
									lon: req.param('lon')
								}
							});
							res.end();
						} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('true')) == 0) {
							setStreetLight(true);
							res.json(200, {
								status: 'Operation successfully authenticated and geo-localized',
								command: 'set',
								streetlight: getStreetLight(),
								geo: {
									lat: req.param('lat'),
									lon: req.param('lon')
								}
							});
							res.end();
						} else if (!(typeof req.param('set') === 'undefined') && (req.param('set').localeCompare('false')) == 0) {
							setStreetLight(false);
							res.json(200, {
								status: 'Operation successfully authenticated and geo-localized',
								command: 'set',
								streetlight: getStreetLight(),
								geo: {
									lat: req.param('lat'),
									lon: req.param('lon')
								}
							});
							res.end();
						} else if (!(typeof req.param('dim') === 'undefined')) {
							setDim(req.param('dim'));
							res.json(200, {
								status: 'Operation successfully geo-localized and non-authenticated',
								command: 'dim',
								streetlight: getStreetLight(),
								dim: getDim(),
								geo: {
									lat: req.param('lat'),
									lon: req.param('lon')
								}
							});
							res.end();
						} else {
							res.json(200, {
								status: 'Operation successfully authenticated and geo-localized',
								command: 'get',
								streetlight: getStreetLight(),
								geo: {
									lat: req.param('lat'),
									lon: req.param('lon')
								}
							});
							res.end();
						}
					} else {
						res.json(403, {
							status: 'Geo-location error'
						});
						res.end();
					}



					break;
				case 1:
					//Authentication Error
					console.log('Authentication Error\n');
					res.json(402, {
						status: 'Authentication error'
					});
					res.end();
					break;
				default:
					console.log('Error\n');
					res.json(400, {
						status: 'Error'
					});
					res.end();
			}
		}


	});


	http.get('/test', function(req, res) {
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
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

	// MIS FUNCIONES	
	http.get('/resources/streetlight/list', function(req, res) {
		//Check if some of the required headers for authentcation are "undefined"
		if (comprobarCamposHTTP(req)) {
			console.log('Request non authenticated\n');
			res.json(215, {
				status: 'Operation successfully non-authenticated'
			});
			res.end();
		} else { //The request is authenticated

			//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
			var result = authenticate(req, res, 'TestKey', 'Jara');
			console.log('Request authenticated');

			switch (result) {
				case 0:
					//Authentication OK

					console.log('Authentication OK');
					// 					res.json(200, { status: 'Operation successfully authenticated' });
					recursos.listarRecursos(function(err, farolas) {
						debugger;
						if (err) console.log('Algo fallo al listar recursos');
						else {
							console.log('Enviando farolas...');
							res.json(200, JSON.stringify(farolas));
							res.end();
						}
					});
					// 					res.json(200, { status: 'Operation successfully authenticated' });
					// 					res.end();
					break;
				case 1:
					//Authentication Error
					console.log('Authentication Error');
					res.json(402, {
						status: 'Authentication error'
					});
					res.end();
					break;
				default:
					console.log('Error');
					res.json(400, {
						status: 'Error'
					});
					res.end();
			}
		}
	});
	http.get('/resources/streetlight', function(req, res) {
		var nombreFarola = req.query.farola;
		var encendida = req.query.encendida;
		var dim = req.query.dim;
		console.log('Farola seleccionada para modificacion: ', nombreFarola);
		
		// Actualizar la farola en la base de datos
		recursos.actualizarFarola(nombreFarola, encendida, dim, function(err) {
			if(err) {
				res.json(400, {
					status: 'No se pudo guardar la farola'
				});
			} else {
				res.json(400, {
					status: 'Farola guardada correctamente'
				});
			}
			
			// Enviar mensaje finalmente
			res.end();
		});
	});
	
	http.get('/resources/streetlight/testlist', function(req, res) {

		//CHANGE 'TestKey' and ´Jara' to the key and user that you are using
		// 		var result = authenticate(req, res, 'TestKey', 'Jara');
		var result = 0;
		console.log('Request authenticated');

		switch (result) {
			case 0:
				//Authentication OK

				console.log('Authentication OK');
				// 					res.json(200, { status: 'Operation successfully authenticated' });
				recursos.listarRecursos(function(err, farolas) {
					debugger;
					if (err) console.log('Algo fallo al listar recursos');
					else {
						console.log('Enviando farolas...');
						res.json(200, farolas);
						res.end();
					}
				});
				// 					res.json(200, { status: 'Operation successfully authenticated' });
				// 					res.end();
				break;
			case 1:
				//Authentication Error
				console.log('Authentication Error');
				res.json(402, {
					status: 'Authentication error'
				});
				res.end();
				break;
			default:
				console.log('Error');
				res.json(400, {
					status: 'Error'
				});
				res.end();
		}

	});

	http.get('/resources/weather', function(req, res) {
		var result = 0;
		console.log('Request authenticated');
		console.log('Authentication OK');
		recursos.getUltimoTiempo(function(err, datos) {
			if (err) console.log('Algo fallo al acceder a la base de datos de Tiempo');
			else {
				res.json(200, datos);
				res.end();
			}
		});

	});

}

exports.initHttpServer = initHttpServer;
