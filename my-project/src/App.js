// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import KullaniciDashboard from './KullaniciDashboard';
import PersonelDashboard from './PersonelDashboard';

// Route yapılandırması
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/kullanici',
    element: <PersonelDashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
