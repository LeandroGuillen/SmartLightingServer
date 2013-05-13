var express = require("express"); //Express Middleware
var crypto = require('crypto'); //Crypto lib http://nodejs.org/api/crypto.html
var http = express(); //HTTP Server (similar to a socket)
var fs = require("fs"); //Read files
var recursos = require("./res/recursos");
var usersDBAccess = require("./users/usuarios");


function initHttpServer() {
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
			if(req.get('HashType')==='MD5')
				usersDBAccess.authenticate(req.get('User-Agent'), req.get('apiKey'), req.get('Date'), accion);
			else
				usersDBAccess.authenticateSHA(req.get('User-Agent'), req.get('apiKey'), req.get('Date'), accion);
			
			function accion(cookie) {

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
			}
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
		Status
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
		Resources can be located in the following subdirectories (images, files, etc.)
	*/
	http.use(express.static(__dirname + '/web'));
	http.use(express.static(__dirname + '/web/public'));
	http.use(express.static(__dirname + '/web/public/images'));


	http.listen(8080);
	console.log("HTTP Server initiated!");

	// MIS FUNCIONES	
	
	http.get('/resources/streetlight', function(req, res) {
		usersDBAccess.checkCookie(req.get("User-Agent"), req.get("Cookie"), function(){
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
					res.json(200, {
						status: 'Farola guardada correctamente'
					});
				}
				
				// Enviar mensaje finalmente
				res.end();
			});
			
		});
	});
	
	http.get('/resources/streetlight/list', function(req, res) {
		usersDBAccess.checkCookie(req.get("User-Agent"), req.get("Cookie"), function(){
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
		}, function(){
			//Authentication Error
			console.log('Authentication Error');
			res.json(402, {
				status: 'Authentication error'
			});
			res.end();
		});
	});

	http.get('/resources/weather', function(req, res) {
		var result = 0;
		
		usersDBAccess.checkCookie(req.get("User-Agent"), req.get("Cookie"), function(){
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
		

	});
}
exports.initHttpServer = initHttpServer;