const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Saulo@123',
        database: 'peticionesweb', 
        insecureAuth: true          
    });        
}

/*
    password:'saulo2000',
    Saulo@123
*/