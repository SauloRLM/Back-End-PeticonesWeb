'use strict'
const conexion = require('../conexion');
const connection = conexion();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});
//acciones
function guardarArticuloProblema(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.id_codigo_articulo && params.id_tipo_problema && connection){

    //Verificar si existe ya el registro 
    var query_verificar = connection.query('SELECT id_articulo_problema FROM articulo_problema WHERE id_codigo_articulo = ? AND id_tipo_problema = ?',[params.id_codigo_articulo,params.id_tipo_problema], function(error, result){
    
        if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        
        var resultado_verificacion = result;        
        if(resultado_verificacion.length == 0){
          var query = connection.query('INSERT INTO articulo_problema(id_codigo_articulo,id_tipo_problema ) VALUES(?,?)',
            [params.id_codigo_articulo, params.id_tipo_problema],function(error, result){
              if(error){
                res.status(200).send({Mensaje:'Error. Al registrar la articulo al tipo de problema.',Estatus:'Error'});
              }else{
                res.status(200).send({Mensaje:'Articulo registrado con exito al Tipo de Problema', Estatus:'Ok'});
              }
          });
        }
        else{
          res.status(200).send({Mensaje:'Error. Articulo ya registrado a este tipo de problema anteriormente.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar el Articulo al tipo de problema.',Estatus:'Error'});
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
          var query = connection.query('UPDATE articulo_problema SET id_codigo_articulo =?, id_tipo_problema = ? WHERE id_articulo_problema = ?',
          [params.id_codigo_articulo, params.id_tipo_problema, id_articulo_problema],function(error, result){
              if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error. Al modificar Articulo por tipo de problema.',Estatus:'Error'});
              }else{
              res.status(200).send({Mensaje:'Articulo por Tipo de problema modificado con exito',Estatus:'Ok'});
              }
          });            
        }
        else{
          res.status(200).send({Mensaje:'Error. Articulo por Tipo de problema no registrado o no existe.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el articulo por tipo de producto.',Estatus:'Error'});
  }
}


//hacer inner join con sucursal y con producto 
function getArticulosProblemas(req,res){
  var query = connection.query('SELECT articulo_problema.id_articulo_problema, articulo_problema.id_codigo_articulo, codigo_articulo.nombre_articulo, articulo_problema.id_tipo_problema, tipo_problema.tipo_problema FROM articulo_problema INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = articulo_problema.id_codigo_articulo INNER JOIN tipo_problema ON  tipo_problema.id_tipo_problema = articulo_problema.id_tipo_problema order by id_articulo_problema', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var articulosproblemas = result;
            
      if(articulosproblemas.length != 0){
        res.status(200).json(articulosproblemas);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay articulos por tipos de problema.',Estatus:'Error'});
      }
    }
  });
}


function getArticuloProblema(req,res){
  var id_articulo_problema = req.params.id_articulo_problema;

  var query = connection.query('SELECT articulo_problema.id_articulo_problema, articulo_problema.id_codigo_articulo, codigo_articulo.nombre_articulo, articulo_problema.id_tipo_problema, tipo_problema.tipo_problema FROM articulo_problema INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = articulo_problema.id_codigo_articulo INNER JOIN tipo_problema ON  tipo_problema.id_tipo_problema = articulo_problema.id_tipo_problema WHERE articulo_problema.id_articulo_problema = ?', [id_articulo_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{
      var articuloproblema = result;            
      if(articuloproblema.length != 0){
        //res.json(rows);
        res.status(200).json(articuloproblema);   
      }else{
        res.status(200).send({Mensaje:'Error. El articulo por tipo de problema no existe.',Estatus:'Error'});
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