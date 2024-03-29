// Para MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmovil');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var modelos = require("./mongomodelos");
var Farola = modelos.Farola;
var Tiempo = modelos.Tiempo;

// Devuelve un JSON con todas las farolas
function listarRecursos(callback){
	Farola.find({}, null, callback);
}

// Devuelve el ultimo tiempo almacenado
function getUltimoTiempo(callback) {
	Tiempo.findOne({}, {}, { sort: { 'fecha' : -1 } }, callback);
}

// Actualiza los datos de la farolas
function actualizarFarola(nombre, encendida, dim, callback) {
	var conditions = { nombre: nombre};
	var update = { encendida: encendida, dim: dim};
	var options = { multi: false};
	
	Farola.update(conditions, update, options, callback);
}

exports.listarRecursos = listarRecursos;
exports.getUltimoTiempo = getUltimoTiempo;
exports.actualizarFarola = actualizarFarola;