'use strict'
const conexion = require('../conexion');
const connection = conexion();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});

//acciones
function guardarRol(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.nombre_rol && params.descripcion_rol && params.estatus && connection){

    //verificar que no exista rol con el mismo nombre
    var query_verificar = connection.query('SELECT nombre_rol FROM rol WHERE nombre_rol =?',[params.nombre_rol], function(error, result){

      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Registrar Empleado//
        if(resultado_verificacion.length == 0){

          var query = connection.query('INSERT INTO rol(nombre_rol, descripcion_rol, estatus) VALUES(?,?,?)',
          [params.nombre_rol, params.descripcion_rol, params.estatus],function(error, result){
           if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al registrar rol',Estatus:'Error'});
           }else{
              res.status(200).send({Mensaje:'Rol registrada con exito'});
           }
         });
        }
        else{
          res.status(200).send({Mensaje:'Rol ya registrado en el sistema',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder registrar el Rol',Estatus:'Error'});
  }
}

/**/
function modificarRol(req,res){
  var id_rol = req.params.id_rol;
  var params = req.body;

  if(params.nombre_rol && params.descripcion_rol && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_rol FROM rol WHERE id_rol =?',[id_rol], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia',Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){

          var query = connection.query('UPDATE rol SET nombre_rol =?, descripcion_rol = ?, estatus=?  WHERE id_rol = ?',
            [params.nombre_rol, params.descripcion_rol, params.estatus, id_rol],function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al modificar Rol',Estatus:'Error'});
            }else{
              res.status(200).send({Mensaje:'Rol modificado con exito'});
            }
          });
        }
        else{
          res.status(200).send({Mensaje:'El Rol no existe',Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Introduce los datos correctamente para poder modificar el Rol',Estatus:'Error'});
  }
}



function getRoles(req,res){
  var query = connection.query('SELECT * FROM rol', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var roles = result;
            
      if(roles.length != 0){
        res.status(200).json(roles);   
      }
      else{
        res.status(200).send({Mensaje:'No hay Roles',Estatus:'Error'});
      }
    }
  });
}


function getRol(req,res){
  var id_rol = req.params.id_rol;

  var query = connection.query('SELECT * FROM rol WHERE id_rol=?', [id_rol], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var rol = result;
            
      if(rol.length != 0){
        //res.json(rows);
        res.status(200).json(rol);   
      }
      else{
        res.status(200).send({Mensaje:'Error. No hay Roles',Estatus:'Error'});
      }
    }
  });
}


function eliminarRol(req,res){

  var id_rol = req.params.id_rol;
  var estatus = 'B';
  var query = connection.query('UPDATE rol SET estatus = ? WHERE id_rol = ?',
  [estatus, id_rol],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición',Estatus:'Error'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Rol deshabilitada con exito'});  
      }
      else{
        res.status(200).send({Mensaje:'El Rol no existe',Estatus:'Error'});
      }
    }
  });
}


module.exports={  
    guardarRol,
    modificarRol,
    getRoles,
    getRol,
    eliminarRol,    

};