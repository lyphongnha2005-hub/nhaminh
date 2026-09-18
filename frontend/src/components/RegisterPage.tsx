import React, { FormEvent, useState } from 'react';
import { registerAccount } from '../services/authService';

interface RegisterPageProps {
  onNavigate: (screen: 'catalog' | 'login') => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    registerAccount({ fullName, email, password });
    onRegisterSuccess();
  };

  return (
    <main className="auth-page">
      <section className="auth-page-card">
        <button className="auth-back-link" onClick={() => onNavigate('login')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Về trang đăng nhập
        </button>
        <div className="auth-page-heading">
          <span className="material-symbols-outlined">person_add</span>
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản để lưu những tác phẩm bạn yêu thích.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Họ và tên
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Mật khẩu
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </label>
          <label>
            Nhập lại mật khẩu
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit">Tạo tài khoản</button>
        </form>
        <p className="auth-page-switch">
          Đã có tài khoản?{' '}
          <button onClick={() => onNavigate('login')}>Đăng nhập</button>
        </p>
      </section>
    </main>
  );
};
