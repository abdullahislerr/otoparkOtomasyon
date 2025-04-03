// // routes/odemeler.js
// const express = require('express');
// const router = express.Router();
// const connection = require('../db');

// // ✅ Araç çıkışı yap ve ödeme işlemi (POST)
// router.post('/', (req, res) => {
//   const { arac_plaka, odeme_yontemi } = req.body;

//   if (!arac_plaka || !odeme_yontemi) {
//     return res.status(400).json({ error: 'Araç plaka ve ödeme yöntemi gereklidir.' });
//   }

//   // Araç için çıkış yapılmamış son giriş kaydını bul
//   const findEntryQuery = `
//     SELECT g.giris_ID, g.yer_ID, g.giris_saat
//     FROM Giris_Kayitlari g
//     JOIN Araclar a ON g.arac_ID = a.arac_ID
//     WHERE a.arac_plaka = ? 
//       AND NOT EXISTS (
//         SELECT 1 FROM Cikis_Kayitlari c WHERE c.giris_ID = g.giris_ID
//       )
//     ORDER BY g.giris_saat DESC
//     LIMIT 1
//   `;

//   connection.query(findEntryQuery, [arac_plaka], (err, results) => {
//     if (err) {
//       console.error('Giriş sorgusunda hata:', err);
//       return res.status(500).json({ error: 'Giriş sorgusunda hata oluştu' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Araç bulunamadı veya zaten çıkış yapılmış.' });
//     }

//     const { giris_ID, yer_ID, giris_saat } = results[0];
//     const girisZamani = new Date(giris_saat);
//     const cikisZamani = new Date();
//     const kalinanDakika = Math.floor((cikisZamani - girisZamani) / (1000 * 60));

//     // Ücret hesaplama (1 saat ücretsiz, sonraki her saat başı 50 TL)
//     let ucret = 0;
//     if (kalinanDakika > 60) {
//       const ucretliDakika = kalinanDakika - 60;
//       ucret = Math.ceil(ucretliDakika / 60) * 50;
//     }

//     // Çıkış kaydı ekle
//     const insertExitQuery = 'INSERT INTO Cikis_Kayitlari (giris_ID, cikis_saati) VALUES (?, ?)';
//     connection.query(insertExitQuery, [giris_ID, cikisZamani], (err, result) => {
//       if (err) {
//         console.error('Çıkış kaydı eklenirken hata:', err);
//         return res.status(500).json({ error: 'Çıkış kaydı oluşturulurken hata oluştu' });
//       }

//       // Otopark yerini boş yap
//       const updateParkingQuery = 'UPDATE Otopark_Yerleri SET yer_durum = "bos" WHERE yer_ID = ?';
//       connection.query(updateParkingQuery, [yer_ID], (err) => {
//         if (err) {
//           console.error('Otopark güncelleme hatası:', err);
//           return res.status(500).json({ error: 'Otopark alanı güncellenirken hata oluştu' });
//         }

//         // Ödeme kaydı ekle
//         const insertPaymentQuery = `
//           INSERT INTO Odemeler (giris_ID, ucret, odeme_tarihi, odeme_yontemi) 
//           VALUES (?, ?, NOW(), ?)
//         `;
//         connection.query(insertPaymentQuery, [giris_ID, ucret, odeme_yontemi], (err) => {
//           if (err) {
//             console.error('Ödeme kaydı eklenirken hata:', err);
//             return res.status(500).json({ error: 'Ödeme kaydı oluşturulurken hata oluştu' });
//           }

//           res.status(201).json({ 
//             message: 'Çıkış başarıyla yapıldı ve ödeme kaydedildi.', 
//             ucret, 
//             odeme_yontemi,
//             kalinanSure: `${Math.floor(kalinanDakika / 60)} saat ${kalinanDakika % 60} dakika`
//           });
//         });
//       });
//     });
//   });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Ödeme kayıtlarını listeleme
router.get('/', (req, res) => {
  const query = `
    SELECT o.ucret_ID, a.arac_plaka, o.ucret
    FROM Odemeler o
    JOIN Giris_Kayitlari g ON o.giris_ID = g.giris_ID
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    ORDER BY o.odeme_tarihi DESC
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ödemeler getirilemedi.' });
    }
    res.json(results);
  });
});
// Detaylı ödeme listesi (giriş, çıkış, ödeme bilgileri dahil)
router.get('/detayli-liste', (req, res) => {
  const query = `
    SELECT 
      a.arac_plaka,
      g.giris_saat,
      c.cikis_saati,
      o.odeme_yontemi,
      o.ucret,
      o.odeme_tarihi
    FROM Odemeler o
    JOIN Giris_Kayitlari g ON o.giris_ID = g.giris_ID
    JOIN Cikis_Kayitlari c ON g.giris_ID = c.giris_ID
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    ORDER BY o.odeme_tarihi DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Detaylı ödeme listesi hatası:', err);
      return res.status(500).json({ error: 'Detaylı ödeme verisi alınamadı.' });
    }
    res.json(results);
  });
});

// Belirli ödeme detaylarını görüntüleme
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      o.ucret_ID,
      a.arac_ID,
      a.arac_plaka,
      g.giris_ID,
      g.giris_saat,
      c.cikis_ID,
      c.cikis_saati,
      TIMESTAMPDIFF(MINUTE, g.giris_saat, c.cikis_saati) AS toplam_dakika,
      o.ucret,
      o.odeme_tarihi
    FROM Odemeler o
    JOIN Giris_Kayitlari g ON o.giris_ID = g.giris_ID
    JOIN Araclar a ON g.arac_ID = a.arac_ID
    JOIN Cikis_Kayitlari c ON g.giris_ID = c.giris_ID
    WHERE o.ucret_ID = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ödeme detayı getirilemedi.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Ödeme bulunamadı.' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
