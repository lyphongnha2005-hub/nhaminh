import React, { FormEvent, useState } from 'react';

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
  const [messages, setMessages] = useState<Message[]>(loadMessages);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const nextMessages = [
      { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() },
      ...messages,
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMessages));
    setMessages(nextMessages);
    setDraft('');
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
              required
            />
            <div className="message-form-footer">
              <span>{draft.length}/500 ký tự</span>
              <button className="btn btn-primary" type="submit" disabled={!draft.trim()}>
                <span className="material-symbols-outlined">save</span>
                Lưu thông điệp
              </button>
            </div>
          </form>
          <p className="message-privacy-note">Thông điệp được lưu trên trình duyệt của bạn.</p>
        </section>

        <section className="message-card message-saved" aria-labelledby="message-saved-title">
          <div className="message-section-heading">
            <span className="material-symbols-outlined">auto_stories</span>
            <h2 id="message-saved-title">Thông điệp đã viết</h2>
          </div>
          {messages.length === 0 ? (
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
