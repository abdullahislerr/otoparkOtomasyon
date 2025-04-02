// routes/parkedVehicles.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// GET /api/parkedVehicles
router.get('/', (req, res) => {
  // Örnek sorgu: Giriş kaydı yapılmış fakat çıkışı yapılmamış araçları getirir.
  const query = `
    SELECT a.arac_plaka AS plaka, g.giris_saat
    FROM Giris_Kayitlari g
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    WHERE g.giris_ID NOT IN (SELECT giris_ID FROM Cikis_Kayitlari)
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('ParkedVehicles sorgusunda hata:', err);
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }
    res.json(results);
  });
});

module.exports = router;
