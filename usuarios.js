// Clase de acceso a la base de datos de usuarios desde nodejs

var mysql  = require('mysql');


var client = mysql.createConnection({
  user: 'root',
  password: 'alumno',
  host: '127.0.0.1',
  port: '3306',
});

client.connect();

client.query('use usersDB');


function insertUser(id,nombre,password){


client.query('INSERT INTO usuarios SET id = ?, nombre = ?, password = MD5(?)',[id,nombre,password]);


};


function deleteUser(id){

	client.query('DELETE FROM usuarios WHERE id=?',[id]);

};

deleteUser('m12');

insertUser('benzema', 'Karim Benzema', 'soy el 9');
