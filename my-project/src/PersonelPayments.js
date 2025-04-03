// src/PersonelPayments.js
import React, { useEffect, useState } from 'react';
import './PersonelPayments.css';

function PersonelPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/odemeler/detayli-liste')
      .then((res) => {
        if (!res.ok) throw new Error('Veri çekilemedi');
        return res.json();
      })
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ödemeler yüklenemedi.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="personel-payments-error">{error}</div>;

  return (
    <div className="personel-payments-container">
      <h2>Ödeme Kayıtları</h2>
      <table className="personel-payments-table">
        <thead>
          <tr>
            <th>Plaka</th>
            <th>Giriş Saati</th>
            <th>Çıkış Saati</th>
            <th>Ödeme Yöntemi</th>
            <th>Ücret</th>
            <th>Ödeme Tarihi</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.arac_plaka}</td>
              <td>{new Date(payment.giris_saat).toLocaleString()}</td>
              <td>{new Date(payment.cikis_saati).toLocaleString()}</td>
              <td>{payment.odeme_yontemi}</td>
              <td>{payment.ucret} TL</td>
              <td>{new Date(payment.odeme_tarihi).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PersonelPayments;
