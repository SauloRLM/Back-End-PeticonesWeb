'use strict'
//const { param } = require('../routes/usuario_problema');
const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});

//acciones
function guardarUsuarioProblema(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.id_tipo_problema && params.id_usuario && params.estatus && connection){

    //verificar que no exista ese usuario por tipo de problema
    var query_verificar = connection.query('SELECT id_usuario_problema FROM usuario_problema WHERE id_tipo_problema =? AND id_usuario =? ',[params.id_tipo_problema, params.id_usuario], function(error, result){

      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{

        var resultado_verificacion = result;
        //verificar
        if(resultado_verificacion.length == 0){

            var query = connection.query('INSERT INTO usuario_problema(id_tipo_problema, id_usuario, estatus) VALUES(?,?,?)',
                            [params.id_tipo_problema, params.id_usuario, params.estatus],function(error, result){
                                if(error){
                                // throw error;
                                    res.status(200).send({Mensaje:'Error al registrar al usuario y a su tipo problema a resolver'});
                                }else{
                                    res.status(200).send({Mensaje:'Solucionador y tipo de Problema registrado con exito'});
                                }
            });             
        }else{
          res.status(200).send({Mensaje:'El Solucionador  ya esta registrado en el sistema'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el Solucionadory su tipo de problema'});
  }
}

/**/
function modificarUsuarioProblema(req,res){
  var id_usuario_problema = req.params.id_usuario_problema;  
  var params = req.body;

  if(params.id_tipo_problema && params.id_usuario && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_tipo_problema FROM usuario_problema WHERE id_usuario_problema =?',[id_usuario_problema], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
          
            var query = connection.query('UPDATE usuario_problema SET id_tipo_problema = ?, id_usuario = ?, estatus= ?  WHERE id_usuario_problema = ?',
            [params.id_tipo_problema, params.id_usuario, params.estatus, id_usuario_problema],function(error, result){
                if(error){
                    //throw error;
                    res.status(200).send({Mensaje:'Error al modificar el usuario por tipo de problema'});
                }else{
                    res.status(200).send({Mensaje:' Usuario por tipo de Problema modificado con exito'});
                }
            });                                                                           
        }
        else{
          res.status(200).send({Mensaje:'El Usuario por Tipo Problema no existe'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar Usuario Por Tipo Problema'});
  }
}


function getUsuariosProblemas(req,res){
  var query = connection.query('SELECT  usuario_problema.id_usuario_problema, usuario_problema.id_tipo_problema ,tipo_problema.tipo_problema, usuario_problema.id_usuario, usuario.usuario, usuario_problema.estatus FROM usuario_problema INNER JOIN tipo_problema ON tipo_problema.id_tipo_problema = usuario_problema.id_usuario_problema INNER JOIN usuario ON usuario.id_usuario = usuario_problema.id_usuario', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var usuarios_problemas = result;
            
      if(usuarios_problemas.length != 0){
        res.status(200).json(usuarios_problemas);   
      }
      else{
        res.status(200).send({Mensaje:'No hay Usuarios Por Tipo de Problema'});
      }
    }
  });
}


function getUsuarioProblema(req,res){
  var id_usuario_problema = req.params.id_usuario_problema;
  var query = connection.query('SELECT usuario_problema.id_usuario_problema, usuario_problema.id_tipo_problema ,tipo_problema.tipo_problema, usuario_problema.id_usuario, usuario.usuario from usuario_problema INNER JOIN tipo_problema ON tipo_problema.id_tipo_problema = usuario_problema.id_usuario_problema INNER JOIN usuario ON usuario.id_usuario = usuario_problema.id_usuario Where usuario_problema.id_usuario_problema = ?', [id_usuario_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var usuario_problema = result;
            
      if(usuario_problema.length != 0){
        //res.json(rows);
        res.status(200).json(usuario_problema);   
      }
      else{
        res.status(200).send({Mensaje:'El Usuario Por tipo de problema no existe'});
      }
    }
  });
}


function eliminarUsuarioProblema(req,res){

  var id_usuario_problema = req.params.id_usuario_problema;
  var estatus = 'B';
  var query = connection.query('UPDATE usuario_problema SET estatus = ? WHERE id_usuario_problema = ?',
  [estatus, id_usuario_problema],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Usuario por Tipo de problema deshabilitado con exito'});  
      }
      else{
        res.status(200).send({Mensaje:'El Usuario por Tipo de problema no existe'});
      }
    }
  });
}


module.exports={  
    guardarUsuarioProblema,
    modificarUsuarioProblema,
    getUsuariosProblemas,
    getUsuarioProblema,
    eliminarUsuarioProblema,    
};
