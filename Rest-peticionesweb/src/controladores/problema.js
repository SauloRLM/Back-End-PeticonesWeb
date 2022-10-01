'use strict'

const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});

//acciones
function guardarProblema(req,res){
  //Recoger parametros peticion
  var params = req.body;
  if(params.id_tipo_problema && params.descripcion_problema && params.id_usuario && params.id_usuario_designado && params.estatus && params.fecha_solicitud && params.fecha_aceptado && params.fecha_revision && params.fecha_enproceso && params.terminado && params.fecha_rechazado && connection){    
    var query = connection.query('INSERT INTO problema(id_tipo_problema, descripcion_problema, id_usuario, id_usuario_designado, estatus, fecha_solicitud, fecha_aceptado, fecha_revision, fecha_enproceso, fecha_terminado, fecha_rechazado) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
    [params.id_tipo_problema, params.descripcion_problema , params.id_usuario , params.id_usuario_designado , params.estatus , params.fecha_solicitud , params.fecha_aceptado , params.fecha_revision , params.fecha_enproceso , params.terminado , params.fecha_rechazado],function(error, result){
     if(error){
        // throw error;
        res.status(200).send({Mensaje:'Error al registrar problema'});
     }else{
        res.status(200).send({Mensaje:'problema registrado con exito'});
     }
   });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el problema'});
  }
}

/**/
function modificarProblema(req,res){
  var id_problema = req.params.id_problema;
  var params = req.body;
  if(params.id_tipo_problema && params.descripcion_problema && connection){
    var query_verificar = connection.query('SELECT id_problema FROM problema WHERE id_problema =?',[id_problema], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
          var query = connection.query('UPDATE problema SET id_tipo_problema =?, descripcion_problema = ? WHERE id_problema = ?',
            [params.id_tipo_problema, params.descripcion_problema, id_problema],function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al modificar problema'});
            }else{
              res.status(200).send({Mensaje:'problema modificado con exito'});
            }
          });
        }
        else{
          res.status(200).send({Mensaje:'El problema no existe'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el problema'});
  }
}
 

function ProblemaEstatus(req,res){
  var id_problema = req.params.id_problema;
  var params = req.body;  
  if(params.estatus && connection){

    //calculo de hora y fecha
    let date = new Date();
    var fecha =date.toISOString().split('T')[0];
    //console.log(fecha);
    var hora = date.toLocaleTimeString('en-US').split(' ')[0];
    //console.log(hora);
    var datetime = fecha+' '+ hora;

    if (params.estatus == 'ACEPTADO'){
      var query = connection.query('UPDATE problema SET estatus=?, fecha_aceptado = ? WHERE id_problema = ?',
      [params.esatus, datetime, id_problema],function(error, result){
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al modificar el estatus del problema'});
        }else{
          res.status(200).send({Mensaje:'Estatus del problema modificado con exito'});
        }
      });      
    }else if(params.estatus == 'REVISION'){
      var query = connection.query('UPDATE problema SET estatus=?, fecha_revision= ? WHERE id_problema = ?',
      [params.esatus, datetime, id_problema],function(error, result){
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al modificar el estatus del problema'});
        }else{
          res.status(200).send({Mensaje:'Estatus del problema modificado con exito'});
        }
      });      

    }else if(params.estatus == 'PROCESO'){
      var query = connection.query('UPDATE problema SET estatus=?, fecha_enproceso = ? WHERE id_problema = ?',
      [params.esatus, datetime, id_problema],function(error, result){
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al modificar el estatus del problema'});
        }else{
          res.status(200).send({Mensaje:'Estatus del problema modificado con exito'});
        }
      });            
    }else if(params.estatus == 'TERMINADO'){
      var query = connection.query('UPDATE problema SET estatus=?, fecha_terminado = ? WHERE id_problema = ?',
      [params.esatus, datetime, id_problema],function(error, result){
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al modificar el estatus del problema'});
        }else{
          res.status(200).send({Mensaje:'Estatus del problema modificado con exito'});
        }
      });      

    }else if(params.estatus == 'RECHAZADO'){
      var query = connection.query('UPDATE problema SET estatus=?, fecha_terminado = ? WHERE id_problema = ?',
      [params.esatus, datetime, id_problema],function(error, result){
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al modificar el estatus del problema'});
        }else{
          res.status(200).send({Mensaje:'Estatus del problema modificado con exito'});
        }
      });      
    }
    
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el estatus del problema'});
  }
}


function getProblemas(req,res){
  var query = connection.query('SELECT * FROM rol', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var roles = result;
            
      if(roles.length != 0){
        res.status(200).json(roles);   
      }
      else{
        res.status(200).send({Mensaje:'No hay Roles'});
      }
    }
  });
}


function getProblema(req,res){
  var id_problema = req.params.id_problema;

  var query = connection.query('SELECT * FROM problema WHERE id_problema=?', [id_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var problema = result;
            
      if(problema.length != 0){
        //res.json(rows);
        res.status(200).json(problema);   
      }
      else{
        res.status(200).send({Mensaje:'El problema no existe'});
      }
    }
  });
}



module.exports={  
    guardarProblema,
    modificarProblema,
    getProblemas,
    getProblema,
    ProblemaEstatus,

};