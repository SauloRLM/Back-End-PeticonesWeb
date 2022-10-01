'use strict'

var express = require('express');
var ArticuloProblemaControlador = require('../controladores/articulo_problema');

var api = express.Router();

api.post('/registrar-articulo-problema',ArticuloProblemaControlador.guardarArticuloProblema);
api.put('/modificar-articulo-problema/:id_articulo_problema',ArticuloProblemaControlador.modificarArticuloProblema);
api.get('/articulos-problemas',ArticuloProblemaControlador.getArticulosProblemas);
api.get('/articulo-problema/:id_articulo_problema',ArticuloProblemaControlador.getArticuloProblema);
//api.delete('/articulo-problema/:id_articulo_problema' ,AlmacenControlador.eliminarAlmacen);

module.exports=api;