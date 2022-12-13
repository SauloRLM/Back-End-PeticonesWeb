'use strict'
const conexion = require('../conexion');
const connection = conexion();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});
//acciones
function guardarRequisitoProblema(req,res){
  //Recoger parametros peticion
  var params = req.body;
  var band = 'A'  
  if(params.requeriment && connection){    
    params.requeriment.forEach(element => {              
      //console.log(element);
      var query = connection.query('INSERT INTO requisito_problema(id_problema, id_codigo_articulo, descripcion_requisito, cantidad,  unidad, precio) VALUES(?,?,?,?,?,?)',
      [element.id_problema, element.id_codigo_articulo ,element.descripcion_requisito , element.cantidad , element.unidad , element.precio ],function(error, result){
          if(error){            
              band = 'B'
          }
      });    
    });       
    if (band == 'B' ){
      res.status(200).send({Mensaje:'Error al registrar Requisito problema',Estatus:'Error'});
    }else{
      res.status(200).send({Mensaje:'Requisito del problema registrado con exito',Estatus:'Ok'});
    }
  }else{
    res.status(200).send({Mensaje:'Error. Introduce la informacion correcta para registrar un requisito.',Estatus:'Error'});
  }

}

/**/
function modificarRequisitoProblema(req,res){
  var id_requisito_problema = req.params.id_requisito_problema;
  var params = req.body;

  if(params.id_codigo_articulo && cantidad && unidad && precio && connection){
      var query_verificar = connection.query('SELECT id_requisito_problema FROM requisito_problema WHERE id_requisito_problema =?',[id_requisito_problema], function(error, result){
        if(error){
            //throw error;
            res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
         }else{
          var resultado_verificacion = result;
          //Modificar Sucursal//
          if(resultado_verificacion.length != 0){
              
              //Verificar que exista el solo puede colocar el id articulo y el tipo del problema correctos no inabil eso con cantidad 0            
  
              var query = connection.query('UPDATE requisito_problema SET id_codigo_articulo =?, cantidad = ?, unidad =?, precio=? WHERE id_requisito_problema = ?',
              [params.id_codigo_articulo, params.cantidad, params.unidad, params.precio ,id_requisito_problema],function(error, result){
                  if(error){
                  //throw error;
                  res.status(200).send({Mensaje:'Error al modificar Requisito de Problema',Estatus:'Error'});
                  }else{
                  res.status(200).send({Mensaje:'Requisito de problema modificado con exito',Estatus:'Ok'});
                  }
              });            
          }
          else{
            res.status(200).send({Mensaje:'Error. Requisito de problema no registrado o no existe.',Estatus:'Error'});
          }
         }
      });
    //verificar si existe para poder modificar
    
  }else if(params.descripcion_requisito && cantidad && unidad && precio && connection){
    var query_verificar = connection.query('SELECT id_requisito_problema FROM requisito_problema WHERE id_requisito_problema =?',[id_requisito_problema], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Requisito//
        if(resultado_verificacion.length != 0){                      
          var query = connection.query('UPDATE requisito_problema SET descripcion_requisito =?, cantidad = ?, unidad =?, precio=? WHERE id_requisito_problema = ?',
          [params.descripcion_requisito, params.cantidad, params.unidad, params.precio ,id_requisito_problema],function(error, result){
              if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al modificar Requisito de Problema',Estatus:'Error'});
              }else{
              res.status(200).send({Mensaje:'Requisito de problema modificado con exito',Estatus:'Ok'});
              }
          });                  
        }else{
          res.status(200).send({Mensaje:'Error. Requisito de problema no registrado o no existe.',Estatus:'Error'});
        }
       }
    });
  
  }else {
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el Requisito del problema.',Estatus:'Error'});
  }
}

//pedir todos los requisitos de este problema
function getRequisitosProblema(req,res){
  var id_problema = req.params.id_problema;  
  var query = connection.query('select requisito_problema.id_requisito_problema, requisito_problema.id_problema, requisito_problema.id_codigo_articulo, codigo_articulo.nombre_articulo, requisito_problema.descripcion_requisito, requisito_problema.cantidad, requisito_problema.unidad, requisito_problema.precio from requisito_problema INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = requisito_problema.id_codigo_articulo WHERE requisito_problema.id_problema = ?', [id_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{
      var Requisitosproblema = result;            
      if(Requisitosproblema.length != 0){
        res.status(200).json(Requisitosproblema);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay Requisitos para este problema',Estatus:'Error'});
      }
    }
  });
}


function getRequisitoProblema(req,res){
  var id_requisito_problema = req.params.id_requisito_problema; 
  var id_problema = req.params.id_problema; 
var query = connection.query('select requisito_problema.id_requisito_problema, requisito_problema.id_problema, codigo_articulo.nombre_articulo, requisito_problema.descripcion_requisito, requisito_problema.cantidad, requisito_problema.unidad, requisito_problema.precio from requisito_problema INNER JOIN codigo_articulo ON codigo_articulo.id_codigo_articulo = requisito_problema.id_codigo_articulo WHERE requisito_problema.id_problema = ? AND requisito_problema.id_requisito_problema = ?', [id_problema,id_requisito_problema], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{
      var Requisitoproblema = result;            
      if(Requisitoproblema.length != 0){
        res.status(200).json(Requisitoproblema);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No existe ese requisito para este problema.',Estatus:'Error'});
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