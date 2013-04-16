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

	client.query('UPDATE cookies SET cookie = ? WHERE id = ?', [cookie, id], function(err) {

		if (err) {

			throw err;

		}
	});

}


/**
 *	Comprueba si una cookie pertenece a un usuario
 *
 *	id -> id del usuario
 *	cookie -> cookie para comprobar
 */


function checkCookie(req, action) {


	client.query('SELECT cookie FROM cookies WHERE id = ?', ["sr4"], function(err, cookie) {

		if (err) {

			throw err;
		}

		// Se comprueba la veracidad y validez en el tiempo

		if (req.localeCompare(cookie[0].cookie) == 0 && checkCookieDate(cookie[0].cookie)) {

			action();

		} else {

			console.log("Cookie incorrecta");
		}
	});

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



};


/**
 *	Elimina un usuario facilitando la id
 *	id -> usuario a elminar
 */

function deleteUser(id) {

	client.query('DELETE FROM usuarios WHERE id=?', [id], function(err) {

		if (err) {
			connection.end();
			throw err;
		}

	});

};


/**
 *	Obtiene el nombre del usuario a partir de la id
 *	id -> id del usuario
 */

function getNombre(id) {

	client.query('SELECT nombre FROM usuarios WHERE id=?', [id], function(err, nombre) {

		if (err) {

			throw err;

		}

		return nombre;
	});

};


/**
 *	Obtiene la contraseña del usuario a partir de la id
 *	id -> id del usuario
 */

function getPassword(id) {

};


/**
 *	Comprueba la contraseña del usuario id.
 *	id -> usuario
 *	key -> hash(contraseña de id + date);
 *	Return true si es un usuario valido o false en caso contrario
 */

function authenticate(id, key, date, response) {

	// Consulta la contraseña en la base de datos
	client.query('SELECT password FROM usuarios WHERE id=?', [id], function(err, password) {

		if (err) {

			throw err;

		}

		console.log("CONSULTANDO LA BASE DE DATOS PARA OBTENER CONTRASEÑA")

		// Hace el hash de la contraseña y la fecha

		var md5sum = crypto.createHash('md5');
		md5sum.update(password[0].password + date);
		var digest = md5sum.digest('hex');


		// Compara las dos contraseñas y construye la respuesta en base a ellas
		if (key.localeCompare(digest) == 0) {

			console.log("Usuario conectado: " + id);
			console.log("CONTRASEÑA ACEPTADA");

			var cookie = createCookie(id, 1, 1);

			console.log("Cookie : " + cookie);
			registerCookie(id, cookie);
			response(cookie, true);

		} else {


			console.log("Contraseña erronea");

			response(null, false);
		}


	});


};

/* Pruebas */
/*)
var md5sum = crypto.createHash('md5');
md5sum.update("da867bade88be72074368ca579d44fdb" + 1);
var digest = md5sum.digest('hex');

authenticate("sr4", digest, "1");
insertUser("fcoentrao", "Fabio Coentrao", "soy el 5");
*/

if (checkCookieDate("sr4=1; expires=Wed, 17 Apr 2013 14:12:20 GMT; path=/")) console.log("Cookie correcta en tiempo");
/*checkCookie("sr4=1; expires=Wed, 17 Apr 2013 14:12:20 GMT; path=/", function() {
	console.log("Cookie aceptada");
});
*/
/***** Funciones publicas *****/

// exports.getUsuario = getUsuario;
exports.authenticate = authenticate;
exports.insertUser = insertUser;
exports.deleteUser = deleteUser;
exports.registerCookie = registerCookie;