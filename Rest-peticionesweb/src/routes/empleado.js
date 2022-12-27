'use strict'

var express = require('express');
var EmpleadoControlador = require('../controladores/empleado');

var api = express.Router();

api.post('/registrar-empleado',EmpleadoControlador.guardarEmpleado);
api.put('/modificar-empleado/:id_empleado',EmpleadoControlador.modificarEmpleado);
api.get('/empleados',EmpleadoControlador.getEmpleados);
api.get('/empleadosAct',EmpleadoControlador.getEmpleadosAct);
api.get('/empleado/:id_empleado',EmpleadoControlador.getEmpleado);
api.delete('/eliminar-empleado/:id_empleado' ,EmpleadoControlador.eliminarEmpleado);

module.exports=api;