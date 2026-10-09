import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/authService';

interface Message { id: string; text: string; status: 'VISIBLE' | 'HIDDEN'; createdAt: string }

export function MessageManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string>();
  const [target, setTarget] = useState<Message>();
  const [notice, setNotice] = useState('');
  function notifyPublic() {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nhaminh-messages');
      channel.postMessage({ type: 'CHANGED' }); channel.close();
    }
  }
  async function load() {
    setLoading(true); setError('');
    try { setMessages(await apiRequest<Message[]>('/api/admin/messages')); }
    catch (e) { setError(e instanceof Error ? e.message : 'Không tải được thông điệp'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  async function moderate(message: Message) {
    const status = message.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
    setBusy(message.id); setError(''); setNotice('');
    try {
      await apiRequest(`/api/admin/messages/${message.id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setMessages(items => items.map(item => item.id === message.id ? { ...item, status } : item));
      setNotice(status === 'HIDDEN' ? 'Đã ẩn thông điệp khỏi trang cộng đồng.' : 'Đã hiển thị lại thông điệp.');
      notifyPublic();
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể đổi trạng thái'); }
    finally { setBusy(undefined); }
  }
  async function remove() {
    if (!target) return;
    setBusy(target.id); setError('');
    try {
      await apiRequest(`/api/admin/messages/${target.id}`, { method: 'DELETE' });
      setMessages(items => items.filter(item => item.id !== target.id)); setTarget(undefined);
      setNotice('Đã xóa thông điệp khỏi hệ thống.'); notifyPublic();
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể xóa thông điệp'); }
    finally { setBusy(undefined); }
  }
  const visible = messages.filter(item => (filter === 'ALL' || item.status === filter) && item.text.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
  return <section className="message-management">
    <div className="admin-page-head"><div><h1>Quản lý thông điệp</h1><p>Ẩn nội dung không phù hợp để bảo vệ không gian chia sẻ của cộng đồng.</p></div></div>
    <div className="message-admin-summary">
      <article><span>Tổng thông điệp</span><strong>{messages.length}</strong></article>
      <article><span>Đang hiển thị</span><strong>{messages.filter(m => m.status === 'VISIBLE').length}</strong></article>
      <article><span>Đã ẩn</span><strong>{messages.filter(m => m.status === 'HIDDEN').length}</strong></article>
    </div>
    <div className="message-admin-tools">
      <input aria-label="Tìm thông điệp" placeholder="Tìm theo nội dung thông điệp…" value={query} onChange={e => setQuery(e.target.value)} />
      <select aria-label="Lọc trạng thái" value={filter} onChange={e => setFilter(e.target.value)}><option value="ALL">Tất cả trạng thái</option><option value="VISIBLE">Đang hiển thị</option><option value="HIDDEN">Đã ẩn</option></select>
      <button onClick={load} disabled={loading || !!busy}>Làm mới</button>
    </div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    {notice && <p className="message-admin-notice" role="status">{notice}</p>}
    {loading ? <p role="status">Đang tải thông điệp…</p> : <div className="message-admin-list">
      {visible.map(message => <article key={message.id}>
        <header><span className={`message-status ${message.status.toLowerCase()}`}>{message.status === 'VISIBLE' ? 'Đang hiển thị' : 'Đã ẩn'}</span><time>{new Date(message.createdAt).toLocaleString('vi-VN')}</time></header>
        <p>{message.text}</p>
        <footer><button disabled={!!busy} onClick={() => moderate(message)}><span className="material-symbols-outlined">{message.status === 'VISIBLE' ? 'visibility_off' : 'visibility'}</span>{message.status === 'VISIBLE' ? 'Ẩn thông điệp' : 'Hiện lại'}</button><button className="message-delete" disabled={!!busy} onClick={() => { setError(''); setTarget(message); }}><span className="material-symbols-outlined">delete</span>Xóa</button></footer>
      </article>)}
      {!visible.length && <div className="customer-empty">Không có thông điệp phù hợp.</div>}
    </div>}
    {target && <div className="admin-modal-backdrop"><section className="admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-message-title">
      <div className="admin-delete-copy"><h2 id="delete-message-title">Xóa thông điệp này?</h2><p>Thao tác này không thể hoàn tác. Bạn có thể chọn ẩn nếu muốn giữ lại nội dung để xem xét.</p><blockquote>{target.text}</blockquote></div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <footer><button autoFocus disabled={!!busy} onClick={() => setTarget(undefined)}>Hủy</button><button className="danger" disabled={!!busy} onClick={remove}>{busy ? 'Đang xóa…' : 'Xóa thông điệp'}</button></footer>
    </section></div>}
  </section>;
}
