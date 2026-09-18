import React, { useState } from 'react';
import { Product } from '../types';
import { FORMAT_CURRENCY } from '../data/mockData';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  searchQuery: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  searchQuery,
}) => {
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter products by the global search query.
  const filteredProducts = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.roomSpace.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
  });

  return (
    <div className="product-catalog-screen" id="product-catalog-screen">
      {/* Hero Strip */}
      <section className="catalog-hero-strip" id="catalog-hero-banner">
        <div className="container">
          <div className="catalog-hero-content">
            <div className="catalog-hero-text">
              <h2>Đồ Decor Tái Chế Bền Vững</h2>
              <p>
                Tái sinh từng thớ sóng carton và bột giấy phế thải thành các tác phẩm nội thất thẩm mỹ cao, an toàn cho sức khỏe và giàu cảm hứng sống xanh.
              </p>
            </div>
            <div className="hero-metric-badge" id="hero-eco-metric">
              <div className="hero-metric-icon">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <div className="hero-metric-data">
                <strong>14.280 kg bìa carton hồi sinh</strong>
                <span>Tương đương bảo tồn hơn 2.450 cây xanh &amp; giảm khí thải CO2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div className="container">
        <div className="catalog-layout">
          {/* Catalog Main Content */}
          <main className="catalog-main" id="catalog-main-content">
            {/* Header / Sort bar */}
            <div className="catalog-content-header">
              <div className="catalog-title-group">
                <h3>{sortedProducts.length} Tác Phẩm Decor Hoàn Thiện</h3>
                <span>
                  {'Thủ công độc bản từ bìa carton & sợi giấy tái sinh'}
                </span>
              </div>

              <div className="catalog-controls">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  id="sort-products-select"
                >
                  <option value="popular">Phổ biến & Ưa chuộng</option>
                  <option value="rating">Đánh giá cao nhất (4.8+)</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>

                <div className="view-mode-toggle" id="view-mode-toggles">
                  <button
                    className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Dạng lưới"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>grid_view</span>
                  </button>
                  <button
                    className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="Dạng danh sách"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>view_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-text-subtle)', marginBottom: '1rem' }}>
                  search_off
                </span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  Không tìm thấy tác phẩm phù hợp
                </h4>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Thử đổi từ khóa để tìm thấy tác phẩm phù hợp.
                </p>
              </div>
            )}

            {/* Products Grid */}
            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`} id="products-catalog-grid">
              {sortedProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);

                return (
                  <article 
                    key={product.id} 
                    className="product-card" 
                    id={`product-card-${product.id}`}
                  >
                    {/* Image & Badges */}
                    <div className="product-card-image-wrap" onClick={() => onSelectProduct(product)} style={{ cursor: 'pointer' }}>
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="product-card-img" 
                        loading="lazy"
                      />
                      {product.badge && (
                        <span className={`product-badge ${product.badge.includes('kg') ? 'eco-badge' : ''}`}>
                          {product.badge}
                        </span>
                      )}
                      <button
                        className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product);
                        }}
                        title={isWishlisted ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
                      >
                        <span 
                          className="material-symbols-outlined" 
                          style={{ 
                            fontSize: '1.2rem',
                            fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" 
                          }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>

                    {/* Body */}
                    <div className="product-card-body">
                      <div className="product-card-meta">
                        <span className="product-space-tag">{product.roomSpace}</span>
                      </div>

                      <h4 
                        className="product-card-title" 
                        onClick={() => onSelectProduct(product)}
                      >
                        {product.name}
                      </h4>

                      <p className="product-card-desc">
                        {product.shortDesc}
                      </p>

                      <div className="product-card-footer">
                        <div className="product-price-box">
                          <span className="product-price-current">
                            {FORMAT_CURRENCY(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="product-price-old">
                              {FORMAT_CURRENCY(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          className="add-cart-mini-btn"
                          onClick={() => onAddToCart(product)}
                          title="Thêm nhanh vào giỏ hàng"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                            add_shopping_cart
                          </span>
                          <span>Thêm giỏ</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <div className="pagination-wrapper" id="catalog-pagination">
                <button 
                  className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                <button 
                  className={`page-btn ${currentPage === 2 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
                <button 
                  className={`page-btn ${currentPage === 3 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(3)}
                >
                  3
                </button>
                <span style={{ color: 'var(--color-text-subtle)' }}>...</span>
                <button 
                  className={`page-btn ${currentPage === 4 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(4)}
                >
                  4
                </button>
              </div>
            )}

            {/* DIY Guide Callout Banner */}
            <div className="diy-catalog-callout" id="catalog-diy-callout">
              <div className="diy-callout-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c9e265' }}>handyman</span>
                  <span style={{ color: '#c9e265', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sáng Tạo Cùng Nhà Mình
                  </span>
                </div>
                <h3>Bạn muốn tự tay biến bìa carton thành đồ trang trí?</h3>
                <p>
                  Mỗi sản phẩm từ shop không chỉ giúp bạn làm đẹp góc nhà, mà còn gửi gắm niềm vui sáng tạo, sự trân trọng những điều sẵn có và cảm hứng sống xanh mỗi ngày.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
