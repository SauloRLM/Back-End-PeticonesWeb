'use strict'

var express = require('express');
var ProblemaControlador = require('../controladores/problema');

var api = express.Router();

api.post('/registrar-problema',ProblemaControlador.guardarProblema);
api.put('/modificar-problema/:id_problema',ProblemaControlador.modificarProblema);
api.get('/problemas',ProblemaControlador.getProblemas);
api.get('/problema/:fecha_solicitud',ProblemaControlador.getProblema);
api.get('/problemas-order',ProblemaControlador.getProblemasOrder);
api.put('/estatus-problema/:id_problema',ProblemaControlador.ProblemaEstatus);
api.delete('/requisito-problema/:id_problema',ProblemaControlador.deleteRequestProblem);

module.exports=api;