'use strict'
const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});
//acciones
function guardarCodigoArticulo(req,res){
  //Recoger parametros peticion
  var params = req.body;  
  if(params.id_codigo_articulo && params.nombre_articulo && params.descripcion && connection){
    //verificar que no exista ese tipo de problema
    var query_verificar = connection.query('SELECT id_codigo_articulo FROM codigo_articulo WHERE id_codigo_articulo =?',[params.id_codigo_articulo], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{

        var resultado_verificacion = result;
        //verificar
        if(resultado_verificacion.length == 0){

            var query = connection.query('INSERT INTO codigo_articulo(id_codigo_articulo, nombre_articulo, descripcion) VALUES(?,?,?)',
                [params.id_codigo_articulo, params.nombre_articulo, params.descripcion],function(error, result){
                  if(error){
                      // throw error;
                      res.status(200).send({Mensaje:'Error al registrar el codigo y el articulo',Estatus:'Error'});
                    }else{
                      res.status(200).send({Mensaje:'Codigo de articulo registrado con exito',Estatus:'Ok'});
                    }
            });             
        }else{
          res.status(200).send({Mensaje:'Error. codigo de ariculo ya registrado en el sistema.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar el codigo y el articulo.',Estatus:'Error'});
  }
}

/**/
function modificarCodigoArticulo(req,res){
  var id_codigo_articulo = req.params.id_codigo_articulo;  
  var params = req.body;

  if(params.nombre_articulo && connection){
    var query_verificar = connection.query('SELECT id_codigo_articulo FROM codigo_articulo WHERE id_codigo_articulo =?',[id_codigo_articulo], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia', Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
          
            var query = connection.query('UPDATE codigo_articulo SET nombre_articulo= ?, descripcion=? WHERE id_codigo_articulo = ?',
            [ params.nombre_articulo,params.descripcion ,id_codigo_articulo],function(error, result){
                if(error){
                    //throw error;
                    res.status(200).send({Mensaje:'Error al modificar nombre del articulo',Estatus:'Error'});
                }else{
                    res.status(200).send({Mensaje:'Nombre de articulo modificado con exito',Estatus:'Ok'});
                }
            });                                                                           
        }
        else{
          res.status(200).send({Mensaje:'Error. El codigo del articulo no existe.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el nombre del articulo.',Estatus:'Error'});
  }
}


function getCodigosArticulos(req,res){
  var query = connection.query('SELECT * FROM codigo_articulo', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var codigos_articulos = result;
            
      if(codigos_articulos.length != 0){
        res.status(200).json(codigos_articulos);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay codigos de articulos.',Estatus:'Error'});
      }
    }
  });
}


function getCodigoArticulo(req,res){
  var id_codigo_articulo = req.params.id_codigo_articulo;

  var query = connection.query('SELECT * FROM codigo_articulo WHERE id_codigo_articulo =?', [id_codigo_articulo], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var codigo_articulo = result;
            
      if(codigo_articulo.length != 0){
        //res.json(rows);
        res.status(200).json(codigo_articulo);   
      }
      else{
        res.status(200).send({Mensaje:'Error. El codigo articulo no existe',Estatus:'Error'});
      }
    }
  });
}

module.exports={  
    guardarCodigoArticulo,
    modificarCodigoArticulo,
    getCodigosArticulos,
    getCodigoArticulo,
};
