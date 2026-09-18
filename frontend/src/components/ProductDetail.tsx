import React, { useState } from 'react';
import { Product, ScreenType, CartItem } from '../types';
import { REVIEWS, FORMAT_CURRENCY } from '../data/mockData';

interface ProductDetailProps {
  product: Product;
  onAddToCartWithOptions: (item: Omit<CartItem, 'cartItemId'>) => void;
  onBuyNow: (item: Omit<CartItem, 'cartItemId'>) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onNavigate: (screen: ScreenType) => void;
  onSelectRelatedProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onAddToCartWithOptions,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onNavigate,
  onSelectRelatedProduct,
  allProducts,
}) => {
  // Configurator states
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSizeId, setSelectedSizeId] = useState<string>(product.sizes[1]?.id || product.sizes[0]?.id || 'm');
  const [selectedWaxId, setSelectedWaxId] = useState<string>(product.waxTones[0]?.id || 'kraft');
  const [selectedFittingId, setSelectedFittingId] = useState<string>(product.fittingOptions[0]?.id || 'oak-cord');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'care' | 'reviews'>('story');

  // Review form states
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Calculate dynamic price
  const activeSize = product.sizes.find((s) => s.id === selectedSizeId) || product.sizes[0];
  const activeFitting = product.fittingOptions.find((f) => f.id === selectedFittingId) || product.fittingOptions[0];
  const activeWax = product.waxTones.find((w) => w.id === selectedWaxId) || product.waxTones[0];

  const currentBasePrice = activeSize ? activeSize.price : product.price;
  const currentFittingPrice = activeFitting ? activeFitting.priceDelta : 0;
  const totalUnitPrice = currentBasePrice + currentFittingPrice;
  const originalTotalPrice = product.originalPrice ? product.originalPrice + currentFittingPrice : undefined;

  const handleAddCart = () => {
    onAddToCartWithOptions({
      productId: product.id,
      name: product.name,
      image: product.images[selectedImageIndex] || product.images[0],
      size: `${activeSize?.label} (${activeSize?.dimensions})`,
      waxTone: activeWax?.label || 'Kraft Mộc',
      fitting: activeFitting?.label || 'Dây tiêu chuẩn',
      unitPrice: totalUnitPrice,
      quantity,
      recycledWasteAmount: product.specs.recycledWasteAmount,
    });
  };

  const handleBuyNowClick = () => {
    onBuyNow({
      productId: product.id,
      name: product.name,
      image: product.images[selectedImageIndex] || product.images[0],
      size: `${activeSize?.label} (${activeSize?.dimensions})`,
      waxTone: activeWax?.label || 'Kraft Mộc',
      fitting: activeFitting?.label || 'Dây tiêu chuẩn',
      unitPrice: totalUnitPrice,
      quantity,
      recycledWasteAmount: product.specs.recycledWasteAmount,
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: newReviewRating,
      date: 'Hôm nay',
      comment: newReviewText.trim(),
      verifiedBuyer: true,
      helpfulCount: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  // Related products
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="product-detail-screen" id="product-detail-screen">
      {/* Breadcrumbs */}
      <div className="container">
        <nav className="breadcrumbs-bar" aria-label="breadcrumbs" id="detail-breadcrumbs">
          <a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>Trang Chủ</a>
          <span className="breadcrumbs-separator">/</span>
          <a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>Đồ Decor Tái Chế</a>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">{product.name}</span>
        </nav>

        {/* 2-Column Detail Layout */}
        <div className="detail-grid">
          {/* Column 1: Gallery */}
          <div className="detail-gallery" id="product-detail-gallery">
            <div className="gallery-main-view">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="gallery-main-img"
              />

              <div className="gallery-badges-overlay">
                <span className="product-badge eco-badge">100% Bìa Carton Tái Chế</span>
                <span className="product-badge">Thủ Công Độc Bản</span>
              </div>

              <div className="craft-stamp">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>verified_user</span>
                <span>Xưởng Nhà Mình Atelier • 2025</span>
              </div>
            </div>

            {/* Thumbnail previews */}
            <div className="gallery-thumbnails-strip" id="gallery-thumbnail-strip">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`thumbnail-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  title={`Xem hình ${idx + 1}`}
                >
                  <img src={imgUrl} alt={`${product.name} góc ${idx + 1}`} className="thumbnail-img" />
                </button>
              ))}
            </div>

            {/* Eco impact microcard */}
            <div className="eco-impact-microcard" id="detail-eco-impact-box">
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>forest</span>
              <div>
                <strong>{product.specs.recycledWasteAmount}</strong>
                <span>Tái sinh từ phế liệu thô • Chứng nhận keo hữu cơ không độc hại</span>
              </div>
            </div>
          </div>

          {/* Column 2: Info & Configurator */}
          <div className="detail-info" id="product-detail-configurator">
            <div className="detail-header-block">
              <h1>{product.name}</h1>
              <div className="detail-rating-row">
                <span className="detail-sku-stock">
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check_circle</span>
                  Còn hàng tại xưởng (Sẵn sàng gửi trong 24h)
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="detail-price-box">
              <span className="detail-price-main">{FORMAT_CURRENCY(totalUnitPrice)}</span>
              {originalTotalPrice && (
                <span className="detail-price-original">{FORMAT_CURRENCY(originalTotalPrice)}</span>
              )}
              {originalTotalPrice && (
                <span className="detail-discount-pill">
                  Tiết kiệm {FORMAT_CURRENCY(originalTotalPrice - totalUnitPrice)}
                </span>
              )}
            </div>

            <p className="detail-short-desc">{product.shortDesc}</p>

            {/* Configurator Option 1: Size selection */}
            <div className="option-group" id="configurator-size-selector">
              <div className="option-label-row">
                <span className="option-label-title">1. Chọn Kích Thước:</span>
                <span className="option-selected-name">{activeSize?.label} - {activeSize?.dimensions}</span>
              </div>
              <div className="size-chips-list">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    className={`size-chip-btn ${selectedSizeId === s.id ? 'active' : ''}`}
                    onClick={() => setSelectedSizeId(s.id)}
                  >
                    <span className="size-chip-label">{s.label}</span>
                    <span className="size-chip-sub">{s.dimensions}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configurator Option 2: Wax tone finish */}
            <div className="option-group" id="configurator-wax-selector">
              <div className="option-label-row">
                <span className="option-label-title">2. Tông Sáp Hoàn Thiện:</span>
                <span className="option-selected-name">{activeWax?.label}</span>
              </div>
              <div className="wax-tones-list">
                {product.waxTones.map((w) => (
                  <button
                    key={w.id}
                    className={`wax-tone-btn ${selectedWaxId === w.id ? 'active' : ''}`}
                    onClick={() => setSelectedWaxId(w.id)}
                  >
                    <span className="wax-swatch" style={{ backgroundColor: w.hex }} />
                    <span>{w.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configurator Option 3: Fitting & Cord options */}
            <div className="option-group" id="configurator-fitting-selector">
              <div className="option-label-row">
                <span className="option-label-title">3. Bộ Đui Đèn & Dây Treo:</span>
                <span className="option-selected-name">{activeFitting?.label}</span>
              </div>
              <div className="fitting-options-list">
                {product.fittingOptions.map((f) => (
                  <label
                    key={f.id}
                    className={`fitting-radio-card ${selectedFittingId === f.id ? 'active' : ''}`}
                    onClick={() => setSelectedFittingId(f.id)}
                  >
                    <div className="fitting-radio-left">
                      <input
                        type="radio"
                        name="fittingOption"
                        checked={selectedFittingId === f.id}
                        onChange={() => setSelectedFittingId(f.id)}
                      />
                      <span>{f.label}</span>
                    </div>
                    {f.priceDelta > 0 && (
                      <span className="fitting-price-delta">+{FORMAT_CURRENCY(f.priceDelta)}</span>
                    )}
                    {f.priceDelta === 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Mặc định</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="detail-actions-row">
              {/* Stepper */}
              <div className="quantity-stepper" id="detail-quantity-stepper">
                <button
                  className="stepper-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  title="Giảm số lượng"
                >
                  -
                </button>
                <span className="stepper-value">{quantity}</span>
                <button
                  className="stepper-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  title="Tăng số lượng"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                className="btn btn-primary btn-add-cart"
                onClick={handleAddCart}
                id="btn-detail-add-cart"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              {/* Buy now */}
              <button
                className="btn btn-secondary btn-buy-now"
                onClick={handleBuyNowClick}
                id="btn-detail-buy-now"
              >
                <span>Mua Ngay</span>
              </button>

              {/* Wishlist */}
              <button
                className={`btn-wishlist-large ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product)}
                title={isWishlisted ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                id="btn-detail-wishlist"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Guarantee badges */}
            <div className="detail-guarantees" id="detail-guarantees-bar">
              <div className="guarantee-item">
                <span className="material-symbols-outlined">package_2</span>
                <div>
                  <strong>Hộp Mộc Kraft</strong>
                  <div>100% không xốp nhựa</div>
                </div>
              </div>

              <div className="guarantee-item">
                <span className="material-symbols-outlined">verified</span>
                <div>
                  <strong>Bảo Hành 12 Tháng</strong>
                  <div>Hỗ trợ đổi trả kết cấu</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Interactive Tabs Section */}
        <section className="detail-tabs-section" id="detail-tabs-container">
          <div className="tabs-nav">
            <button
              className={`tab-nav-btn ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => setActiveTab('story')}
              id="tab-btn-story"
            >
              Câu Chuyện Tái Sinh & Thiết Kế
            </button>
            <button
              className={`tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
              id="tab-btn-specs"
            >
              Thông Số Kỹ Thuật & Chất Liệu
            </button>
            <button
              className={`tab-nav-btn ${activeTab === 'care' ? 'active' : ''}`}
              onClick={() => setActiveTab('care')}
              id="tab-btn-care"
            >
              Cẩm Nang Giữ Đèn Bền Trên 5 Năm
            </button>
            <button
              className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              id="tab-btn-reviews"
            >
              Đánh Giá & Không Gian Thực Tế ({reviewsList.length})
            </button>
          </div>

          <div className="tab-panel-content">
            {/* Tab 1: Story */}
            {activeTab === 'story' && (
              <div id="tab-panel-story">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                  Hành Trình Tái Sinh Từng Lớp Sóng Giấy
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {product.story}
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-surface-soft)', borderRadius: '8px', borderLeft: '3px solid var(--color-kraft)' }}>
                      <em>"Chúng mình tin rằng vật liệu không có hồi kết. Bìa carton sau khi hoàn thành sứ mệnh vận chuyển hoàn toàn có thể trở thành tâm điểm ấm áp của không gian sống."</em>
                      <div style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                        — Đội ngũ Thợ Thủ Công Nhà Mình Atelier
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
                      alt="Thợ thủ công tại Nhà Mình Atelier"
                      style={{ borderRadius: 'var(--radius-md)', width: '100%', objectFit: 'cover', height: '280px' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'center', marginTop: '0.5rem' }}>
                      Công đoạn cắt vát ngàm 30 độ và miết sáp ong thủ công tại xưởng
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Specs */}
            {activeTab === 'specs' && (
              <div id="tab-panel-specs">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
                  Bảng Thông Số Kỹ Thuật Độc Bản
                </h3>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td>Chất Liệu Chính</td>
                      <td>{product.specs.material}</td>
                    </tr>
                    <tr>
                      <td>Kích Thước Khung</td>
                      <td>{product.specs.dimensions}</td>
                    </tr>
                    <tr>
                      <td>Trọng Lượng Thực Tế</td>
                      <td>{product.specs.weight}</td>
                    </tr>
                    <tr>
                      <td>Lượng Rác Tái Sinh</td>
                      <td>{product.specs.recycledWasteAmount}</td>
                    </tr>
                    <tr>
                      <td>Xử Lý Bề Mặt</td>
                      <td>{product.specs.finish}</td>
                    </tr>
                    <tr>
                      <td>Xuất Xứ Chế Tác</td>
                      <td>{product.specs.origin}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Care Guide */}
            {activeTab === 'care' && (
              <div id="tab-panel-care">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>
                  Hướng Dẫn Bảo Quản & Vệ Sinh Đúng Cách
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Được phủ lớp sáp ong vi sinh tự nhiên, sản phẩm giấy tái sinh Nhà Mình có độ bền trên 5 năm nếu được chăm sóc theo những nguyên tắc đơn giản sau:
                </p>
                <div className="care-guide-list">
                  {product.careGuide.map((guide, idx) => (
                    <div key={idx} className="care-item">
                      <span className="material-symbols-outlined">verified</span>
                      <span>{guide}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === 'reviews' && (
              <div id="tab-panel-reviews">
                <div className="reviews-summary-row">
                  <div className="rating-big-score">
                    <span className="big-number">{product.rating}</span>
                    <div>
                      <div style={{ display: 'flex', color: 'var(--color-accent-amber)', fontSize: '1.25rem' }}>
                        {'★★★★★'}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Dựa trên {reviewsList.length} đánh giá đã xác thực đơn hàng
                      </span>
                    </div>
                  </div>

                  <a href="#review-form-anchor" className="btn btn-outline btn-sm">
                    <span className="material-symbols-outlined">rate_review</span>
                    Viết Đánh Giá Của Bạn
                  </a>
                </div>

                {/* Reviews List */}
                <div className="reviews-list">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="review-item">
                      <div className="review-header">
                        <div className="review-author-info">
                          <img src={rev.avatar} alt={rev.author} className="review-avatar" />
                          <div>
                            <div className="review-author-name">{rev.author}</div>
                            {rev.verifiedBuyer && (
                              <span className="verified-badge">
                                <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>check_circle</span>
                                Đã mua hàng
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="review-date">{rev.date}</span>
                      </div>

                      <div style={{ display: 'flex', color: 'var(--color-accent-amber)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>

                      <p className="review-comment">{rev.comment}</p>

                      {rev.roomPhoto && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <img
                            src={rev.roomPhoto}
                            alt="Hình ảnh thực tế không gian"
                            style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                          />
                        </div>
                      )}

                      <button className="review-helpful-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>thumb_up</span>
                        Hữu ích ({rev.helpfulCount})
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <div id="review-form-anchor" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                    Chia Sẻ Cảm Nhận Về Tác Phẩm
                  </h4>
                  {reviewSubmitted ? (
                    <div style={{ padding: '1rem', background: 'var(--color-secondary-light)', color: 'var(--color-secondary)', borderRadius: '8px', fontWeight: 600 }}>
                      Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận và hiển thị ngay trên trang.
                    </div>
                  ) : (
                    <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                          type="text"
                          placeholder="Họ tên của bạn *"
                          className="form-input"
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          required
                        />
                        <select
                          className="form-input"
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        >
                          <option value={5}>5 sao - Xuất sắc tuyệt vời</option>
                          <option value={4}>4 sao - Rất hài lòng</option>
                          <option value={3}>3 sao - Khá tốt</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Cảm nhận của bạn về độ hoàn thiện, mùi sáp ong, ánh sáng, cảm giác khi nhận hộp mộc..."
                        className="form-input"
                        rows={3}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        required
                      />
                      <div>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Gửi Đánh Giá Ngay
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Collection */}
        <section className="related-section" id="detail-related-products">
          <h3 className="related-title">Mảnh Ghép Đồng Điệu - Cùng Bộ Sưu Tập Tái Chế</h3>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <article key={p.id} className="product-card">
                <div className="product-card-image-wrap" onClick={() => onSelectRelatedProduct(p)} style={{ cursor: 'pointer' }}>
                  <img src={p.images[0]} alt={p.name} className="product-card-img" />
                  {p.badge && <span className="product-badge">{p.badge}</span>}
                </div>
                <div className="product-card-body">
                  <div className="product-card-meta">
                    <span className="product-space-tag">{p.roomSpace}</span>
                    <span className="product-rating">★ {p.rating}</span>
                  </div>
                  <h4 className="product-card-title" onClick={() => onSelectRelatedProduct(p)}>
                    {p.name}
                  </h4>
                  <p className="product-card-desc">{p.shortDesc}</p>
                  <div className="product-card-footer">
                    <span className="product-price-current">{FORMAT_CURRENCY(p.price)}</span>
                    <button className="add-cart-mini-btn" onClick={() => onSelectRelatedProduct(p)}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
