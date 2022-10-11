'use strict'

//const compression = require('compression');
var express = require('express');
var bodyParser= require('body-parser');

var app= express();


// Compress all HTTP responses
//app.use(compression());


//Cargar rutas ----------------------------------------------------
var sucursal = require('./routes/sucursal');
var empleado = require('./routes/empleado');
var rol = require('./routes/rol');
var usuario = require('./routes/usuario');
var tipo_problema = require('./routes/tipo_problema');
var usuario_problema = require('./routes/usuario_problema');
var codigo_articulo = require('./routes/codigo_articulo');
var almacen = require('./routes/almacen');
var articulo_problema = require('./routes/articulo_problema');
var problema = require('./routes/problema');
var requisito_problema = require('./routes/requisito_problema');

//middlewares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configurar cabeceras y cors
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Credentials','true');
	res.header('Access-Control-Allow-Origin','http://localhost:4200');
	res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
	res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
	next();	
});



//rutas base body-parser
app.use('/api', sucursal, empleado, rol, usuario, tipo_problema, usuario_problema, codigo_articulo, almacen, articulo_problema, problema, requisito_problema);

module.exports = app;