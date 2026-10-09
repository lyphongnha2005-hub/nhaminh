import React, { FormEvent, useEffect, useState } from 'react';
import { apiRequest } from '../services/authService';

interface Message {
  id: string;
  text: string;
  createdAt: string;
}

const STORAGE_KEY = 'nhaminh-messages';

const loadMessages = (): Message[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.filter((item): item is Message =>
          typeof item?.id === 'string' &&
          typeof item?.text === 'string' &&
          typeof item?.createdAt === 'string'
        )
      : [];
  } catch {
    return [];
  }
};

export const MessagePage: React.FC = () => {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [localMessages, setLocalMessages] = useState<Message[]>(loadMessages);
  const [localSourceId, setLocalSourceId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (saving) return;
    let active = true;
    let refreshing = false;
    const controller = new AbortController();
    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const items = await apiRequest<Message[]>('/api/messages', { signal: controller.signal });
        if (active) { setMessages(items); setLoadError(''); }
      } catch {
        if (active) { setMessages([]); setLoadError('Không tải được thông điệp. Hệ thống sẽ tự thử lại.'); }
      } finally { refreshing = false; if (active) setLoading(false); }
    };
    void refresh();
    const timer = window.setInterval(refresh, 15000);
    const channel = 'BroadcastChannel' in window ? new BroadcastChannel('nhaminh-messages') : null;
    if (channel) channel.onmessage = () => { void refresh(); };
    window.addEventListener('focus', refresh);
    return () => { active = false; controller.abort(); window.clearInterval(timer); channel?.close(); window.removeEventListener('focus', refresh); };
  }, [saving]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || saving) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const saved = await apiRequest<Message>('/api/messages', { method: 'POST', body: JSON.stringify({ text }) });
      setMessages(items => [saved, ...items.filter(item => item.id !== saved.id)]);
      setDraft('');
      setNotice('Thông điệp đã được lưu và chia sẻ thành công.');
      if (localSourceId) {
        const remaining = loadMessages().filter(item => item.id !== localSourceId);
        setLocalMessages(remaining); setLocalSourceId(undefined);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining)); }
        catch { setNotice('Thông điệp đã lưu trên máy chủ; chưa thể dọn bản cũ trong trình duyệt.'); }
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể gửi thông điệp'); }
    finally { setSaving(false); }
  };

  return (
    <main className="message-page container">
      <div className="message-intro">
        <span className="message-eyebrow">Góc nhỏ Nhà Mình</span>
        <h1>Thông điệp</h1>
        <p>Ghi lại một lời nhắn, một ý tưởng hoặc điều bạn muốn chia sẻ về không gian sống xanh.</p>
      </div>

      <div className="message-layout">
        <section className="message-card" aria-labelledby="message-form-title">
          <div className="message-section-heading">
            <span className="material-symbols-outlined">edit_note</span>
            <h2 id="message-form-title">Viết thông điệp của bạn</h2>
          </div>
          <form onSubmit={handleSave}>
            <label htmlFor="message-text">Nội dung thông điệp</label>
            <textarea
              id="message-text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Hôm nay bạn muốn chia sẻ điều gì?"
              maxLength={500}
              disabled={saving}
              required
            />
            <div className="message-form-footer">
              <span>{draft.length}/500 ký tự</span>
              <button className="btn btn-primary" type="submit" disabled={!draft.trim() || saving}>
                <span className="material-symbols-outlined">save</span>
                {saving ? 'Đang gửi…' : 'Chia sẻ thông điệp'}
              </button>
            </div>
          </form>
          <p className="message-privacy-note">Thông điệp sẽ được chia sẻ công khai. Quản trị viên có thể ẩn hoặc xóa nội dung không phù hợp.</p>
          {error && <p role="alert" className="admin-form-error">{error}</p>}
          {notice && <p role="status" className="message-privacy-note">{notice}</p>}
          {localMessages.length > 0 && <details className="message-local-archive"><summary>Thông điệp cũ trên trình duyệt ({localMessages.length})</summary><p>Chọn bản cũ rồi bấm Chia sẻ thông điệp để chuyển lên máy chủ và cho phép mọi người xem. Bản cũ chỉ được dọn sau khi lưu thành công.</p>{localMessages.map(message => <article className="message-note" key={message.id}><p>{message.text}</p><button type="button" disabled={saving} onClick={() => { setDraft(message.text.slice(0, 500)); setLocalSourceId(message.id); setNotice(''); }}>Đưa vào ô soạn thảo</button></article>)}</details>}
        </section>

        <section className="message-card message-saved" aria-labelledby="message-saved-title">
          <div className="message-section-heading">
            <span className="material-symbols-outlined">auto_stories</span>
            <h2 id="message-saved-title">Thông điệp cộng đồng</h2>
          </div>
          {loadError && <p role="alert" className="admin-form-error">{loadError}</p>}
          {loading ? <p role="status">Đang tải thông điệp…</p> : loadError ? null : messages.length === 0 ? (
            <div className="message-empty">
              <span className="material-symbols-outlined">mail</span>
              <p>Chưa có thông điệp nào. Hãy viết lời nhắn đầu tiên của bạn.</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <article className="message-note" key={message.id}>
                  <p>{message.text}</p>
                  <time dateTime={message.createdAt}>
                    {new Date(message.createdAt).toLocaleString('vi-VN')}
                  </time>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
