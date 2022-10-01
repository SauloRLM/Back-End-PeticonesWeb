'use strict'

var express = require('express');
var SucursalControlador = require('../controladores/sucursal');

var api = express.Router();

api.post('/registrar-sucursal',SucursalControlador.guardarSucursal);
api.put('/modificar-sucursal/:id_sucursal',SucursalControlador.modificarSucursal);
api.get('/sucursales',SucursalControlador.getSucursales);
api.get('/sucursal/:id_sucursal',SucursalControlador.getSucursal);
api.delete('/eliminar-sucursal/:id_sucursal' ,SucursalControlador.eliminarSucursal);

module.exports=api;