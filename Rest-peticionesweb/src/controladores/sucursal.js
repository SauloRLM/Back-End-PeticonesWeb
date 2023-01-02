'use strict'
const conexion = require('../conexion');
const connection = conexion();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});
//acciones
function guardarSucursal(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.id_sucursal && params.nombre_sucursal  && params.telefono && params.domicilio && params.correo && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[params.id_sucursal], function(error, result){

      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia', Estatus:'Error'});
       }else{
        var resultado_verificacion = result;        
        if(resultado_verificacion.length == 0){
          var query = connection.query('INSERT INTO sucursal(id_sucursal, nombre_sucursal, domicilio, correo, telefono, estatus) VALUES(?,?,?,?,?,?)',
          [params.id_sucursal, params.nombre_sucursal, params.domicilio, params.correo, params.telefono, params.estatus],function(error, result){
           if(error){        
              res.status(200).send({Mensaje:'Error al registrar la sucursal', Estatus:'Error'});
           }else{
              res.status(200).send({Mensaje:'sucursal registrada con exito', Estatus:'Ok'});
           }
         });
        }
        else{
          res.status(200).send({Mensaje:'Error. sucursal ya registrada anteriormente.', Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar la sucursal.', Estatus:'Error'});
  }
}

/**/
function modificarSucursal(req,res){
  var id_sucursal = req.params.id_sucursal;
  var params = req.body;

  if(params.nombre_sucursal && params.domicilio && params.correo && params.telefono && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[id_sucursal], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia', Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){

          var query = connection.query('UPDATE sucursal SET nombre_sucursal =?, domicilio = ?, correo = ?, telefono=?, estatus=?  WHERE id_sucursal = ?',
            [params.nombre_sucursal, params.domicilio, params.correo, params.telefono, params.estatus, id_sucursal],function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al modificar Sucursal', Estatus:'Error'});
            }else{
              //deshabilitar empleado aosciado a dicha sucursal o habilitar en caso de habilitar
              var query = connection.query('UPDATE empleado JOIN sucursal ON sucursal.id_sucursal = empleado.id_sucursal SET empleado.estatus = ? WHERE sucursal.estatus = ?;',
              [params.estatus,params.estatus],function(error, result){
                if(error){
                //throw error;
                  res.status(200).send({Mensaje:'Error al modificar Empleado',Estatus:'Error'});
                }else{                
                  //deshabilitar usuario asosiado con el empleado
                  var query = connection.query('UPDATE usuario JOIN empleado ON empleado.id_empleado = usuario.id_empleado SET usuario.estatus = ? WHERE empleado.estatus = ?;',
                  [params.estatus,params.estatus],function(error, result){
                    if(error){
                    //throw error;
                      res.status(200).send({Mensaje:'Error al modificar Empleado',Estatus:'Error'});
                    }else{                      
                      if(params.estatus == 'B'){                                                                        
                        //obtener los datos de almacen y cargarlos a la 1 como disponibles, por ultimo borrarlos de almacen.
                        var query = connection.query('SELECT id_codigo_articulo,cantidad_total,tipo FROM almacen WHERE id_sucursal = ?', [id_sucursal], function(error, result){
                          if(error){
                            // throw error;
                            res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
                          }else{
                      
                            var stockSucursal = result;                                  
                            var banderaError = 'a'
                            if(stockSucursal.length != 0){
                              
                              //console.log(stockSucursal);

                              //hacer un foreach para preguntar si existen en el almacen y sino para cargarlos 
                              stockSucursal.forEach(element => {

                                //element.id_codigo_articulo
                                //element.cantidad_total
                                //element.tipo
                                //console.log(element.cantidad_total);

                                //preguntar si existe el articulo en el almacen 1 si es asi sumarle
                                var query_exist_almacen = connection.query('SELECT cantidad_disponible from almacen  where id_sucursal = ? and id_codigo_articulo = ?',
                                  [1,element.id_codigo_articulo],function(error, result){
                                  if(error){
                                    //si hubo error al preguntar                                    
                                    banderaError = 'b';
                                  }else{
                                    var disponible = result;  
                                    //console.log(disponible.length);
                                    if(disponible.length != 0){                                                
                                      //si existe  sumarlo 
                                      //console.log('Cantidad de alamacen: '+result[0].cantidad_disponible)
                                      var cantidadAlmacen = 0;                                      
                                      cantidadAlmacen = result[0].cantidad_disponible + element.cantidad_total;                                      
                                      var query_almacen = connection.query('UPDATE almacen SET cantidad_disponible = ? WHERE id_sucursal = ? and id_codigo_articulo = ?;',
                                      [cantidadAlmacen,1,element.id_codigo_articulo],function(error, result){
                                        if(error){
                                        //throw error;                                          
                                          banderaError = 'b';
                                        }else{                                                 
                                          //Borrar dicho almacen por id_sucursal y por codigo
                                          var query_almacen = connection.query('DELETE FROM almacen WHERE id_sucursal = ? AND id_codigo_articulo = ?;',
                                          [ id_sucursal,element.id_codigo_articulo],function(error, result){
                                          if(error){
                                            //throw error;
                                            banderaError = 'b';                                            
                                          }
                                          });                                                                                                            
                                        }
                                      });                                                                                                            
                                    }else{                                      
                                      //sino existe crearlo y eliminar el almacen
                                      var query = connection.query('INSERT INTO almacen(id_sucursal, id_codigo_articulo, cantidad_total, cantidad_disponible, tipo) VALUES(?,?,?,?,?)',
                                      [1,element.id_codigo_articulo,0,element.cantidad_total,element.tipo],function(error, result){
                                        if(error){
                                        // throw error;                                        
                                          banderaError = 'b';
                                        }else{
                                          //Borrar dicho almacen por id_sucursal y por codigo
                                          var query_almacen = connection.query('DELETE FROM almacen WHERE id_sucursal = ? AND id_codigo_articulo = ?;',
                                          [ id_sucursal,element.id_codigo_articulo],function(error, result){
                                          if(error){
                                            //throw error;                                            
                                            banderaError = 'b';
                                          }
                                          });                                                
                                        }
                                      });                                                                                
                                    }
                                  }
                                });                                                  
                              });

                              if(banderaError == 'b'){
                                res.status(200).send({Mensaje:'Error. al cargar stock a almacen', Estatus:'Error'});
                              }else{
                                res.status(200).send({Mensaje:'Sucursal modificada con exito', Estatus:'Ok'});
                              }

                            }else{
                              res.status(200).send({Mensaje:'Sucursal modificada con exito', Estatus:'Ok'});
                            }
                          }
                        });

                      }else{                        
                        res.status(200).send({Mensaje:'Sucursal modificada con exito', Estatus:'Ok'});
                      }                      
                    }
                  });       
                }  
              });                     
            }
          });
        }
        else{
          res.status(200).send({Mensaje:'Error. sucursal no existe.', Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error.Introduce los datos correctamente para poder modificar la sucursal.', Estatus:'Error'});
  }
}



function getSucursales(req,res){
  var query = connection.query('SELECT * FROM sucursal', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var sucursales = result;
            
      if(sucursales.length != 0){
        res.status(200).json(sucursales);   
      }
      else{
        res.status(200).send({Mensaje:'Error.No hay sucursales', Estatus:'Error'});
      }
    }
  });
}

function getSucursalesSinAlmacen(req,res){
  var query = connection.query('SELECT * FROM sucursal WHERE id_sucursal != ?', [1], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{
      var sucursales = result;            
      if(sucursales.length != 0){
        res.status(200).json(sucursales);   
      }
      else{
        res.status(200).send({Mensaje:'Error.No hay sucursales', Estatus:'Error'});
      }
    }
  });
}

