// src/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import AdminEmployees from './AdminEmployees';
import AdminParking from './AdminParking';
import AdminVehicles from './AdminVehicles';
import AdminEntries from './AdminEntries';
import AdminExits from './AdminExits';
import AdminPayments from './AdminPayments';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

function AdminDashboard() {
  const [activePage, setActivePage] = useState('raporlar');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const [weeklyGiris, setWeeklyGiris] = useState([]);
  const [weeklyCikis, setWeeklyCikis] = useState([]);
  const [weeklyKazanc, setWeeklyKazanc] = useState([]);
  const [top5Vehicles, setTop5Vehicles] = useState([]);
  const [parkedVehicles, setParkedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) {
      navigate('/');
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getLast7Days = () => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const today = new Date();
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        tarih: d.toISOString().slice(0, 10),
        gun: days[d.getDay()]
      };
    });
  };

  const formatWeeklyChartData = (apiData, valueKey = 'sayi') => {
    const last7 = getLast7Days();
    return last7.map(item => {
      const match = apiData.find(d => d.tarih.slice(0, 10) === item.tarih);
      return {
        gun: item.gun,
        [valueKey]: match ? match[valueKey] : 0
      };
    });
  };

  useEffect(() => {
    if (activePage === 'raporlar') {
      const fetchReportData = async () => {
        try {
          const [girisRes, cikisRes, kazancRes, top5Res, aktifAracRes] = await Promise.all([
            fetch('/api/report/haftalik-giris'),
            fetch('/api/report/haftalik-cikis'),
            fetch('/api/report/haftalik-kazanc'),
            fetch('/api/report/en-cok-kalanlar'),
            fetch('/api/report/aktif-araclar')
          ]);

          const girisData = await girisRes.json();
          const cikisData = await cikisRes.json();
          const kazancData = await kazancRes.json();
          const top5Data = await top5Res.json();
          const aktifData = await aktifAracRes.json();

          setWeeklyGiris(formatWeeklyChartData(girisData, 'sayi'));
          setWeeklyCikis(formatWeeklyChartData(cikisData, 'sayi'));
          setWeeklyKazanc(formatWeeklyChartData(kazancData, 'toplam'));
          setTop5Vehicles(top5Data);
          setParkedVehicles(aktifData);
          setLoading(false);
        } catch (err) {
          console.error('Veri hatası:', err);
          setError('Veri alınırken bir hata oluştu.');
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
    <button className="admin-button" onClick={() => setShowLogout(prev => !prev)}>
      {user ? `${user.calisan_ad || ''} ${user.calisan_soyad || ''}`.trim() || 'Admin' : 'Admin'}
    </button>
    {showLogout && (
      <div className="logout-dropdown">
        <button className="logout-button" onClick={handleLogout}>Çıkış Yap</button>
      </div>
    )}
  </div>
      </header>

      <div className="admin-content">
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

        <main className="admin-main">
          {activePage === 'raporlar' ? (
            <div className="raporlar-content">
              {loading ? (
                <div>Yükleniyor...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <>
                  <section className="admin-report-charts">
                    <div className="chart-block">
                      <h3>Haftalık Giriş Sayıları</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyGiris}>
                          <XAxis dataKey="gun" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Line type="monotone" dataKey="sayi" stroke="#007bff" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-block">
                      <h3>Haftalık Çıkış Sayıları</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyCikis}>
                          <XAxis dataKey="gun" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Line type="monotone" dataKey="sayi" stroke="#dc3545" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-block">
                      <h3>Haftalık Kazanç (TL)</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyKazanc}>
                          <XAxis dataKey="gun" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Bar dataKey="toplam" fill="#28a745" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <section className="top-vehicles-section">
                    <h3>Otoparkta En Uzun Süre Kalan 5 Araç</h3>
                    <table className="styled-table">
                      <thead>
                        <tr>
                          <th>Plaka</th>
                          <th>Süre (dk)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {top5Vehicles.map((v, i) => (
                          <tr key={i}>
                            <td>{v.arac_plaka}</td>
                            <td>{v.sure_dk}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  <section className="parked-vehicles">
                    <h3>Otoparkta Bulunan Araçlar</h3>
                    <table className="styled-table">
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
                              <td>{vehicle.arac_plaka}</td>
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
          ) : activePage === 'cikislar' ? (
            <AdminExits userId={user?.id} />
          ) : activePage === 'odemeler' ? (
            <AdminPayments userId={user?.id} />
          ) : (
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