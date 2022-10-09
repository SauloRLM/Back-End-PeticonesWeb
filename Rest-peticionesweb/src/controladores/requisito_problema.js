'use strict'

const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
    if(error){
     console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
   }
  });

//acciones
function guardarRequisitoProblema(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if( params.id_problema && params.id_codigo_articulo && params.descripcion_requisito && params.cantidad && params.unidad && params.precio && connection){

     //verificar el codigo del articulo si no esta vacio
    if(params.id_codigo_articulo == ""){
      console.log("entro aqui");

        var query_verificar = connection.query('SELECT id_requisito_problema FROM requisito_problema WHERE id_problema = ? AND descripcion_requisito = ?',[params.id_problema,params.descripcion_requisito], function(error, result){
            if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al verificar existencia'});
             }else{

              var resultado_verificacion = result;
              //Modificar Sucursal//
              if(resultado_verificacion.length == 0){
                  var query = connection.query('INSERT INTO requisisto_problema(id_problema, descripcion_requisito, cantidad, unidad, precio) VALUES(?,?,?,?,?)',
                [params.id_problema, params.descripcion_requisito, params.cantidad, params.unidad, params.precio],function(error, result){
                    if(error){
                    // throw error;
                        res.status(200).send({Mensaje:'Error al registrar Requsito de Problema'});
                    }else{
                        res.status(200).send({Mensaje:'Requisito registrado con exito'});
                    }
                });         
              }else{
                res.status(200).send({Mensaje:'Error ya existe ese Requsito de Problema'});
              }
            }
        });

    }else{      

        var query_verificar = connection.query('SELECT id_requisito_problema FROM requisito_problema WHERE id_problema = ? AND id_codigo_articulo = ?',[params.id_problema,params.id_codigo_articulo], function(error, result){
            if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al verificar existencia'});
             }else{
              var query = connection.query('INSERT INTO requisisto_problema(id_problema, id_codigo_articulo, cantidad, unidad, precio) VALUES(?,?,?,?,?)',
              [params.id_problema, params.id_codigo_articulo, params.cantidad, params.unidad, params.precio],function(error, result){
                  if(error){
                  // throw error;
                      res.status(200).send({Mensaje:'Error al registrar el Requisito de Problema'});
                  }else{
                      res.status(200).send({Mensaje:'Requisito registrado con exito'});
                  }
              });
             }
        });
    }
  }else{
    res.status(200).send({Mensaje:'Introduce la informacion correcta para registrar un requisito'});
  }
}

/**/
function modificarRequisitoProblema(req,res){
  var id_requisito_problema = req.params.id_requisito_problema;
  var params = req.body;

  if(params.id_codigo_Articulo && params.descripcion_requisito && cantidad && unidad && precio && connection){

    if(params.id_codigo_articulo == null){
      console.log("entro aqui");

      var query_verificar = connection.query('SELECT id_codigo_articulo FROM articulo_problema WHERE id_articulo_problema =?',[id_requisito_problema], function(error, result){
        if(error){
            //throw error;
            res.status(200).send({Mensaje:'Error al verificar existencia'});
         }else{
          var resultado_verificacion = result;
          //Modificar Sucursal//
          if(resultado_verificacion.length != 0){
              
              //Verificar que exista el solo puede colocar el id articulo y el tipo del problema correctos no inabil eso con cantidad 0            
  
              var query = connection.query('UPDATE articulo_problema SET id_articulo =?, id_tipo_problema = ? WHERE id_articulo_problema = ?',
              [params.id_articulo, params.id_tipo_problema, id_articulo_problema],function(error, result){
                  if(error){
                  //throw error;
                  res.status(200).send({Mensaje:'Error al modificar Requisito de Problema'});
                  }else{
                  res.status(200).send({Mensaje:'Requisito de problema modificado con exito'});
                  }
              });            
          }
          else{
            res.status(200).send({Mensaje:'Requisito de problema no registrado o no existe'});
          }
         }
      });

    }else{


    }

    //verificar si existe para poder modificar
    
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el Requisito del problema'});
  }
}

//pedir todos los requisitos de este problema
function getRequisitosProblema(req,res){
  var id_problema = req.params.id_problema;  
  var query = connection.query('select requisito_problema.id_requisito_problema, requisito_problema.id_problema, codigo_articulo.nombre_articulo, requisito_problema.descripcion_requisito, requisito_problema.cantidad, requisito_problema.unidad, requisito_problema.precio from requisito_problema INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = requisito_problema.id_requisito_problema WHERE requisito_problema.id_problema = ?', [id_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{
      var Requisitosproblema = result;            
      if(Requisitoproblema.length != 0){
        res.status(200).json(Requisitoproblema);   
      }
      else{
        res.status(200).send({Mensaje:'No hay Requisitos para este problema'});
      }
    }
  });
}


function getRequisitoProblema(req,res){
  var id_requisito_problema = req.params.id_requisito_problema; 
  var id_problema = req.params.id_problema; 
var query = connection.query('select requisito_problema.id_requisito_problema, requisito_problema.id_problema, codigo_articulo.nombre_articulo, requisito_problema.descripcion_requisito, requisito_problema.cantidad, requisito_problema.unidad, requisito_problema.precio from requisito_problema INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = requisito_problema.id_requisito_problema WHERE requisito_problema.id_problema = ? AND requisito_problema.id_requisito_problema = ?', [id_problema,id_requisito_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{
      var Requisitoproblema = result;            
      if(Requisitoproblema.length != 0){
        res.status(200).json(Requisitoproblema);   
      }
      else{
        res.status(200).send({Mensaje:'No existe ese Requisito para este problema'});
      }
    }
  });
}

module.exports={  
    guardarRequisitoProblema,
    modificarRequisitoProblema,
    getRequisitosProblema,    
    getRequisitoProblema,    
};