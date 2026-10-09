import React, { useEffect, useState } from 'react';
import { ScreenType, Product, CartItem } from './utils/types';
import { fetchActiveProducts } from './services/productService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCatalog } from './pages/ProductCatalog';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DIYGuidesPage } from './pages/DIYGuidesPage';
import { WishlistModal } from './components/WishlistModal';
import { WorkshopModal } from './components/WorkshopModal';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MessagePage } from './pages/MessagePage';
import { Toast, ToastMessage } from './components/Toast';
import { getStoredAccount, isLoggedIn, logoutAccount, Role } from './services/authService';
import { useShoppingLists } from './hooks/useShoppingLists';

export default function App() {
  const screenFromPath=():ScreenType=>location.pathname==='/login'?'login':location.pathname==='/register'?'register':'catalog';
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(screenFromPath);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productError, setProductError] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(() => isLoggedIn());
  const [userName, setUserName] = useState<string | undefined>(() => getStoredAccount()?.fullName);
  const [userRole, setUserRole] = useState<Role | undefined>(() => getStoredAccount()?.role);
  const [pendingWishlistProduct, setPendingWishlistProduct] = useState<Product | null>(null);
  const [pendingCartItem, setPendingCartItem] = useState<Omit<CartItem, 'cartItemId'> | null>(null);

  useEffect(() => {
    fetchActiveProducts()
      .then((items) => { setProducts(items); setSelectedProduct((current) => current ?? items[0] ?? null); })
      .catch((error) => setProductError(error instanceof Error ? error.message : 'Không thể tải sản phẩm'));
  }, []);

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

  const shopping = useShoppingLists(message => addToast(message));
  const { cartItems, wishlistIds } = shopping;

  // Screen navigation with scroll to top
  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    const path=screen==='login'?'/login':screen==='register'?'/register':'/';
    if(location.pathname!==path) history.pushState({},'',path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(()=>{const onPop=()=>setCurrentScreen(screenFromPath());addEventListener('popstate',onPop);return()=>removeEventListener('popstate',onPop)},[]);

  // Select a product to view detail
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart from Catalog (default options)
  const handleAddToCartQuick = async (product: Product) => {
      const itemData: Omit<CartItem, 'cartItemId'> = {
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
    if (!isLoggedIn()) {
      setPendingCartItem(itemData);
      addToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      handleNavigate('login');
      return;
    }
    const newItem: CartItem = { ...itemData, cartItemId: crypto.randomUUID() };
    const saved = await shopping.update('cart', items => {
      const match = items.find(item => item.productId === newItem.productId && item.size === newItem.size && item.waxTone === newItem.waxTone && item.fitting === newItem.fitting);
      return match ? items.map(item => item.cartItemId === match.cartItemId ? { ...item, quantity: item.quantity + 1 } : item) : [...items, newItem];
    });
    if (saved) addToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  };

  // Add to cart with custom options from Detail
  const handleAddToCartWithOptions = async (itemData: Omit<CartItem, 'cartItemId'>) => {
    if (!isLoggedIn()) {
      setPendingCartItem(itemData);
      addToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      handleNavigate('login');
      return false;
    }
    const newItem: CartItem = {
      ...itemData,
      cartItemId: `cart-${Date.now()}-${Math.random()}`,
    };
    const saved = await shopping.update('cart', items => [...items, newItem]);
    if (saved) addToast(`Đã thêm "${itemData.name}" (${itemData.size}) vào giỏ!`, 'success');
    return saved;
  };

  // Buy now: add and jump directly to Cart
  const handleBuyNow = async (itemData: Omit<CartItem, 'cartItemId'>) => {
    if (!await handleAddToCartWithOptions(itemData)) return;
    setCurrentScreen('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist toggle
  const handleToggleWishlist = async (product: Product) => {
    const saved = await shopping.update('wishlist', ids => ids.includes(product.id) ? ids.filter(id => id !== product.id) : [...ids, product.id]);
    if (saved) addToast('Đã cập nhật danh sách yêu thích.', 'success');
  };

  const requireLoginForWishlist = (product?: Product) => {
    if (isUserLoggedIn) {
      if (product) handleToggleWishlist(product);
      else setIsWishlistOpen(true);
      return;
    }

    if (product) setPendingWishlistProduct(product);
    handleNavigate('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    if (isUserLoggedIn) return;
    handleNavigate('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAccount();
    setIsUserLoggedIn(false);
    setUserName(undefined);
    setUserRole(undefined);
    shopping.clear();
    setIsWishlistOpen(false);
    setPendingWishlistProduct(null);
    setPendingCartItem(null);
    handleNavigate('catalog');
    addToast('Bạn đã đăng xuất.', 'success');
  };

  const handleLoginSuccess = async () => {
    setIsUserLoggedIn(true);
    setUserName(getStoredAccount()?.fullName);
    setUserRole(getStoredAccount()?.role);
    handleNavigate('catalog');
    await shopping.load();
    if (pendingCartItem) {
      const pending = pendingCartItem;
      setPendingCartItem(null);
      await handleAddToCartWithOptions(pending);
    }
    if (pendingWishlistProduct) {
      await handleToggleWishlist(pendingWishlistProduct);
      setPendingWishlistProduct(null);
    }
    addToast('Đăng nhập thành công!', 'success');
  };

  const handleRegisterSuccess = () => {
    handleNavigate('login');
    addToast('Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.', 'success');
  };

  const handleOrderSuccess = async () => {
    await shopping.update('cart', () => []);
    handleNavigate('catalog');
    addToast('Đặt hàng thành công! Xưởng sẽ liên hệ với bạn sớm.', 'success');
  };

  // Cart operations
  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    void shopping.update('cart', (prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = async (cartItemId: string) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    const saved = await shopping.update('cart', (prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (saved && item) {
      addToast(`Đã xóa "${item.name}" khỏi giỏ hàng.`);
    }
  };

  const handleClearCart = async () => {
    if (await shopping.update('cart', () => [])) addToast('Đã làm rỗng giỏ hàng.');
  };

  useEffect(() => {
    const synchronize = () => {
      const account = getStoredAccount();
      shopping.clear();
      setIsWishlistOpen(false);
      setPendingWishlistProduct(null);
      setPendingCartItem(null);
      setIsUserLoggedIn(!!account);
      setUserName(account?.fullName);
      setUserRole(account?.role);
      if (account) void shopping.load();
      else handleNavigate('catalog');
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'nhaminh-auth-session' || event.key === null) synchronize();
    };
    const onExpired = (event: Event) => {
      if ((event as CustomEvent).detail?.scope === 'store') synchronize();
    };
    const timer = window.setInterval(() => {
      if (isUserLoggedIn && !isLoggedIn()) synchronize();
    }, 1000);
    window.addEventListener('storage', onStorage);
    window.addEventListener('nhaminh-auth-expired', onExpired);
    return () => { clearInterval(timer); window.removeEventListener('storage', onStorage); window.removeEventListener('nhaminh-auth-expired', onExpired); };
  }, [isUserLoggedIn, shopping.clear, shopping.load]);

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
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

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
        userRole={userRole}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Screen Content */}
      <div className="main-content-viewport" id="main-content-viewport">
        {productError && <div className="container auth-error" style={{marginTop:'1rem'}}>{productError}. Hãy kiểm tra backend đang chạy.</div>}
        {currentScreen === 'catalog' && (
          <ProductCatalog
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCartQuick}
            onToggleWishlist={requireLoginForWishlist}
            wishlistIds={wishlistIds}
            searchQuery={searchQuery}
          />
        )}

        {currentScreen === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCartWithOptions={handleAddToCartWithOptions}
            onBuyNow={handleBuyNow}
            onToggleWishlist={requireLoginForWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onNavigate={handleNavigate}
            onSelectRelatedProduct={handleSelectProduct}
            allProducts={products}
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

        {currentScreen === 'message' && <MessagePage />}

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
