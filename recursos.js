// Para MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmovil');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var modelos = require("./mongomodelos");
var Farola = modelos.Farola;

// Devuelve un JSON con todas las farolas
function listarRecursos(callback){
	Farola.find({encendida: false}, null, callback);
}

exports.listarRecursos = listarRecursos;