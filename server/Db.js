// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',   
  password: 'aPO.415665',      
  database: 'OtoparkOtomasyonu'
});

connection.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanırken hata oluştu:', err);
    process.exit(1);
  }
  console.log('Veritabanına başarıyla bağlanıldı!');
});

module.exports = connection;
