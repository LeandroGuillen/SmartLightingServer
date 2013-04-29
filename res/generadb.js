var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmovil');

var modelos = require("./mongomodelos");
var Farola = modelos.Farola;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

	borrarTodo(); // Elimina bbdd

});

function crearFarolas(){
	// Crear documentos
	var farola1 = new Farola({
		nombre: 'farola1',
		encendida: false,
		dim: 0,
		lat: 38024105,
		lon: -1173877
	});
	var farola2 = new Farola({
		nombre: 'farola2',
		encendida: false,
		dim: 0,
		lat: 3802438,
		lon: -1174083
	});
	var farola3 = new Farola({
		nombre: 'farola3',
		encendida: true,
		dim: 100,
		lat: 38024635,
		lon: -1174266
	});
	
	// Guardar documentos
	farola1.save();
	farola2.save();
	farola3.save();
	
	console.log("Farolas re-creadas");
}

function borrarTodo(){
	// Vaciar colecciones
	Farola.remove({}, function(err){
		console.log('Coleccion borrada de la base de datos.');
		
		crearFarolas(); // Para insertar documentos
	});
}