function getSucursalesAct(req,res){
  var query = connection.query('SELECT * FROM sucursal WHERE estatus = ?', ["A"], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var sucursales = result;
            
      if(sucursales.length != 0){
        res.status(200).json(sucursales);   
      }
      else{
        res.status(200).send({Mensaje:'Error.No hay sucursales', Estatus:'Error'});
      }
    }
  });
}

function getSucursal(req,res){
  var id_sucursal = req.params.id_sucursal;

  var query = connection.query('SELECT * FROM sucursal WHERE id_sucursal=?', [id_sucursal], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var sucursal = result;
            
      if(sucursal.length != 0){
        //res.json(rows);
        res.status(200).json(sucursal);   
      }
      else{
        res.status(200).send({Mensaje:'Error. La sucursal no existe.', Estatus:'Error'});
      }
    }
  });
}


function eliminarSucursal(req,res){

  var id_sucursal = req.params.id_sucursal;
  var estatus = 'B';
  var query = connection.query('UPDATE sucursal SET estatus = ? WHERE id_sucursal = ?',
  [estatus, id_sucursal],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Sucursal  deshabilitada con exito', Estatus:'Ok'});  
      }
      else{
        res.status(200).send({Mensaje:'Error. La sucursal no existe.', Estatus:'Error'});
      }
    }
  });
}

module.exports={  
    guardarSucursal,
    modificarSucursal,
    getSucursales,
    getSucursalesAct,
    getSucursalesSinAlmacen,
    getSucursal,
    eliminarSucursal,    
};