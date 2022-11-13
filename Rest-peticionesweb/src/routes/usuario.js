'use strict'

var express = require('express');
var UsuarioControlador = require('../controladores/usuario');

var api = express.Router();

api.post('/registrar-usuario',UsuarioControlador.guardarUsuario);
api.post('/login',UsuarioControlador.login);
api.put('/logout',UsuarioControlador.logout);
api.put('/modificar-usuario/:id_usuario',UsuarioControlador.modificarUsuario);
api.get('/usuarios',UsuarioControlador.getUsuarios);
api.get('/usuario/:id_usuario',UsuarioControlador.getUsuario);
api.delete('/eliminar-usuario/:id_usuario' ,UsuarioControlador.eliminarUsuario);

module.exports=api;