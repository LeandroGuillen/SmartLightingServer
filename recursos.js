// Para MongoDB
var modelos = require("./mongomodelos");
var Farola = modelos.Farola;

// Devuelve un JSON con todas las farolas
function listarRecursos(callback){
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/cmovil');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		Farola.find({encendida: false}, 'nombre dim', callback);
	});
}

exports.listarRecursos = listarRecursos;