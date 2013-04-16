var sleep = require('sleep');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmovil');
var modelos = require("./mongomodelos");
var Tiempo = modelos.Tiempo;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var jsdom = require("jsdom");

var PERIODO = 3600 // segundos

db.once('open', function () {
	
	setInterval(function() {
		jsdom.env(
		"http://www.eltiempo.es/murcia.html?v=por_hora",
		["http://code.jquery.com/jquery.js"],
		function (errors, window) {
			var $ = window.jQuery;
			var a;
			
			a = $("tr:eq(0)").text().split("\n");
			var cabeceras = new Array(8);
			cabeceras[0] = limpiarPaja(a[1]);
			cabeceras[1] = limpiarPaja(a[2]);
			cabeceras[2] = "Viento (medio)";
			cabeceras[3] = "Viento (rachas)";
			cabeceras[4] = limpiarPaja(a[6]);
			cabeceras[5] = limpiarPaja(a[9]);
			cabeceras[6] = limpiarPaja(a[13]);
			cabeceras[7] = limpiarPaja(a[16]);
			
			a = $("tr:eq(2)").text().split("\n");
			var valores = new Array(8);
			valores[0] = limpiarPaja(a[1]);
			valores[1] = limpiarPaja(a[11]);
			valores[2] = limpiarPaja(a[17]);
			valores[3] = limpiarPaja(a[19]);
			valores[4] = limpiarPaja(a[21]);
			valores[5] = limpiarPaja(a[24]);
			valores[6] = limpiarPaja(a[28]);
			valores[7] = limpiarPaja(a[31]);
			
// 			debug(cabeceras, valores);
			
			var tiempo = new Tiempo({
				temperatura: valores[1],	// ºC
				vientoMedio: valores[2],	// km/h
				vientoRacha: valores[3],	// km/h
				precipitaciones: valores[4], // mm
				nubes: valores[5],	// %
				humedad: valores[6],	// %
				presion: valores[7],	// hPa
				fecha: Date.now()
			});
			
			console.log(tiempo);
			
			// Guardar en la base de datos el tiempo obtenido
			tiempo.save();
			}
		);
	}, PERIODO); // Dormir un periodo antes de la siguiente consulta
});


function debug(cabeceras, valores){
	var temp = "";
	for(var i=0; i<cabeceras.length; i++) {
		temp = temp + cabeceras[i] + ': ' + valores[i] +'\n';
	}
	console.log(temp);
}

function limpiarPaja(stringConPaja) {
	return stringConPaja.replace(/\t/g, '')
		.replace('%', '')
		.replace("km/h", '')
		.replace("hPa", '')
		.replace("º", '')
		.replace("mm", '');
}
