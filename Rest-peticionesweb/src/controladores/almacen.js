'use strict'
/*
var mysql = require('mysql');

var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'Saulo@123',
   database: 'peticionesweb',   
});

connection.connect(function(error){
   if(error){
    console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
  }
});
*/
const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});

//acciones
function guardarAlmacen(req,res){
  //Recoger parametros peticion
  var params = req.body;

cantidad_disponible
cantidad_total
id_codigo_articulo
id_sucursal
tipo


  if(params.id_sucursal && params.id_codigo_articulo  && params.cantidad_total && params.cantidad_disponible && params.tipo && connection){

    //Verrificar si existe ese registro en el almacen 
    var query_verificar = connection.query('SELECT id_codigo_articulo FROM almacen WHERE id_codigo_articulo = ? AND id_sucursal = ?',[params.id_codigo_articulo, params.id_sucursal], function(error, result){
    
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        
        var resultado_verificacion = result;
        //Verificar //
        if(resultado_verificacion.length == 0){

          //Verificar si existe la sucursal ingresada 
          var query_verificar_sucursal = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[params.id_sucursal], function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
            }else{
              
              var resultado_verificacion_sucursal = result;

              if(resultado_verificacion_sucursal.length != 0){

                //verificar el codigo del producto
                var query_verificar_codigo = connection.query('SELECT id_codigo_articulo FROM codigo_articulo WHERE id_codigo_articulo = ?',[params.id_codigo_articulo], function(error, result){
                    
                    if(error){
                        //throw error;
                        res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
                      
                    }else{
                        
                        var resultado_verificacion_codigo = result;

                        if(resultado_verificacion_codigo.length != 0){
                            //se procede a insetar la tupla
                            var query = connection.query('INSERT INTO almacen(id_sucursal, id_codigo_articulo, cantidad_total, cantidad_disponible, tipo) VALUES(?,?,?,?,?)',
                            [params.id_sucursal, params.id_codigo_articulo, params.cantidad_total, params.cantidad_disponible, params.tipo],function(error, result){
                                if(error){
                                // throw error;
                                    res.status(200).send({Mensaje:'Error. Al registrar la Articulo.',Estatus:'Error'});
                                }else{
                                    res.status(200).send({Mensaje:'Articulo registrado con exito',Estatus:'Ok'});
                                }
                            });

                        }else{
                            res.status(200).send({Mensaje:'Error. EL codigo articulo no existe o no esta registrado.',Estatus:'Error'});
                        }
                    }          
                });                             
              }else{
                  res.status(200).send({Mensaje:'Error. La sucursal no existe o no esta registrada.',Estatus:'Error'});
              }
            }
          });          
        }
        else{
          res.status(200).send({Mensaje:'Error. Producto ya registrado en esta sucursal anteriormente.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar el Pruducto.',Estatus:'Error'});
  }
}

/**/
function modificarAlmacen(req,res){
  var id_almacen = req.params.id_almacen;
  var params = req.body;

  if(params.cantidad_total && params.cantidad_disponible && params.tipo && connection){

    var query_verificar = connection.query('SELECT id_almacen FROM almacen WHERE id_almacen =?',[id_almacen], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){

            var query = connection.query('UPDATE almacen SET cantidad_total =?, cantidad_disponible = ?, tipo = ? WHERE id_almacen = ?',
            [params.cantidad_total, params.cantidad_disponible, params.tipo, id_almacen],function(error, result){
                if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al modificar Almacen',Estatus:'Error'});
                }else{
                res.status(200).send({Mensaje:'Almacen modificado con exito',Estatus:'Ok'});
                }
            });            
        }
        else{
          res.status(200).send({Mensaje:'Error. Producto no registrado o no existe.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el almacen.',Estatus:'Error'});
  }
}


//hacer inner join con sucursal y con producto 
function getAlmacenes(req,res){
  var query = connection.query('SELECT almacen.id_almacen, almacen.id_sucursal ,sucursal.nombre_sucursal, almacen.id_codigo_articulo, codigo_articulo.nombre_articulo, cantidad_total, cantidad_disponible, tipo FROM almacen INNER JOIN sucursal on sucursal.id_sucursal = almacen.id_sucursal INNER JOIN codigo_articulo on codigo_articulo.id_codigo_articulo = almacen.id_codigo_articulo', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var almacenes = result;
            
      if(almacenes.length != 0){
        res.status(200).json(almacenes);   
      }
      else{
        res.status(200).send({Mensaje:'No hay productos en el almacen',Estatus:'Error'});
      }
    }
  });
}

//hacer inner join con sucursal y con producto 
function getAlmacenesTypeProblem(req,res){
  var id_tipo_problema = req.params.id_tipo_problema;
  var query = connection.query('SELECT almacen.id_almacen, almacen.id_sucursal ,sucursal.nombre_sucursal, almacen.id_codigo_articulo, codigo_articulo.nombre_articulo, cantidad_total, cantidad_disponible, tipo FROM almacen INNER JOIN sucursal on sucursal.id_sucursal = almacen.id_sucursal INNER JOIN codigo_articulo on codigo_articulo.id_codigo_articulo  = almacen.id_codigo_articulo INNER JOIN articulo_problema ON articulo_problema.id_codigo_articulo = almacen.id_codigo_articulo WHERE almacen.id_sucursal = 16  AND articulo_problema.id_tipo_problema = ?', [id_tipo_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var almacenes = result;
            
      if(almacenes.length != 0){
        res.status(200).json(almacenes);   
      }
      else{
        res.status(200).send({Mensaje:'No hay productos en el almacen',Estatus:'Error'});
      }
    }
  });
}


function getAlmacen(req,res){
  var id_almacen = req.params.id_almacen;

  var query = connection.query('SELECT almacen.id_articulo, almacen.id_sucursal ,sucursal.nombre_sucursal, almacen.id_codigo_articulo, codigo_articulo.nombre_articulo, cantidad_total, cantidad_disponible, tipo FROM almacen INNER JOIN sucursal on sucursal.id_sucursal = almacen.id_sucursal INNER JOIN codigo_articulo on codigo_articulo.id_codigo_articulo = almacen.id_codigo_articulo Where usuario_problema.id_usuario_problema =?', [id_almacen], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{
      var almacen = result;            
      if(almacen.length != 0){
        //res.json(rows);
        res.status(200).json(almacen);   
      }else{
        res.status(200).send({Mensaje:'Error. El Producto no existe en el almacen.',Estatus:'Error'});
      }
    }
  });
}

module.exports={  
    guardarAlmacen,
    modificarAlmacen,
    getAlmacenes,
    getAlmacen,
    getAlmacenesTypeProblem
  //  eliminarAlmacen,    
};