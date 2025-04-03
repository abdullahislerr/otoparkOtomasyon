// src/PersonelParking.js
import React, { useEffect, useState } from 'react';
import './PersonelParking.css';

function PersonelParking() {
  const [parkingList, setParkingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API'den otopark verilerini çek
  const fetchParkingList = async () => {
    try {
      const res = await fetch('/api/otoparklar');
      const data = await res.json();
      setParkingList(data);
      setLoading(false);
    } catch (err) {
      setError('Otopark alanları çekilirken bir hata oluştu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingList();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="personel-parking-error">{error}</div>;

  return (
    <div className="personel-parking-container">
      <h2>Otopark Alanları</h2>
      <table className="personel-parking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alan Adı</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {parkingList.map((parking) => (
            <tr key={parking.yer_ID}>
              <td>{parking.yer_ID}</td>
              <td>{parking.yer_ad}</td>
              <td>{parking.yer_durum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PersonelParking;
