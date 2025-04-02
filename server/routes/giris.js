// routes/giris.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// ✅ Yeni giriş kaydı oluşturma (POST)
router.post('/', (req, res) => {
  let { arac_plaka, calisan_ID } = req.body; // let kullanılarak değişken atanabilir hale getirildi

  if (!arac_plaka || !calisan_ID) {
    return res.status(400).json({ error: 'Araç plaka ve çalışan ID gereklidir.' });
  }

  arac_plaka = arac_plaka.trim();
  console.log(`Gelen araç plakası: ${arac_plaka}, Çalışan ID: ${calisan_ID}`);

  // 1. Araç kontrolü ve yoksa ekleme
  const insertVehicleQuery = `
    INSERT INTO Araclar (arac_plaka)
    VALUES (?)
    ON DUPLICATE KEY UPDATE arac_ID = LAST_INSERT_ID(arac_ID)
  `;

  connection.query(insertVehicleQuery, [arac_plaka], (err, vehicleResult) => {
    if (err) {
      console.error('Araç eklenirken hata:', err);
      return res.status(500).json({ error: 'Araç eklenirken hata oluştu' });
    }

    const arac_ID = vehicleResult.insertId;
    console.log(`Arac_ID: ${arac_ID}`);

    // 2. Boş otopark alanı kontrolü
    const selectFreeParkingQuery = 'SELECT * FROM Otopark_Yerleri WHERE yer_durum = "bos" LIMIT 1';
    connection.query(selectFreeParkingQuery, (err, parkingResults) => {
      if (err) {
        console.error('Otopark sorgusunda hata:', err);
        return res.status(500).json({ error: 'Otopark sorgusunda hata oluştu' });
      }
      if (parkingResults.length === 0) {
        console.warn('Boş otopark alanı bulunamadı.');
        return res.status(400).json({ error: 'Boş otopark alanı yok' });
      }

      const yer_ID = parkingResults[0].yer_ID;
      const yer_ad = parkingResults[0].yer_ad;
      console.log(`Boş yer bulundu, yer_ID: ${yer_ID}, Yer Adı: ${yer_ad}`);

      // 3. Otopark alanını "dolu" yap
      const updateParkingQuery = 'UPDATE Otopark_Yerleri SET yer_durum = "dolu" WHERE yer_ID = ?';
      connection.query(updateParkingQuery, [yer_ID], (err) => {
        if (err) {
          console.error('Otopark alanı güncellenirken hata:', err);
          return res.status(500).json({ error: 'Otopark alanı güncellenirken hata oluştu' });
        }

        // 4. Giriş kaydı ekleme
        const insertEntryQuery = 'INSERT INTO Giris_Kayitlari (arac_ID, yer_ID, calisan_ID) VALUES (?, ?, ?)';
        connection.query(insertEntryQuery, [arac_ID, yer_ID, calisan_ID], (err, result) => {
          if (err) {
            console.error('Giriş kaydı oluşturulurken hata:', err);
            return res.status(500).json({ error: 'Giriş kaydı oluşturulurken hata oluştu' });
          }
          console.log(`Giriş kaydı oluşturuldu, Giriş ID: ${result.insertId}`);
          res.status(201).json({ message: 'Giriş kaydı başarıyla oluşturuldu', giris_ID: result.insertId, yer_ad });
        });
      });
    });
  });
});

// ✅ Tüm giriş kayıtlarını listeleme (GET)
router.get('/', (req, res) => {
  const query = `
    SELECT g.*, a.arac_plaka, y.yer_ad, c.cikis_ID,
           CASE WHEN c.cikis_ID IS NULL THEN 'çıkmadı' ELSE 'çıktı' END AS cikis_durumu
    FROM Giris_Kayitlari g
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    JOIN Otopark_Yerleri y ON g.yer_ID = y.yer_ID
    LEFT JOIN Cikis_Kayitlari c ON g.giris_ID = c.giris_ID
    ORDER BY g.giris_saat DESC;
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Giriş kayıtları sorgusunda hata:', err);
      return res.status(500).json({ error: 'Veritabanı sorgusunda hata oluştu' });
    }
    res.json(results);
  });
});

// ✅ Belirli bir giriş kaydını alma (GET)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT g.*, a.arac_plaka, y.yer_ad, c.cikis_ID,
           CASE WHEN c.cikis_ID IS NULL THEN 'çıkmadı' ELSE 'çıktı' END AS cikis_durumu
    FROM Giris_Kayitlari g
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    JOIN Otopark_Yerleri y ON g.yer_ID = y.yer_ID
    LEFT JOIN Cikis_Kayitlari c ON g.giris_ID = c.giris_ID
    WHERE g.giris_ID = ?;
  `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Giriş kaydı sorgusunda hata:', err);
      return res.status(500).json({ error: 'Veritabanı sorgusunda hata oluştu' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Giriş kaydı bulunamadı' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
