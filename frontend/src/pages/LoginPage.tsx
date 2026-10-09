import React, { FormEvent, useState } from 'react';
import { ApiError, loginAccount, resetPassword } from '../services/authService';
import { PasswordInput } from '../components/PasswordInput';

interface LoginPageProps {
  onNavigate: (screen: 'catalog' | 'register') => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const session = await loginAccount(email.trim(), password);
      if (!session.accessToken || !session.user) throw new ApiError(401, 'Tài khoản hoặc mật khẩu không chính xác.');
      onLoginSuccess();
    }
    catch (e) { setError(e instanceof ApiError && e.status === 401 ? 'Tài khoản hoặc mật khẩu không chính xác.' : e instanceof ApiError ? e.message : 'Không thể kết nối máy chủ.'); }
    finally { setLoading(false); }
  };

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setSuccess('');
    if (newPassword !== confirmPassword) { setError('Mật khẩu xác nhận không trùng khớp.'); return; }
    setLoading(true);
    try {
      const result = await resetPassword({ email, phone, newPassword });
      setSuccess(result.message);
      setPassword(''); setPhone(''); setNewPassword(''); setConfirmPassword('');
      setForgotMode(false);
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Không thể kết nối máy chủ.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <section className="auth-page-card">
        <button className="auth-back-link" onClick={() => forgotMode ? setForgotMode(false) : onNavigate('catalog')}>
          <span className="material-symbols-outlined">arrow_back</span>
          {forgotMode ? 'Quay lại đăng nhập' : 'Về trang chủ'}
        </button>
        <div className="auth-page-heading">
          {forgotMode && <span className="material-symbols-outlined">lock_reset</span>}
          <h1>{forgotMode ? 'Đặt lại mật khẩu' : 'Đăng nhập'}</h1>
          <p>{forgotMode ? 'Xác minh email và số điện thoại đã đăng ký.' : 'Đăng nhập để lưu những tác phẩm bạn yêu thích.'}</p>
        </div>

        {forgotMode ? (
          <form className="auth-form" onSubmit={handleReset}>
            <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
            <label>Số điện thoại đã đăng ký<input value={phone} onChange={(event) => setPhone(event.target.value)} required autoComplete="tel" /></label>
            <label>Mật khẩu mới<PasswordInput value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} required autoComplete="new-password" /></label>
            <label>Nhập lại mật khẩu mới<PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required autoComplete="new-password" /></label>
            <p className="auth-password-hint">Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
            {error && <p className="auth-error">{error}</p>}
            <button disabled={loading} type="submit" className="btn btn-primary auth-submit">{loading ? 'Đang đặt lại…' : 'Đặt lại mật khẩu'}</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
            <label>Mật khẩu<PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
            <button type="button" className="auth-forgot-button" onClick={() => { setForgotMode(true); setError(''); setSuccess(''); }}>Quên mật khẩu?</button>
            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}
            <button disabled={loading} type="submit" className="btn btn-primary auth-submit">{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
          </form>
        )}
        {!forgotMode && <p className="auth-page-switch">Chưa có tài khoản? <button onClick={() => onNavigate('register')}>Đăng ký ngay</button></p>}
      </section>
    </main>
  );
};
