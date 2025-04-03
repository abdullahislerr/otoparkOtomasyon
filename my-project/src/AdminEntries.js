import React, { useState, useEffect } from 'react';
import './AdminEntries.css';

function AdminEntries({ userId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aracPlaka, setAracPlaka] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/giris');
      if (!response.ok) throw new Error('Veriler alınamadı');
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error('Giriş kayıtları çekilirken hata:', err);
      setError('Giriş kayıtları çekilirken bir hata oluştu.');
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
      setError('Lütfen araç plakasını giriniz.');
      return;
    }

    if (!userId) {
      setError('Çalışan ID alınamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    try {
      const response = await fetch('/api/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arac_plaka: aracPlaka.trim(),
          calisan_ID: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Giriş kaydı eklenemedi.');
      }

      setAracPlaka('');
      fetchEntries();
    } catch (err) {
      console.error('Giriş eklenirken hata:', err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-entries-container">
      <h2>Giriş Yönetimi</h2>

      {error && <div className="admin-entries-error">{error}</div>}

      <form onSubmit={handleAddEntry} className="admin-entries-form">
        <input
          type="text"
          value={aracPlaka}
          onChange={(e) => setAracPlaka(e.target.value)}
          placeholder="Araç plakası giriniz..."
        />
        <button type="submit">Giriş Ekle</button>
      </form>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : entries.length === 0 ? (
        <div>Henüz giriş kaydı bulunmamaktadır.</div>
      ) : (
        <table className="admin-entries-table">
          <thead>
            <tr>
              <th>Giriş ID</th>
              <th>Araç Plaka</th>
              <th>Yer Adı</th>
              <th>Giriş Saati</th>
              <th>Çıkış Durumu</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.giris_ID}>
                <td>{entry.giris_ID}</td>
                <td>{entry.arac_plaka}</td>
                <td>{entry.yer_ad || 'Bilinmiyor'}</td>
                <td>{new Date(entry.giris_saat).toLocaleString()}</td>
                <td>{entry.cikis_durumu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminEntries;
