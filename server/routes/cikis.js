// routes/cikis.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Yeni çıkış oluşturma ve ödeme kaydı
router.post('/', (req, res) => {
  const { giris_ID, odeme_yontemi, ucret } = req.body;

  if (!giris_ID || !odeme_yontemi || !ucret) {
    return res.status(400).json({ error: 'Eksik bilgi: giris_ID, odeme_yontemi ve ucret gereklidir.' });
  }

  // Önce giriş kaydını bulalım (yer_ID'yi almak için)
  const findEntryQuery = 'SELECT yer_ID FROM Giris_Kayitlari WHERE giris_ID = ?';
  connection.query(findEntryQuery, [giris_ID], (err, entryResults) => {
    if (err) {
      console.error('Giriş kaydı sorgu hatası:', err);
      return res.status(500).json({ error: 'Veritabanı hatası oluştu.' });
    }

    if (entryResults.length === 0) {
      return res.status(404).json({ error: 'Giriş kaydı bulunamadı.' });
    }

    const yer_ID = entryResults[0].yer_ID;

    // Çıkış kaydı oluştur
    const insertExitQuery = 'INSERT INTO Cikis_Kayitlari (giris_ID, cikis_saati) VALUES (?, NOW())';
    connection.query(insertExitQuery, [giris_ID], (err, exitResult) => {
      if (err) {
        console.error('Çıkış kaydı ekleme hatası:', err);
        return res.status(500).json({ error: 'Çıkış kaydı oluşturulamadı.' });
      }

      // Otopark yerini "boş" olarak güncelle
      const updateParkingQuery = 'UPDATE Otopark_Yerleri SET yer_durum = "bos" WHERE yer_ID = ?';
      connection.query(updateParkingQuery, [yer_ID], (err) => {
        if (err) {
          console.error('Park alanı güncelleme hatası:', err);
          return res.status(500).json({ error: 'Park alanı güncellenemedi.' });
        }

        // Ödemeyi kaydet
        const insertPaymentQuery = `
          INSERT INTO Odemeler (giris_ID, ucret, odeme_tarihi, odeme_yontemi)
          VALUES (?, ?, NOW(), ?)
        `;
        connection.query(insertPaymentQuery, [giris_ID, ucret, odeme_yontemi], (err) => {
          if (err) {
            console.error('Ödeme kaydı oluşturma hatası:', err);
            return res.status(500).json({ error: 'Ödeme kaydı oluşturulamadı.' });
          }

          return res.status(201).json({
            message: 'Çıkış işlemi ve ödeme başarıyla tamamlandı.',
            cikis_ID: exitResult.insertId,
            odeme_yontemi,
            ucret,
          });
        });
      });
    });
  });
});

// Tüm çıkış kayıtlarını getir
router.get('/', (req, res) => {
  const query = `
    SELECT c.cikis_ID, a.arac_plaka, g.giris_saat, c.cikis_saati, o.odeme_yontemi, o.ucret
    FROM Cikis_Kayitlari c
    JOIN Giris_Kayitlari g ON c.giris_ID = g.giris_ID
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    JOIN Odemeler o ON o.giris_ID = g.giris_ID
    ORDER BY c.cikis_saati DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Çıkış kayıtları getirme hatası:', err);
      return res.status(500).json({ error: 'Çıkış kayıtları getirilemedi.' });
    }
    res.json(results);
  });
});

module.exports = router;
