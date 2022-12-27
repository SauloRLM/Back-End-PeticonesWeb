'use strict'

var express = require('express');
var CodigoArticuloControlador = require('../controladores/codigo_articulo');

var api = express.Router();

api.post('/registrar-codigo-articulo',CodigoArticuloControlador.guardarCodigoArticulo);
api.put('/modificar-codigo-articulo/:id_codigo_articulo',CodigoArticuloControlador.modificarCodigoArticulo);
api.get('/codigos-articulos',CodigoArticuloControlador.getCodigosArticulos);
api.get('/codigosArticulosSinOtros',CodigoArticuloControlador.getCodigosArticulosSinOtros);
api.get('/codigo-articulo/:id_codigo_articulo',CodigoArticuloControlador.getCodigoArticulo);

//api.delete('/eliminar-usuario-problema/:id_usuario_problema' ,UsuarioProblemaControlador.eliminarUsuarioProblema);


module.exports=api;