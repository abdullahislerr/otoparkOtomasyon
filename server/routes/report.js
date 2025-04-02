// routes/report.js (aynı dosya içinde doluluk ve kazanc raporlarını toplayabiliriz)
const express = require('express');
const router = express.Router();
const connection = require('../db');

// GET /api/report/doluluk
router.get('/doluluk', (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM Giris_Kayitlari WHERE giris_ID NOT IN (SELECT giris_ID FROM Cikis_Kayitlari)) AS occupied,
      (SELECT COUNT(*) FROM Otopark_Yerleri) AS total
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Doluluk raporu sorgusunda hata:', err);
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }
    if (results && results.length > 0) {
      const { occupied, total } = results[0];
      const doluluk = total ? Math.round((occupied / total) * 100) : 0;
      res.json({ doluluk });
    } else {
      res.json({ doluluk: 0 });
    }
  });
});

// GET /api/report/kazanc
router.get('/kazanc', (req, res) => {
  // Örnek: Odemeler tablosundaki toplam ücreti hesapla
  const query = `SELECT SUM(ucret) AS totalEarnings FROM Odemeler`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Kazanç raporu sorgusunda hata:', err);
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }
    const totalEarnings = results[0].totalEarnings || 0;
    res.json({ kazanc: totalEarnings });
  });
});

module.exports = router;
