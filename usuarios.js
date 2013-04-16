// Clase de acceso a la base de datos de usuarios desde nodejs

var mysql  = require('mysql');
var crypto = require('crypto');

var client = mysql.createConnection({
  user: 'root',
  password: 'root',
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

function registerCookie(id, cookie){
	
	client.query('INSERT INTO cookies SET cookie = ? WHERE id = ?', [cookie,id], function (err){
		
		if(err){
			
			connection.end();
			throw err;
	
		}
	});

}


/**
*	Comprueba si una cookie pertenece a un usuario
*
*	id -> id del usuario
*	cookie -> cookie para comprobar
*
*/

function checkCookie(id, oldCookie){


	client.query('SELECT cookie FROM cookies WHERE id = ?', [id], function (err, realCookie){

		if(err){
		
			connection.end();
			throw err;
		}
	
		return oldCookie.localeCompare(realCookie) == 0;
	});



}



/**
*       Crea una cookie en base a un valor y una fecha
*
*       id -> id del usuario al que va la cookie
*       value -> valor para crear la cookie
*	days -> dias de validez
*/

function createCookie(name,value,days) {

        if (days) {

                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();

        }

        else var expires = "";

        return name+"="+value+expires+"; path=/";

}



/**
*	Inserta usuario facilitando todos sus datos.
*	id -> id del  usuario
*	nombre -> nombre completo del usuario
*	password -> hash md5 del password
*/


function insertUser(id,nombre,password){

	client.query('INSERT INTO usuarios SET id = ?, nombre = ?, password = MD5(?)',[id,nombre,password],function (err){

		if(err){
	
			connection.end();
			throw err;
	
		}

	});

	   	
};


/**
*	Elimina un usuario facilitando la id
*	id -> usuario a elminar
*/

function deleteUser(id){

	client.query('DELETE FROM usuarios WHERE id=?',[id],function (err){

		if(err){
			connection.end();
			throw err;
		}

	});

};


/**
*	Obtiene el nombre del usuario a partir de la id
*	id -> id del usuario
*/

function getNombre(id){

	client.query('SELECT nombre FROM usuarios WHERE id=?',[id], function(err, nombre){

		if(err){
	
			connection.end();
			throw err;
	
		}
		
		return nombre;
	});

};


/**
*	Obtiene la contraseña del usuario a partir de la id
*	id -> id del usuario
*/

function getPassword(id){

	client.query('SELECT password FROM usuarios WHERE id=?',[id], function(err, password){
	
		if(err){
	
			connection.end();
			throw err;
	
		}

		return password;
	});

};


/**
*	Comprueba la contraseña del usuario id.
*	id -> usuario
*	key -> hash(contraseña de id + date);
*	Return true si es un usuario valido o false en caso contrario
*/

function isAuth(id, key, date){

	var md5sum  = crypto.createHash('md');
	md5sum.update(getPassword(id)+date);
	var digest = md5sum.digest('hex');	

	return key.localeCompare(digest) == 0;
	
}


/***** Funciones publicas *****/

// exports.getUsuario = getUsuario;
exports.isAuth = isAuth;
exports.insertUser = insertUser;
exports.deleteUser = deleteUser;
exports.registerCookie = registerCookie;
