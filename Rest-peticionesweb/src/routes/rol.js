'use strict'

var express = require('express');
var RolControlador = require('../controladores/rol');

var api = express.Router();

api.post('/registrar-rol',RolControlador.guardarRol);
api.put('/modificar-rol/:id_rol',RolControlador.modificarRol);
api.get('/roles',RolControlador.getRoles);
api.get('/rol/:id_rol',RolControlador.getRol);
api.delete('/eliminar-rol/:id_rol' ,RolControlador.eliminarRol);

module.exports=api;