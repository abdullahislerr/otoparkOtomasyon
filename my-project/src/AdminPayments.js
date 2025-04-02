import React, { useState, useEffect } from 'react';
import './AdminPayments.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/odemeler');
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      setError('Ödemeler yüklenirken hata oluştu.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleView = async (id) => {
    setLoading(true);
    setSelectedPayment(null);
    try {
      const res = await fetch(`/api/odemeler/${id}`);
      const data = await res.json();
      setSelectedPayment(data);
    } catch (err) {
      setError('Ödeme detayı yüklenirken hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.arac_plaka.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-payments">
      <h2>Ödeme Kayıtları</h2>
      
      <input
        type="text"
        placeholder="Araç plakasına göre ara..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Ödeme ID</th>
            <th>Araç Plaka</th>
            <th>Ücret (TL)</th>
            <th>Detaylar</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(payment => (
            <tr key={payment.ucret_ID}>
              <td>{payment.ucret_ID}</td>
              <td>{payment.arac_plaka}</td>
              <td>{payment.ucret}</td>
              <td><button onClick={() => handleView(payment.ucret_ID)}>Görüntüle</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pop-up */}
      {loading && <div className="popup-bg">Yükleniyor...</div>}

      {selectedPayment && (
        <div className="popup-bg">
          <div className="popup">
            <h3>Ödeme Detayları</h3>
            <ul>
              <li><strong>Ödeme ID:</strong> {selectedPayment.ucret_ID}</li>
              <li><strong>Araç ID:</strong> {selectedPayment.arac_ID}</li>
              <li><strong>Plaka:</strong> {selectedPayment.arac_plaka}</li>
              <li><strong>Giriş ID:</strong> {selectedPayment.giris_ID}</li>
              <li><strong>Giriş Saati:</strong> {new Date(selectedPayment.giris_saat).toLocaleString()}</li>
              <li><strong>Çıkış ID:</strong> {selectedPayment.cikis_ID}</li>
              <li><strong>Çıkış Saati:</strong> {new Date(selectedPayment.cikis_saati).toLocaleString()}</li>
              <li><strong>Toplam Süre:</strong> {selectedPayment.toplam_dakika} dakika</li>
              <li><strong>Ücret:</strong> {selectedPayment.ucret} TL</li>
            </ul>
            <button onClick={() => setSelectedPayment(null)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
