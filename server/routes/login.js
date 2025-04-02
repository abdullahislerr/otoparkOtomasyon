// routes/login.js
const express = require('express');
const router = express.Router();
const connection = require('../db'); // db.js dosyanızdaki veritabanı bağlantısını import edin


// POST /api/login endpoint'i
router.post('/', (req, res) => {
  const { calisan_mail, calisan_sifre } = req.body;
  const query = 'SELECT * FROM Calisanlar WHERE calisan_mail = ? AND calisan_sifre = ?';

  connection.query(query, [calisan_mail, calisan_sifre], (err, results) => {
    if (err) {
      console.error('Giriş sorgusunda hata:', err);
      return res.status(500).json({ error: 'Sunucu hatası' });
    }

    if (results.length > 0) {
      // Kullanıcı bulunduysa
      const user = results[0];
      res.json({
        message: 'Giriş başarılı',
        user: { id: user.calisan_ID, rol: user.calisan_rol }
      });
    } else {
      // Kullanıcı bulunamadıysa
      res.status(401).json({ error: 'Geçersiz mail veya şifre' });
    }
  });
});

module.exports = router;
