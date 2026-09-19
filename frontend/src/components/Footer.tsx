import React from 'react';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer" id="site-main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#2c221b',
                border: '1px solid #b89063',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ebd8c0'
              }}>
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontFamily: 'var(--font-serif)' }}>
                Nhà Mình
              </h2>
            </div>
            <p>
              Nhà Mình là không gian sáng tạo tái sinh bìa các-tông và giấy bỏ đi thành những món đồ decor bền vững, mang vẻ đẹp mộc mạc, tinh tế của chất liệu thủ công truyền thống vào từng góc sống.
            </p>
            <div className="footer-eco-callout">
              <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>forest</span>
              <div>
                <strong>14.280 kg bìa carton đã hồi sinh</strong>
                <div style={{ fontSize: '0.75rem', color: '#a3b89d' }}>Tương đương bảo tồn hơn 2.450 cây xanh & giảm khí thải CO2</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Khám Phá Decor</h4>
            <div className="footer-links">
              <a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>Tất Cả Sản Phẩm</a>
              <a href="#den" onClick={(e) => { e.preventDefault(); onNavigate('detail'); }}>Đèn Thả Geodesic Bìa Carton</a>
              <a href="#ke-sach" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>Kệ Mô-Đun 3 Tầng</a>
              <a href="#lot-ly" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>Set Lót Ly Sợi Giấy Ép</a>
              <a href="#gom-giay" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>Bình Gốm Giấy Wabi Sabi</a>
            </div>
          </div>

          {/* Support Links */}
          <div className="footer-col">
            <h4>Đồng Hành & Hỗ Trợ</h4>
            <div className="footer-links">
              <a href="#returns">Chính sách đổi trả & hoàn tiền</a>
              <a href="#custom-orders">Đặt làm theo yêu cầu / B2B</a>
              <a href="#shipping">Phương thức giao hàng</a>
              <a href="#contact">Liên hệ & Hợp tác</a>
            </div>
          </div>

          {/* Atelier Contact */}
          <div className="footer-col">
            <h4>Cơ sở</h4>
            <div className="footer-links" style={{ color: '#9c9288', fontSize: '0.85rem', lineHeight: '1.6' }}>
              <div><strong>Xưởng & Trưng Bày:</strong> 600 Nguyễn Văn Cừ, thành phố Cần Thơ</div>
              <div><strong>Giờ Mở Cửa:</strong> 08:30 - 18:30 (Thứ 2 - Chủ Nhật)</div>
              <div><strong>Hotline / Zalo:</strong> 08 3769 4079</div>
              <div><strong>Email:</strong></div>
              <div><strong>Fanpage:</strong> Nhà Mình</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2025 Nhà Mình Atelier - Đồ Decor Tái Chế & Cẩm Nang Tự Làm. Tôn vinh vẻ đẹp bền vững.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Chính Sách Bảo Hành 12 Tháng</span>
            <span>Giao Hàng Giảm Nhựa</span>
            <span>Cam Kết Không Rác Thải Xốp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
