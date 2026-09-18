import React, { useState } from 'react';

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (message: string) => void;
}

export const WorkshopModal: React.FC<WorkshopModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [selectedSession, setSelectedSession] = useState('sat-morning');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onRegisterSuccess(`Đã đăng ký thành công cho ${userName}! Xưởng sẽ gửi tin nhắn SMS xác nhận.`);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>handyman</span>
            <h3>Workshop Thủ Công & Trạm Thu Gom Bìa</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
              Trải Nghiệm Tự Tay Làm Đồ Decor Tại Xưởng Nhà Mình
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.55' }}>
              Mỗi cuối tuần, Nhà Mình Atelier mở cửa đón các bạn yêu thích tái chế đến xưởng để học kỹ thuật xếp nếp carton, pha chế hồ gốm giấy và miết sáp ong tự nhiên.
            </p>
          </div>

          {/* Schedule card */}
          <div style={{ background: 'var(--color-surface-soft)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Lịch Workshop Cuối Tuần Này:</strong>
              <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 600 }}>
                Còn 4 chỗ trống
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
              <div>📅 <strong>Thứ Bảy & Chủ Nhật:</strong> 09:00 - 11:30 hoặc 14:30 - 17:00</div>
              <div>📍 <strong>Địa chỉ:</strong> 48 Đường Số 9, P. Linh Tây, TP. Thủ Đức, TP.HCM</div>
              <div>🎁 <strong>Chi phí:</strong> 180.000₫/người (Đã bao gồm toàn bộ bìa tái sinh, sáp ong, đui đèn LED và mang thành phẩm về nhà).</div>
            </div>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                check_circle
              </span>
              <h4>Đăng Ký Thành Công!</h4>
              <p style={{ fontSize: '0.875rem' }}>Hẹn gặp bạn tại xưởng cuối tuần này nhé!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Họ tên của bạn *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại / Zalo *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="09xx xxx xxx"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Chọn khung giờ tham gia</label>
                <select
                  className="form-input"
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                >
                  <option value="sat-morning">Thứ Bảy (09:00 - 11:30) - Làm Chao Đèn Origami</option>
                  <option value="sat-afternoon">Thứ Bảy (14:30 - 17:00) - Làm Kệ Bìa 3 Tầng</option>
                  <option value="sun-morning">Chủ Nhật (09:00 - 11:30) - Tạo Bình Gốm Giấy Wabi Sabi</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Để Sau
                </button>
                <button type="submit" className="btn btn-primary">
                  Xác Nhận Giữ Chỗ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
