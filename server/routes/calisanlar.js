// routes/calisanlar.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Yeni çalışan ekleme
router.post('/', (req, res) => {
  const { calisan_ad, calisan_soyad, calisan_telNO, calisan_adres, calisan_mail, calisan_sifre, calisan_rol } = req.body;
  const query = 'INSERT INTO Calisanlar (calisan_ad, calisan_soyad, calisan_telNO, calisan_adres, calisan_mail, calisan_sifre, calisan_rol) VALUES (?,?,?,?,?,?,?)';
  connection.query(query, [calisan_ad, calisan_soyad, calisan_telNO, calisan_adres, calisan_mail, calisan_sifre, calisan_rol], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Çalışan eklendi', id: result.insertId });
  });
});

// Tüm çalışanları listeleme
router.get('/', (req, res) => {
  connection.query('SELECT * FROM Calisanlar', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Belirli bir çalışanı getirme
router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM Calisanlar WHERE calisan_ID = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Çalışan bulunamadı' });
    res.json(results[0]);
  });
});

// Çalışan güncelleme
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { calisan_ad, calisan_soyad, calisan_telNO, calisan_adres, calisan_mail, calisan_sifre, calisan_rol } = req.body;
  const query = 'UPDATE Calisanlar SET calisan_ad = ?, calisan_soyad = ?, calisan_telNO = ?, calisan_adres = ?, calisan_mail = ?, calisan_sifre = ?, calisan_rol = ? WHERE calisan_ID = ?';
  connection.query(query, [calisan_ad, calisan_soyad, calisan_telNO, calisan_adres, calisan_mail, calisan_sifre, calisan_rol, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Çalışan güncellendi' });
  });
});

// Çalışan silme
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM Calisanlar WHERE calisan_ID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Çalışan silindi' });
  });
});

module.exports = router;
