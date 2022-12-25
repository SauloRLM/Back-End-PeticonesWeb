'use strict'
const conexion = require('../conexion');
const connection = conexion();
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
          res.status(200).send({Mensaje:'Error al verificar existencia', Estatus:'Error'});
       }else{
        
        var resultado_verificacion = result;
        //Registrar Empleado//
        if(resultado_verificacion.length == 0){


          //Verificar si existe la sucursal 
          var query_verificar_sucursal = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[params.id_sucursal], function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al verificar existencia de Sucursal', Estatus:'Error'});
            }else{
              
              var resultado_verificacion_sucursal = result;

              if(resultado_verificacion_sucursal.length != 0){
             
                var query = connection.query('INSERT INTO empleado(id_empleado, nombre_empleado, id_sucursal, correo, telefono, estatus) VALUES(?,?,?,?,?,?)',
                [params.id_empleado, params.nombre_empleado, params.id_sucursal, params.correo, params.telefono, params.estatus],function(error, result){
                  if(error){
                  // throw error;
                    res.status(200).send({Mensaje:'Error al registrar la empleado', Estatus:'Error'});
                  }else{
                    res.status(200).send({Mensaje:'Empleado registrado con exito', Estatus:'Ok'});
                  }
                });

              }else{
                  res.status(200).send({Mensaje:'La Sucursal no existe o no esta registrada', Estatus:'Error'});
              }

            }

          });          
        }
        else{
          res.status(200).send({Mensaje:'Empleado ya registrado anteriormente', Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el Empleado', Estatus:'Error'});
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
          res.status(200).send({Mensaje:'Error al verificar existencia de empleado',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){

            //Verificar si existe la sucursal 
            var query_verificar_sucursal = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[params.id_sucursal], function(error, result){
              if(error){
                //throw error;
                res.status(200).send({Mensaje:'Error al verificar existencia de Sucural', Estatus:'Error'});
              }else{
                
                var resultado_verificacion_sucursal = result;
  
                if(resultado_verificacion_sucursal.length != 0){
                  var query = connection.query('UPDATE empleado SET nombre_empleado =?, id_sucursal = ?, correo = ?, telefono = ?, estatus=?  WHERE id_empleado = ?',
                    [params.nombre_empleado, params.id_sucursal, params.correo, params.telefono, params.estatus, id_empleado],function(error, result){
                    if(error){
                    //throw error;
                      res.status(200).send({Mensaje:'Error al modificar Empleado',Estatus:'Error'});
                    }else{

                      var query = connection.query('UPDATE usuario JOIN empleado ON empleado.id_empleado = usuario.id_empleado SET usuario.estatus = ? WHERE empleado.estatus = ?;',
                      [params.estatus,params.estatus],function(error, result){
                        if(error){
                        //throw error;
                          res.status(200).send({Mensaje:'Error al modificar Empleado',Estatus:'Error'});
                        }else{
                        res.status(200).send({Mensaje:'Empleado modificado con exito',Estatus:'Ok'});
                        }
                      });                    
                    }
                  });
          
                }else{
                    res.status(200).send({Mensaje:'Error. La sucursal no existe o no esta registrada', Estatus:'Error'});
                }  
              }  
            });             
        }
        else{
          res.status(200).send({Mensaje:'Error. Empleado no existe',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el empleado.',Estatus:'Error'});
  }
}



function getEmpleados(req,res){
  var query = connection.query('SELECT * FROM empleado', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var sucursales = result;
            
      if(sucursales.length != 0){
        res.status(200).json(sucursales);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay empleados.',Estatus:'Error'});
      }
    }
  });
}


function getEmpleado(req,res){
  var id_empleado = req.params.id_empleado;
  var query = connection.query('SELECT * FROM empleado WHERE id_empleado=?', [id_empleado], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var empleado = result;
            
      if(empleado.length != 0){
        //res.json(rows);
        res.status(200).json(empleado);   
      }
      else{
        res.status(200).send({Mensaje:'Error. El Empleado no existe.',Estatus:'Error'});
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
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Empleado deshabilitado con exito',Estatus:'Ok'});  
      }
      else{
        res.status(200).send({Mensaje:'Error. El Empleado no existe',Estatus:'Error'});
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