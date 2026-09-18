import React from 'react';
import { Product } from '../types';
import { FORMAT_CURRENCY } from '../data/mockData';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#e53e3e' }}>favorite</span>
            <h3>Danh Sách Yêu Thích Của Bạn ({wishlistProducts.length})</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          {wishlistProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-text-subtle)', marginBottom: '0.75rem' }}>
                favorite_border
              </span>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Bạn chưa lưu tác phẩm nào. Bấm vào biểu tượng trái tim ở các sản phẩm để lưu lại ngắm nhìn nhé!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '72px', height: '72px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{ fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.2rem' }}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                    >
                      {product.name}
                    </h4>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {FORMAT_CURRENCY(product.price)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onAddToCart(product);
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add_shopping_cart</span>
                      Thêm Giỏ
                    </button>
                    <button
                      className="icon-btn"
                      style={{ padding: '0.4rem 0.6rem', color: 'var(--color-error)' }}
                      onClick={() => onRemoveWishlist(product)}
                      title="Bỏ khỏi yêu thích"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
