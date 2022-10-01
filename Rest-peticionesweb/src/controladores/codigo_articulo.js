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

  if(params.id_codigo_articulo && params.nombre_articulo && connection){

    //verificar que no exista ese tipo de problema
    var query_verificar = connection.query('SELECT id_codigo_articulo FROM codigo_articulo WHERE id_codigo_articulo =?',[params.id_codigo_articulo], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{

        var resultado_verificacion = result;
        //verificar
        if(resultado_verificacion.length == 0){

            var query = connection.query('INSERT INTO codigo_articulo(id_codigo_articulo, nombre_articulo) VALUES(?,?)',
                            [params.id_codigo_articulo, params.nombre_articulo],function(error, result){
                                if(error){
                                // throw error;
                                    res.status(200).send({Mensaje:'Error Al registrar el Codigo y el Articulo'});
                                }else{
                                    res.status(200).send({Mensaje:'Codigo y Articulo registrado con exito'});
                                }
            });             
        }else{
          res.status(200).send({Mensaje:'Codigo de ariculo ya registrado en el sistema'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el Codigo y el Articulo'});
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
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
          
            var query = connection.query('UPDATE codigo_articulo SET nombre_articulo= ?  WHERE id_codigo_articulo = ?',
            [ params.nombre_articulo, id_codigo_articulo],function(error, result){
                if(error){
                    //throw error;
                    res.status(200).send({Mensaje:'Error al modificar nombre del articulo'});
                }else{
                    res.status(200).send({Mensaje:'nombre de articulo modificado con exito'});
                }
            });                                                                           
        }
        else{
          res.status(200).send({Mensaje:'El codigo del articulo no existe'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el nombre del articulo'});
  }
}


function getCodigosArticulos(req,res){
  var query = connection.query('SELECT * FROM codigo_articulo', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var codigos_articulos = result;
            
      if(codigos_articulos.length != 0){
        res.status(200).json(codigos_articulos);   
      }
      else{
        res.status(200).send({Mensaje:'No hay Codigos de Articulos'});
      }
    }
  });
}


function getCodigoArticulo(req,res){
  var id_codigo_articulo = req.params.id_codigo_articulo;

  var query = connection.query('SELECT * FROM codigo_articulo WHERE id_codigo_articulo =?', [id_codigo_articulo], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var codigo_articulo = result;
            
      if(codigo_articulo.length != 0){
        //res.json(rows);
        res.status(200).json(codigo_articulo);   
      }
      else{
        res.status(200).send({Mensaje:'El Codigo Articulo no existe'});
      }
    }
  });
}

/*
function eliminarCodigoProblema(req,res){

  var id_tipo_problema = req.params.id_usuario;
  var estatus = 'B';
  var query = connection.query('UPDATE tipo_problema SET estatus = ? WHERE id_tipo_problema = ?',
  [estatus, id_tipo_problema],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Tipo de problema deshabilitado con exito'});  
      }
      else{
        res.status(200).send({Mensaje:'El Tipo de problema no existe'});
      }
    }
  });
}
*/

module.exports={  
    guardarCodigoArticulo,
    modificarCodigoArticulo,
    getCodigosArticulos,
    getCodigoArticulo,
    //eliminarTipoProblema,    
};
