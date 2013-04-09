// Clase de acceso a la base de datos de usuarios desde nodejs

var mysql  = require('mysql');
var crypto = require('crypto');

var client = mysql.createConnection({
  user: 'root',
  password: 'alumno',
  host: '127.0.0.1',
  port: '3306',
});

client.connect();

client.query('use usersDB');

// FALTA AÑADIR EXCEPCIONES
function insertUser(id,nombre,password){


client.query('INSERT INTO usuarios SET id = ?, nombre = ?, password = MD5(?)',[id,nombre,password]);


};

// FALTA AÑADIR EXCEPCIONES
function deleteUser(id){

	client.query('DELETE FROM usuarios WHERE id=?',[id]);

};


function getNombre(id){

	client.query('SELECT * FROM usuarios WHERE id=?',[id], function(err, ids){

		console.log(ids);});

};

function getPassword(id){

	client.query('SELECT password FROM usuarios WHERE id=?',[id], function(err, password){

		return password;
	});

};

/**
*	Funcion para comprobar la contraseña del usuario id.
*	id -> usuario
*	key -> hash(contraseña de id + date);
*	Return true si es un usuario valido o false en caso contrario
*/
function isAuth(id, key, date){

	var md5sum  = crypto.createHash('md');
	md5sum.update(getPassword(id)+date);
	var digest = md5sum.digest('hex');	

	return key.localeCoimpare(digest) == 0;
	
}

exports.getUsuario = getUsuario;
exports.isAuth = isAuth;
exports.insertUser = insertUser;
exports.deleteUser = deleteUser;
