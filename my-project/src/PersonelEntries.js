// src/PersonelEntries.js
import React, { useState, useEffect } from 'react';
import './PersonelEntries.css';

function PersonelEntries({ userId }) {
  const [entries, setEntries] = useState([]);
  const [aracPlaka, setAracPlaka] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/giris');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Veri alınırken hata:', err);
      setError('Giriş kayıtları alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setError('');

    if (!aracPlaka.trim()) {
      setError('Araç plakası giriniz.');
      return;
    }

    try {
      const response = await fetch('/api/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arac_plaka: aracPlaka.trim(), calisan_ID: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Giriş eklenemedi.');
      }

      setAracPlaka('');
      fetchEntries();
    } catch (err) {
      console.error('Giriş eklenemedi:', err);
      setError(err.message);
    }
  };

  return (
    <div className="personel-entries-container">
      <h2>Araç Girişleri</h2>
      {error && <div className="personel-error">{error}</div>}

      <form className="personel-entry-form" onSubmit={handleAddEntry}>
        <input
          type="text"
          placeholder="Araç Plakası"
          value={aracPlaka}
          onChange={(e) => setAracPlaka(e.target.value)}
        />
        <button type="submit">Giriş Ekle</button>
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table className="personel-entry-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Araç Plaka</th>
              <th>Yer</th>
              <th>Giriş Saati</th>
              <th>Çıkış</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.giris_ID}>
                <td>{entry.giris_ID}</td>
                <td>{entry.arac_plaka}</td>
                <td>{entry.yer_ad || '-'}</td>
                <td>{new Date(entry.giris_saat).toLocaleString()}</td>
                <td>{entry.cikis_durumu || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PersonelEntries;
