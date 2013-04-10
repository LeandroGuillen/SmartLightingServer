var mongoose = require('mongoose');

// Definicion de esquemas
var farolaSchema = new mongoose.Schema({
	nombre: String,
	encendida: Boolean,
	dim: Number,
	lat: Number,
	lon: Number
});

// Creacion de los modelos
var Farola = mongoose.model('Farola', farolaSchema);

// Exportarlos para que esten disponibles en las aplicaciones
exports.Farola = Farola;