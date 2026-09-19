import React from 'react';
import { ScreenType } from '../types';

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
  wishlistCount,
  onOpenWishlist,
  isLoggedIn,
  userName,
  onOpenLogin,
  onLogout,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="site-header" id="site-main-header">
      {/* Top Announcement Bar */}
      <div className="top-announcement" id="top-announcement-bar">
        <div className="top-announcement-left">
          <span className="eco-pill">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>eco</span>
            Sống Xanh Bền Vững
          </span>
          <span>Mỗi sản phẩm tại Nhà Mình giúp tái sinh trung bình 2kg bìa carton phế liệu</span>
        </div>
        <div className="top-announcement-right">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>storefront</span>
            600 Nguyễn Văn Cừ, thành phố Cần Thơ
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
            <img className="brand-emblem" src="/logo-emblem.png" alt="" />
            <div className="brand-text">
              <h1>Nhà Mình</h1>
              <span>Paper Upcycling &amp; Decor</span>
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
          <div className="header-actions">
            <button
              className="icon-btn header-icon-only"
              id="header-wishlist-action-btn"
              onClick={onOpenWishlist}
              title="Danh sách yêu thích"
              aria-label="Danh sách yêu thích"
            >
              <span className="material-symbols-outlined">favorite_border</span>
              {wishlistCount > 0 && (
                <span className="icon-btn-badge">{wishlistCount}</span>
              )}
            </button>

            <button
              className="icon-btn header-icon-only cart-header-btn"
              id="header-cart-action-btn"
              onClick={() => onNavigate('cart')}
              title="Xem giỏ hàng"
              aria-label="Xem giỏ hàng"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="icon-btn-badge">{cartCount}</span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="header-user-pill" id="header-account-action-btn">
                <span className="material-symbols-outlined">person</span>
                <span className="header-user-name">{userName}</span>
                <button
                  className="header-logout-icon"
                  onClick={onLogout}
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            ) : (
              <button
                className="icon-btn account-header-btn"
                id="header-account-action-btn"
                onClick={onOpenLogin}
                title="Đăng nhập"
              >
                <span className="material-symbols-outlined">person</span>
                <span>Đăng nhập</span>
              </button>
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
              className={`nav-link ${currentScreen === 'message' ? 'active' : ''}`}
              onClick={() => onNavigate('message')}
              id="nav-link-message"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>edit_note</span>
              Thông điệp
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
