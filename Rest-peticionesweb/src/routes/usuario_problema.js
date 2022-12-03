'use strict'

var express = require('express');
var UsuarioProblemaControlador = require('../controladores/usuario_problema');

var api = express.Router();

api.post('/registrar-usuario-problema',UsuarioProblemaControlador.guardarUsuarioProblema);
api.put('/modificar-usuario-problema/:id_usuario_problema',UsuarioProblemaControlador.modificarUsuarioProblema);
api.get('/usuarios-problemas',UsuarioProblemaControlador.getUsuariosProblemas);
api.get('/usuario-problema/:id_usuario_problema',UsuarioProblemaControlador.getUsuarioProblema);
api.get('/usuario-tipo-problema/:id_tipo_problema',UsuarioProblemaControlador.getUsuarioTipoProblema);
api.delete('/eliminar-usuario-problema/:id_usuario_problema' ,UsuarioProblemaControlador.eliminarUsuarioProblema);

module.exports=api;