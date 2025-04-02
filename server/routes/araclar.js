// routes/araclar.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Yeni araç ekleme
router.post('/', (req, res) => {
  const { arac_plaka } = req.body;
  const query = 'INSERT INTO Araclar (arac_plaka) VALUES (?)';
  connection.query(query, [arac_plaka], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Araç eklendi', id: result.insertId });
  });
});

// Tüm araçları listeleme
router.get('/', (req, res) => {
  connection.query('SELECT * FROM Araclar', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Belirli bir aracı getirme
router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM Araclar WHERE arac_ID = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Araç bulunamadı' });
    res.json(results[0]);
  });
});

// Araç güncelleme
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { arac_plaka } = req.body;
  const query = 'UPDATE Araclar SET arac_plaka = ? WHERE arac_ID = ?';
  connection.query(query, [arac_plaka, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Araç güncellendi' });
  });
});

// Araç silme
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM Araclar WHERE arac_ID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Araç silindi' });
  });
});

module.exports = router;
