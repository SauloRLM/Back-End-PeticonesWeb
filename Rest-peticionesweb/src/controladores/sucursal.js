'use strict'
const conexion = require('../conexion');
const connection = conexion();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }
});
//acciones
function guardarSucursal(req,res){
  //Recoger parametros peticion
  var params = req.body;

  if(params.id_sucursal && params.nombre_sucursal  && params.telefono && params.domicilio && params.correo && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[params.id_sucursal], function(error, result){

      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia', Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Registrar Empleado//
        if(resultado_verificacion.length == 0){

          var query = connection.query('INSERT INTO sucursal(id_sucursal, nombre_sucursal, domicilio, correo, telefono, estatus) VALUES(?,?,?,?,?,?)',
          [params.id_sucursal, params.nombre_sucursal, params.domicilio, params.correo, params.telefono, params.estatus],function(error, result){
           if(error){
              // throw error;
              res.status(200).send({Mensaje:'Error al registrar la sucursal', Estatus:'Error'});
           }else{
              res.status(200).send({Mensaje:'sucursal registrada con exito', Estatus:'Ok'});
           }
         });
        }
        else{
          res.status(200).send({Mensaje:'Error. sucursal ya registrada anteriormente.', Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error. Introduce los datos correctamente para poder registrar la sucursal.', Estatus:'Error'});
  }
}

/**/
function modificarSucursal(req,res){
  var id_sucursal = req.params.id_sucursal;
  var params = req.body;

  if(params.nombre_sucursal && params.domicilio && params.correo && params.telefono && params.estatus && connection){

    var query_verificar = connection.query('SELECT id_sucursal FROM sucursal WHERE id_sucursal =?',[id_sucursal], function(error, result){
      if(error){
          //throw error;
          res.status(200).send({Mensaje:'Error al verificar existencia', Estatus:'Error'});
       }else{
        var resultado_verificacion = result;
        //Modificar Sucursal//
        if(resultado_verificacion.length != 0){

          var query = connection.query('UPDATE sucursal SET nombre_sucursal =?, domicilio = ?, correo = ?, telefono=?, estatus=?  WHERE id_sucursal = ?',
            [params.nombre_sucursal, params.domicilio, params.correo, params.telefono, params.estatus, id_sucursal],function(error, result){
            if(error){
              //throw error;
              res.status(200).send({Mensaje:'Error al modificar Sucursal', Estatus:'Error'});
            }else{
              res.status(200).send({Mensaje:'Sucursal modificada con exito', Estatus:'Ok'});
            }
          });
        }
        else{
          res.status(200).send({Mensaje:'Error. sucursal no existe.', Estatus:'Error'});
        }
       }
    });
  }else{
    res.status(200).send({Mensaje:'Error.Introduce los datos correctamente para poder modificar la sucursal.', Estatus:'Error'});
  }
}



function getSucursales(req,res){
  var query = connection.query('SELECT * FROM sucursal', [], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var sucursales = result;
            
      if(sucursales.length != 0){
        res.status(200).json(sucursales);   
      }
      else{
        res.status(200).send({Mensaje:'Error.No hay sucursales', Estatus:'Error'});
      }
    }
  });
}


function getSucursal(req,res){
  var id_sucursal = req.params.id_sucursal;

  var query = connection.query('SELECT * FROM sucursal WHERE id_sucursal=?', [id_sucursal], function(error, result){
    if(error){
      // throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var sucursal = result;
            
      if(sucursal.length != 0){
        //res.json(rows);
        res.status(200).json(sucursal);   
      }
      else{
        res.status(200).send({Mensaje:'Error. La sucursal no existe.', Estatus:'Error'});
      }
    }
  });
}


function eliminarSucursal(req,res){

  var id_sucursal = req.params.id_sucursal;
  var estatus = 'B';
  var query = connection.query('UPDATE sucursal SET estatus = ? WHERE id_sucursal = ?',
  [estatus, id_sucursal],function(error, result){

    if(error){
      //throw error;
      res.status(200).send({Mensaje:'Error en la petición', Estatus:'Error'});
    }else{

      var resultado_verificacion = result.affectedRows;
            
      if(resultado_verificacion != 0){
        res.status(200).send({Mensaje:'Sucursal  deshabilitada con exito', Estatus:'Ok'});  
      }
      else{
        res.status(200).send({Mensaje:'Error. La sucursal no existe.', Estatus:'Error'});
      }
    }
  });
}

module.exports={  
    guardarSucursal,
    modificarSucursal,
    getSucursales,
    getSucursal,
    eliminarSucursal,    

};