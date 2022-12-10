'use strict'
const dbconnection = require('./conectionBD');
const connection = dbconnection();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});

function login(req,res){
  var params = req.body;
  var user = params.usuario;  
  var password = params.password;
  var estatus = 'A';

  //si el usuario es baja B
  var query = connection.query("SELECT * FROM usuario WHERE usuario= ? AND estatus = ?",[user,estatus],function(error, result){        
    if(error){          
      res.status(200).send({Mensaje:'Error al Consultar',Estatus:'Error'});
    }else{
      var resultado_B = result;
      //verificar que el id del empleado exista y el id de la sucursal exista//              
      if(resultado_B.length > 0){

        var query = connection.query("SELECT * FROM usuario WHERE usuario= ? AND password= ? AND login < 5",[user,password],function(error, result){        
  
          if(error){    
            // throw error;
            res.status(200).send({Mensaje:'Error al Consultar',Estatus:'Error'});
          }else{            
            var resultado_verificacion = result;
            if(resultado_verificacion.length > 0){    
                  
              //nuevo para validar mas de una vez el inicio de sesion------ 5 veces como maximo
              var query = connection.query('SELECT login FROM usuario WHERE usuario= ? AND password= ?', [user,password], function(error, result){
                if(error){
                  // throw error;
                  res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
                }else{
            
                  var numlogin = result[0].login + 1;
                  //console.log(numlogin);                                    
                  var query = connection.query('UPDATE usuario SET login= ? WHERE usuario = ? AND password = ?',
                  [numlogin,user,password],function(error, result){
                    if(error){
                    //throw error;
                      res.status(200).send({Mensaje:'Error al inisiar sesión',Estatus:'Error'});
                    }else{                  
                        var query = connection.query('SELECT * FROM usuario WHERE usuario=? AND password=?', [user,password], function(error, result){
                          if(error){
                            // throw error;
                            res.status(200).send({Mensaje:'Error en la solicitud',Estatus:'Error'});
                          }else{
                      
                            var usuario = result;                      
                            if(usuario.length != 0){
                              //res.json(rows);
                              res.status(200).send({Mensaje:'Inicio de sesion Exitoso',Estatus:'Ok', usuario});                           
                              //console.log(usuario);
                            }
                            else{
                              res.status(200).send({Mensaje:'Error. En la carga de datos de inicio de sesion.',Estatus:'Error'});
                            }
                          }
                        });
                    }
                  }); 
                }
              });                                                                                                                                 
            }else{
              res.status(200).send({Mensaje:'Error. Usuario con sesión iniciada o datos incorrectos verifique!!.', Estatus:'Error'});  
            }                        
          }
        });  
      }else{
        res.status(200).send({Mensaje:'Error. El usuario no existe o esta desahabilitado.', Estatus:'Error'});  
      }
    }
  });    
}

function logout(req,res){
  var params = req.body;
  var user = params.usuario;  
  var password = params.password;  
  //cierre de sesion
  var query = connection.query('UPDATE usuario SET login= 0 WHERE usuario = ? AND password = ?',
    [user,password],function(error, result){
    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error al cerrar',Estatus:'Error'});
      }else{                                    
        res.status(200).send({Mensaje:'Cierre de sesion exitoso',Estatus:'Ok'});
    }
  });
} 

//acciones
function guardarUsuario(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.id_empleado && params.id_rol && params.usuario && params.password && params.estatus && connection){

    //verificar que no exista el usuario con el mismo nombre
    var query_verificar = connection.query('SELECT usuario FROM usuario WHERE usuario =?',[params.usuario], function(error, result){

      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia'});
       }else{

        var resultado_verificacion = result;
        //verificar que el id del empleado exista y el id de la sucursal exista//        
        if(resultado_verificacion.length == 0){

             //Verificar si existe el empleado
          var query_verificar_empleado = connection.query('SELECT id_empleado FROM empleado WHERE id_empleado =?',[params.id_empleado], function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al verificar existencia'});
            }else{
              
              var resultado_verificacion_empleado = result;

              if(resultado_verificacion_empleado.length != 0){
             
                var query_verificar_rol = connection.query('SELECT id_rol FROM rol WHERE id_rol =?',[params.id_rol], function(error, result){
                  
                    if(error){
                    // throw error;
                    res.status(200).send({Mensaje:'Error al verificar Existencia'});
                  }else{

                    var resultado_verificacion_rol = result;

                        if(resultado_verificacion_rol.length != 0){
                            
                            var query = connection.query('INSERT INTO usuario(id_empleado, id_rol, usuario, password, estatus, login) VALUES(?,?,?,?,?,?)',
                            [params.id_empleado, params.id_rol, params.usuario, params.password, params.estatus,0],function(error, result){
                                if(error){
                                // throw error;
                                    res.status(200).send({Mensaje:'Error al registrar el Usuario',Estatus:'Error'});
                                }else{
                                    res.status(200).send({Mensaje:'Usuario registrado con exito',Estatus:'Ok'});
                                }
                            });

                        }else{
                            res.status(200).send({Mensaje:'Error. El Rol no existe o no esta registrado.',Estatus:'Error'});
                        }
                    }
                });
              }else{
                  res.status(200).send({Mensaje:'El Empleado no existe o no esta registrado',Estatus:'Error'});
              }
            }
          });
          
        }else{
          res.status(200).send({Mensaje:'Error. Usuario ya esta en uso.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar el usuario.',Estatus:'Error'});
  }
}

