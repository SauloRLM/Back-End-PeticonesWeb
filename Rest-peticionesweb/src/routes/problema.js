'use strict'

var express = require('express');
var ProblemaControlador = require('../controladores/problema');

var api = express.Router();

api.post('/registrar-problema',ProblemaControlador.guardarProblema);
api.put('/modificar-problema/:id_problema',ProblemaControlador.modificarProblema);
api.get('/problemas',ProblemaControlador.getProblemas);
api.get('/problema/:fecha_solicitud',ProblemaControlador.getProblema);
api.get('/problemaStore/:id_user',ProblemaControlador.getProblemaStoreManager);
api.get('/problemas-order',ProblemaControlador.getProblemasDesc);
api.put('/estatus-problema/:id_problema',ProblemaControlador.ProblemaEstatus);
//api.delete('/articulo-problema/:id_articulo_problema' ,AlmacenControlador.eliminarAlmacen);

module.exports=api;