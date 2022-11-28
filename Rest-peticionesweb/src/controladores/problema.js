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

  //calculo de hora y fecha
  let date = new Date();
  var fecha =date.toISOString().split('T')[0];
  //console.log(fecha);
  var hora = date.toLocaleTimeString('en-US').split(' ')[0];
  //console.log(hora);
  var datetime = fecha+' '+ hora;
  //console.log(datetime);

  //&& params.fecha_solicitud

  if(params.id_tipo_problema && params.descripcion_problema && params.id_usuario && params.estatus && datetime && connection){    

    var query = connection.query('INSERT INTO problema(id_tipo_problema, descripcion_problema, id_usuario,  estatus, fecha_solicitud) VALUES(?,?,?,?,?)',
    [params.id_tipo_problema, params.descripcion_problema , params.id_usuario , params.estatus , datetime ],function(error, result){
     if(error){
        // throw error;
        res.status(200).send({Mensaje:'Error al registrar problema',Estatus:'Error'});
     }else{
        res.status(200).send({Mensaje:'problema registrado con exito',Estatus:'Ok'});
     }
   });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el problema',Estatus:'Error'});
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
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
          var query = connection.query('UPDATE problema SET id_tipo_problema =?, descripcion_problema = ? WHERE id_problema = ?',
            [params.id_tipo_problema, params.descripcion_problema, id_problema],function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al modificar problema',Estatus:'Error'});
            }else{
              res.status(200).send({Mensaje:'problema modificado con exito',Estatus:'Ok'});
            }
          });
        }
        else{
          res.status(200).send({Mensaje:'El problema no existe',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el problema',Estatus:'Error'});
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
    //console.log(datetime);

    //ver si existe el problema
    var query_verificar = connection.query('SELECT id_problema FROM problema WHERE id_problema =?',[id_problema], function(error, result){    
      if(error){
        //throw error;
        res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
      }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
          
          if (params.estatus == 'ACEPTADO'){
            
            var query = connection.query('UPDATE problema SET estatus=?, id_usuario_designado = ? ,fecha_aceptado = ? WHERE id_problema = ?',
            [params.estatus, params.id_usuario_designado, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema modificado con exito',Estatus:'Ok'});
              }
            });      

          }else if(params.estatus == 'REVISION'){

            var query = connection.query('UPDATE problema SET estatus=?, fecha_revision= ? WHERE id_problema = ?',
            [params.esatus, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema modificado con exito',Estatus:'Ok'});
              }
            });      
      
          }else if(params.estatus == 'PROCESO'){

            var query = connection.query('UPDATE problema SET estatus=?, fecha_enproceso = ? WHERE id_problema = ?',
            [params.esatus, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema modificado con exito',Estatus:'Ok'});
              }
            });            
          }else if(params.estatus == 'TERMINADO'){

            var query = connection.query('UPDATE problema SET estatus=?, fecha_terminado = ? WHERE id_problema = ?',
            [params.esatus, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema modificado con exito',Estatus:'Ok'});
              }
            });      
      
          }else if(params.estatus == 'RECHAZADO'){

            var query = connection.query('UPDATE problema SET estatus=?, fecha_rechazado = ? WHERE id_problema = ?',
            [params.esatus, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema modificado con exito',Estatus:'Ok'});
              }
            });      
          }
        }else{
          res.status(200).send({Mensaje:'El problema no existe',Estatus:'Error'});
        }        
      }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el estatus del problema',Estatus:'Error'});
  }
}

