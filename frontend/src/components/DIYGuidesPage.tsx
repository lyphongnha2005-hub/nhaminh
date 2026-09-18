import React, { useState } from 'react';
import { DIYGuide, ScreenType } from '../types';
import { DIY_GUIDES } from '../data/mockData';

interface DIYGuidesPageProps {
  onNavigate: (screen: ScreenType) => void;
  onDownloadTemplate: (fileName: string) => void;
}

export const DIYGuidesPage: React.FC<DIYGuidesPageProps> = ({
  onNavigate,
  onDownloadTemplate,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeGuideForModal, setActiveGuideForModal] = useState<DIYGuide | null>(null);

  // Community form state
  const [communityAuthor, setCommunityAuthor] = useState('');
  const [communityProjectName, setCommunityProjectName] = useState('');
  const [communityMaterial, setCommunityMaterial] = useState('');
  const [communityNote, setCommunityNote] = useState('');
  const [communitySuccessMsg, setCommunitySuccessMsg] = useState(false);

  const filteredGuides = DIY_GUIDES.filter((guide) => {
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const match =
        guide.title.toLowerCase().includes(q) ||
        guide.summary.toLowerCase().includes(q) ||
        guide.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedDifficulty !== 'all' && guide.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const featuredGuide = DIY_GUIDES[0];

  const handleCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityAuthor || !communityProjectName) return;
    setCommunitySuccessMsg(true);
    setCommunityAuthor('');
    setCommunityProjectName('');
    setCommunityMaterial('');
    setCommunityNote('');
    setTimeout(() => setCommunitySuccessMsg(false), 5000);
  };

  return (
    <div className="diy-guides-screen" id="diy-guides-screen-root">
      {/* Hero Banner with Community Stats */}
      <div className="container">
        <section className="diy-hero-banner" id="diy-hero-banner">
          <div className="diy-hero-tag">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>architecture</span>
            Lan Tỏa Lối Sống Tái Sinh
          </div>
          <h2>Cẩm Nang Tự Làm & Kho Rập Miễn Phí</h2>
          <p>
            Tận dụng những chiếc thùng carton mua sắm online để tự tay tạo nên các tác phẩm decor độc bản, ấm cúng và chịu lực bền bỉ cho góc nhà của bạn.
          </p>

          <div className="diy-metrics-ribbon" id="diy-metrics-ribbon">
            <div className="diy-metric-item">
              <strong>42+</strong>
              <span>Bản rập chuẩn tỉ lệ 1:1</span>
            </div>
            <div className="diy-metric-item">
              <strong>100%</strong>
              <span>Nguyên liệu bìa tái sinh</span>
            </div>
            <div className="diy-metric-item">
              <strong>18.5k+</strong>
              <span>Lượt tải cẩm nang</span>
            </div>
            <div className="diy-metric-item">
              <strong>0đ</strong>
              <span>Mở hoàn toàn cho cộng đồng</span>
            </div>
          </div>
        </section>

        {/* Search & Difficulty Filter Bar */}
        <div className="diy-filter-bar" id="diy-filter-controls">
          <div className="search-bar-wrapper" style={{ maxWidth: '360px' }}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm dự án tự làm..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div className="diy-difficulty-chips" id="diy-difficulty-chips">
            <button
              className={`difficulty-chip ${selectedDifficulty === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('all')}
            >
              Tất Cả Cấp Độ
            </button>
            <button
              className={`difficulty-chip ${selectedDifficulty === 'Dễ làm (< 30p)' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('Dễ làm (< 30p)')}
            >
              Dễ Làm (&lt; 30 phút)
            </button>
            <button
              className={`difficulty-chip ${selectedDifficulty === 'Trung bình (1-2h)' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('Trung bình (1-2h)')}
            >
              Trung Bình (1-2 giờ)
            </button>
            <button
              className={`difficulty-chip ${selectedDifficulty === 'Nâng cao (> 2h)' ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty('Nâng cao (> 2h)')}
            >
              Nâng Cao (&gt; 2 giờ)
            </button>
          </div>
        </div>

        {/* Featured DIY Showcase */}
        {featuredGuide && selectedDifficulty === 'all' && !searchFilter && (
          <section className="featured-diy-card" id="featured-diy-showcase">
            <div className="featured-diy-img-wrap">
              <img src={featuredGuide.image} alt={featuredGuide.title} className="featured-diy-img" />
              <div className="featured-diy-badge">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>star</span>
                Dự án được yêu thích nhất tuần
              </div>
            </div>

            <div className="featured-diy-body">
              <div className="featured-diy-meta">
                <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>{featuredGuide.category}</span>
                <span>•</span>
                <span>⏱️ {featuredGuide.estimatedTime}</span>
                <span>•</span>
                <span>📊 {featuredGuide.difficulty}</span>
              </div>

              <h3>{featuredGuide.title}</h3>
              <p className="featured-diy-summary">{featuredGuide.summary}</p>

              {/* Checklist preview */}
              <div className="diy-checklist-preview">
                <h5>Vật liệu cần chuẩn bị:</h5>
                <div className="diy-checklist-items">
                  {featuredGuide.materialsNeeded.slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>
                        check
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="featured-diy-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveGuideForModal(featuredGuide)}
                >
                  <span className="material-symbols-outlined">menu_book</span>
                  Xem Toàn Bộ Các Bước
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => onDownloadTemplate(featuredGuide.templateFileName)}
                >
                  <span className="material-symbols-outlined">download</span>
                  Tải Bản Rập PDF
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Grid of DIY Tutorials */}
        <section style={{ marginBottom: '4rem' }} id="diy-tutorials-list">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700 }}>
              Kho Hướng Dẫn Tự Làm ({filteredGuides.length})
            </h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Bản vẽ tỉ lệ chuẩn 1:1, phù hợp máy in A4 / A3
            </span>
          </div>

          <div className="diy-grid">
            {filteredGuides.map((guide) => (
              <article key={guide.id} className="diy-card" id={`diy-card-${guide.id}`}>
                <div className="diy-card-img-wrap" onClick={() => setActiveGuideForModal(guide)} style={{ cursor: 'pointer' }}>
                  <img src={guide.image} alt={guide.title} className="diy-card-img" />
                  <span className="diy-difficulty-badge">{guide.difficulty}</span>
                </div>

                <div className="diy-card-body">
                  <span className="diy-card-category">{guide.category}</span>
                  <h4 className="diy-card-title" onClick={() => setActiveGuideForModal(guide)}>
                    {guide.title}
                  </h4>
                  <p className="diy-card-summary">{guide.summary}</p>

                  <div className="diy-card-footer">
                    <span>⏱️ {guide.estimatedTime}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveGuideForModal(guide)}
                      >
                        Chi tiết
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onDownloadTemplate(guide.templateFileName)}
                        title="Tải rập PDF"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Download Template Library Section */}
        <section className="template-library-section" id="diy-template-library">
          <div className="template-library-header">
            <h3>Thư Viện File Rập Cắt Sẵn (PDF Miễn Phí)</h3>
            <p>
              Tải về, in ra giấy A4 hoặc A3 và dán lên bìa carton để cắt theo những đường chuẩn xác nhất.
            </p>
          </div>

          <div className="template-download-list">
            <div className="template-item-card">
              <div className="template-item-info">
                <div className="pdf-icon-box">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="template-item-text">
                  <h4>Rap_KeSachMini_NhaMinh.pdf</h4>
                  <span>Dung lượng: 2.4 MB • Khổ in: A3 hoặc ghép 2 tờ A4</span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDownloadTemplate('Rap_KeSachMini_NhaMinh.pdf')}
              >
                <span className="material-symbols-outlined">download</span>
                Tải Về
              </button>
            </div>

            <div className="template-item-card">
              <div className="template-item-info">
                <div className="pdf-icon-box">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="template-item-text">
                  <h4>Rap_ChaoDen_KimCuong_NhaMinh.pdf</h4>
                  <span>Dung lượng: 3.1 MB • Khổ in: 50x70cm hoặc A3</span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDownloadTemplate('Rap_ChaoDen_KimCuong_NhaMinh.pdf')}
              >
                <span className="material-symbols-outlined">download</span>
                Tải Về
              </button>
            </div>

            <div className="template-item-card">
              <div className="template-item-info">
                <div className="pdf-icon-box">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="template-item-text">
                  <h4>HuongDan_GomGiay_WabiSabi.pdf</h4>
                  <span>Dung lượng: 5.2 MB • Ebook cẩm nang minh họa 12 trang</span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDownloadTemplate('HuongDan_GomGiay_WabiSabi.pdf')}
              >
                <span className="material-symbols-outlined">download</span>
                Tải Về
              </button>
            </div>

            <div className="template-item-card">
              <div className="template-item-info">
                <div className="pdf-icon-box">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="template-item-text">
                  <h4>Rap_KhayBut_Nordic.pdf</h4>
                  <span>Dung lượng: 1.8 MB • Khổ in: A4 chuẩn tỉ lệ</span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDownloadTemplate('Rap_KhayBut_Nordic.pdf')}
              >
                <span className="material-symbols-outlined">download</span>
                Tải Về
              </button>
            </div>
          </div>
        </section>

        {/* Community Submission Form */}
        <section className="diy-community-section" id="diy-community-showcase">
          <div className="community-section-grid">
            <div className="community-info">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined">diversity_3</span>
                Góc Cộng Đồng Nhà Mình
              </div>
              <h3>Đã Tự Tay Làm Được Một Món Đồ? Chia Sẻ Cùng Nhà Mình Nhé!</h3>
              <p>
                Gửi câu chuyện và hình ảnh thành phẩm của bạn để truyền cảm hứng cho hàng ngàn người khác cùng biến rác thải carton thành niềm vui sáng tạo mỗi ngày.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <div>✨ Bài chia sẻ xuất sắc sẽ nhận 01 phần quà sáp ong tự nhiên & voucher 100k</div>
                <div>🌱 Được đăng tải trong bản tin Sống Xanh Bền Vững hàng tháng</div>
              </div>
            </div>

            <div className="community-form">
              {communitySuccessMsg ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                    task_alt
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    Cảm Ơn Bạn Rất Nhiều!
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Nhà Mình đã nhận được chia sẻ của bạn và sẽ duyệt đăng trong thời gian sớm nhất.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCommunitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Họ tên hoặc Biệt danh của bạn *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="VD: Thu Hằng (Hà Nội)"
                      value={communityAuthor}
                      onChange={(e) => setCommunityAuthor(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tên món đồ bạn vừa tự làm *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="VD: Kệ để son & mỹ phẩm từ hộp bánh mì"
                      value={communityProjectName}
                      onChange={(e) => setCommunityProjectName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Loại phế liệu đã tận dụng</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="VD: 3 thùng carton hàng Tiki + vỏ trấu ngâm"
                      value={communityMaterial}
                      onChange={(e) => setCommunityMaterial(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mẹo hay hoặc cảm nghĩ của bạn</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Chia sẻ kinh nghiệm rạch ngấn giấy, phơi keo..."
                      value={communityNote}
                      onChange={(e) => setCommunityNote(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <span className="material-symbols-outlined">send</span>
                    Gửi Tác Phẩm Của Bạn
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Step-by-Step DIY Modal */}
      {activeGuideForModal && (
        <div className="modal-overlay" onClick={() => setActiveGuideForModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{activeGuideForModal.title}</h3>
              <button className="modal-close-btn" onClick={() => setActiveGuideForModal(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <span>⏱️ {activeGuideForModal.estimatedTime}</span>
                <span>•</span>
                <span>📊 {activeGuideForModal.difficulty}</span>
                <span>•</span>
                <span>📥 {activeGuideForModal.downloadCount} lượt tải</span>
              </div>

              {/* Materials checklist */}
              <div style={{ background: 'var(--color-surface-soft)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Dụng cụ & Vật liệu cần có:</h5>
                <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.825rem' }}>
                  {activeGuideForModal.materialsNeeded.map((m, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>check_circle</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {activeGuideForModal.steps.map((step) => (
                  <div key={step.stepNumber} className="diy-modal-step-card">
                    <div className="diy-step-number-badge">{step.stepNumber}</div>
                    <div className="diy-step-content" style={{ flex: 1 }}>
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                      {step.tip && (
                        <div className="diy-step-tip">
                          <strong>💡 Mẹo thợ xưởng:</strong> {step.tip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <button className="btn btn-secondary" onClick={() => setActiveGuideForModal(null)}>
                  Đóng
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => onDownloadTemplate(activeGuideForModal.templateFileName)}
                >
                  <span className="material-symbols-outlined">download</span>
                  Tải Bản Rập PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
