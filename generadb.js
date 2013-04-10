// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmovil');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	
	// Creacion de esquemas
	var usuarioSchema = new mongoose.Schema({
		nombre:  String,
		clave: String
	});
	var farolaSchema = new mongoose.Schema({
		nombre: String,
		encendida: Boolean,
		dim: Number,
		lat: Number,
		lon: Number
	});
	
	// Creacion de modelos
	var Usuario = mongoose.model('Usuario', usuarioSchema);
	var Farola = mongoose.mod335el('Farola', farolaSchema);
	
	// Creacion de documentos
	var usuario1 = new Usuario({nombre: 'usuario1', clave: '111'});
	var usuario2 = new Usuario({nombre: 'usuario2', clave: '222'});
	var usuario3 = new Usuario({nombre: 'usuario3', clave: '333'});
	
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
	
	Farola.count({}, function(err, count){
		console.log('Farola count = %d',count);
	});
	Usuario.count({}, function(err, count){
		console.log('Usuario count = %d',count);
	});
	
	Farola.find({encendida: false}, 'nombre', function (err, farolas){
		if (err)
			return manejarError('No puedo encontrar esa farola', err);
		
		var f=0;
		for(f in farolas){
			console.log(farolas[f].nombre);
		}
		console.log('farolas.length=', f);
			
// 			console.log('%s esta encendida.', farolas[i].nombre);
// 			console.log('%s esta encendida.', farolas.nombre);
// 			console.log('%s esta encendida.', farolas);

	});
	
	console.log('Todo ok');
	
	
	function restart(){
		// Vaciar colecciones
		Usuario.remove({}, function(err){
			console.log('Coleccion Usuario limpiada');
		});
		Farola.remove({}, function(err){
			console.log('Coleccion Usuario limpiada');
		});
		
		// Guardar documentos
		usuario1.save();
		usuario2.save();
		usuario3.save();
		farola1.save();
		farola2.save();
		farola3.save();
	}
});



function manejarError(msj, err) {
	console.log(msj);
};
