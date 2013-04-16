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

function getUltimoTiempo(callback) {
	Tiempo.findOne({}, {}, { sort: { 'fecha' : -1 } }, callback);
}

exports.listarRecursos = listarRecursos;
exports.getUltimoTiempo = getUltimoTiempo;