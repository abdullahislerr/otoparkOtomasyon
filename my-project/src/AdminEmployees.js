// src/AdminEmployees.js
import React, { useEffect, useState } from 'react';
import './AdminEmployees.css';

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newEmployee, setNewEmployee] = useState({
    calisan_ad: '', calisan_soyad: '', calisan_telNO: '',
    calisan_adres: '', calisan_mail: '', calisan_sifre: '',
    calisan_rol: 'personel'
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/calisanlar');
      const data = await res.json();
      setEmployees(data);
      setLoading(false);
    } catch {
      setError('Çalışanlar çekilirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/calisanlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Çalışan eklenemedi.');
        return;
      }
      setNewEmployee({ calisan_ad: '', calisan_soyad: '', calisan_telNO: '', calisan_adres: '', calisan_mail: '', calisan_sifre: '', calisan_rol: 'personel' });
      fetchEmployees();
    } catch {
      setError('Çalışan eklenirken bir hata oluştu.');
    }
  };

  const openUpdateModal = (employee) => {
    setSelectedEmployee(employee);
    setShowUpdateModal(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/calisanlar/${selectedEmployee.calisan_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedEmployee)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Güncelleme başarısız.');
        return;
      }
      setShowUpdateModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch {
      setError('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const openDeleteModal = (employeeId) => {
    setDeleteEmployeeId(employeeId);
    setShowDeleteModal(true);
  };

  const handleDeleteEmployee = async () => {
    try {
      const res = await fetch(`/api/calisanlar/${deleteEmployeeId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Silme başarısız.');
        return;
      }
      setShowDeleteModal(false);
      setDeleteEmployeeId(null);
      fetchEmployees();
    } catch {
      setError('Silme sırasında bir hata oluştu.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="admin-employees-error">{error}</div>;

  return (
    <div className="admin-employees-container">
      <h2>Çalışanlar Yönetimi</h2>

      <form className="admin-employees-form" onSubmit={handleAddEmployee}>
        <h3>Yeni Çalışan Ekle</h3>
        {['ad', 'soyad', 'telNO', 'adres', 'mail', 'sifre'].map((field, i) => (
          <input
            key={i}
            type={field === 'mail' ? 'email' : field === 'sifre' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={newEmployee[`calisan_${field}`]}
            onChange={e => setNewEmployee({ ...newEmployee, [`calisan_${field}`]: e.target.value })}
            required
          />
        ))}
        <select value={newEmployee.calisan_rol} onChange={e => setNewEmployee({ ...newEmployee, calisan_rol: e.target.value })}>
          <option value="personel">Personel</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Ekle</button>
      </form>

      <table className="admin-employees-table">
        <thead>
          <tr>
            <th>ID</th><th>Ad</th><th>Soyad</th><th>Email</th><th>Telefon</th><th>Rol</th><th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.calisan_ID}>
              <td>{emp.calisan_ID}</td>
              <td>{emp.calisan_ad}</td>
              <td>{emp.calisan_soyad}</td>
              <td>{emp.calisan_mail}</td>
              <td>{emp.calisan_telNO}</td>
              <td>{emp.calisan_rol}</td>
              <td>
                <button className="btn-update" onClick={() => openUpdateModal(emp)}>Güncelle</button>
                <button className="btn-delete" onClick={() => openDeleteModal(emp.calisan_ID)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateModal && selectedEmployee && (
        <div className="admin-employees-modal-overlay">
          <div className="admin-employees-modal">
            <h3>Çalışan Güncelle</h3>
            <form onSubmit={handleUpdateEmployee}>
              {['ad', 'soyad', 'mail', 'telNO'].map((field, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={selectedEmployee[`calisan_${field}`]}
                  onChange={e => setSelectedEmployee({ ...selectedEmployee, [`calisan_${field}`]: e.target.value })}
                  required
                />
              ))}
              <select
                value={selectedEmployee.calisan_rol}
                onChange={e => setSelectedEmployee({ ...selectedEmployee, calisan_rol: e.target.value })}
              >
                <option value="personel">Personel</option>
                <option value="admin">Admin</option>
              </select>
              <div className="modal-buttons">
                <button className="btn-update" type="submit">Kaydet</button>
                <button className="btn-cancel" type="button" onClick={() => setShowUpdateModal(false)}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-employees-modal-overlay">
          <div className="admin-employees-modal">
            <h3>Çalışanı Sil</h3>
            <p>Bu çalışanı silmek istediğinize emin misiniz?</p>
            <div className="modal-buttons">
              <button className="btn-update" onClick={handleDeleteEmployee}>Evet</button>
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Hayır</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEmployees;
