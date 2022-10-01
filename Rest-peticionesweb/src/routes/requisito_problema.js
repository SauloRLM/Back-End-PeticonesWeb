'use strict'

var express = require('express');
var RequisitoProblemaControlador = require('../controladores/requisito_problema');

var api = express.Router();

api.post('/registrar-requsito-problema',RequisitoProblemaControlador.guardarRequisitoProblema);
api.put('/modificar-reuisito-problema/:id_requisito_problema',RequisitoProblemaControlador.modificarRequisitoProblema);
api.get('/requisitos-problema/:id_problema',RequisitoProblemaControlador.getRequisitosProblema);
api.get('/requisito-problema/:id_requisito_problema/:id_problema',RequisitoProblemaControlador.getRequisitoProblema);
//api.delete('/articulo-problema/:id_articulo_problema' ,AlmacenControlador.eliminarAlmacen);

module.exports=api;