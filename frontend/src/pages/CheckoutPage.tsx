import React, { FormEvent, useState } from 'react';
import { CartItem, ScreenType } from '../utils/types';
import { FORMAT_CURRENCY } from '../utils/mockData';
import { ApiError, apiRequest, getStoredAccount } from '../services/authService';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigate: (screen: ScreenType) => void;
  onOrderSuccess: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onNavigate, onOrderSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'momo'>('cod');
  const account = getStoredAccount();
  const [customerName, setCustomerName] = useState(account?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(account?.phone || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true); setError('');
    try {
      const created = await apiRequest<{id:number;orderCode:string}>('/api/orders', { method:'POST', body:JSON.stringify({
        customerName, customerPhone, shippingAddress, note,
        paymentMethod: paymentMethod.toUpperCase(),
        items: cartItems.map(item => ({
          productId:Number(item.productId), productName:item.name, productImageUrl:item.image,
          selectedVariants:JSON.stringify({size:item.size,waxTone:item.waxTone,fitting:item.fitting}),
          unitPrice:item.unitPrice, quantity:item.quantity,
        })),
      }) });
      localStorage.setItem('nhaminh-last-created-order', JSON.stringify({id:created.id,orderCode:created.orderCode,at:Date.now()}));
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('nhaminh-orders');
        channel.postMessage({type:'ORDER_CREATED',id:created.id});
        channel.close();
      }
      onOrderSuccess();
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Không thể lưu đơn hàng. Vui lòng thử lại.'); }
    finally { setSubmitting(false); }
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
          <label>Họ và tên<input required value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Nhập họ và tên" /></label>
          <label>Số điện thoại<input required type="tel" value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} placeholder="Nhập số điện thoại" /></label>
          <label>Địa chỉ nhận hàng<input required value={shippingAddress} onChange={e=>setShippingAddress(e.target.value)} placeholder="Số nhà, đường, phường/xã, tỉnh/thành" /></label>
          <label>Ghi chú đơn hàng<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Ghi chú thêm cho xưởng (không bắt buộc)" /></label>

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
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={submitting} className="btn btn-primary btn-block btn-lg">
            <span className="material-symbols-outlined">check_circle</span>
            {submitting ? 'Đang lưu đơn hàng…' : 'Hoàn tất đặt hàng'}
          </button>
        </aside>
      </form>
    </main>
  );
};
