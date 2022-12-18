'use strict'
const conexion = require('../conexion');
const connection = conexion();
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
    var date = new Date();
    var fecha =date.toISOString().split('T')[0];    
    var hora = date.toLocaleTimeString('en-US').split(' ')[0];    
    var datetime = fecha+' '+ hora;

    //console.log(params);
    //console.log(datetime);
    

  if(params.id_tipo_problema && params.descripcion_problema && params.id_usuario && params.estatus && connection){    

    var query = connection.query('INSERT INTO problema(id_tipo_problema, descripcion_problema, id_usuario,  estatus, fecha_solicitud, total) VALUES(?,?,?,?,?,?)',
    [params.id_tipo_problema, params.descripcion_problema , params.id_usuario , params.estatus , datetime, 0],function(error, result){
     if(error){
        // throw error;
        res.status(200).send({Mensaje:'Error al registrar problema',Estatus:'Error'});
     }else{
        res.status(200).send({Mensaje:'problema registrado con exito',Estatus:'Ok'});
     }
   });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar el problema.',Estatus:'Error'});
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
          res.status(200).send({Mensaje:'Error. El problema no existe.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el problema.',Estatus:'Error'});
  }
}
 

function ProblemaEstatus(req,res){
  var id_problema = req.params.id_problema;
  var params = req.body;  
  if(params.estatus && connection){

  //calculo de hora y fecha actual
    var date = new Date();
    var fecha =date.toISOString().split('T')[0];    
    var hora = date.toLocaleTimeString('en-US').split(' ')[0];    
    var datetime = fecha+' '+ hora;
    //console.log(datetime);
  //prueba de nueva fecha menos 3 meses
    var dateAtras = new Date();
    dateAtras.setDate(date.getDate() - 90);    
    var fecha_3 =dateAtras.toISOString().split('T')[0];    
    var hora_3 = dateAtras.toLocaleTimeString('en-US').split(' ')[0];    
    var tiempo_3 = fecha_3+' '+ hora_3;
    //console.log(tiempo_3);

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
                res.status(200).send({Mensaje:'Problema asignado con exito',Estatus:'Ok'});
              }
            });      

          }else if(params.estatus == 'REVISION'){

            var query = connection.query('UPDATE problema SET estatus=?, fecha_revision= ? WHERE id_problema = ?',
            [params.estatus, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema modificado con exito',Estatus:'Ok'});
              }
            });      
      
          }else if(params.estatus == 'PROCESO'){            
            var banderaError = 'a'
            
                //materiales va a estar compuesto por dos campos cantidad a restar y el codigo del articulo 
                var totalPrecioRequisitos = 0 ;                
                params.requeriment.forEach(element => {              
                  var codigo = element.id_codigo_articulo;
                  var cantidad = element.cantidad;                                    
                  var precio = element.precio;                       
                  
                  //console.log(element);
                  
                  if(codigo == '5000000000'){ //cambiar en base a cual es otros en el codigo
                    totalPrecioRequisitos = totalPrecioRequisitos + precio;                    
                  }else{
                    totalPrecioRequisitos = totalPrecioRequisitos + precio;
                    var query_exist_almacen = connection.query('SELECT * from almacen  where id_sucursal = ? and id_codigo_articulo = ?',
                    [params.id_sucursal,codigo],function(error, result){
                    if(error){
                      //throw error;
                      banderaError = 'b';
                    }else{
                      var resultado_verificacion = result;  
                      if(resultado_verificacion.length != 0){                                                
                        
                        var query_almacen = connection.query('SELECT cantidad_disponible from almacen WHERE id_sucursal = 16 and id_codigo_articulo = ?;',
                        [ codigo ],function(error, result){
                          if(error){
                            //throw error;
                            banderaError = 'b';
                          }else{                                                        
                            var cantidadAlmacen = 0;
                            cantidadAlmacen = result[0].cantidad_disponible;
                            cantidadAlmacen = cantidadAlmacen - cantidad;                            
                                                                                                                
                                var resultado_verificacion_update = result;                                  
                                if(resultado_verificacion_update.length > 0){
                                  //se procede a reinsetar el almacen modificado
                                  var query_almacen = connection.query('UPDATE almacen SET cantidad_disponible = ? WHERE id_sucursal = 16 and id_codigo_articulo = ?;',
                                  [ cantidadAlmacen,codigo ],function(error, result){
                                    if(error){
                                      //throw error;
                                      banderaError = 'b';
                                    }else{                                                 
                                      //se procede a modificar el almacen receptor
                                      var query_almacen = connection.query('SELECT cantidad_total from almacen WHERE id_sucursal = ? and id_codigo_articulo = ?;',
                                      [params.id_sucursal,codigo ],function(error, result){
                                        if(error){
                                          //throw error;
                                          banderaError = 'b';
                                        }else{
                                          var cantidadAlmacenRecip = result[0].cantidad_total;
                                          cantidadAlmacenRecip = cantidadAlmacenRecip + cantidad;                                          
                                          //se procede a a
                                          var query = connection.query('UPDATE almacen SET cantidad_total = ? WHERE id_sucursal = ? AND id_codigo_articulo = ?',
                                          [ cantidadAlmacenRecip,params.id_sucursal, codigo],function(error, result){
                                            if(error){
                                              banderaError = 'b';
                                            }
                                          })
                                        }
                                      })
                                    }
                                  });
                                }                               
                              }
                            })                                                                                                                                         
                      }else{
                        var query_almacen = connection.query('SELECT cantidad_disponible,tipo from almacen WHERE id_sucursal = 16 and id_codigo_articulo = ?;',
                        [ codigo ],function(error, result){
                          if(error){
                            //throw error;
                            banderaError = 'b';
                          }else{                                                        
                            var cantidadAlmacen = 0;
                            cantidadAlmacen = result[0].cantidad_disponible;
                            cantidadAlmacen = cantidadAlmacen - cantidad;                     
                            //console.log(cantidadAlmacen);
                            var tipo = result[0].tipo;                                                                                                                
                                var resultado_verificacion_update = result;                                  
                                if(resultado_verificacion_update.length > 0){
                                  //se procede a reinsetar el almacen modificado
                                  var query_almacen = connection.query('UPDATE almacen SET cantidad_disponible = ? WHERE id_sucursal = 16 and id_codigo_articulo = ?;',
                                  [ cantidadAlmacen,codigo ],function(error, result){
                                    if(error){
                                      //throw error;
                                      banderaError = 'b';
                                    }else{                                                 
                                      //para generarlo
                                        var cantTotal = 0;
                                        //console.log(cantidad);
                                        var query = connection.query('INSERT INTO almacen(id_sucursal, id_codigo_articulo, cantidad_total, cantidad_disponible, tipo) VALUES(?,?,?,?,?)',
                                        [params.id_sucursal, codigo, cantidad, cantTotal,tipo],function(error, result){
                                          if(error){
                                          // throw error;
                                            banderaError = 'b';
                                          }
                                        });                                                                                
                                    }
                                  });
                                }                               
                              }
                            })                                                                                                                                                                                                                                                                                               
                      }
                    }
                  });                     
                  }                                                  
                });   
                
                           
                if(banderaError == 'b'){
                  res.status(200).send({Mensaje:'Error al asignar materiales al problema',Estatus:'Error'});
                }else{                  
                  var query = connection.query('UPDATE problema SET total=?, estatus= ?, fecha_enproceso= ? WHERE id_problema = ?',
                  [ totalPrecioRequisitos,params.estatus,datetime,id_problema],function(error, result){
                    if(error){
                      res.status(200).send({Mensaje:'Error al modificar estatus del problema',Estatus:'Ok'});                                
                    }else{
                      res.status(200).send({Mensaje:'Materiales agregados con exito al problema',Estatus:'Ok'});                                
                    }
                  });                                                                                              
                }                          

          }else if(params.estatus == 'TERMINADO'){

            var query = connection.query('UPDATE problema SET estatus=?, fecha_terminado = ? WHERE id_problema = ?',
            [params.estatus, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema Terminado con exito',Estatus:'Ok'});
              }
            });      
      
          }else if(params.estatus == "RECHAZADO"){            
            var query = connection.query('UPDATE problema SET estatus=?, fecha_rechazado = ? WHERE id_problema = ?',
            [params.estatus, datetime, id_problema],function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Estatus del problema Rechazado con exito',Estatus:'Ok'});
              }
            });      
          }
        }else{
          res.status(200).send({Mensaje:'Error. El problema no existe.',Estatus:'Error'});
        }        
      }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el estatus del problema',Estatus:'Error'});
  }
}

