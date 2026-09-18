import React, { useEffect, useRef, useState } from 'react';
import { ScreenType } from '../types';
import { FORMAT_CURRENCY } from '../data/mockData';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenWishlist: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onOpenLogin: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenWishlist,
  isLoggedIn,
  userName,
  onOpenLogin,
  onLogout,
  searchQuery,
  onSearchChange,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleAccountClick = () => {
    if (isLoggedIn) {
      setIsAccountMenuOpen((isOpen) => !isOpen);
      return;
    }
    onOpenLogin();
  };

  return (
    <header className="site-header" id="site-main-header">
      {/* Top Announcement Bar */}
      <div className="top-announcement" id="top-announcement-bar">
        <div className="top-announcement-left">
          <span className="eco-pill">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>eco</span>
            Sống Xanh Bền Vững
          </span>
          <span>Mỗi sản phẩm tại Nhà Mình giúp tái sinh trung bình 3.2kg bìa carton phế liệu</span>
        </div>
        <div className="top-announcement-right">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>storefront</span>
            Xưởng: 600 Nguyễn Văn Cừ, thành phố Cần Thơ
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>call</span>
            Hotline: 08 3769 4079
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="header-main">
          {/* Brand Logo */}
          <div 
            className="brand-logo" 
            id="header-brand-logo"
            onClick={() => onNavigate('catalog')}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>recycling</span>
            </div>
            <div className="brand-text">
              <h1>Nhà Mình</h1>
              <span>Tái Sinh Từ Phế Liệu</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="search-bar-wrapper" id="header-search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              id="global-search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear-btn" 
                onClick={() => onSearchChange('')}
                title="Xóa tìm kiếm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="header-actions" ref={accountMenuRef}>
            <button 
              className="icon-btn" 
              id="header-wishlist-action-btn"
              onClick={onOpenWishlist}
              title="Danh sách yêu thích"
            >
              <span className="material-symbols-outlined">favorite</span>
              <span>Yêu thích</span>
              {wishlistCount > 0 && (
                <span className="icon-btn-badge">{wishlistCount}</span>
              )}
            </button>

            <button 
              className="icon-btn cart-header-btn" 
              id="header-cart-action-btn"
              onClick={() => onNavigate('cart')}
              title="Xem giỏ hàng"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              <span>Giỏ Hàng</span>
              {cartCount > 0 && (
                <span className="icon-btn-badge">{cartCount}</span>
              )}
              {cartTotal > 0 && (
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  ({FORMAT_CURRENCY(cartTotal)})
                </span>
              )}
            </button>

            <button
              className="icon-btn account-header-btn"
              id="header-account-action-btn"
              onClick={handleAccountClick}
              title={isLoggedIn ? 'Tài khoản của bạn' : 'Đăng nhập'}
            >
              <span className="material-symbols-outlined">{isLoggedIn ? 'account_circle' : 'person'}</span>
              <span>{isLoggedIn ? userName : 'Đăng nhập'}</span>
            </button>
            {isLoggedIn && isAccountMenuOpen && (
              <div className="account-menu" role="menu">
                <div className="account-menu-name">
                  <span className="material-symbols-outlined">account_circle</span>
                  <span>{userName}</span>
                </div>
                <button className="account-logout-btn" onClick={() => { setIsAccountMenuOpen(false); onLogout(); }}>
                  <span className="material-symbols-outlined">logout</span>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu Bar */}
        <div className="nav-bar" id="header-navigation-bar">
          <nav className="nav-links">
            <button
              className={`nav-link ${currentScreen === 'catalog' ? 'active' : ''}`}
              onClick={() => onNavigate('catalog')}
              id="nav-link-catalog"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>grid_view</span>
              Đồ Decor Tái Chế
            </button>

            <button
              className={`nav-link ${currentScreen === 'detail' ? 'active' : ''}`}
              onClick={() => onNavigate('detail')}
              id="nav-link-detail"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>lightbulb</span>
              Chi Tiết Tác Phẩm
            </button>

            <button
              className={`nav-link ${currentScreen === 'cart' ? 'active' : ''}`}
              onClick={() => onNavigate('cart')}
              id="nav-link-cart"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>shopping_cart</span>
              Giỏ Hàng Của Bạn
              {cartCount > 0 && (
                <span style={{ 
                  background: 'var(--color-primary)', 
                  color: '#fff', 
                  fontSize: '0.7rem', 
                  padding: '0.1rem 0.45rem', 
                  borderRadius: '10px' 
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
