// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import KullaniciDashboard from './KullaniciDashboard';

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
    element: <KullaniciDashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
