// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmovil');

var modelos = require("./mongomodelos");
var Farola = modelos.Farola;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	

});

function crearTestDocs(){
	// Crear documentos
	var farola1 = new Farola({
		nombre: 'farola1',
		encendida: false,
		dim: 50,
		lat: 131.123,
		lon: 1.123
	});
	var farola2 = new Farola({
		nombre: 'farola2',
		encendida: false,
		dim: 0,
		lat: 131.124,
		lon: 1.123
	});
	var farola3 = new Farola({
		nombre: 'farola3',
		encendida: true,
		dim: 0,
		lat: 131.125,
		lon: 1.123
	});
	
	// Guardar documentos
	farola1.save();
	farola2.save();
	farola3.save();
}

function borrarTodo(){
	// Vaciar colecciones
	Farola.remove({}, function(err){
		console.log('Coleccion borrada de la base de datos.');
	});
}