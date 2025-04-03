const express = require('express');
const router = express.Router();
const connection = require('../db');

// 1. Haftalık giriş sayıları (son 7 gün)
router.get('/haftalik-giris', (req, res) => {
  const query = `
    SELECT DATE(giris_saat) AS tarih, COUNT(*) AS sayi
    FROM Giris_Kayitlari
    WHERE giris_saat >= CURDATE() - INTERVAL 6 DAY
    GROUP BY DATE(giris_saat)
    ORDER BY DATE(giris_saat)
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Haftalık giriş verisi hatası:', err);
      return res.status(500).json({ error: 'Giriş verisi çekilemedi.' });
    }
    res.json(results);
  });
});

// 2. Haftalık çıkış sayıları (son 7 gün)
router.get('/haftalik-cikis', (req, res) => {
  const query = `
    SELECT DATE(cikis_saati) AS tarih, COUNT(*) AS sayi
    FROM Cikis_Kayitlari
    WHERE cikis_saati >= CURDATE() - INTERVAL 6 DAY
    GROUP BY DATE(cikis_saati)
    ORDER BY DATE(cikis_saati)
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Haftalık çıkış verisi hatası:', err);
      return res.status(500).json({ error: 'Çıkış verisi çekilemedi.' });
    }
    res.json(results);
  });
});

// 3. Haftalık kazanç verileri (son 7 gün)
router.get('/haftalik-kazanc', (req, res) => {
  const query = `
    SELECT DATE(odeme_tarihi) AS tarih, SUM(ucret) AS toplam
    FROM Odemeler
    WHERE odeme_tarihi >= CURDATE() - INTERVAL 6 DAY
    GROUP BY DATE(odeme_tarihi)
    ORDER BY DATE(odeme_tarihi)
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Haftalık kazanç verisi hatası:', err);
      return res.status(500).json({ error: 'Kazanç verisi çekilemedi.' });
    }
    res.json(results);
  });
});

// 4. En çok kalan 5 araç (dakika bazında süre ile)
router.get('/en-cok-kalanlar', (req, res) => {
  const query = `
    SELECT a.arac_plaka, 
           TIMESTAMPDIFF(MINUTE, g.giris_saat, c.cikis_saati) AS sure_dk
    FROM Giris_Kayitlari g
    JOIN Cikis_Kayitlari c ON g.giris_ID = c.giris_ID
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    ORDER BY sure_dk DESC
    LIMIT 5
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Top 5 araç verisi hatası:', err);
      return res.status(500).json({ error: 'Araç süre verisi çekilemedi.' });
    }
    res.json(results);
  });
});

// 5. Hala içeride olan araçlar
router.get('/aktif-araclar', (req, res) => {
  const query = `
    SELECT a.arac_plaka, g.giris_saat
    FROM Giris_Kayitlari g
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    WHERE NOT EXISTS (
      SELECT 1 FROM Cikis_Kayitlari c WHERE c.giris_ID = g.giris_ID
    )
    ORDER BY g.giris_saat DESC
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('İçerideki araçlar hatası:', err);
      return res.status(500).json({ error: 'İçerideki araçlar çekilemedi.' });
    }
    res.json(results);
  });
});

module.exports = router;
