import React, { FormEvent, useState } from 'react';
import { ApiError, registerAccount } from '../services/authService';
import { PasswordInput } from '../components/PasswordInput';

interface RegisterPageProps {
  onNavigate: (screen: 'catalog' | 'login') => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [loading,setLoading]=useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setLoading(true); try { await registerAccount({fullName,email,phone:phone.trim(),password}); onRegisterSuccess(); }
    catch(e){setError(e instanceof ApiError?e.message:'Không thể kết nối máy chủ.')} finally{setLoading(false)}
  };

  return (
    <main className="auth-page">
      <section className="auth-page-card">
        <button className="auth-back-link" onClick={() => onNavigate('login')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Về trang đăng nhập
        </button>
        <div className="auth-page-heading">
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
          <label>Số điện thoại<input type="tel" autoComplete="tel" value={phone} onChange={(event)=>setPhone(event.target.value)} required maxLength={20} /></label>
          <label>
            Mật khẩu
            <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required autoComplete="new-password" />
          </label>
          <label>
            Nhập lại mật khẩu
            <PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required autoComplete="new-password" />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button disabled={loading} type="submit" className="btn btn-primary auth-submit">{loading?'Đang tạo…':'Tạo tài khoản'}</button>
        </form>
        <p className="auth-page-switch">
          Đã có tài khoản?{' '}
          <button onClick={() => onNavigate('login')}>Đăng nhập</button>
        </p>
      </section>
    </main>
  );
};
