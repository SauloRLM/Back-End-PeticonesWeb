'use strict'

const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
    if(error){
     console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
   }
  });

//acciones
function guardarArticuloProblema(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.id_articulo && params.id_tipo_problema && connection){

    //Verificar si existe ya el registro 
    var query_verificar = connection.query('SELECT id_articulo_problema FROM articulo_problema WHERE id_articulo = ? AND id_tipo_problema = ?',[params.id_articulo,params.id_articulo_problema], function(error, result){
    
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        
        var resultado_verificacion = result;        
        if(resultado_verificacion.length == 0){

          //Verificar si existe el id articulo en almacen 
          var query_verificar_articulo = connection.query('SELECT id_articulo FROM almacen WHERE id_articulo =?',[params.id_articulo], function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
            }else{              

              var resultado_verificacion_articulo = result;
              if(resultado_verificacion_articulo.length != 0){

                //verificar el tipo de problema en la tabla tipo _problema
                var query_verificar_tipo_problema = connection.query('SELECT id_tipo_problema FROM tipo_problema WHERE id_tipo_problema = ?',[params.id_tipo_problema], function(error, result){
                    
                    if(error){
                        //throw error;
                        res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});                  
                    }else{
                        
                        var resultado_verificacion_tipo_problema = result;

                        if(resultado_verificacion_tipo_problema.length != 0){

                            //se procede a insetar la tupla 
                            var query = connection.query('INSERT INTO articulo_problema(id_articulo,id_tipo_problema ) VALUES(?,?)',
                            [params.id_articulo, params.id_tipo_problema],function(error, result){
                                if(error){
                                // throw error;
                                    res.status(200).send({Mensaje:'Error al registrar la Articulo al Tipo de Problema',Estatus:'Error'});
                                }else{
                                    res.status(200).send({Mensaje:'Articulo registrado con exito al Tipo de Problema', Estatus:'Ok'});
                                }
                            });

                        }else{
                            res.status(200).send({Mensaje:'EL Tipo de Problema no existe o no esta registrado',Estatus:'Error'});
                        }
                    }          
                });                             
              }else{
                  res.status(200).send({Mensaje:'El Articulo no existe o no esta registrado en almacen', Estatus:'Error'});
              }
            }
          });          
        }
        else{
          res.status(200).send({Mensaje:'Articulo ya registrado a este tipo de problema anteriormente',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el Articulo al Tipo de Problema',Estatus:'Error'});
  }
}

/**/
function modificarArticuloProblema(req,res){
  var id_articulo_problema = req.params.id_articulo_problema;
  var params = req.body;

  if(params.id_articulo && params.id_tipo_problema && connection){
    //verificar si existe para poder modificar
    var query_verificar = connection.query('SELECT id_articulo_problema FROM articulo_problema WHERE id_articulo_problema =?',[id_articulo_problema], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
            
            //Verificar que exista el solo puede colocar el id articulo y el tipo del problema correctos no inabileso con cantidad 0            

            var query = connection.query('UPDATE articulo_problema SET id_articulo =?, id_tipo_problema = ? WHERE id_articulo_problema = ?',
            [params.id_articulo, params.id_tipo_problema, id_articulo_problema],function(error, result){
                if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar Articulo por Tipo de Problema',Estatus:'Error'});
                }else{
                res.status(200).send({Mensaje:'Articulo por Tipo de problema modificado con exito',Estatus:'Ok'});
                }
            });            
        }
        else{
          res.status(200).send({Mensaje:'Articulo por Tipo de problema no registrado o no existe',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el Articulo por tipo de producto',Estatus:'Error'});
  }
}


//hacer inner join con sucursal y con producto 
function getArticulosProblemas(req,res){
  var query = connection.query('SELECT articulo_problema.id_articulo_problema, articulo_problema.id_articulo, codigo_articulo.nombre_articulo, articulo_problema.id_tipo_problema, tipo_problema.tipo_problema FROM articulo_problema INNER JOIN almacen ON almacen.id_articulo = articulo_problema.id_articulo INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = almacen.id_codigo_articulo INNER JOIN tipo_problema ON  tipo_problema.id_tipo_problema = articulo_problema.id_tipo_problema', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var articulosproblemas = result;
            
      if(articulosproblemas.length != 0){
        res.status(200).json(articulosproblemas);   
      }
      else{
        res.status(200).send({Mensaje:'No hay Articulos por tipos de problema',Estatus:'Error'});
      }
    }
  });
}


function getArticuloProblema(req,res){
  var id_articulo_problema = req.params.id_articulo_problema;

  var query = connection.query('SELECT articulo_problema.id_articulo_problema, articulo_problema.id_articulo, codigo_articulo.nombre_articulo, articulo_problema.id_tipo_problema, tipo_problema.tipo_problema FROM articulo_problema INNER JOIN almacen ON almacen.id_articulo = articulo_problema.id_articulo INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = almacen.id_codigo_articulo INNER JOIN tipo_problema ON  tipo_problema.id_tipo_problema = articulo_problema.id_tipo_problema WHERE articulo_problema.id_articulo_problema = ?', [id_articulo_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{
      var articuloproblema = result;            
      if(articuloproblema.length != 0){
        //res.json(rows);
        res.status(200).json(articuloproblema);   
      }else{
        res.status(200).send({Mensaje:'El Articulo por Tipo de Problema no existe',Estatus:'Error'});
      }
    }
  });
}

module.exports={  
    guardarArticuloProblema,
    modificarArticuloProblema,
    getArticulosProblemas,
    getArticuloProblema,
    //eliminarAlmacen,    
};