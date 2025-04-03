// src/PersonelDashboard.js
import React, { useEffect, useState } from 'react';
import PersonelParking from './PersonelParking';
import PersonelVehicles from './PersonelVehicles';
import PersonelEntries from './PersonelEntries';
import PersonelExits from './PersonelExits';
import PersonelPayments from './PersonelPayments';
import { useNavigate } from 'react-router-dom';
import './PersonelDashboard.css';

function PersonelDashboard() {
  const [activePage, setActivePage] = useState('girisler');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) {
      navigate('/');
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="personel-dashboard-container">
      <header className="personel-header">
        <h1>Personel Paneli</h1>
        <div className="personel-info">
  <button onClick={() => setShowDropdown(!showDropdown)} className="personel-name-button">
    {user?.name || 'Personel'}
  </button>
  {showDropdown && (
    <div className="personel-logout-dropdown">
      <button onClick={handleLogout} className="personel-logout-button">Çıkış Yap</button>
    </div>
  )}
</div>
      </header>

      <div className="personel-content">
        <aside className={`personel-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? '<' : '>'}
          </button>
          {sidebarOpen && (
            <nav className="sidebar-nav">
              <ul>
                {['otopark', 'araclar', 'girisler', 'cikislar', 'odemeler'].map((page) => (
                  <li key={page} className={activePage === page ? 'active' : ''}>
                    <button onClick={() => setActivePage(page)}>
                      {page.charAt(0).toUpperCase() + page.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        <main className="personel-main">
          {activePage === 'otopark' && <PersonelParking />}
          {activePage === 'araclar' && <PersonelVehicles />}
          {activePage === 'girisler' && <PersonelEntries userId={user?.id} />}
          {activePage === 'cikislar' && <PersonelExits userId={user?.id} />}
          {activePage === 'odemeler' && <PersonelPayments userId={user?.id} />}
        </main>
      </div>
    </div>
  );
}

export default PersonelDashboard;
