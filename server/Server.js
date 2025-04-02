// server.js
const express = require('express');
const app = express();
const port = 5000;

// JSON verilerini işleyebilmek için middleware
app.use(express.json());

// Database bağlantısını yükle (db.js)
require('./db');

// Route dosyalarını import et
const araclarRouter = require('./routes/araclar');
const calisanlarRouter = require('./routes/calisanlar');
const otoparklarRouter = require('./routes/otoparklar');
const girisRouter = require('./routes/giris');
const cikisRouter = require('./routes/cikis');
const odemelerRouter = require('./routes/odemeler');
const loginRouter = require('./routes/login.js');
const parkedVehiclesRouter = require('./routes/parkedVehicles');
const reportRouter = require('./routes/report');
// Router'ları ilgili path'lere bağla
app.use('/api/araclar', araclarRouter);
app.use('/api/calisanlar', calisanlarRouter);
app.use('/api/otoparklar', otoparklarRouter);
app.use('/api/giris', girisRouter);
app.use('/api/cikis', cikisRouter);
app.use('/api/odemeler', odemelerRouter);
app.use('/api/login', loginRouter);
app.use('/api/parkedVehicles', parkedVehiclesRouter);
app.use('/api/report', reportRouter);
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
