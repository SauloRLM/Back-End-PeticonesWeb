'use strict'
const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});
//acciones
function guardarEmpleado(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.id_empleado && params.nombre_empleado  && params.id_sucursal && params.correo && params.telefono && params.estatus && connection){

    //Verrificar si existe el empleado
    var query_verificar = connection.query('SELECT id_empleado FROM empleado WHERE id_empleado =?',[params.id_empleado], function(error, result){

      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{
        
        var resultado_verificacion = result;
        //Registrar Empleado//
        if(resultado_verificacion.length == 0){


          //Verificar si existe la sucursal 
          var query_verificar_sucursal = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[params.id_sucursal], function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al verificar existencia'});
            }else{
              
              var resultado_verificacion_sucursal = result;

              if(resultado_verificacion_sucursal.length != 0){
             
                var query = connection.query('INSERT INTO empleado(id_empleado, nombre_empleado, id_sucursal, correo, telefono, estatus) VALUES(?,?,?,?,?,?)',
                [params.id_empleado, params.nombre_empleado, params.id_sucursal, params.correo, params.telefono, params.estatus],function(error, result){
                  if(error){
                  // throw error;
                    res.status(200).send({Mensaje:'Error al registrar la empleado'});
                  }else{
                    res.status(200).send({Mensaje:'Empleado registrado con exito'});
                  }
                });

              }else{
                  res.status(200).send({Mensaje:'La Sucursal no existe o no esta registrada'});
              }

            }

          });          
        }
        else{
          res.status(200).send({Mensaje:'Empleado ya registrado anteriormente'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el Empleado'});
  }
}

/**/
function modificarEmpleado(req,res){
  var id_empleado = req.params.id_empleado;
  var params = req.body;

  if(params.nombre_empleado && params.id_sucursal && params.correo && params.telefono && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_empleado FROM empleado WHERE id_empleado =?',[id_empleado], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){

            //Verificar si existe la sucursal 
            var query_verificar_sucursal = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[params.id_sucursal], function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al verificar existencia'});
              }else{
                
                var resultado_verificacion_sucursal = result;
  
                if(resultado_verificacion_sucursal.length != 0){
                  var query = connection.query('UPDATE empleado SET nombre_empleado =?, id_sucursal = ?, correo = ?, telefono = ?, estatus=?  WHERE id_empleado = ?',
                    [params.nombre_empleado, params.id_sucursal, params.correo, params.telefono, params.estatus, id_empleado],function(error, result){
                    if(error){
                    //throw error;
                      res.status(200).send({Mensaje:'Error al modificar Empleado'});
                    }else{
                    res.status(200).send({Mensaje:'Empleado modificada con exito'});
                    }
                  });
          
                }else{
                    res.status(200).send({Mensaje:'La Sucursal no existe o no esta registrada'});
                }
  
              }
  
            });   
          
        }
        else{
          res.status(200).send({Mensaje:'Empleado no existe'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el Empleado'});
  }
}



function getEmpleados(req,res){
  var query = connection.query('SELECT * FROM empleado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var sucursales = result;
            
      if(sucursales.length != 0){
        res.status(200).json(sucursales);   
      }
      else{
        res.status(200).send({Mensaje:'No hay Empleados'});
      }
    }
  });
}


function getEmpleado(req,res){
  var id_empleado = req.params.id_empleado;

  var query = connection.query('SELECT * FROM empleado WHERE id_empleado=?', [id_empleado], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var empleado = result;
            
      if(empleado.length != 0){
        //res.json(rows);
        res.status(200).json(empleado);   
      }
      else{
        res.status(200).send({Mensaje:'El Empleado no existe'});
      }
    }
  });
}


function eliminarEmpleado(req,res){

  var id_empleado = req.params.id_empleado;
  var estatus = 'B';
  var query = connection.query('UPDATE empleado SET estatus = ? WHERE id_empleado = ?',
  [estatus, id_empleado],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Empleado deshabilitado con exito'});  
      }
      else{
        res.status(200).send({Mensaje:'El Empleado no existe'});
      }
    }
  });
}


module.exports={  
    guardarEmpleado,
    modificarEmpleado,
    getEmpleados,
    getEmpleado,
    eliminarEmpleado,    
};