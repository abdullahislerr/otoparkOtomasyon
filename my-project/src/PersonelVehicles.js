import React, { useEffect, useState } from 'react';
import './PersonelVehicles.css';

function PersonelVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ arac_plaka: '' });
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/araclar');
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      setError('Araçlar çekilirken bir hata oluştu.');
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
        body: JSON.stringify(newVehicle),
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

  return (
    <div className="personel-vehicles-container">
      <h2>Araçlar</h2>

      <form className="personel-vehicle-form" onSubmit={handleAddVehicle}>
        <input
          type="text"
          value={newVehicle.arac_plaka}
          onChange={(e) => setNewVehicle({ arac_plaka: e.target.value })}
          placeholder="Plaka giriniz"
          required
        />
        <button type="submit">Ekle</button>
      </form>

      {error && <p className="personel-error">{error}</p>}

      <table className="personel-vehicle-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plaka</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.arac_ID}>
              <td>{vehicle.arac_ID}</td>
              <td>{vehicle.arac_plaka}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PersonelVehicles;
