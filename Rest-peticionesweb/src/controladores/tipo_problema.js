'use strict'
const conexion = require('../conexion');
const connection = conexion();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});
//acciones
function guardarTipoProblema(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.tipo_problema && params.descripcion_tipo_problema && params.estatus && connection){

    //verificar que no exista ese tipo de problema
    var query_verificar = connection.query('SELECT tipo_problema FROM tipo_problema WHERE tipo_problema =?',[params.tipo_problema], function(error, result){

      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{

        var resultado_verificacion = result;
        //verificar
        if(resultado_verificacion.length == 0){

            var query = connection.query('INSERT INTO tipo_problema(tipo_problema, descripcion_tipo_problema, estatus) VALUES(?,?,?)',
            [params.tipo_problema, params.descripcion_tipo_problema, params.estatus],function(error, result){
              if(error){                            
                res.status(200).send({Mensaje:'Error Al registrar al Tipo de Problema',Estatus:'Error'});
              }else{
                var query = connection.query('SELECT id_tipo_problema FROM tipo_problema WHERE tipo_problema = ?',
                [params.tipo_problema],function(error, result){
                  if(error){
                    res.status(200).send({Mensaje:'Error. Al obtener id tipo de problema.',Estatus:'Error'});
                  }else{
                    var idtipoproblema =result[0].id_tipo_problema;
                    var query = connection.query('INSERT INTO articulo_problema(id_codigo_articulo,id_tipo_problema ) VALUES(?,?)',
                    ['5000000000', idtipoproblema],function(error, result){
                      if(error){
                        res.status(200).send({Mensaje:'Error. Al registrar la articulo al tipo de problema.',Estatus:'Error'});
                      }else{
                        res.status(200).send({Mensaje:'Tipo de Problema registrado con exito',Estatus:'Ok'});
                      }
                    });                  
                  }
                });
              }
            });             
        }else{
          res.status(200).send({Mensaje:'Error. Tipo de problema ya registrado en el sistema',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar el tipo de problema',Estatus:'Error'});
  }
}

/**/
function modificarTipoProblema(req,res){
  var id_tipo_problema = req.params.id_tipo_problema;  
  var params = req.body;

  if(params.tipo_problema && params.descripcion_tipo_problema && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_tipo_problema FROM tipo_problema WHERE id_tipo_problema =?',[id_tipo_problema], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){
          
            var query = connection.query('UPDATE tipo_problema SET tipo_problema =?, descripcion_tipo_problema =?, estatus= ?  WHERE id_tipo_problema = ?',
            [params.tipo_problema, params.descripcion_tipo_problema, params.estatus, id_tipo_problema],function(error, result){
                if(error){
                    //throw error;
                    res.status(200).send({Mensaje:'Error al modificar el tipo de problema',Estatus:'Error'});
                }else{
                    res.status(200).send({Mensaje:'Tipo de Problema modificado con exito',Estatus:'Ok'});
                }
            });                                                                           
        }
        else{
          res.status(200).send({Mensaje:'Error. El Tipo Problema no existe',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el tipo problema.',Estatus:'Error'});
  }
}


function getTiposProblemas(req,res){
  var query = connection.query('SELECT * FROM tipo_problema', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var tipos_problemas = result;
            
      if(tipos_problemas.length != 0){
        res.status(200).json(tipos_problemas);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay tipo de problema',Estatus:'Error'});
      }
    }
  });
}

//problemas Activos
function getTiposProblemasAct(req,res){
  var query = connection.query('SELECT * FROM tipo_problema WHERE estatus = "A"', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var tipos_problemas = result;
            
      if(tipos_problemas.length != 0){
        res.status(200).json(tipos_problemas);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay tipo de problema activo',Estatus:'Error'});
      }
    }
  });
}


function getTipoProblema(req,res){
  var id_tipo_problema = req.params.id_tipo_problema;

  var query = connection.query('SELECT * FROM tipo_problema WHERE id_tipo_problema =?', [id_tipo_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var tipo_problema = result;
            
      if(tipo_problema.length != 0){
        //res.json(rows);
        res.status(200).json(tipo_problema);   
      }
      else{
        res.status(200).send({Mensaje:'Error. El tipo de problema no existe.',Estatus:'Error'});
      }
    }
  });
}


function eliminarTipoProblema(req,res){

  var id_tipo_problema = req.params.id_tipo_problema;
  var estatus = 'B';
  var query = connection.query('UPDATE tipo_problema SET estatus = ? WHERE id_tipo_problema = ?',
  [estatus, id_tipo_problema],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Tipo de problema deshabilitado con exito',Estatus:'Ok'});  
      }
      else{
        res.status(200).send({Mensaje:'Error. El Tipo de problema no existe.',Estatus:'Error'});
      }
    }
  });
}


module.exports={  
    guardarTipoProblema,
    modificarTipoProblema,
    getTiposProblemas,
    getTipoProblema,
    eliminarTipoProblema,    
    getTiposProblemasAct
};
