import React, { useState } from 'react';
import { CartItem, ScreenType } from '../types';
import { FORMAT_CURRENCY } from '../data/mockData';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  // Add-on options
  const [giftWrap, setGiftWrap] = useState<boolean>(true);
  const [handwrittenCard, setHandwrittenCard] = useState<boolean>(true);
  const [artisanNote, setArtisanNote] = useState<string>('Xin nhờ xưởng cắt sẵn dây dù dài 1.5m và kiểm tra sáp ong cẩn thận giúp mình nhé.');

  // Coupon
  const [couponCode, setCouponCode] = useState<string>('NHAMINHXANH');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState<number>(0.1); // 10% default
  const [couponMessage, setCouponMessage] = useState<string>('Mã NHAMINHXANH: Đã áp dụng giảm 10% tri ân khách hàng sống xanh');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cod' | 'momo'>('vietqr');

  // Order success modal state
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState<boolean>(false);
  const [orderCode, setOrderCode] = useState<string>('');

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const giftWrapFee = giftWrap ? 15000 : 0;
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const discountAmount = Math.round(subtotal * appliedDiscountRate);
  const grandTotal = Math.max(0, subtotal + giftWrapFee + shippingFee - discountAmount);

  // Total recycled waste estimate in kg
  const totalRecycledWasteKg = (
    cartItems.reduce((sum, item) => {
      const match = item.recycledWasteAmount.match(/(\d+)/);
      const grams = match ? parseInt(match[0], 10) : 350;
      return sum + grams * item.quantity;
    }, 0) / 1000
  ).toFixed(1);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NHAMINHXANH') {
      setAppliedDiscountRate(0.1);
      setCouponMessage('Mã NHAMINHXANH: Giảm 10% thành công!');
    } else if (code === 'TAISINH15') {
      setAppliedDiscountRate(0.15);
      setCouponMessage('Mã TAISINH15: Giảm 15% cho tín đồ tái chế!');
    } else if (code === 'FREESHIP') {
      setAppliedDiscountRate(0.05);
      setCouponMessage('Mã FREESHIP: Hỗ trợ vận chuyển xanh!');
    } else {
      setAppliedDiscountRate(0);
      setCouponMessage('Mã ưu đãi không hợp lệ. Thử: NHAMINHXANH hoặc TAISINH15');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    onNavigate('checkout');
  };

  return (
    <div className="cart-screen" id="cart-screen-root">
      <div className="container">
        {/* Checkout Steps Indicator */}
        <div className="checkout-steps-bar" id="checkout-steps-indicator">
          <div className="checkout-step active">
            <div className="step-circle">1</div>
            <span>Giỏ Hàng Của Bạn</span>
          </div>
          <div className="step-divider-line" />
          <div className="checkout-step">
            <div className="step-circle">2</div>
            <span>Giao Hàng & Thanh Toán</span>
          </div>
          <div className="step-divider-line" />
          <div className="checkout-step">
            <div className="step-circle">3</div>
            <span>Hoàn Tất Đơn Hàng</span>
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4.5rem 2rem',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            marginBottom: '3rem'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', color: 'var(--color-text-subtle)', marginBottom: '1rem' }}>
              production_quantity_limits
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              Giỏ hàng của bạn đang trống
            </h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              Hãy khám phá các tác phẩm decor tái chế thủ công hoặc tải bản rập DIY miễn phí từ Nhà Mình.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>
                Khám Phá Đồ Decor Ngay
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('diy')}>
                Xem Cẩm Nang Tự Làm
              </button>
            </div>
          </div>
        )}

        {/* Main Cart Layout (Items + Summary) */}
        {cartItems.length > 0 && (
          <div className="cart-layout">
            {/* Left Column: Items List */}
            <div className="cart-items-container" id="cart-items-panel">
              <div className="cart-box-header">
                <h2>Danh Sách Tác Phẩm Đã Chọn ({cartItems.length})</h2>
                <button className="clear-cart-btn" onClick={onClearCart} id="btn-clear-cart">
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete_sweep</span>
                  Làm rỗng giỏ
                </button>
              </div>

              {/* Items List */}
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="cart-item-row" id={`cart-item-${item.cartItemId}`}>
                    <img src={item.image} alt={item.name} className="cart-item-img" />

                    <div className="cart-item-details">
                      <h4 onClick={() => onNavigate('detail')}>{item.name}</h4>
                      <div className="cart-item-variants-tags">
                        <span className="variant-tag">{item.size}</span>
                        <span className="variant-tag">{item.waxTone}</span>
                        <span className="variant-tag">{item.fitting}</span>
                      </div>
                      <div className="cart-item-eco-note">
                        <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>recycling</span>
                        <span>Tái sinh {item.recycledWasteAmount} bìa carton</span>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="quantity-stepper">
                      <button
                        className="stepper-btn"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        title="Giảm"
                      >
                        -
                      </button>
                      <span className="stepper-value">{item.quantity}</span>
                      <button
                        className="stepper-btn"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        title="Tăng"
                      >
                        +
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="cart-item-price-unit">
                        {FORMAT_CURRENCY(item.unitPrice * item.quantity)}
                      </div>
                      <button
                        className="cart-item-remove-btn"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        title="Xóa món này khỏi giỏ"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eco Packaging Options */}
              <div className="eco-packaging-box" id="cart-eco-packaging-box">
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                  Tùy Chọn Đóng Gói Thủ Công Bền Vững
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <label className="eco-checkbox-label">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                    />
                    <div>
                      <strong>Gói Quà Hộp Mộc Kraft Tái Chế (+15.000₫)</strong>
                      <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
                        Thắt nơ dây cói mộc thiên nhiên, đính kèm cành hoa sao khô & tem niêm phong sáp ong sang trọng.
                      </div>
                    </div>
                  </label>

                  <label className="eco-checkbox-label">
                    <input
                      type="checkbox"
                      checked={handwrittenCard}
                      onChange={(e) => setHandwrittenCard(e.target.checked)}
                    />
                    <div>
                      <strong>Kèm Thiệp Giấy Dó Thủ Công Viết Tay (Miễn Phí)</strong>
                      <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
                        Nhà Mình sẽ nắn nót viết thông điệp yêu thương của bạn gửi tặng người thân.
                      </div>
                    </div>
                  </label>
                </div>

                {/* Artisan Note Textarea */}
                <div className="artisan-note-box">
                  <label htmlFor="artisan-order-notes">
                    Lời nhắn nhủ gửi thợ thủ công tại Xưởng Nhà Mình:
                  </label>
                  <textarea
                    id="artisan-order-notes"
                    className="artisan-textarea"
                    placeholder="Ví dụ: Xin xưởng cắt sẵn dây dù dài 1.5m, nội dung thiệp viết tay..."
                    value={artisanNote}
                    onChange={(e) => setArtisanNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <aside className="order-summary-card" id="cart-order-summary-sidebar">
              <h3>Tóm Tắt Đơn Hàng</h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="coupon-input-group">
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="Mã ưu đãi (VD: NHAMINHXANH)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Áp Dụng
                </button>
              </form>

              {couponMessage && (
                <div className="coupon-badge-active">
                  <span>{couponMessage}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check</span>
                </div>
              )}

              {/* Summary Calculations */}
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Tạm tính tác phẩm:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{FORMAT_CURRENCY(subtotal)}</span>
                </div>

                {giftWrap && (
                  <div className="summary-row">
                    <span>Hộp mộc quà tặng:</span>
                    <span>+{FORMAT_CURRENCY(giftWrapFee)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Phí giao hàng an toàn:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong style={{ color: 'var(--color-success)' }}>Miễn phí vận chuyển</strong>
                    ) : (
                      `+${FORMAT_CURRENCY(shippingFee)}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="summary-row" style={{ color: 'var(--color-error)' }}>
                    <span>Ưu đãi sống xanh ({appliedDiscountRate * 100}%):</span>
                    <span>-{FORMAT_CURRENCY(discountAmount)}</span>
                  </div>
                )}

                <div className="summary-row total-row">
                  <span>Tổng thanh toán:</span>
                  <span className="summary-total-price">{FORMAT_CURRENCY(grandTotal)}</span>
                </div>
              </div>

              {/* Eco Impact Box */}
              <div className="order-eco-impact-box" id="cart-eco-impact-badge">
                <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', flexShrink: 0 }}>forest</span>
                <div>
                  <strong>Tác động môi trường đơn hàng:</strong>
                  <div>Giúp tái sinh ~{totalRecycledWasteKg} kg bìa carton thô & đóng góp 01 mầm cây cho rừng phòng hộ.</div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="payment-selector" id="payment-methods-selector">
                <div className="payment-selector-title">Phương Thức Thanh Toán:</div>
                <div className="payment-methods-grid">
                  <label
                    className={`payment-method-card ${paymentMethod === 'vietqr' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('vietqr')}
                  >
                    <input
                      type="radio"
                      name="paymentMethodRadio"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                    />
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>qr_code_2</span>
                    <span>Chuyển khoản VietQR tức thì (Khuyên dùng)</span>
                  </label>

                  <label
                    className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input
                      type="radio"
                      name="paymentMethodRadio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="material-symbols-outlined">local_shipping</span>
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>

                  <label
                    className={`payment-method-card ${paymentMethod === 'momo' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('momo')}
                  >
                    <input
                      type="radio"
                      name="paymentMethodRadio"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                    />
                    <span className="material-symbols-outlined" style={{ color: '#a50064' }}>account_balance_wallet</span>
                    <span>Ví MoMo / ZaloPay</span>
                  </label>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={handleCheckout}
                id="btn-proceed-checkout"
              >
                <span className="material-symbols-outlined">lock</span>
                <span>Tiếp Tục Đặt Hàng</span>
              </button>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'center', marginTop: '0.75rem' }}>
                Cam kết 100% đổi mới nếu có trầy xước trong quá trình vận chuyển
              </div>
            </aside>
          </div>
        )}

      </div>

      {/* Order Success Confirmation Modal */}
      {showOrderSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowOrderSuccessModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--color-primary)' }}>Đặt Hàng Thành Công!</h3>
              <button className="modal-close-btn" onClick={() => setShowOrderSuccessModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--color-secondary-light)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-secondary)',
                margin: '0 auto 1.25rem auto'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>check</span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.4rem' }}>
                Cảm Ơn Bạn Đã Ủng Hộ Tác Phẩm Tái Sinh!
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Mã đơn hàng: <strong style={{ color: 'var(--color-primary)' }}>{orderCode}</strong>.
                Nhà Mình sẽ bắt đầu đóng gói và liên hệ xác nhận trong vòng 30 phút.
              </p>

              {paymentMethod === 'vietqr' && (
                <div style={{ background: 'var(--color-surface-soft)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                    Quét Mã VietQR Chuyển Khoản Tức Thì:
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=VietQR_NhaMinh_${orderCode}_${grandTotal}`}
                    alt="VietQR Code"
                    style={{ margin: '0 auto', borderRadius: '8px', border: '1px solid var(--color-border)', width: '160px', height: '160px' }}
                  />
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <div>Ngân hàng: <strong>Techcombank (TCB)</strong></div>
                    <div>Số tài khoản: <strong>1903 884 124 999</strong></div>
                    <div>Chủ tài khoản: <strong>XƯỞNG MỘC NHÀ MÌNH ATELIER</strong></div>
                    <div>Số tiền: <strong style={{ color: 'var(--color-primary)' }}>{FORMAT_CURRENCY(grandTotal)}</strong></div>
                  </div>
                </div>
              )}

              <div style={{ background: '#f0f7f1', padding: '0.85rem', borderRadius: '8px', fontSize: '0.825rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
                🌱 Một mầm cây xanh đã được ghi nhận trồng dưới tên của bạn trong dự án phục hồi rừng ngập mặn Cần Giờ 2025!
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowOrderSuccessModal(false);
                    onClearCart();
                    onNavigate('catalog');
                  }}
                >
                  Tiếp Tục Xem Đồ Decor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
