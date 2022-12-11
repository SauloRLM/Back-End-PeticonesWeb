var app = require('./app');
var port = process.env.PORT || 5000;
//conexion mysql
const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'saulo2000',
    database: 'peticionesweb',
    insecureAuth: true  
    //port: 3306;
});
/*
password:'saulo2000',
Saulo@123
*/


function conectado(){
    mysqlConnection.connect(function(err){
        if(err){
            console.log(err);
            return;
        }else{
            console.log('Db is connectd');
            app.listen(port, () => {
                console.log(`Servidor Local en ${port} esta corriendo correctamente`);                
            });
        }
    });    
}

module.exports = {conectado, mysqlConnection};