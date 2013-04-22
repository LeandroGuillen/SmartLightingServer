// Clase de acceso a la base de datos de usuarios desde nodejs

var mysql = require('mysql');
var crypto = require('crypto');

var client = mysql.createConnection({
	user: 'root',
	password: 'alumno',
	host: '127.0.0.1',
	port: '3306',
});


client.connect();


client.query('use usersDB');


/**
 *	Registra una cookie asociada a un id
 *
 *	id -> id del usuario
 *	cookie -> cookie para el usuario
 */

function registerCookie(id, cookie) {

	if (checkLength(id, cookie)) {

		client.query('UPDATE cookies SET cookie = ? WHERE id = ?', [cookie, id], function(err) {

			if (err) {

				throw err;

			}
		});
	}

}


/**
 *	Comprueba si una cookie pertenece a un usuario
 *
 *	id -> id del usuario
 *	cookie -> cookie para comprobar
 */


function checkCookie(id, userCookie, action) {

	if (checkLength(id, userCookie)) {

		client.query('SELECT cookie FROM cookies WHERE id = ?', [id], function(err, cookie) {

			if (err) {

				throw err;
			}

			// Se comprueba la veracidad y validez en el tiempo

			if (userCookie.localeCompare(cookie[0].cookie) == 0 && checkCookieDate(cookie[0].cookie)) {

				action();

			} else {

				console.log("Cookie incorrecta");
			}
		});
	}

}


function checkCookieDate(cookie) {


	var cookieString = cookie.split(";");
	var dateString = cookieString[1].split("=");

	return new Date().getTime() < new Date(dateString[1]).getTime();

}


/**
 *       Crea una cookie en base a un valor y una fecha
 *
 *       id -> id del usuario al que va la cookie
 *       value -> valor para crear la cookie
 *	days -> dias de validez
 */

function createCookie(name, value, days) {

	if (days) {

		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();

	} else var expires = "";

	return name + "=" + value + expires + "; path=/";

}



/**
 *	Inserta usuario facilitando todos sus datos.
 *	id -> id del  usuario
 *	nombre -> nombre completo del usuario
 *	password -> hash md5 del password
 */


function insertUser(id, nombre, password) {


	if (checkLength(id, nombre, password)) {

		client.query('INSERT INTO usuarios SET id = ?, nombre = ?, password = MD5(?)', [id, nombre, password], function(err) {

			if (err) {


				throw err;

			}

		});

		client.query('INSERT INTO cookies SET id = ?, cookie=""', [id], function(err) {

			if (err) {
				throw err;

			}

		});

	}

}


/**
 *	Elimina un usuario facilitando la id
 *	id -> usuario a elminar
 */

function deleteUser(id) {

	if (checkLength(id)) {


		client.query('DELETE FROM usuarios WHERE id=?', [id], function(err) {

			if (err) {
				connection.end();
				throw err;
			}

		});
	}

}


/**
 *	Obtiene el nombre del usuario a partir de la id
 *	id -> id del usuario
 */

function getNombre(id) {

	if (checkLength(id)) {


		client.query('SELECT nombre FROM usuarios WHERE id=?', [id], function(err, nombre) {

			if (err) {

				throw err;

			}

			return nombre;
		});
	}
}


/**
 *	Comprueba la contraseña del usuario id.
 *	id -> usuario
 *	key -> hash(contraseña de id + date);
 *	Return true si es un usuario valido o false en caso contrario
 */

function authenticate(id, key, date, response) {

	if (checkLength(id, key, date)) {


		console.log(id + " " + key + " " + " " + date);
		// Consulta la contraseña en la base de datos
		client.query('SELECT password FROM usuarios WHERE id=?', [id], function(err, password) {

			if (err) {

				throw err;

			}

			console.log("******CONSULTANDO LA BASE DE DATOS PARA OBTENER CONTRASEÑA*****")


			// Comprueba que exista una contraseña para ese usuario
			if (password.length) {


				//Hace el hash de la contraseña y la fecha
				console.log(password[0].password);
				var md5sum = crypto.createHash('md5');
				md5sum.update(password[0].password + date);
				var digest = md5sum.digest('hex');

				// Compara las dos contraseñas y construye la respuesta en base a ellas
				if (key.localeCompare(digest) == 0) {

					console.log("Usuario conectado: " + id);
					console.log("CONTRASEÑA ACEPTADA");
					var cookie = createCookie(id, 1, 1);
					registerCookie(id, cookie);
					response(cookie);
					console.log("Cookie : " + cookie);

				} else {

					console.log("Contraseña erronea");
					// Responde con una cadena vacia
					response("");
				}


			} else {

				console.log("Usuario incorrecto");
				// Responde con una cadena vacia
				response("");
			}

		});
	}
};

/**
 *	Funcion para comprobar la validez de los parametros facilitados
 *	Devuelve true si todos los parametros son buenos y false en caso
 *	contrario
 *
 */

function checkLength() {


	for (var i = arguments.length - 1; i >= 0; i--) {


		if (!arguments[i]) return false;

	};

	return true;
}



/***** Funciones publicas *****/

// exports.getUsuario = getUsuario;
exports.checkCookie = checkCookie;
exports.authenticate = authenticate;
exports.insertUser = insertUser;
exports.deleteUser = deleteUser;
exports.registerCookie = registerCookie;

/***** Casos de prueba *****/

// Contraseña vacia 

//authenticate("sr4","","1654165",res);