'use strict'

var express = require('express');
var AlmacenControlador = require('../controladores/almacen');

var api = express.Router();

api.post('/registrar-almacen',AlmacenControlador.guardarAlmacen);
api.put('/modificar-almacen/:id_almacen',AlmacenControlador.modificarAlmacen);
api.get('/almacenes',AlmacenControlador.getAlmacenes);
api.get('/almacen/:id_almacen',AlmacenControlador.getAlmacen);
api.get('/almacen-problema/:id_tipo_problema',AlmacenControlador.getAlmacenesTypeProblem);
//api.delete('/eliminar-almacen/:id_almacen' ,AlmacenControlador.eliminarAlmacen);

module.exports=api;