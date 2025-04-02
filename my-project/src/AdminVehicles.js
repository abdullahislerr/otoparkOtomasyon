// src/AdminVehicles.js
import React, { useEffect, useState } from 'react';
import './AdminVehicles.css';

function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Yeni araç ekleme form state'i
  const [newVehicle, setNewVehicle] = useState({
    arac_plaka: ''
  });

  // Güncelleme için seçili araç
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Silme işlemi için state
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // API'den araçları çek
  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/araclar');
      const data = await res.json();
      setVehicles(data);
      setLoading(false);
    } catch (err) {
      setError('Araçlar çekilirken bir hata oluştu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Yeni araç ekleme işlemi
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/araclar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Araç eklenemedi.');
        return;
      }
      setNewVehicle({ arac_plaka: '' });
      fetchVehicles();
    } catch (err) {
      setError('Araç eklenirken bir hata oluştu.');
    }
  };

  // Güncelleme modalını açma
  const openUpdateModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowUpdateModal(true);
  };

  // Güncelleme işlemi
  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/araclar/${selectedVehicle.arac_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedVehicle)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Güncelleme başarısız.');
        return;
      }
      setShowUpdateModal(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (err) {
      setError('Güncelleme sırasında bir hata oluştu.');
    }
  };

  // Silme modalını açma
  const openDeleteModal = (id) => {
    setDeleteVehicleId(id);
    setShowDeleteModal(true);
  };

  // Silme işlemi
  const handleDeleteVehicle = async () => {
    try {
      const res = await fetch(`/api/araclar/${deleteVehicleId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Silme başarısız.');
        return;
      }
      setShowDeleteModal(false);
      setDeleteVehicleId(null);
      fetchVehicles();
    } catch (err) {
      setError('Silme sırasında bir hata oluştu.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-vehicles-container">
      <h2>Araç Yönetimi</h2>
      
      {/* Yeni Araç Ekleme Formu */}
      <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
        <h3>Yeni Araç Ekle</h3>
        <div>
          <label>Plaka:</label>
          <input
            type="text"
            value={newVehicle.arac_plaka}
            onChange={(e) => setNewVehicle({ arac_plaka: e.target.value })}
            required
          />
        </div>
        <button type="submit">Ekle</button>
      </form>
      
      {/* Araçlar Tablosu */}
      <table className="vehicles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plaka</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.arac_ID}>
              <td>{vehicle.arac_ID}</td>
              <td>{vehicle.arac_plaka}</td>
              <td>
                <button onClick={() => openUpdateModal(vehicle)}>Güncelle</button>
                <button onClick={() => openDeleteModal(vehicle.arac_ID)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Güncelleme Modal'ı */}
      {showUpdateModal && selectedVehicle && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Araç Güncelle</h3>
            <form onSubmit={handleUpdateVehicle}>
              <div>
                <label>Plaka:</label>
                <input
                  type="text"
                  value={selectedVehicle.arac_plaka}
                  onChange={(e) =>
                    setSelectedVehicle({
                      ...selectedVehicle,
                      arac_plaka: e.target.value
                    })
                  }
                  required
                />
              </div>
              <button type="submit">Güncelle</button>
              <button type="button" onClick={() => { setShowUpdateModal(false); setSelectedVehicle(null); }}>İptal</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Silme Onay Modal'ı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Araç Sil</h3>
            <p>Emin misiniz?</p>
            <button onClick={handleDeleteVehicle}>Evet</button>
            <button onClick={() => { setShowDeleteModal(false); setDeleteVehicleId(null); }}>Hayır</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVehicles;
