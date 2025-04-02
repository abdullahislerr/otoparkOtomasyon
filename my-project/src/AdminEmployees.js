// src/AdminEmployees.js
import React, { useEffect, useState } from 'react';
import styles from'./AdminEmployees.css';

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Yeni çalışan form state'i
  const [newEmployee, setNewEmployee] = useState({
    calisan_ad: '',
    calisan_soyad: '',
    calisan_telNO: '',
    calisan_adres: '',
    calisan_mail: '',
    calisan_sifre: '',
    calisan_rol: 'personel',
  });
  
  // Güncelleme için seçili çalışan
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // Modal kontrolü
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Silme işleminde silinecek id'yi tutalım
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  
  // API'den çalışanları çek
  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/calisanlar');
      const data = await res.json();
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      setError('Çalışanlar çekilirken bir hata oluştu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  // Yeni çalışan ekleme
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
      setNewEmployee({
        calisan_ad: '',
        calisan_soyad: '',
        calisan_telNO: '',
        calisan_adres: '',
        calisan_mail: '',
        calisan_sifre: '',
        calisan_rol: 'personel',
      });
      fetchEmployees();
    } catch (err) {
      setError('Çalışan eklenirken bir hata oluştu.');
    }
  };
  
  // Güncelleme açma
  const openUpdateModal = (employee) => {
    setSelectedEmployee(employee);
    setShowUpdateModal(true);
  };
  
  // Güncelleme işlemi
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
    } catch (err) {
      setError('Güncelleme sırasında bir hata oluştu.');
    }
  };
  
  // Silme açma
  const openDeleteModal = (employeeId) => {
    setDeleteEmployeeId(employeeId);
    setShowDeleteModal(true);
  };
  
  // Silme işlemi
  const handleDeleteEmployee = async () => {
    try {
      const res = await fetch(`/api/calisanlar/${deleteEmployeeId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Silme başarısız.');
        return;
      }
      setShowDeleteModal(false);
      setDeleteEmployeeId(null);
      fetchEmployees();
    } catch (err) {
      setError('Silme sırasında bir hata oluştu.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-employees-container">
      <h2>Çalışanlar Yönetimi</h2>
      
      {/* Yeni çalışan ekleme formu */}
      <form className="add-employee-form" onSubmit={handleAddEmployee}>
        <h3>Yeni Çalışan Ekle</h3>
        <div>
          <label>Ad:</label>
          <input
            type="text"
            value={newEmployee.calisan_ad}
            onChange={(e) => setNewEmployee({...newEmployee, calisan_ad: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Soyad:</label>
          <input
            type="text"
            value={newEmployee.calisan_soyad}
            onChange={(e) => setNewEmployee({...newEmployee, calisan_soyad: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Telefon:</label>
          <input
            type="text"
            value={newEmployee.calisan_telNO}
            onChange={(e) => setNewEmployee({...newEmployee, calisan_telNO: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Adres:</label>
          <input
            type="text"
            value={newEmployee.calisan_adres}
            onChange={(e) => setNewEmployee({...newEmployee, calisan_adres: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={newEmployee.calisan_mail}
            onChange={(e) => setNewEmployee({...newEmployee, calisan_mail: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={newEmployee.calisan_sifre}
            onChange={(e) => setNewEmployee({...newEmployee, calisan_sifre: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select
            value={newEmployee.calisan_rol}
            onChange={(e) => setNewEmployee({...newEmployee, calisan_rol: e.target.value})}
          >
            <option value="personel">Personel</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Ekle</button>
      </form>
      
      {/* Çalışanlar Tablosu */}
      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Rol</th>
            <th>İşlemler</th>
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
                <button onClick={() => openUpdateModal(emp)}>Güncelle</button>
                <button onClick={() => openDeleteModal(emp.calisan_ID)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Güncelleme Modal'ı */}
      {showUpdateModal && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Çalışan Güncelle</h3>
            <form onSubmit={handleUpdateEmployee}>
              <div>
                <label>Ad:</label>
                <input
                  type="text"
                  value={selectedEmployee.calisan_ad}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, calisan_ad: e.target.value})}
                  required
                />
              </div>
              <div>
                <label>Soyad:</label>
                <input
                  type="text"
                  value={selectedEmployee.calisan_soyad}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, calisan_soyad: e.target.value})}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={selectedEmployee.calisan_mail}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, calisan_mail: e.target.value})}
                  required
                />
              </div>
              <div>
                <label>Telefon:</label>
                <input
                  type="text"
                  value={selectedEmployee.calisan_telNO}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, calisan_telNO: e.target.value})}
                  required
                />
              </div>
              <div>
                <label>Rol:</label>
                <select
                  value={selectedEmployee.calisan_rol}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, calisan_rol: e.target.value})}
                >
                  <option value="personel">Personel</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit">Güncelle</button>
              <button type="button" onClick={() => { setShowUpdateModal(false); setSelectedEmployee(null); }}>İptal</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Silme Onay Modal'ı */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Çalışanı Sil</h3>
            <p>Emin misiniz?</p>
            <button onClick={handleDeleteEmployee}>Evet</button>
            <button onClick={() => { setShowDeleteModal(false); setDeleteEmployeeId(null); }}>Hayır</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEmployees;
