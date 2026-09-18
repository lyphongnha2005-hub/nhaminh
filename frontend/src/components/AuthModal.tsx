import React, { FormEvent, useState } from 'react';
import { loginAccount, registerAccount } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onModeChange: (mode: 'login' | 'register') => void;
  onLoginSuccess: () => void;
  onRegisterSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onModeChange,
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (mode === 'register') {
      registerAccount({ fullName, email, password });
      setPassword('');
      setError('');
      onRegisterSuccess();
      return;
    }

    if (!loginAccount(email, password)) {
      const accountExists = localStorage.getItem('nhaminh-account');
      if (!accountExists) {
        setError('Bạn chưa có tài khoản. Vui lòng đăng ký trước.');
        onModeChange('register');
        return;
      }

      setError('Email hoặc mật khẩu chưa chính xác.');
      return;
    }

    onLoginSuccess();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container auth-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h3>
            <p className="auth-subtitle">
              {mode === 'login' ? 'Đăng nhập để lưu tác phẩm yêu thích.' : 'Tạo tài khoản để lưu các tác phẩm bạn yêu thích.'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Họ và tên
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Mật khẩu
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary auth-submit">
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button type="button" onClick={() => { setError(''); onModeChange(mode === 'login' ? 'register' : 'login'); }}>
            {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};