//eliminar los requisitos del prolema y regresar a aceptado y la fecha de revision debe de ser null e indicar que fue rechazado.
function deleteRequestProblem(req,res){
  var id_problema = req.params.id_problema;  
  var query = connection.query('DELETE FROM requisito_problema WHERE id_problema = ?',
  [id_problema],function(error, result){
    if(error){      
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{
      var resultado_verificacion = result.affectedRows;            
      if(resultado_verificacion != 0){        
        var query = connection.query('UPDATE problema SET estatus="ACEPTADO", fecha_revision = NULL WHERE id_problema = ?',
        [id_problema],function(error, result){
          if(error){
            //throw error;
            res.status(200).send({Mensaje:'Error al modificar el estatus del problema',Estatus:'Error'});
          }else{
            res.status(200).send({Mensaje:'Requisitos del problema eliminados con exito, favor de comunicarse con el Solucionador correspondiente para que los vuelva a levantar',Estatus:'Ok'});
          }
        });      
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay requisitos a eliminar.',Estatus:'Error'});
      }
    }
  });
}

//idea get multiple por estados para las distintas tablas de admin y solver y de stremanager
function getProblemas(req,res){

  //calculo de hora y fecha actual
  var date = new Date();
  var fecha =date.toISOString().split('T')[0];    
  var hora = date.toLocaleTimeString('en-US').split(' ')[0];    
  var datetime = fecha+' '+ hora;
  //console.log(datetime);
//prueba de nueva fecha menos 3 meses
  var dateAtras = new Date();
  dateAtras.setDate(date.getDate() - 90);    
  var fecha_3 =dateAtras.toISOString().split('T')[0];    
  var hora_3 = dateAtras.toLocaleTimeString('en-US').split(' ')[0];    
  var tiempo_3 = fecha_3+' '+ hora_3;
  //console.log(tiempo_3);

  var query_drop_temporal = connection.query('DROP TABLE IF EXISTS problema_usuario_designado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error al eliminar la tabla Usuario Designado Por Problema ',Estatus:'Error'});
    }else{

      var query_temporal = connection.query('CREATE TEMPORARY TABLE IF NOT EXISTS problema_usuario_designado (id_problema int, id_usuario_designado int NULL DEFAULT NULL, id_empleado int NULL DEFAULT NULL, nombre_empleado_designado varchar(150) NULL DEFAULT NULL)', [], function(error, result){
        if(error){
          // throw error;
          res.status(200).send({Mensaje:'Error al eliminar Crear la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
        }else{

          var query_upload_data = connection.query('INSERT INTO problema_usuario_designado (id_problema, id_usuario_designado,id_empleado, nombre_empleado_designado) SELECT id_problema, id_usuario_designado,(SELECT id_empleado  FROM usuario AS us WHERE (us.id_usuario = problem.id_usuario_designado)) AS infouser,  (SELECT nombre_empleado FROM  empleado AS resp WHERE (infouser = resp.id_empleado)) AS respon FROM problema AS problem', [], function(error, result){
            if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al Cargar datos a la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
            }else{              
              var query = connection.query('SELECT problema.id_problema, problema.id_tipo_problema,tipo_problema.tipo_problema, problema.descripcion_problema, problema.id_usuario, empleado.nombre_empleado, sucursal.id_sucursal, sucursal.nombre_sucursal,problema.id_usuario_designado, problema_usuario_designado.nombre_empleado_designado, problema.estatus, DATE_FORMAT(fecha_solicitud, "%Y-%m-%d %T") as fecha_solicitud, DATE_FORMAT(fecha_aceptado, "%Y-%m-%d %T") as fecha_aceptado,  DATE_FORMAT(fecha_revision, "%Y-%m-%d %T") as fecha_revision, DATE_FORMAT(fecha_enproceso, "%Y-%m-%d %T") as fecha_enproceso, DATE_FORMAT(fecha_terminado, "%Y-%m-%d %T") as fecha_terminado, DATE_FORMAT(fecha_rechazado, "%Y-%m-%d %T") as fecha_rechazado, problema.total FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal INNER JOIN  problema_usuario_designado ON problema.id_problema = problema_usuario_designado.id_problema WHERE problema.fecha_solicitud > ? ORDER BY problema.fecha_solicitud', [tiempo_3], function(error, result){
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
                    res.status(200).send({Mensaje:'Error. No hay problemas.',Estatus:'Error'});
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



function getProblema(req,res){
  var id_problema = req.params.id_problema;
  //calculo de hora y fecha actual
  var date = new Date();
  var fecha =date.toISOString().split('T')[0];    
  var hora = date.toLocaleTimeString('en-US').split(' ')[0];    
  var datetime = fecha+' '+ hora;
  //console.log(datetime);
//prueba de nueva fecha menos 3 meses
  var dateAtras = new Date();
  dateAtras.setDate(date.getDate() - 90);    
  var fecha_3 =dateAtras.toISOString().split('T')[0];    
  var hora_3 = dateAtras.toLocaleTimeString('en-US').split(' ')[0];    
  var tiempo_3 = fecha_3+' '+ hora_3;
  //console.log(tiempo_3);
  var query_drop_temporal = connection.query('DROP TABLE IF EXISTS problema_usuario_designado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error al eliminar la tabla Usuario Designado Por Problema ',Estatus:'Error'});
    }else{

      var query_temporal = connection.query('CREATE TEMPORARY TABLE IF NOT EXISTS problema_usuario_designado (id_problema int, id_usuario_designado int NULL DEFAULT NULL, id_empleado int NULL DEFAULT NULL, nombre_empleado_designado varchar(150) NULL DEFAULT NULL)', [], function(error, result){
        if(error){
          // throw error;
          res.status(200).send({Mensaje:'Error al eliminar Crear la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
        }else{

          var query_upload_data = connection.query('INSERT INTO problema_usuario_designado (id_problema, id_usuario_designado,id_empleado, nombre_empleado_designado) SELECT id_problema, id_usuario_designado,(SELECT id_empleado  FROM usuario AS us WHERE (us.id_usuario = problem.id_usuario_designado)) AS infouser,  (SELECT nombre_empleado FROM  empleado AS resp WHERE (infouser = resp.id_empleado)) AS respon FROM problema AS problem', [], function(error, result){
            if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al Cargar datos a la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
            }else{                            
              var query = connection.query('SELECT problema.id_problema, problema.id_tipo_problema,tipo_problema.tipo_problema, problema.descripcion_problema, problema.id_usuario, empleado.nombre_empleado, sucursal.id_sucursal, sucursal.nombre_sucursal,problema.id_usuario_designado, problema_usuario_designado.nombre_empleado_designado, problema.estatus, DATE_FORMAT(fecha_solicitud, "%Y-%m-%d %T") as fecha_solicitud, DATE_FORMAT(fecha_aceptado, "%Y-%m-%d %T") as fecha_aceptado,  DATE_FORMAT(fecha_revision, "%Y-%m-%d %T") as fecha_revision, DATE_FORMAT(fecha_enproceso, "%Y-%m-%d %T") as fecha_enproceso, DATE_FORMAT(fecha_terminado, "%Y-%m-%d %T") as fecha_terminado, DATE_FORMAT(fecha_rechazado, "%Y-%m-%d %T") as fecha_rechazado FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal INNER JOIN  problema_usuario_designado ON problema.id_problema = problema_usuario_designado.id_problema WHERE problema.fecha_solicitud > ? AND problema.id_problema=?', [tiempo_3,id_problema], function(error, result){
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
                    res.status(200).send({Mensaje:'Error. El problema no existe.',Estatus:'Error'});
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

//funcion de problemas por orden de fecha de solicitud
function getProblemasOrder(req,res){
  //calculo de hora y fecha actual
  var date = new Date();
  var fecha =date.toISOString().split('T')[0];    
  var hora = date.toLocaleTimeString('en-US').split(' ')[0];    
  var datetime = fecha+' '+ hora;
  //console.log(datetime);
//prueba de nueva fecha menos 3 meses
  var dateAtras = new Date();
  dateAtras.setDate(date.getDate() - 90);    
  var fecha_3 =dateAtras.toISOString().split('T')[0];    
  var hora_3 = dateAtras.toLocaleTimeString('en-US').split(' ')[0];    
  var tiempo_3 = fecha_3+' '+ hora_3;
  //console.log(tiempo_3);
  var query_drop_temporal = connection.query('DROP TABLE IF EXISTS problema_usuario_designado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error al eliminar la tabla Usuario Designado Por Problema ',Estatus:'Error'});
    }else{

      var query_temporal = connection.query('CREATE TEMPORARY TABLE IF NOT EXISTS problema_usuario_designado (id_problema int, id_usuario_designado int NULL DEFAULT NULL, id_empleado int NULL DEFAULT NULL, nombre_empleado_designado varchar(150) NULL DEFAULT NULL)', [], function(error, result){
        if(error){
          // throw error;
          res.status(200).send({Mensaje:'Error al eliminar Crear la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
        }else{

          var query_upload_data = connection.query('INSERT INTO problema_usuario_designado (id_problema, id_usuario_designado,id_empleado, nombre_empleado_designado) SELECT id_problema, id_usuario_designado,(SELECT id_empleado  FROM usuario AS us WHERE (us.id_usuario = problem.id_usuario_designado)) AS infouser,  (SELECT nombre_empleado FROM  empleado AS resp WHERE (infouser = resp.id_empleado)) AS respon FROM problema AS problem', [], function(error, result){
            if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al Cargar datos a la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
            }else{              
              var query = connection.query('SELECT problema.id_problema, problema.id_tipo_problema,tipo_problema.tipo_problema, problema.descripcion_problema, problema.id_usuario, empleado.nombre_empleado, sucursal.id_sucursal, sucursal.nombre_sucursal,problema.id_usuario_designado, problema_usuario_designado.nombre_empleado_designado, problema.estatus, DATE_FORMAT(fecha_solicitud, "%Y-%m-%d %T") as fecha_solicitud, DATE_FORMAT(fecha_aceptado, "%Y-%m-%d %T") as fecha_aceptado,  DATE_FORMAT(fecha_revision, "%Y-%m-%d %T") as fecha_revision, DATE_FORMAT(fecha_enproceso, "%Y-%m-%d %T") as fecha_enproceso, DATE_FORMAT(fecha_terminado, "%Y-%m-%d %T") as fecha_terminado, DATE_FORMAT(fecha_rechazado, "%Y-%m-%d %T") as fecha_rechazado, problema.total FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal INNER JOIN  problema_usuario_designado ON problema.id_problema = problema_usuario_designado.id_problema WHERE problema.fecha_solicitud > ?  ORDER BY problema.fecha_solicitud', [tiempo_3], function(error, result){
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
                    res.status(200).send({Mensaje:'Error. No hay problemas.',Estatus:'Error'});
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


//problemas por sucursal ordenadors por fecha de solicitud
//funcion de problemas por orden de fecha de solicitud
function getProblemasSucursalOrder(req,res){
  var id_sucursal = req.params.id_sucursal;
  //calculo de hora y fecha actual
  var date = new Date();
  var fecha =date.toISOString().split('T')[0];    
  var hora = date.toLocaleTimeString('en-US').split(' ')[0];    
  var datetime = fecha+' '+ hora;
  //console.log(datetime);
//prueba de nueva fecha menos 3 meses
  var dateAtras = new Date();
  dateAtras.setDate(date.getDate() - 90);    
  var fecha_3 =dateAtras.toISOString().split('T')[0];    
  var hora_3 = dateAtras.toLocaleTimeString('en-US').split(' ')[0];    
  var tiempo_3 = fecha_3+' '+ hora_3;
  //console.log(tiempo_3);
  var query_drop_temporal = connection.query('DROP TABLE IF EXISTS problema_usuario_designado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error al eliminar la tabla Usuario Designado Por Problema ',Estatus:'Error'});
    }else{

      var query_temporal = connection.query('CREATE TEMPORARY TABLE IF NOT EXISTS problema_usuario_designado (id_problema int, id_usuario_designado int NULL DEFAULT NULL, id_empleado int NULL DEFAULT NULL, nombre_empleado_designado varchar(150) NULL DEFAULT NULL)', [], function(error, result){
        if(error){
          // throw error;
          res.status(200).send({Mensaje:'Error al eliminar Crear la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
        }else{

          var query_upload_data = connection.query('INSERT INTO problema_usuario_designado (id_problema, id_usuario_designado,id_empleado, nombre_empleado_designado) SELECT id_problema, id_usuario_designado,(SELECT id_empleado  FROM usuario AS us WHERE (us.id_usuario = problem.id_usuario_designado)) AS infouser,  (SELECT nombre_empleado FROM  empleado AS resp WHERE (infouser = resp.id_empleado)) AS respon FROM problema AS problem', [], function(error, result){
            if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al Cargar datos a la tabla Temporal Usuario Designado Por Problema ',Estatus:'Error'});
            }else{              
              var query = connection.query('SELECT problema.id_problema, problema.id_tipo_problema,tipo_problema.tipo_problema, problema.descripcion_problema, problema.id_usuario, empleado.nombre_empleado, sucursal.id_sucursal, sucursal.nombre_sucursal,problema.id_usuario_designado, problema_usuario_designado.nombre_empleado_designado, problema.estatus, DATE_FORMAT(fecha_solicitud, "%Y-%m-%d %T") as fecha_solicitud, DATE_FORMAT(fecha_aceptado, "%Y-%m-%d %T") as fecha_aceptado,  DATE_FORMAT(fecha_revision, "%Y-%m-%d %T") as fecha_revision, DATE_FORMAT(fecha_enproceso, "%Y-%m-%d %T") as fecha_enproceso, DATE_FORMAT(fecha_terminado, "%Y-%m-%d %T") as fecha_terminado, DATE_FORMAT(fecha_rechazado, "%Y-%m-%d %T") as fecha_rechazado, problema.total FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal INNER JOIN  problema_usuario_designado ON problema.id_problema = problema_usuario_designado.id_problema WHERE problema.fecha_solicitud > ? AND  sucursal.id_sucursal = ?', [tiempo_3,id_sucursal], function(error, result){
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
                    res.status(200).send({Mensaje:'Error. No hay problemas.',Estatus:'Error'});
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

//suma de gasto de sucursal en mantenimiento por problemas terminados
function getGastoTotalSucursal(req,res){
  var id_sucursal = req.params.id_sucursal;
  //problema.estatus = "TERMINADO" AND
  var query = connection.query('SELECT SUM(problema.total) AS gasto_total  FROM problema INNER JOIN tipo_problema ON problema.id_tipo_problema = tipo_problema.id_tipo_problema INNER JOIN usuario ON problema.id_usuario = usuario.id_usuario  INNER JOIN empleado ON usuario.id_empleado = empleado.id_empleado INNER JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal INNER JOIN  problema_usuario_designado ON problema.id_problema = problema_usuario_designado.id_problema where  sucursal.id_sucursal = 2;', [id_sucursal], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var GastoSucursal = result;
            
      if(GastoSucursal.length != 0){
        //res.json(rows);
        res.status(200).json(GastoSucursal);   
      }
      else{
        res.status(200).send({Mensaje:'Error. La sucursal no existe.', Estatus:'Error'});
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
    getProblemasOrder,
    deleteRequestProblem,
    getProblemasSucursalOrder,
    getGastoTotalSucursal
};