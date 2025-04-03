import React, { useEffect, useState } from 'react';
import './AdminVehicles.css';

function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newVehicle, setNewVehicle] = useState({ arac_plaka: '' });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const openUpdateModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowUpdateModal(true);
  };

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

  const openDeleteModal = (id) => {
    setDeleteVehicleId(id);
    setShowDeleteModal(true);
  };

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
  if (error) return <div className="admin-vehicles-error">{error}</div>;

  return (
    <div className="admin-vehicles-container">
      <h2>Araç Yönetimi</h2>

      <form className="admin-vehicles-form" onSubmit={handleAddVehicle}>
        <input
          type="text"
          value={newVehicle.arac_plaka}
          onChange={(e) => setNewVehicle({ arac_plaka: e.target.value })}
          placeholder="Plaka giriniz"
          required
        />
        <button type="submit">Ekle</button>
      </form>

      <table className="admin-vehicles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plaka</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.arac_ID}>
              <td>{vehicle.arac_ID}</td>
              <td>{vehicle.arac_plaka}</td>
              <td>
                <button className="btn-update" onClick={() => openUpdateModal(vehicle)}>Güncelle</button>
                <button className="btn-delete" onClick={() => openDeleteModal(vehicle.arac_ID)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateModal && selectedVehicle && (
        <div className="admin-vehicles-modal-overlay">
          <div className="admin-vehicles-modal">
            <h3>Araç Güncelle</h3>
            <form onSubmit={handleUpdateVehicle}>
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
              <div className="modal-buttons">
                <button type="submit" className="btn-green">Kaydet</button>
                <button type="button" className="btn-red" onClick={() => { setShowUpdateModal(false); setSelectedVehicle(null); }}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-vehicles-modal-overlay">
          <div className="admin-vehicles-modal">
            <h3>Araç Sil</h3>
            <p>Bu aracı silmek istediğinize emin misiniz?</p>
            <div className="modal-buttons">
              <button className="btn-green" onClick={handleDeleteVehicle}>Evet</button>
              <button className="btn-red" onClick={() => { setShowDeleteModal(false); setDeleteVehicleId(null); }}>Hayır</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVehicles;