//idea get multiple por estados para las distintas tablas de admin y solver y de stremanager
function getProblemas(req,res){

  var query_drop_temporal = connection.query('DROP TABLE IF EXISTS problema_usuario_designado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error al eliminar la tabla Usuario Designado Por Problema ',Estatus:'Error'});
    }else{

      var query_temporal = connection.query('CREATE TEMPORARY TABLE IF NOT EXISTS problema_usuario_designado (id_problema int, id_usuario_designado int NULL DEFAULT NULL, nombre_empleado_designado varchar(150) NULL DEFAULT NULL)', [], function(error, result){
        if(error){
          // throw error;
          res.status(200).send({Mensaje:'Error al eliminar Crear la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
        }else{

          var query_upload_data = connection.query('INSERT INTO problema_usuario_designado (id_problema, id_usuario_designado, nombre_empleado_designado) SELECT id_problema, id_usuario_designado,(SELECT emp.nombre_empleado FROM empleado AS emp WHERE (emp.id_empleado = problema.id_usuario_designado)) as nombre_empleado_designado FROM problema;', [], function(error, result){
            if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al Cargar datos a la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
            }else{              
              var query = connection.query('SELECT problema.id_problema, problema.id_tipo_problema,tipo_problema.tipo_problema, problema.descripcion_problema, problema.id_usuario, empleado.nombre_empleado, sucursal.id_sucursal, sucursal.nombre_sucursal,problema.id_usuario_designado, problema_usuario_designado.nombre_empleado_designado, problema.estatus, DATE_FORMAT(fecha_solicitud, "%Y-%m-%d %T") as fecha_solicitud, DATE_FORMAT(fecha_aceptado, "%Y-%m-%d %T") as fecha_aceptado,  DATE_FORMAT(fecha_revision, "%Y-%m-%d %T") as fecha_revision, DATE_FORMAT(fecha_enproceso, "%Y-%m-%d %T") as fecha_enproceso, DATE_FORMAT(fecha_terminado, "%Y-%m-%d %T") as fecha_terminado, DATE_FORMAT(fecha_rechazado, "%Y-%m-%d %T") as fecha_rechazado FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal INNER JOIN  problema_usuario_designado ON problema.id_problema = problema_usuario_designado.id_problema;', [], function(error, result){
                if(error){
                  // throw error;
                  res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
                }else{
            
                  var problemas = result;
                  //console.log(problemas);
                  if(problemas.length != 0){
                    res.status(200).json(problemas);   
                  }
                  else{
                    res.status(200).send({Mensaje:'No hay problemas',Estatus:'Error'});
                  }
                }
              });

            }
          });
        }
      });      
    }
  });  
}


//
/*
var query = connection.query('SELECT problema.id_problema, problema.id_tipo_problema,tipo_problema.tipo_problema,problema.descripcion_problema, problema.id_usuario, empleado.nombre_empleado, problema_usuario_designado.nombre_empleado, problema.id_usuario_designado, problema.estatus, fecha_solicitud, fecha_aceptado, fecha_revision, fecha_enproceso, fecha_terminado, fecha_rechazado  FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN  problema_usuario_designado ON problema.id_usuario_designado = problema_usuario_designado.id_usuario_designado WHERE id_problema=?', [id_problema], function(error, result){
        if(error){
          // throw error;
          res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
        }else{
    
          
        }
      });
*/
function getProblema(req,res){
  var id_problema = req.params.id_problema;
  var query_drop_temporal = connection.query('DROP TABLE IF EXISTS problema_usuario_designado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error al eliminar la tabla Usuario Designado Por Problema ',Estatus:'Error'});
    }else{

      var query_temporal = connection.query('CREATE TEMPORARY TABLE IF NOT EXISTS problema_usuario_designado (id_problema int, id_usuario_designado int NULL DEFAULT NULL, nombre_empleado_designado varchar(150) NULL DEFAULT NULL)', [], function(error, result){
        if(error){
          // throw error;
          res.status(200).send({Mensaje:'Error al eliminar Crear la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
        }else{

          var query_upload_data = connection.query('INSERT INTO problema_usuario_designado (id_problema, id_usuario_designado, nombre_empleado_designado) SELECT id_problema, id_usuario_designado,(SELECT emp.nombre_empleado FROM empleado AS emp WHERE (emp.id_empleado = problema.id_usuario_designado)) as nombre_empleado_designado FROM problema;', [], function(error, result){
            if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al Cargar datos a la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
            }else{              
              
              var query = connection.query('SELECT problema.id_problema, problema.id_tipo_problema,tipo_problema.tipo_problema, problema.descripcion_problema, problema.id_usuario, empleado.nombre_empleado, sucursal.id_sucursal, sucursal.nombre_sucursal,problema.id_usuario_designado, problema_usuario_designado.nombre_empleado_designado, problema.estatus, DATE_FORMAT(fecha_solicitud, "%Y-%m-%d %T") as fecha_solicitud, DATE_FORMAT(fecha_aceptado, "%Y-%m-%d %T") as fecha_aceptado,  DATE_FORMAT(fecha_revision, "%Y-%m-%d %T") as fecha_revision, DATE_FORMAT(fecha_enproceso, "%Y-%m-%d %T") as fecha_enproceso, DATE_FORMAT(fecha_terminado, "%Y-%m-%d %T") as fecha_terminado, DATE_FORMAT(fecha_rechazado, "%Y-%m-%d %T") as fecha_rechazado FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal INNER JOIN  problema_usuario_designado ON problema.id_problema = problema_usuario_designado.id_problema WHERE id_problema=?', [], function(error, result){
                if(error){
                  // throw error;
                  res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
                }else{            
                  var problema = result;                
                  if(problema.length != 0){
                    //res.json(rows);
                    res.status(200).json(problema);   
                  }
                  else{
                    res.status(200).send({Mensaje:'El problema no existe',Estatus:'Error'});
                  }
                }
              });

            }
          });
        }
      });      
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