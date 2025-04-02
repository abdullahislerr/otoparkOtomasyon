// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calisan_mail: email,
          calisan_sifre: sifre,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Giriş başarısız');
        return;
      }

      // ✅ Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Giriş başarılıysa, kullanıcı rolüne göre yönlendir
      if (data.user.rol === 'admin') {
        navigate('/admin');
      } else if (data.user.rol === 'personel') {
        navigate('/kullanici');
      } else {
        setError('Bilinmeyen kullanıcı rolü');
      }
    } catch (err) {
      console.error('Hata:', err);
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sisteme Giriş</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email adresinizi giriniz"
            />
          </div>
          <div className="form-group">
            <label>Şifre:</label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
              placeholder="Şifrenizi giriniz"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
