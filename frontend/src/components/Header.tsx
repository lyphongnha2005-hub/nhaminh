import React, { useEffect, useRef, useState } from 'react';
import { ScreenType } from '../utils/types';
import { Role } from '../services/authService';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenWishlist: () => void;
  isLoggedIn: boolean;
  userName?: string;
  userRole?: Role;
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
  userRole,
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
      {/* Main Header */}
      <div className="container">
        <div className="header-main">
          {/* Brand Logo */}
          <button
            type="button"
            className="brand-logo"
            id="header-brand-logo"
            onClick={() => onNavigate('catalog')}
            aria-label="Nhà Mình — Trang chủ"
          >
            <img className="brand-wordmark" src="/logo-nha-minh.png" alt="Nhà Mình" width="56" height="56" />
            <span className="brand-tagline">Paper Upcycling<br />&amp; Decor</span>
          </button>

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
              className="icon-btn header-icon-only"
              id="header-wishlist-action-btn"
              onClick={onOpenWishlist}
              title="Danh sách yêu thích"
            >
              <span className="material-symbols-outlined">favorite</span>
              {wishlistCount > 0 && (
                <span className="icon-btn-badge">{wishlistCount}</span>
              )}
            </button>

            <button
              className="icon-btn header-icon-only cart-header-btn"
              id="header-cart-action-btn"
              onClick={() => onNavigate('cart')}
              title="Xem giỏ hàng"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="icon-btn-badge">{cartCount}</span>
              )}
            </button>

            <button
              className="icon-btn account-header-btn header-login-button"
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
                {userRole === 'ADMIN' && (
                  <a className="account-admin-link" href="/admin/dashboard" role="menuitem">
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                    Trang quản trị
                  </a>
                )}
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
