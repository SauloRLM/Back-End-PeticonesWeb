'use strict'

var express = require('express');
var TipoProblemaControlador = require('../controladores/tipo_problema');

var api = express.Router();

api.post('/registrar-tipo-problema',TipoProblemaControlador.guardarTipoProblema);
api.put('/modificar-tipo-problema/:id_tipo_problema',TipoProblemaControlador.modificarTipoProblema);
api.get('/tipos-problemas',TipoProblemaControlador.getTiposProblemas);
api.get('/tipo-problema/:id_tipo_problema',TipoProblemaControlador.getTipoProblema);
api.delete('/eliminar-tipo-problema/:id_tipo_problema',TipoProblemaControlador.eliminarTipoProblema);

module.exports=api;