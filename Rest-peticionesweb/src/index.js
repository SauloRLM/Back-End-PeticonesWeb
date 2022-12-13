var app = require('./app');
var port = process.env.PORT || 5000;

const conexion = require('./conexion');
const connection = conexion();
connection.connect(function(error){
  if(error){
   console.log("No es posible establecer conexión con el servidor de base de datos. Verifique la conexión.")
 }else{
    console.log('Db is connectd');
    app.listen(port, () => {
        console.log(`Servidor Local en ${port} esta corriendo correctamente`);                
    });
 }
});
