var mongoose = require('mongoose');

// Definicion de esquemas
var farolaSchema = new mongoose.Schema({
	nombre: String,
	encendida: Boolean,
	dim: Number,
	lat: Number,
	lon: Number
});
var tiempoSchema = new mongoose.Schema({
	temperatura: Number,	// ºC
	vientoMedio: Number,	// km/h
	vientoRacha: Number,	// km/h
	precipitaciones: Number, // mm
	nubes: Number,		// %
	humedad: Number,	// %
	presion: Number,		// hPa
	fecha: Date
});

// Creacion de los modelos
var Farola = mongoose.model('Farola', farolaSchema);
var Tiempo = mongoose.model('Tiempo', tiempoSchema);

// Exportarlos para que esten disponibles en las aplicaciones
exports.Farola = Farola;
exports.Tiempo = Tiempo;