import React, { useState } from 'react';
import { ScreenType, Product, CartItem } from './types';
import { PRODUCTS, INITIAL_CART_ITEMS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetail } from './components/ProductDetail';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { DIYGuidesPage } from './components/DIYGuidesPage';
import { WishlistModal } from './components/WishlistModal';
import { WorkshopModal } from './components/WorkshopModal';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Toast, ToastMessage } from './components/Toast';
import { getStoredAccount, isLoggedIn, logoutAccount } from './services/authService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(() => isLoggedIn());
  const [userName, setUserName] = useState<string | undefined>(() => getStoredAccount()?.fullName);
  const [pendingWishlistProduct, setPendingWishlistProduct] = useState<Product | null>(null);

  // Helper to trigger toast
  const addToast = (text: string, type: 'default' | 'success' = 'default') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      text,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Screen navigation with scroll to top
  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select a product to view detail
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart from Catalog (default options)
  const handleAddToCartQuick = (product: Product) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === product.id && item.size.includes(product.sizes[0]?.label || '')
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        cartItemId: `cart-${Date.now()}`,
        productId: product.id,
        name: product.name,
        image: product.images[0],
        size: product.sizes[0] ? `${product.sizes[0].label} (${product.sizes[0].dimensions})` : 'Tiêu chuẩn',
        waxTone: product.waxTones[0]?.label || 'Kraft Mộc',
        fitting: product.fittingOptions[0]?.label || 'Tiêu chuẩn',
        unitPrice: product.price,
        quantity: 1,
        recycledWasteAmount: product.specs.recycledWasteAmount,
      };
      setCartItems([...cartItems, newItem]);
    }

    addToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  };

  // Add to cart with custom options from Detail
  const handleAddToCartWithOptions = (itemData: Omit<CartItem, 'cartItemId'>) => {
    const newItem: CartItem = {
      ...itemData,
      cartItemId: `cart-${Date.now()}-${Math.random()}`,
    };
    setCartItems((prev) => [...prev, newItem]);
    addToast(`Đã thêm "${itemData.name}" (${itemData.size}) vào giỏ!`, 'success');
  };

  // Buy now: add and jump directly to Cart
  const handleBuyNow = (itemData: Omit<CartItem, 'cartItemId'>) => {
    handleAddToCartWithOptions(itemData);
    setCurrentScreen('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      addToast(`Đã bỏ "${product.name}" khỏi danh sách yêu thích.`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      addToast(`Đã lưu "${product.name}" vào mục yêu thích!`, 'success');
    }
  };

  const requireLoginForWishlist = (product?: Product) => {
    if (isUserLoggedIn) {
      if (product) handleToggleWishlist(product);
      else setIsWishlistOpen(true);
      return;
    }

    if (product) setPendingWishlistProduct(product);
    setCurrentScreen('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    if (isUserLoggedIn) return;
    setCurrentScreen('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAccount();
    setIsUserLoggedIn(false);
    setUserName(undefined);
    setWishlistIds([]);
    addToast('Bạn đã đăng xuất.', 'success');
  };

  const handleLoginSuccess = () => {
    setIsUserLoggedIn(true);
    setUserName(getStoredAccount()?.fullName);
    setCurrentScreen('catalog');
    if (pendingWishlistProduct) {
      handleToggleWishlist(pendingWishlistProduct);
      setPendingWishlistProduct(null);
    }
    addToast('Đăng nhập thành công!', 'success');
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen('login');
    addToast('Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.', 'success');
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    handleNavigate('catalog');
    addToast('Đặt hàng thành công! Xưởng sẽ liên hệ với bạn sớm.', 'success');
  };

  // Cart operations
  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (item) {
      addToast(`Đã xóa "${item.name}" khỏi giỏ hàng.`);
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    addToast('Đã làm rỗng giỏ hàng.');
  };

  // Download PDF template simulation
  const handleDownloadTemplate = (fileName: string) => {
    addToast(`Đang tải file rập "${fileName}" chuẩn tỉ lệ 1:1...`, 'success');
    // Simulate anchor download trigger
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derived counts
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  if (currentScreen === 'login') {
    return (
      <div className="app-layout" id="app-main-root">
        <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <div className="app-layout" id="app-main-root">
        <RegisterPage onNavigate={handleNavigate} onRegisterSuccess={handleRegisterSuccess} />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="app-layout" id="app-main-root">
      {/* Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => requireLoginForWishlist()}
        isLoggedIn={isUserLoggedIn}
        userName={userName}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Screen Content */}
      <div className="main-content-viewport" id="main-content-viewport">
        {currentScreen === 'catalog' && (
          <ProductCatalog
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCartQuick}
            onToggleWishlist={requireLoginForWishlist}
            wishlistIds={wishlistIds}
            searchQuery={searchQuery}
          />
        )}

        {currentScreen === 'detail' && (
          <ProductDetail
            product={selectedProduct}
            onAddToCartWithOptions={handleAddToCartWithOptions}
            onBuyNow={handleBuyNow}
            onToggleWishlist={requireLoginForWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onNavigate={handleNavigate}
            onSelectRelatedProduct={handleSelectProduct}
            allProducts={PRODUCTS}
          />
        )}

        {currentScreen === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentScreen === 'diy' && (
          <DIYGuidesPage
            onNavigate={handleNavigate}
            onDownloadTemplate={handleDownloadTemplate}
          />
        )}
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCartQuick}
        onSelectProduct={handleSelectProduct}
      />

      {/* Workshop Registration Modal */}
      <WorkshopModal
        isOpen={isWorkshopOpen}
        onClose={() => setIsWorkshopOpen(false)}
        onRegisterSuccess={(msg) => addToast(msg, 'success')}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
