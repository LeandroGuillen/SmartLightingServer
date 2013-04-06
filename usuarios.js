// Clase de acceso a la base de datos de usuarios desde nodejs


var mysql  = require('mysql');


var client = mysql.createConnection({
  user: 'root',
  password: 'alumno',
  host: '127.0.0.1',
  port: '3306',
});

client.connect();
client.query('USE usersDB');



client.query(
    'SELECT * FROM usuarios;',
    function selectUsuario(err, results) {

    if (err) {
        console.log("Error: " + err.message);
        throw err;
    }
    console.log(results);

    client.end();
});
