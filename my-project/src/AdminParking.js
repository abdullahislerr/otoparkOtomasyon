// src/AdminParking.js
import React, { useEffect, useState } from 'react';
import './AdminParking.css';

function AdminParking() {
  const [parkingList, setParkingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Yeni otopark alanı ekleme formu state'i
  const [newParking, setNewParking] = useState({
    yer_ad: '',
    yer_durum: 'bos',
  });

  // Güncelleme için seçili otopark alanı
  const [selectedParking, setSelectedParking] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Silme için state
  const [deleteParkingId, setDeleteParkingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Backend'den otopark verilerini çek
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

  // Yeni otopark alanı ekleme
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

  // Güncelleme modalını aç
  const openUpdateModal = (parking) => {
    setSelectedParking(parking);
    setShowUpdateModal(true);
  };

  // Güncelleme işlemi
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

  // Silme modalını aç
  const openDeleteModal = (id) => {
    setDeleteParkingId(id);
    setShowDeleteModal(true);
  };

  // Silme işlemi
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
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-parking-container">
      <h2>Otopark Alanları Yönetimi</h2>
      
      {/* Yeni Otopark Alanı Ekleme Formu */}
      <form className="add-parking-form" onSubmit={handleAddParking}>
        <h3>Yeni Otopark Alanı Ekle</h3>
        <div>
          <label>Alan Adı:</label>
          <input
            type="text"
            value={newParking.yer_ad}
            onChange={(e) =>
              setNewParking({ ...newParking, yer_ad: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Durum:</label>
          <select
            value={newParking.yer_durum}
            onChange={(e) =>
              setNewParking({ ...newParking, yer_durum: e.target.value })
            }
          >
            <option value="bos">Boş</option>
            <option value="dolu">Dolu</option>
          </select>
        </div>
        <button type="submit">Ekle</button>
      </form>
      
      {/* Otopark Alanları Tablosu */}
      <table className="parking-table">
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
                <button onClick={() => openUpdateModal(parking)}>Güncelle</button>
                <button onClick={() => openDeleteModal(parking.yer_ID)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Güncelleme Modal'ı */}
      {showUpdateModal && selectedParking && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Otopark Alanı Güncelle</h3>
            <form onSubmit={handleUpdateParking}>
              <div>
                <label>Alan Adı:</label>
                <input
                  type="text"
                  value={selectedParking.yer_ad}
                  onChange={(e) =>
                    setSelectedParking({
                      ...selectedParking,
                      yer_ad: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Durum:</label>
                <select
                  value={selectedParking.yer_durum}
                  onChange={(e) =>
                    setSelectedParking({
                      ...selectedParking,
                      yer_durum: e.target.value,
                    })
                  }
                >
                  <option value="bos">Boş</option>
                  <option value="dolu">Dolu</option>
                </select>
              </div>
              <button type="submit">Güncelle</button>
              <button
                type="button"
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedParking(null);
                }}
              >
                İptal
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Silme Onay Modal'ı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Otopark Alanını Sil</h3>
            <p>Emin misiniz?</p>
            <button onClick={handleDeleteParking}>Evet</button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteParkingId(null);
              }}
            >
              Hayır
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminParking;
