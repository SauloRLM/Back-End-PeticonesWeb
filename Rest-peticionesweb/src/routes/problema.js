'use strict'

var express = require('express');
var ProblemaControlador = require('../controladores/problema');

var api = express.Router();

api.post('/registrar-problema',ProblemaControlador.guardarProblema);
api.put('/modificar-problema/:id_problema',ProblemaControlador.modificarProblema);
api.get('/problemas-Act',ProblemaControlador.getProblemasAct);
api.get('/problemas',ProblemaControlador.getProblemas);
api.get('/problema/:id_problema',ProblemaControlador.getProblema);
api.get('/problemas-sucursal-order/:id_sucursal/:FecIni/:FecFin',ProblemaControlador.getProblemasSucursalOrder);
api.get('/problemas-usuario-order/:id_user/:FecIni/:FecFin',ProblemaControlador.getProblemasUserDegOrder);
api.put('/estatus-problema/:id_problema',ProblemaControlador.ProblemaEstatus);
api.delete('/requisito-problema/:id_problema',ProblemaControlador.deleteRequestProblem);

module.exports=api;