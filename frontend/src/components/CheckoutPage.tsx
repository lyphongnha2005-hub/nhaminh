import React, { FormEvent, useState } from 'react';
import { CartItem, ScreenType } from '../types';
import { FORMAT_CURRENCY } from '../data/mockData';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigate: (screen: ScreenType) => void;
  onOrderSuccess: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onNavigate, onOrderSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'momo'>('cod');
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOrderSuccess();
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page container">
        <div className="checkout-empty-state">
          <span className="material-symbols-outlined">production_quantity_limits</span>
          <h1>Giỏ hàng đang trống</h1>
          <p>Hãy chọn một tác phẩm trước khi tiến hành mua hàng.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>Xem sản phẩm</button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page container">
      <button className="auth-back-link" onClick={() => onNavigate('cart')}>
        <span className="material-symbols-outlined">arrow_back</span>
        Quay lại giỏ hàng
      </button>
      <div className="checkout-page-heading">
        <span className="material-symbols-outlined">shopping_bag</span>
        <div>
          <h1>Thông tin mua hàng</h1>
          <p>Điền thông tin nhận hàng để hoàn tất đơn của bạn.</p>
        </div>
      </div>

      <form className="checkout-page-grid" onSubmit={handleSubmit}>
        <section className="checkout-form-card">
          <h2>Thông tin giao hàng</h2>
          <label>Họ và tên<input required placeholder="Nhập họ và tên" /></label>
          <label>Số điện thoại<input required type="tel" placeholder="Nhập số điện thoại" /></label>
          <label>Địa chỉ nhận hàng<input required placeholder="Số nhà, đường, phường/xã, tỉnh/thành" /></label>
          <label>Ghi chú đơn hàng<textarea placeholder="Ghi chú thêm cho xưởng (không bắt buộc)" /></label>

          <h2>Phương thức thanh toán</h2>
          <div className="checkout-payment-list">
            <label className={`checkout-payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
              <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <span className="material-symbols-outlined">local_shipping</span>
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className={`checkout-payment-option ${paymentMethod === 'vietqr' ? 'active' : ''}`}>
              <input type="radio" checked={paymentMethod === 'vietqr'} onChange={() => setPaymentMethod('vietqr')} />
              <span className="material-symbols-outlined">qr_code_2</span>
              Chuyển khoản VietQR
            </label>
            <label className={`checkout-payment-option ${paymentMethod === 'momo' ? 'active' : ''}`}>
              <input type="radio" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} />
              <span className="material-symbols-outlined">account_balance_wallet</span>
              Ví MoMo / ZaloPay
            </label>
          </div>
        </section>

        <aside className="checkout-summary-card">
          <h2>Đơn hàng của bạn</h2>
          {cartItems.map((item) => (
            <div className="checkout-product-row" key={item.cartItemId}>
              <img src={item.image} alt={item.name} />
              <div><strong>{item.name}</strong><span>Số lượng: {item.quantity}</span></div>
              <b>{FORMAT_CURRENCY(item.unitPrice * item.quantity)}</b>
            </div>
          ))}
          <div className="checkout-total-row"><span>Tạm tính</span><b>{FORMAT_CURRENCY(subtotal)}</b></div>
          <div className="checkout-total-row"><span>Phí giao hàng</span><b>{shippingFee === 0 ? 'Miễn phí' : FORMAT_CURRENCY(shippingFee)}</b></div>
          <div className="checkout-grand-total"><span>Tổng thanh toán</span><b>{FORMAT_CURRENCY(total)}</b></div>
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            <span className="material-symbols-outlined">check_circle</span>
            Hoàn tất đặt hàng
          </button>
        </aside>
      </form>
    </main>
  );
};
