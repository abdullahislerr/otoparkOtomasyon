//AdminExits.js
import React, { useState, useEffect } from 'react';
import './AdminExits.css';

function AdminExits() {
  const [vehicles, setVehicles] = useState([]);
  const [exits, setExits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('kart');
  const [popupOpen, setPopupOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/giris')
      .then((res) => res.json())
      .then((data) => setVehicles(data.filter(v => v.cikis_durumu === 'çıkmadı')))
      .catch(() => setError('Araçlar yüklenemedi.'));

    fetch('/api/cikis')
      .then((res) => res.json())
      .then(setExits)
      .catch(() => setError('Çıkışlar yüklenemedi.'));
  }, []);

  const handleExit = () => {
    fetch('/api/cikis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        giris_ID: selectedVehicle.giris_ID,
        odeme_yontemi: paymentMethod,
        ucret: 10,
      }),
    })
    .then((res) => res.json())
    .then(() => {
      alert('Çıkış başarılı.');
      window.location.reload();
    })
    .catch(() => setError('Çıkış işlemi başarısız.'));
  };

  return (
    <div className="admin-exits-container">
      <div className="admin-exits-left-panel">
        <h2>Otoparktaki Araçlar</h2>
        <input
          type="text"
          className="admin-exits-search"
          placeholder="Plaka ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="admin-exits-vehicles-table">
          <thead>
            <tr>
              <th>Plaka</th>
              <th>Giriş Saati</th>
              <th>Park Alanı</th>
              <th>Çıkış</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.filter(v => v.arac_plaka.includes(searchTerm)).map(v => (
              <tr key={v.giris_ID}>
                <td>{v.arac_plaka}</td>
                <td>{new Date(v.giris_saat).toLocaleString()}</td>
                <td>{v.yer_ad}</td>
                <td>
                  <button
                    className="admin-exits-exit-button"
                    onClick={() => {
                      setSelectedVehicle(v);
                      setPopupOpen(true);
                    }}
                  >
                    Çıkış Yap
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-exits-right-panel">
        <h2>Çıkış Yapan Araçlar</h2>
        <table className="admin-exits-exits-table">
          <thead>
            <tr>
              <th>Plaka</th>
              <th>Giriş Saati</th>
              <th>Çıkış Saati</th>
              <th>Ödeme Yöntemi</th>
              <th>Ücret</th>
            </tr>
          </thead>
          <tbody>
            {exits.map(exit => (
              <tr key={exit.cikis_ID}>
                <td>{exit.arac_plaka}</td>
                <td>{new Date(exit.giris_saat).toLocaleString()}</td>
                <td>{new Date(exit.cikis_saati).toLocaleString()}</td>
                <td>{exit.odeme_yontemi}</td>
                <td>{exit.ucret} TL</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupOpen && (
        <div className="admin-exits-popup-bg">
          <div className="admin-exits-popup">
            <h3>Ödeme Yöntemini Seçin</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="admin-exits-select"
            >
              <option value="kart">Kart</option>
              <option value="nakit">Nakit</option>
            </select>
            <button className="admin-exits-popup-confirm" onClick={handleExit}>Ödemeyi Tamamla</button>
            <button className="admin-exits-popup-cancel" onClick={() => setPopupOpen(false)}>İptal</button>
          </div>
        </div>
      )}
      {error && <p className="admin-exits-error">{error}</p>}
    </div>
  );
}

export default AdminExits;
