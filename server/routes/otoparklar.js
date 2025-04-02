// routes/otoparklar.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Yeni otopark alanı ekleme
router.post('/', (req, res) => {
  const { yer_ad, yer_durum } = req.body;
  const query = 'INSERT INTO Otopark_Yerleri (yer_ad, yer_durum) VALUES (?,?)';
  connection.query(query, [yer_ad, yer_durum || 'bos'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Otopark alanı eklendi', id: result.insertId });
  });
});

// Tüm otopark alanlarını listeleme
router.get('/', (req, res) => {
  connection.query('SELECT * FROM Otopark_Yerleri', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Belirli bir otopark alanını getirme
router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM Otopark_Yerleri WHERE yer_ID = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Otopark alanı bulunamadı' });
    res.json(results[0]);
  });
});

// Otopark alanı güncelleme
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { yer_ad, yer_durum } = req.body;
  const query = 'UPDATE Otopark_Yerleri SET yer_ad = ?, yer_durum = ? WHERE yer_ID = ?';
  connection.query(query, [yer_ad, yer_durum, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Otopark alanı güncellendi' });
  });
});

// Otopark alanı silme
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM Otopark_Yerleri WHERE yer_ID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Otopark alanı silindi' });
  });
});

module.exports = router;
