// src/AdminParking.js
import React, { useEffect, useState } from 'react';
import './AdminParking.css';

function AdminParking() {
  const [parkingList, setParkingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newParking, setNewParking] = useState({ yer_ad: '', yer_durum: 'bos' });
  const [selectedParking, setSelectedParking] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteParkingId, setDeleteParkingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleAddParking = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/otoparklar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParking),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Otopark alanı eklenemedi.');
        return;
      }
      setNewParking({ yer_ad: '', yer_durum: 'bos' });
      fetchParkingList();
    } catch (err) {
      setError('Otopark alanı eklenirken bir hata oluştu.');
    }
  };

  const openUpdateModal = (parking) => {
    setSelectedParking(parking);
    setShowUpdateModal(true);
  };

  const handleUpdateParking = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/otoparklar/${selectedParking.yer_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedParking),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Güncelleme başarısız.');
        return;
      }
      setShowUpdateModal(false);
      setSelectedParking(null);
      fetchParkingList();
    } catch (err) {
      setError('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const openDeleteModal = (id) => {
    setDeleteParkingId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteParking = async () => {
    try {
      const res = await fetch(`/api/otoparklar/${deleteParkingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Silme başarısız.');
        return;
      }
      setShowDeleteModal(false);
      setDeleteParkingId(null);
      fetchParkingList();
    } catch (err) {
      setError('Silme sırasında bir hata oluştu.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="admin-parking-error">{error}</div>;

  return (
    <div className="admin-parking-container">
      <h2>Otopark Alanları Yönetimi</h2>

      <form className="admin-parking-form" onSubmit={handleAddParking}>
        <input
          type="text"
          value={newParking.yer_ad}
          onChange={(e) => setNewParking({ ...newParking, yer_ad: e.target.value })}
          placeholder="Alan Adı"
          required
        />
        <select
          value={newParking.yer_durum}
          onChange={(e) => setNewParking({ ...newParking, yer_durum: e.target.value })}
        >
          <option value="bos">Boş</option>
          <option value="dolu">Dolu</option>
        </select>
        <button type="submit">Ekle</button>
      </form>

      <table className="admin-parking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alan Adı</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {parkingList.map((parking) => (
            <tr key={parking.yer_ID}>
              <td>{parking.yer_ID}</td>
              <td>{parking.yer_ad}</td>
              <td>{parking.yer_durum}</td>
              <td>
                <button className="btn-update" onClick={() => openUpdateModal(parking)}>Güncelle</button>
                <button className="btn-delete" onClick={() => openDeleteModal(parking.yer_ID)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateModal && selectedParking && (
        <div className="admin-parking-modal-overlay">
          <div className="admin-parking-modal">
            <h3>Otopark Alanı Güncelle</h3>
            <form onSubmit={handleUpdateParking}>
              <input
                type="text"
                value={selectedParking.yer_ad}
                onChange={(e) => setSelectedParking({ ...selectedParking, yer_ad: e.target.value })}
                required
              />
              <select
                value={selectedParking.yer_durum}
                onChange={(e) => setSelectedParking({ ...selectedParking, yer_durum: e.target.value })}
              >
                <option value="bos">Boş</option>
                <option value="dolu">Dolu</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn-green">Kaydet</button>
                <button type="button" className="btn-red" onClick={() => { setShowUpdateModal(false); setSelectedParking(null); }}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-parking-modal-overlay">
          <div className="admin-parking-modal">
            <h3>Otopark Alanını Sil</h3>
            <p>Bu alanı silmek istediğinize emin misiniz?</p>
            <div className="modal-buttons">
              <button className="btn-green" onClick={handleDeleteParking}>Evet</button>
              <button className="btn-red" onClick={() => { setShowDeleteModal(false); setDeleteParkingId(null); }}>Hayır</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminParking;