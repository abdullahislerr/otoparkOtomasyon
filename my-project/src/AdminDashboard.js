// src/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import AdminEmployees from './AdminEmployees';
import AdminParking from './AdminParking';
import AdminVehicles from './AdminVehicles';
import AdminEntries from './AdminEntries';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.css';
import AdminExits from './AdminExits';
import AdminPayments from './AdminPayments';

function AdminDashboard() {
  const [activePage, setActivePage] = useState('raporlar');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dolulukData, setDolulukData] = useState(null);
  const [kazancData, setKazancData] = useState(null);
  const [parkedVehicles, setParkedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kullanıcı doğrulama ve giriş kontrolü
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) {
      navigate('/');
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  // Sidebar açma/kapama
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Raporlar için veri çekme
  useEffect(() => {
    if (activePage === 'raporlar') {
      const fetchReportData = async () => {
        try {
          const [dolulukRes, kazancRes, parkedRes] = await Promise.all([
            fetch('/api/report/doluluk'),
            fetch('/api/report/kazanc'),
            fetch('/api/parkedVehicles')
          ]);

          setDolulukData(await dolulukRes.json());
          setKazancData(await kazancRes.json());
          setParkedVehicles(await parkedRes.json());
          setLoading(false);
        } catch (err) {
          console.error('Veriler çekilirken hata:', err);
          setError('Veriler çekilirken bir hata oluştu.');
          setLoading(false);
        }
      };
      fetchReportData();
    }
  }, [activePage]);

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1>Admin Paneli</h1>
        <div className="admin-info">
          <span>{user?.name || 'Admin'}</span>
        </div>
      </header>

      <div className="admin-content">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? '<' : '>'}
          </button>
          {sidebarOpen && (
            <nav className="sidebar-nav">
              {['raporlar', 'calisanlar', 'otopark', 'araclar', 'girisler', 'cikislar', 'odemeler'].map((page) => (
                <li key={page} className={activePage === page ? 'active' : ''}>
                  <button onClick={() => setActivePage(page)}>{page.charAt(0).toUpperCase() + page.slice(1)}</button>
                </li>
              ))}
            </nav>
          )}
        </aside>

        {/* Sayfa İçeriği */}
        <main className="admin-main">
          {activePage === 'raporlar' ? (
            <div className="raporlar-content">
              {loading ? (
                <div>Yükleniyor...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <>
                  <section className="chart-section">
                    <div className="chart-box">
                      <h3>Otopark Doluluk Oranı</h3>
                      <div className="chart-placeholder">{dolulukData?.doluluk || 'Veri Yok'}%</div>
                    </div>
                    <div className="chart-box">
                      <h3>Kazanç Oranı</h3>
                      <div className="chart-placeholder">{kazancData?.kazanc || 'Veri Yok'} TL</div>
                    </div>
                  </section>
                  <section className="parked-vehicles">
                    <h3>Otoparkta Bulunan Araçlar</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Plaka</th>
                          <th>Giriş Saati</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parkedVehicles.length > 0 ? (
                          parkedVehicles.map((vehicle, index) => (
                            <tr key={index}>
                              <td>{vehicle.plaka}</td>
                              <td>{vehicle.giris_saat}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2">Otoparkta araç bulunamadı.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </section>
                </>
              )}
            </div>
          ) : activePage === 'calisanlar' ? (
            <AdminEmployees />
          ) : activePage === 'otopark' ? (
            <AdminParking />
          ) : activePage === 'araclar' ? (
            <AdminVehicles />
          ) : activePage === 'girisler' ? (
            <AdminEntries userId={user?.id} />
          ) : 
          activePage === 'cikislar' ? (
            <AdminExits userId={user?.id} />
          ) :
          
          activePage === 'odemeler' ? (
            <AdminPayments userId={user?.id} />
          ) :(
            <div className="placeholder-page">
              <h2>{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Sayfası</h2>
              <p>Bu sayfa henüz tasarlanmadı.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