/**/
function modificarUsuario(req,res){
  var id_usuario = req.params.id_usuario;
  var params = req.body;

  if(params.id_rol && params.usuario && params.password && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_usuario FROM usuario WHERE id_usuario =?',[id_usuario], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){

            var query_verificar_rol = connection.query('SELECT id_rol FROM rol WHERE id_rol =?',[params.id_rol], function(error, result){
                if(error){
                    //throw error;
                    res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
                 }else{
                  var resultado_verificacion = result;
                  //Modificar//
                  if(resultado_verificacion.length != 0){                    

                    //revisar que l nuevo usuario no exista ya en el sistema 
                    var query_verificar_nuevoUsuario = connection.query('SELECT usuario FROM usuario WHERE usuario =? AND id_usuario != ? ',
                    [params.usuario, id_usuario], function(error, result){
                      if(error){
                        //throw error;
                        res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
                     }else{
                      var resultado_verificacion_nuevousuario = result;
                      if(resultado_verificacion_nuevousuario.length != 0){                   
                        res.status(200).send({Mensaje:'Error. El usuario ya esta en uso.',Estatus:'Error'});
                      }else{
                        var query = connection.query('UPDATE usuario SET id_rol =?, usuario =?, password =?, estatus=?  WHERE id_usuario = ?',
                        [params.id_rol, params.usuario, params.password, params.estatus, id_usuario],function(error, result){
                          if(error){
                          //throw error;
                            res.status(200).send({Mensaje:'Error al modificar Usuario',Estatus:'Error'});
                          }else{
                            res.status(200).send({Mensaje:'Usuario modificado con exito',Estatus:'Ok'});
                          }
                        });                                                                
                      }
                     }
                    });                  
                  }else{
                    res.status(200).send({Mensaje:'Error. El Rol no existe.',Estatus:'Error'});
                  }
                 }
              });          
        }
        else{
          res.status(200).send({Mensaje:'Error. El Usuario no existe.',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder modificar el usuario.',Estatus:'Error'});
  }
}



function getUsuarios(req,res){
  var query = connection.query('SELECT * FROM usuario', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var usuarios = result;
            
      if(usuarios.length != 0){
        res.status(200).json(usuarios);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay usuarios.',Estatus:'Error'});
      }
    }
  });
}


function getUsuario(req,res){
  var id_usuario = req.params.id_usuario;

  var query = connection.query('SELECT * FROM usuario WHERE id_usuario=?', [id_usuario], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var usuario = result;
            
      if(usuario.length != 0){
        //res.json(rows);
        res.status(200).json(usuario);   
      }
      else{
        res.status(200).send({Mensaje:'Error. El Usuario no existe',Estatus:'Error'});
      }
    }
  });
}


function eliminarUsuario(req,res){

  var id_usuario = req.params.id_usuario;
  var estatus = 'B';
  var query = connection.query('UPDATE usuario SET estatus = ? WHERE id_usuario = ?',
  [estatus, id_usuario],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Usuario deshabilitada con exito',Estatus:'Ok'});  
      }
      else{
        res.status(200).send({Mensaje:'Error. El Usuario no existe.',Estatus:'Error'});
      }
    }
  });
}


module.exports={  
    login,
    logout,
    guardarUsuario,
    modificarUsuario,
    getUsuarios,
    getUsuario,
    eliminarUsuario,    
    
};