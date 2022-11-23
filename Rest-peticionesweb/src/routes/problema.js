'use strict'

var express = require('express');
var ProblemaControlador = require('../controladores/problema');

var api = express.Router();

api.post('/registrar-problema',ProblemaControlador.guardarProblema);
api.put('/modificar-problema/:id_problema',ProblemaControlador.modificarProblema);
api.get('/problemas-espera',ProblemaControlador.getProblemasEspera);
api.get('/problemas-asignados',ProblemaControlador.getProblemasAsignados);
api.get('/problema/:id_problema',ProblemaControlador.getProblemasAsignados);
api.put('/estatus-problema/:id_problema',ProblemaControlador.ProblemaEstatus);
//api.delete('/articulo-problema/:id_articulo_problema' ,AlmacenControlador.eliminarAlmacen);

module.exports=api;