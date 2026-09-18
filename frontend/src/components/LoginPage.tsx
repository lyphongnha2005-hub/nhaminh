import React, { FormEvent, useState } from 'react';
import { getStoredAccount, loginAccount } from '../services/authService';

interface LoginPageProps {
  onNavigate: (screen: 'catalog' | 'register') => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!loginAccount(email, password)) {
      if (!getStoredAccount()) {
        onNavigate('register');
        return;
      }
      setError('Email hoặc mật khẩu chưa chính xác. Nếu chưa có tài khoản, hãy đăng ký trước.');
      return;
    }

    onLoginSuccess();
  };

  return (
    <main className="auth-page">
      <section className="auth-page-card">
        <button className="auth-back-link" onClick={() => onNavigate('catalog')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Về trang chủ
        </button>
        <div className="auth-page-heading">
          <span className="material-symbols-outlined">favorite</span>
          <h1>Đăng nhập</h1>
          <p>Đăng nhập để lưu những tác phẩm bạn yêu thích.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Mật khẩu
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit">Đăng nhập</button>
        </form>
        <p className="auth-page-switch">
          Chưa có tài khoản?{' '}
          <button onClick={() => onNavigate('register')}>Đăng ký ngay</button>
        </p>
      </section>
    </main>
  );
};
