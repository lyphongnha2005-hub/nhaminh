import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ApiError,
  apiRequest,
  assetUrl,
  getSession,
  loginAccount,
  logoutAccount,
  verifySession,
} from "../../services/authService";
import { PasswordInput } from "../../components/PasswordInput";
import { MessageManagement } from "./MessageManagement";

interface AdminVariant {
  id?: number;
  type: "SIZE" | "COLOR";
  name: string;
  dimensions?: string;
  colorHex?: string;
  priceAdjustment: number;
  stockQuantity: number;
}

interface AdminProduct {
  id?: number;
  name: string;
  sku?: string;
  slug?: string;
  category?: string;
  categoryName?: string;
  price?: string;
  basePrice?: number;
  stock?: number;
  stockQuantity?: number;
  carbon?: string;
  recycledWasteAmount?: string;
  status: string;
  tone?: string;
  shortDescription?: string;
  roomSpace?: string;
  imageUrl?: string;
  imageUrls?: string[];
  variants?: AdminVariant[];
}

interface DashboardStats {
  activeProducts: number;
  lowStockProducts: number;
  newProductsThisMonth: number;
  recycledCartonKg: number;
  equivalentTrees: number;
  monthlyRevenue: number;
  revenueGrowthPercent?: number | null;
}

interface CustomerAccount {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: "CUSTOMER";
  status: "ACTIVE" | "LOCKED" | "DISABLED";
}
interface AdminReview { id:number;customerId?:number;productId?:number;authorName:string;email?:string;rating:number;comment:string;status:"PENDING"|"APPROVED"|"REJECTED";createdAt:string; }
interface GreenMember { id:number;fullName:string;email:string;phone?:string;totalOrders:number;totalItems:number;totalSpent:number;lastOrderAt:string; }
interface OrderNotification { id:number;orderCode:string;customerName:string;totalAmount:number;status:string;createdAt:string; }

const Icon = ({ children }: { children: string }) => (
  <span className="material-symbols-outlined">{children}</span>
);

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const s = await loginAccount(email, password, "admin");
      if (!s.accessToken || !s.user) {
        throw new ApiError(401, "Tài khoản hoặc mật khẩu không chính xác.");
      }
      if (s.user.role !== "ADMIN") {
        logoutAccount("admin");
        throw new ApiError(
          403,
          "Tài khoản CUSTOMER không được truy cập quản trị",
        );
      }
      nav("/admin/dashboard", { replace: true });
    } catch (x) {
      setError(x instanceof ApiError && x.status === 401 ? "Tài khoản hoặc mật khẩu không chính xác." : x instanceof Error ? x.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-page-card">
        <a className="auth-back-link" href="/">
          <Icon>arrow_back</Icon> Về cửa hàng
        </a>
        <div className="auth-page-heading">
          <h1>Quản trị Nhà Mình</h1>
          <p>Đăng nhập vào không gian vận hành cửa hàng.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Đang kiểm tra…" : "Đăng nhập quản trị"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Guard({ children }: { children: ReactNode }) {
  const initialSession = getSession("admin");
  const [state, setState] = useState<"checking" | "ok" | "no">(
    initialSession?.user.role === "ADMIN" ? "ok" : "checking",
  );
  useEffect(() => {
    const expired = (event: Event) => {
      if ((event as CustomEvent<{scope:string}>).detail?.scope === "admin") setState("no");
    };
    window.addEventListener("nhaminh-auth-expired", expired);
    const session = getSession("admin");
    if (session?.user.role !== "ADMIN") {
      setState("no");
      return () => window.removeEventListener("nhaminh-auth-expired", expired);
    }
    verifySession("admin")
      .then((u) => setState(u.role === "ADMIN" ? "ok" : "no"))
      .catch((error) => {
        if (error instanceof ApiError && [401, 403].includes(error.status)) {
          setState("no");
        } else {
          setState("ok");
        }
      });
    return () => window.removeEventListener("nhaminh-auth-expired", expired);
  }, []);
  if (state === "checking")
    return (
      <div className="admin-loading">
        <div className="admin-loader" />
        <span>Đang xác minh quyền quản trị…</span>
      </div>
    );
  return state === "ok" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login/admin" replace />
  );
}

const groups = [
  {
    label: "Tổng quan",
    items: [["dashboard", "Dashboard / Thống kê", "/admin/dashboard"]],
  },
  {
    label: "Quản lý cửa hàng",
    items: [
      ["inventory_2", "Quản lý Sản phẩm", "/admin/products"],
      ["local_shipping", "Đơn hàng & Vận chuyển", "/admin/orders"],
    ],
  },
  {
    label: "Khách hàng & cộng đồng",
    items: [
      ["group", "Tài khoản Khách hàng", "/admin/customers"],
      ["reviews", "Đánh giá & Feedback", "/admin/reviews"],
      ["forum", "Quản lý Thông điệp", "/admin/messages"],
      ["eco", "Thành viên Sống Xanh", "/admin/members"],
    ],
  },
  {
    label: "Thiết lập",
    items: [
      ["store", "Cài đặt Cửa hàng", "#"],
      ["admin_panel_settings", "Quyền quản trị", "#"],
    ],
  },
];

function Sidebar() {
  const loc = useLocation();
  const nav = useNavigate();
  const user = getSession("admin")?.user;
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [recycledCartonKg, setRecycledCartonKg] = useState<number>();
  useEffect(() => {
    let active = true;
    const check = () => apiRequest<OrderNotification[]>("/api/admin/order-notifications").then(items => {
      if (!active) return;
      const seen = Number(localStorage.getItem("nhaminh-admin-last-seen-order") || 0);
      setHasNewOrders(items.some(item => item.id > seen));
    }).catch(() => undefined);
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("nhaminh-orders") : undefined;
    if (channel) channel.onmessage = check;
    const onRead = () => check();
    window.addEventListener("nhaminh-orders-read", onRead);
    void check();
    const timer = window.setInterval(check, 5000);
    return () => { active=false;window.clearInterval(timer);channel?.close();window.removeEventListener("nhaminh-orders-read",onRead); };
  }, []);
  useEffect(() => {
    apiRequest<DashboardStats>("/api/admin/dashboard")
      .then(stats => setRecycledCartonKg(stats.recycledCartonKg))
      .catch(() => undefined);
  }, []);
  return (
    <aside className="admin-sidebar">
      <a href="/" className="admin-brand" aria-label="Nhà Mình — Trang chủ">
        <img className="admin-wordmark" src="/logo-nha-minh.png" alt="Nhà Mình" width="64" height="64" />
        <div>
          <small>Paper Upcycling & Decor</small>
        </div>
        <span>
          Admin
          <br />
          Studio
        </span>
      </a>
      <nav>
        {groups.map((g) => (
          <section key={g.label}>
            <p>{g.label}</p>
            {g.items.map(([, label, path]) => (
              <Link
                key={label}
                to={path}
                className={
                  loc.pathname === path ||
                  (label === "Quản lý Sản phẩm" &&
                    loc.pathname === "/admin/dashboard")
                    ? "active"
                    : ""
                }
              >
                {label}
                {path === "/admin/orders" && hasNewOrders && <i className="admin-menu-alert" title="Có đơn hàng mới" />}
              </Link>
            ))}
          </section>
        ))}
      </nav>
      <div className="admin-eco">
        <Icon>recycling</Icon>
        <div>
          <small>Kho tái sinh</small>
          <b>{recycledCartonKg == null ? "—" : `${recycledCartonKg.toLocaleString("vi-VN", {maximumFractionDigits:2})}kg`}</b>
          <span>phế liệu đã tái chế</span>
        </div>
      </div>
      <div className="admin-profile">
        <span className="admin-avatar">{user?.fullName?.charAt(0) || "A"}</span>
        <div>
          <b>{user?.fullName || "Admin"}</b>
          <small>Quản trị viên</small>
        </div>
        <button
          title="Đăng xuất"
          onClick={() => {
            logoutAccount("admin");
            nav("/login/admin", { replace: true });
          }}
        >
          <Icon>logout</Icon>
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  const user = getSession("admin")?.user;
  const nav = useNavigate();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [orders, setOrders] = useState<OrderNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [lastSeenId, setLastSeenId] = useState(() =>
    Number(localStorage.getItem("nhaminh-admin-last-seen-review") || 0),
  );
  const [lastSeenOrderId, setLastSeenOrderId] = useState(() =>
    Number(localStorage.getItem("nhaminh-admin-last-seen-order") || 0),
  );

  useEffect(() => {
    let active = true;
    const load = () => Promise.allSettled([
      apiRequest<AdminReview[]>("/api/admin/reviews"),
      apiRequest<OrderNotification[]>("/api/admin/order-notifications"),
    ]).then(([reviewResult, orderResult]) => {
      if (!active) return;
      if (reviewResult.status === "fulfilled") setReviews(reviewResult.value);
      if (orderResult.status === "fulfilled") setOrders(orderResult.value);
    });
    const refresh = () => { void load(); };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "nhaminh-last-created-order") refresh();
    };
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("nhaminh-orders") : undefined;
    if (channel) channel.onmessage = refresh;
    window.addEventListener("storage", onStorage);
    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  const unread = reviews.filter((review) => review.id > lastSeenId);
  const unreadOrders = orders.filter((order) => order.id > lastSeenOrderId);
  const unreadCount = unread.length + unreadOrders.length;
  const toggleNotifications = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && reviews.length) {
      const newestId = Math.max(...reviews.map((review) => review.id));
      setLastSeenId(newestId);
      localStorage.setItem("nhaminh-admin-last-seen-review", String(newestId));
    }
    if (nextOpen && orders.length) {
      const newestOrderId = Math.max(...orders.map((order) => order.id));
      setLastSeenOrderId(newestOrderId);
      localStorage.setItem("nhaminh-admin-last-seen-order", String(newestOrderId));
    }
  };

  return (
    <header className="admin-topbar">
      <div className="admin-top-search">
        <Icon>search</Icon>
        <input placeholder="Tìm kiếm đơn hàng, sản phẩm, mã SKU…" />
        <kbd>Ctrl K</kbd>
      </div>
      <div className="admin-top-actions">
        <button className="admin-bell" onClick={toggleNotifications} title="Thông báo mới" aria-label={`Thông báo, ${unreadCount} chưa đọc`}>
          <Icon>notifications</Icon>
          {unreadCount > 0 && <b>{unreadCount > 99 ? "99+" : unreadCount}</b>}
        </button>
        {open && (
          <section className="admin-notifications">
            <header><strong>Thông báo mới</strong><small>{unreadCount ? `${unreadCount} chưa đọc` : "Đã đọc tất cả"}</small></header>
            <div>
              {orders.slice(0, 5).map((order) => (
                <button key={`order-${order.id}`} onClick={() => { setOpen(false); nav("/admin/orders"); }}>
                  <span className="admin-notification-avatar"><Icon>shopping_bag</Icon></span>
                  <span><strong>Đơn hàng mới #{order.orderCode}</strong><small>{order.customerName} vừa đặt đơn trị giá {order.totalAmount.toLocaleString("vi-VN")}đ</small><time>{new Date(order.createdAt).toLocaleString("vi-VN")}</time></span>
                </button>
              ))}
              {reviews.slice(0, 5).map((review) => (
                <button key={review.id} onClick={() => { setOpen(false); nav("/admin/reviews"); }}>
                  <span className="admin-notification-avatar">{review.authorName.charAt(0).toUpperCase()}</span>
                  <span><strong>{review.authorName}</strong><small>đã đánh giá {review.rating}/5 sao cho sản phẩm #{review.productId ?? "—"}</small><time>{new Date(review.createdAt).toLocaleString("vi-VN")}</time></span>
                </button>
              ))}
              {!reviews.length && !orders.length && <p>Chưa có thông báo nào.</p>}
            </div>
            <button className="admin-notifications-all" onClick={() => { setOpen(false); nav("/admin/orders"); }}>Xem đơn hàng</button>
          </section>
        )}
        <div className="admin-account-summary">
          <span className="admin-avatar">{user?.fullName?.charAt(0).toUpperCase() || "A"}</span>
          <span><strong>{user?.fullName || "Admin"}</strong><small>Quản trị viên</small></span>
        </div>
      </div>
    </header>
  );
}

function StatCards({ stats, loading }: { stats?: DashboardStats; loading: boolean }) {
  const number = (value?: number, digits = 0) =>
    loading || value == null
      ? "—"
      : value.toLocaleString("vi-VN", { maximumFractionDigits: digits });
  const growth = stats?.revenueGrowthPercent;
  return (
    <div className="admin-stats">
      <article>
        <div>
          <small>Đang bày bán</small>
          <strong>{number(stats?.activeProducts)}</strong>
          <span>tác phẩm</span>
        </div>
        <Icon>inventory_2</Icon>
        <footer className="positive">↗ +{number(stats?.newProductsThisMonth)} mẫu mới trong tháng này</footer>
      </article>
      <article>
        <div>
          <small>Sắp hết hàng</small>
          <strong className="orange">{number(stats?.lowStockProducts)}</strong>
          <span>còn từ 3 chiếc trở xuống</span>
        </div>
        <Icon>notifications_active</Icon>
        <footer className="warning">Cảnh báo tồn kho cần nhập thêm hàng</footer>
      </article>
      <article>
        <div>
          <small>Carton tái sinh</small>
          <strong className="green">{number(stats?.recycledCartonKg, 2)}</strong>
          <span>kg</span>
        </div>
        <Icon>eco</Icon>
        <footer>
          Quy đổi: <b>~{number(stats?.equivalentTrees)} cây xanh</b>
        </footer>
      </article>
      <article>
        <div>
          <small>Doanh thu decor tháng</small>
          <strong>
            {number(stats?.monthlyRevenue)}<sup>đ</sup>
          </strong>
        </div>
        <Icon>payments</Icon>
        <footer className={growth != null && growth < 0 ? "warning" : "positive"}>
          {growth == null ? "Chưa có dữ liệu tháng trước" : `${growth >= 0 ? "↗ +" : "↘ "}${number(growth, 1)}% so với tháng trước`}
        </footer>
      </article>
    </div>
  );
}

interface VariantInput {
  name: string;
  dimensions: string;
  colorHex: string;
  priceAdjustment: string;
  stockQuantity: string;
}
const emptyVariant = (): VariantInput => ({
  name: "",
  dimensions: "",
  colorHex: "#8a572c",
  priceAdjustment: "0",
  stockQuantity: "0",
});
const COLOR_PALETTE = [
  { name: "Nâu Kraft", hex: "#8A572C" },
  { name: "Nâu Đất", hex: "#6B4423" },
  { name: "Nâu Cacao", hex: "#4E342E" },
  { name: "Nâu Hạt Dẻ", hex: "#7B4B3A" },
  { name: "Nâu Caramel", hex: "#A66A3F" },
  { name: "Nâu Đồng", hex: "#B87333" },
  { name: "Be Carton", hex: "#C8A77A" },
  { name: "Kem Mộc", hex: "#E8DCC8" },
  { name: "Be Cát", hex: "#D8C3A5" },
  { name: "Kem Sữa", hex: "#FFF3D6" },
  { name: "Trắng Ngà", hex: "#F4F0E6" },
  { name: "Trắng Sứ", hex: "#FAFAF7" },
  { name: "Xanh Rêu", hex: "#4A634E" },
  { name: "Xanh Lá", hex: "#6F8B63" },
  { name: "Xanh Olive", hex: "#808A4E" },
  { name: "Xanh Sage", hex: "#A3B18A" },
  { name: "Xanh Mint", hex: "#A8D5BA" },
  { name: "Xanh Ngọc", hex: "#2A9D8F" },
  { name: "Xanh Thông", hex: "#264D3B" },
  { name: "Xanh Neon", hex: "#70E000" },
  { name: "Cam Đất", hex: "#C06C3E" },
  { name: "Cam Cháy", hex: "#D35400" },
  { name: "Cam San Hô", hex: "#FF7F50" },
  { name: "Cam Tươi", hex: "#F28C28" },
  { name: "Đỏ Gạch", hex: "#9D4A3A" },
  { name: "Đỏ Đô", hex: "#800020" },
  { name: "Đỏ Ruby", hex: "#B51233" },
  { name: "Đỏ Tươi", hex: "#D62828" },
  { name: "Vàng Mật", hex: "#D09A3A" },
  { name: "Vàng Nghệ", hex: "#E0A800" },
  { name: "Vàng Chanh", hex: "#F4D35E" },
  { name: "Vàng Kem", hex: "#F6E7A1" },
  { name: "Xanh Da Trời", hex: "#78B7D0" },
  { name: "Xanh Biển", hex: "#2878B5" },
  { name: "Xanh Navy", hex: "#1D3557" },
  { name: "Xanh Cobalt", hex: "#2455A4" },
  { name: "Xanh Lam Nhạt", hex: "#A9D6E5" },
  { name: "Xanh Cyan", hex: "#00B4D8" },
  { name: "Tím Lavender", hex: "#B8A1D9" },
  { name: "Tím Mận", hex: "#6D3B6A" },
  { name: "Tím Than", hex: "#4A3F6B" },
  { name: "Hồng Phấn", hex: "#E9B7B7" },
  { name: "Hồng Đất", hex: "#C97C7C" },
  { name: "Hồng Sen", hex: "#D94F8A" },
  { name: "Xám Khói", hex: "#B0B3B0" },
  { name: "Xám Tro", hex: "#777873" },
  { name: "Xám Xi Măng", hex: "#5F6368" },
  { name: "Xám Xanh", hex: "#607D8B" },
  { name: "Đen Than", hex: "#292B29" },
  { name: "Đen Tuyền", hex: "#111111" },
];
function VariantEditor({
  type,
  items,
  setItems,
}: {
  type: "size" | "color";
  items: VariantInput[];
  setItems: (items: VariantInput[]) => void;
}) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const update = (index: number, key: keyof VariantInput, value: string) =>
    setItems(
      items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  const choosePaletteColor = (index: number, name: string, colorHex: string) =>
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, name, colorHex } : item,
      ),
    );
  return (
    <div className="wide variant-editor">
      <div className="variant-heading">
        <div>
          <b>{type === "size" ? "Kích cỡ sản phẩm" : "Màu sắc sản phẩm"}</b>
          <span>
            {type === "size"
              ? "Thêm tên và kích thước cho từng lựa chọn"
              : "Chọn màu hiển thị cho từng phiên bản"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setItems([...items, emptyVariant()]);
            if (type === "color") setActiveColorIndex(items.length);
          }}
        >
          <Icon>add</Icon>Thêm {type === "size" ? "kích cỡ" : "màu"}
        </button>
      </div>
      {items.map((item, index) => (
        <div className="variant-item" key={index}>
          <div
            className={`variant-row ${type}`}
            onFocusCapture={() => {
              if (type === "color") setActiveColorIndex(index);
            }}
            onClick={() => {
              if (type === "color") setActiveColorIndex(index);
            }}
          >
            {type === "color" && (
              <input
                aria-label="Chọn màu"
                className="color-picker"
                type="color"
                value={item.colorHex}
                onChange={(e) => update(index, "colorHex", e.target.value)}
              />
            )}
            <input
              placeholder={type === "size" ? "Tên (S, M, L…)" : "Tên màu"}
              value={item.name}
              onChange={(e) => update(index, "name", e.target.value)}
              required
            />
            <input
              placeholder={type === "size" ? "Kích thước (30x40cm)" : "Mã màu"}
              value={type === "size" ? item.dimensions : item.colorHex}
              onChange={(e) =>
                update(
                  index,
                  type === "size" ? "dimensions" : "colorHex",
                  e.target.value,
                )
              }
            />
            <input
              type="number"
              min="0"
              placeholder="Giá cộng"
              value={item.priceAdjustment}
              onChange={(e) => update(index, "priceAdjustment", e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Tồn kho"
              value={item.stockQuantity}
              onChange={(e) => update(index, "stockQuantity", e.target.value)}
            />
            <button
              type="button"
              className="remove-variant"
              title="Xóa"
              onClick={(event) => {
                event.stopPropagation();
                setItems(items.filter((_, i) => i !== index));
                setActiveColorIndex((active) =>
                  Math.max(0, active > index ? active - 1 : Math.min(active, items.length - 2)),
                );
              }}
            >
              <Icon>delete</Icon>
            </button>
          </div>
          {type === "color" && activeColorIndex === index && (
            <div className="color-palette" aria-label={`Bảng màu cho ${item.name || `màu ${index + 1}`}`}>
              {COLOR_PALETTE.map((color) => (
                <button
                  type="button"
                  key={color.hex}
                  className={
                    item.colorHex.toUpperCase() === color.hex ? "selected" : ""
                  }
                  title={`${color.name} (${color.hex})`}
                  onClick={() =>
                    choosePaletteColor(index, color.name, color.hex)
                  }
                >
                  <span style={{ backgroundColor: color.hex }} />
                  <small>{color.name}</small>
                  {item.colorHex.toUpperCase() === color.hex && (
                    <Icon>check</Icon>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && (
        <div className="variant-empty">
          Chưa có {type === "size" ? "kích cỡ" : "màu sắc"} — sản phẩm sẽ dùng
          lựa chọn mặc định.
        </div>
      )}
    </div>
  );
}

function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
  deletingId,
}: {
  products: AdminProduct[];
  onView: (product: AdminProduct) => void;
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
  deletingId?: number;
}) {
  return (
    <>
      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Tác phẩm decor & SKU</th>
              <th>Phân loại</th>
              <th>Bảng giá niêm yết</th>
              <th>Tồn kho xưởng</th>
              <th>Giảm thải carton</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const stock = p.stockQuantity ?? p.stock ?? 0;
              const price =
                p.basePrice != null
                  ? `${Number(p.basePrice).toLocaleString("vi-VN")}đ`
                  : p.price;
              const statusLabel =
                p.status === "ACTIVE"
                  ? "Đang bán"
                  : p.status === "DRAFT"
                    ? "Bản nháp"
                    : p.status;
              return (
                <tr key={p.id ?? p.sku}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="product-cell">
                      <div className={`product-thumb thumb-${i % 6}`}>
                        {p.imageUrl ? (
                          <img src={assetUrl(p.imageUrl)} alt={p.name} />
                        ) : (
                          <Icon>{i % 2 ? "shelves" : "light"}</Icon>
                        )}
                      </div>
                      <div>
                        <b>{p.name}</b>
                        <small>SKU: {p.sku ?? p.slug}</small>
                        <em>{p.roomSpace || "Bìa tái chế"}</em>
                      </div>
                    </div>
                  </td>
                  <td>{p.categoryName ?? p.category}</td>
                  <td>
                    <b>{price}</b>
                    <small>Nguyên giá</small>
                  </td>
                  <td>
                    <div className="stock-line">
                      <span style={{ width: `${Math.max(5, stock * 3)}%` }} />
                    </div>
                    <small className={stock < 3 ? "low" : ""}>
                      {String(stock).padStart(2, "0")} chiếc{" "}
                      {stock === 0 ? "Hết hàng" : "sẵn có"}
                    </small>
                  </td>
                  <td>
                    <span className="carbon">
                      <Icon>recycling</Icon>
                      {p.recycledWasteAmount ?? p.carbon ?? "—"}
                      <small>bìa/sp</small>
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${p.tone ?? (p.status === "ACTIVE" ? "green" : p.status === "DRAFT" ? "brown" : "gray")}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button title="Xem" onClick={() => onView(p)}>
                        <Icon>visibility</Icon>
                      </button>
                      <button title="Sửa" onClick={() => onEdit(p)}>
                        <Icon>edit</Icon>
                      </button>
                      <button
                        title="Xóa"
                        disabled={p.id == null || deletingId === p.id}
                        onClick={() => onDelete(p)}
                      >
                        <Icon>{deletingId === p.id ? "progress_activity" : "delete"}</Icon>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <footer className="table-footer">
          <span>
            Hiển thị <b>{products.length}</b> tác phẩm decor tái chế
          </span>
        </footer>
      </div>
    </>
  );
}

function ProductViewModal({
  product,
  onClose,
  onEdit,
}: {
  product: AdminProduct;
  onClose: () => void;
  onEdit: () => void;
}) {
  const sizes = product.variants?.filter((v) => v.type === "SIZE") ?? [];
  const colors = product.variants?.filter((v) => v.type === "COLOR") ?? [];
  const statusLabel =
    product.status === "ACTIVE"
      ? "Đang bán"
      : product.status === "DRAFT"
        ? "Bản nháp"
        : "Đã ẩn";
  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="admin-product-modal product-view-modal">
        <header>
          <div>
            <small>CHI TIẾT SẢN PHẨM</small>
            <h2>{product.name}</h2>
          </div>
          <button onClick={onClose} title="Đóng">
            <Icon>close</Icon>
          </button>
        </header>
        <div className="product-view-body">
          <div className="product-view-images">
            {(product.imageUrls?.length
              ? product.imageUrls
              : product.imageUrl
                ? [product.imageUrl]
                : []
            ).map((url, index) => (
              <img key={url} src={assetUrl(url)} alt={`${product.name} ${index + 1}`} />
            ))}
            {!product.imageUrl && !product.imageUrls?.length && (
              <div className="product-view-no-image">
                <Icon>image_not_supported</Icon>
                Chưa có hình ảnh
              </div>
            )}
          </div>
          <dl className="product-view-info">
            <div>
              <dt>Danh mục</dt>
              <dd>{product.categoryName ?? product.category ?? "—"}</dd>
            </div>
            <div>
              <dt>Không gian</dt>
              <dd>{product.roomSpace || "—"}</dd>
            </div>
            <div>
              <dt>Giá bán</dt>
              <dd>{Number(product.basePrice ?? 0).toLocaleString("vi-VN")}đ</dd>
            </div>
            <div>
              <dt>Tồn kho</dt>
              <dd>{product.stockQuantity ?? product.stock ?? 0} sản phẩm</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd>
                <span
                  className={`status ${product.status === "ACTIVE" ? "green" : product.status === "DRAFT" ? "brown" : "gray"}`}
                >
                  {statusLabel}
                </span>
              </dd>
            </div>
            <div>
              <dt>Carton tái sinh</dt>
              <dd>{product.recycledWasteAmount ?? product.carbon ?? "—"}</dd>
            </div>
          </dl>
          <section className="product-view-description">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.shortDescription || "Chưa có mô tả."}</p>
          </section>
          <section className="product-view-variants">
            <h3>Kích cỡ</h3>
            <div>
              {sizes.length ? (
                sizes.map((v) => (
                  <span key={v.id ?? v.name}>
                    <b>{v.name}</b>
                    {v.dimensions && ` · ${v.dimensions}`} · +
                    {Number(v.priceAdjustment).toLocaleString("vi-VN")}đ · tồn{" "}
                    {v.stockQuantity}
                  </span>
                ))
              ) : (
                <em>Không có biến thể kích cỡ</em>
              )}
            </div>
            <h3>Màu sắc</h3>
            <div>
              {colors.length ? (
                colors.map((v) => (
                  <span key={v.id ?? v.name}>
                    <i style={{ background: v.colorHex || "#8a572c" }} />
                    <b>{v.name}</b> · +
                    {Number(v.priceAdjustment).toLocaleString("vi-VN")}đ · tồn{" "}
                    {v.stockQuantity}
                  </span>
                ))
              ) : (
                <em>Không có biến thể màu sắc</em>
              )}
            </div>
          </section>
        </div>
        <footer className="product-view-footer">
          <button onClick={onClose}>Đóng</button>
          <button className="save" onClick={onEdit}>
            <Icon>edit</Icon>Sửa sản phẩm
          </button>
        </footer>
      </section>
    </div>
  );
}

function ProductModal({
  onClose,
  onSaved,
  product,
}: {
  onClose: () => void;
  onSaved: (p: AdminProduct) => void;
  product?: AdminProduct;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    categoryName: product?.categoryName ?? product?.category ?? "",
    shortDescription: product?.shortDescription ?? "",
    roomSpace: product?.roomSpace ?? "",
    basePrice: String(product?.basePrice ?? ""),
    stockQuantity: String(product?.stockQuantity ?? product?.stock ?? 0),
    status: product?.status ?? "ACTIVE",
    recycledWasteAmount: product?.recycledWasteAmount ?? product?.carbon ?? "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<string[]>(
    () => product?.imageUrls?.length ? product.imageUrls : product?.imageUrl ? [product.imageUrl] : [],
  );
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const existingImages = savedImages.filter((url) => !removedImageUrls.includes(url));
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);
  const toInput = (variant: AdminVariant): VariantInput => ({
    name: variant.name,
    dimensions: variant.dimensions ?? "",
    colorHex: variant.colorHex ?? "#8a572c",
    priceAdjustment: String(variant.priceAdjustment ?? 0),
    stockQuantity: String(variant.stockQuantity ?? 0),
  });
  const [sizes, setSizes] = useState<VariantInput[]>(
    () =>
      product?.variants?.filter((v) => v.type === "SIZE").map(toInput) ?? [],
  );
  const [colors, setColors] = useState<VariantInput[]>(
    () =>
      product?.variants?.filter((v) => v.type === "COLOR").map(toInput) ?? [],
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const change = (key: string, value: string) =>
    setForm((v) => ({ ...v, [key]: value }));
  function choose(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list);
    if (next.length + files.length + existingImages.length > 5) {
      setError("Chỉ được chọn tối đa 5 ảnh");
      return;
    }
    if (
      next.some(
        (f) =>
          !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
          f.size > 5 * 1024 * 1024,
      )
    ) {
      setError("Ảnh phải là JPG, PNG hoặc WEBP và không vượt quá 5MB");
      return;
    }
    setError("");
    setFiles((v) => [...v, ...next]);
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let saved = await apiRequest<AdminProduct>(
        product?.id
          ? `/api/admin/products/${product.id}`
          : "/api/admin/products",
        {
          method: product?.id ? "PUT" : "POST",
          body: JSON.stringify({
            ...form,
            removedImageUrls,
            basePrice: Number(form.basePrice),
            stockQuantity: Number(form.stockQuantity),
            sizes: sizes.map((item) => ({
              ...item,
              priceAdjustment: Number(item.priceAdjustment),
              stockQuantity: Number(item.stockQuantity),
              colorHex: null,
            })),
            colors: colors.map((item) => ({
              ...item,
              priceAdjustment: Number(item.priceAdjustment),
              stockQuantity: Number(item.stockQuantity),
              dimensions: null,
            })),
          }),
        },
      );
      if (removedImageUrls.some((url) => saved.imageUrls?.includes(url) || saved.imageUrl === url)) {
        throw new Error("Máy chủ chưa xóa ảnh cũ. Hãy khởi động lại backend rồi bấm Cập nhật sản phẩm lần nữa.");
      }
      // The product update has committed even if the subsequent upload fails.
      setSavedImages(saved.imageUrls ?? []);
      setRemovedImageUrls([]);
      if (files.length && saved.id) {
        const body = new FormData();
        files.forEach((file) => body.append("files", file));
        const uploaded = await apiRequest<
          Array<{ imageUrl: string; primary: boolean }>
        >(`/api/admin/products/${saved.id}/images`, { method: "POST", body });
        saved = {
          ...saved,
          imageUrl: saved.imageUrl ?? uploaded[0]?.imageUrl,
          imageUrls: [
            ...(saved.imageUrls ?? []),
            ...uploaded.map((x) => x.imageUrl),
          ],
        };
      }
      onSaved(saved);
      onClose();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Không thể lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="admin-product-modal">
        <header>
          <div>
            <small>{product ? "CẬP NHẬT SẢN PHẨM" : "SẢN PHẨM MỚI"}</small>
            <h2>{product ? "Sửa tác phẩm decor" : "Thêm tác phẩm decor"}</h2>
          </div>
          <button onClick={onClose}>
            <Icon>close</Icon>
          </button>
        </header>
        <form onSubmit={submit}>
          <div className="admin-form-grid">
            <label className="wide">
              Tên sản phẩm
              <input
                value={form.name}
                onChange={(e) => change("name", e.target.value)}
                maxLength={255}
                required
                placeholder="Ví dụ: Đèn thả trần hoa mây"
              />
            </label>
            <label>
              Danh mục
              <input
                value={form.categoryName}
                onChange={(e) => change("categoryName", e.target.value)}
                maxLength={120}
                required
                placeholder="Đèn trang trí"
              />
            </label>
            <label>
              Không gian
              <input
                value={form.roomSpace}
                onChange={(e) => change("roomSpace", e.target.value)}
                maxLength={100}
                placeholder="Phòng khách"
              />
            </label>
            <label>
              Giá bán (VNĐ)
              <input
                type="number"
                min="0"
                step="1000"
                value={form.basePrice}
                onChange={(e) => change("basePrice", e.target.value)}
                required
              />
            </label>
            <label>
              Tồn kho
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) => change("stockQuantity", e.target.value)}
                required
              />
            </label>
            <label>
              Trạng thái
              <select
                value={form.status}
                onChange={(e) => change("status", e.target.value)}
              >
                <option value="ACTIVE">Đang bán</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="INACTIVE">Đã ẩn</option>
              </select>
            </label>
            <label>
              Lượng carton tái sinh
              <input
                value={form.recycledWasteAmount}
                onChange={(e) => change("recycledWasteAmount", e.target.value)}
                maxLength={255}
                placeholder="0.85 kg"
              />
            </label>
            <div className="wide product-image-upload">
              <div className="upload-title">
                <b>Hình ảnh sản phẩm</b>
                <span>Tối đa 5 ảnh · JPG, PNG, WEBP · 5MB/ảnh</span>
              </div>
              <label className="image-drop">
                <Icon>add_photo_alternate</Icon>
                <strong>Tải ảnh từ máy</strong>
                <span>Nhấn để chọn hình ảnh sản phẩm</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={saving}
                  onChange={(e) => {
                    choose(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              {existingImages.length > 0 && (
                <div className="image-previews">
                  {existingImages.map((url, index) => (
                    <div key={url}>
                      <img src={assetUrl(url)} alt={`${form.name} ${index + 1}`} />
                      <button
                        type="button"
                        title="Xóa ảnh hiện tại"
                        aria-label={`Xóa ảnh hiện tại ${index + 1}`}
                        disabled={saving}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setRemovedImageUrls((urls) => urls.includes(url) ? urls : [...urls, url]);
                          setError("");
                        }}
                      >
                        <Icon>close</Icon>
                      </button>
                      {index === 0 && <span>Ảnh hiện tại</span>}
                    </div>
                  ))}
                </div>
              )}
              {!existingImages.length && !files.length && removedImageUrls.length > 0 && (
                <p role="status" className="image-removal-notice">
                  Đã bỏ ảnh cũ. Bạn có thể tải ảnh mới ở phía trên, sau đó bấm Cập nhật sản phẩm để lưu.
                </p>
              )}
              {files.length > 0 && (
                <div className="image-previews">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`}>
                      <img src={previewUrls[index]} alt="Xem trước" />
                      <button
                        type="button"
                        title="Xóa ảnh"
                        aria-label={`Xóa ảnh mới ${index + 1}`}
                        disabled={saving}
                        onClick={() =>
                          setFiles((v) => v.filter((_, i) => i !== index))
                        }
                      >
                        <Icon>close</Icon>
                      </button>
                      {index === 0 && !existingImages.length && <span>Ảnh chính</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <VariantEditor type="size" items={sizes} setItems={setSizes} />
            <VariantEditor type="color" items={colors} setItems={setColors} />
            <label className="wide">
              Mô tả ngắn
              <textarea
                value={form.shortDescription}
                onChange={(e) => change("shortDescription", e.target.value)}
                maxLength={1000}
                required
                rows={4}
                placeholder="Mô tả câu chuyện và đặc điểm sản phẩm…"
              />
            </label>
          </div>
          {error && <p className="admin-form-error">{error}</p>}
          <footer>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button className="save" disabled={saving}>
              <Icon>save</Icon>
              {saving
                ? "Đang lưu…"
                : product
                  ? "Cập nhật sản phẩm"
                  : "Lưu sản phẩm"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats>();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | undefined>();
  const [viewing, setViewing] = useState<AdminProduct | undefined>();
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState<number>();
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct>();
  async function loadDashboard() {
    setDashboardLoading(true);
    try {
      setDashboard(await apiRequest<DashboardStats>("/api/admin/dashboard"));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Không tải được thống kê");
    } finally {
      setDashboardLoading(false);
    }
  }
  useEffect(() => {
    apiRequest<AdminProduct[]>("/api/admin/products")
      .then(setProducts)
      .catch((e) =>
        setLoadError(
          e instanceof Error ? e.message : "Không tải được sản phẩm",
        ),
      )
      .finally(() => setLoading(false));
    void loadDashboard();
  }, []);
  useEffect(() => {
    const channel = "BroadcastChannel" in window
      ? new BroadcastChannel("nhaminh-orders")
      : undefined;
    if (channel) channel.onmessage = () => {
      apiRequest<AdminProduct[]>("/api/admin/products")
        .then(setProducts)
        .catch((error) => setLoadError(error instanceof Error ? error.message : "Không tải được sản phẩm"));
      void loadDashboard();
    };
    return () => channel?.close();
  }, []);

  async function deleteProduct(product: AdminProduct) {
    if (product.id == null) return;
    setDeletingId(product.id);
    setLoadError("");
    try {
      await apiRequest<void>(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      setProducts((current) => current.filter((item) => item.id !== product.id));
      void loadDashboard();
      if (viewing?.id === product.id) setViewing(undefined);
      if (editing?.id === product.id) {
        setEditing(undefined);
        setOpen(false);
      }
      setDeleteTarget(undefined);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Không thể xóa sản phẩm",
      );
    } finally {
      setDeletingId(undefined);
    }
  }
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Quản lý Sản Phẩm Decor</h1>
          <p>
            Quản lý kho hàng, cập nhật thông tin, bảng giá và theo dõi tác động
            <br />
            tái sinh rác thải carton trên từng thành phẩm thủ công.
          </p>
        </div>
        <div className="admin-page-buttons">
          <button
            className="primary"
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            <Icon>add_circle</Icon> Thêm Sản Phẩm Mới
          </button>
        </div>
      </div>
      <StatCards stats={dashboard} loading={dashboardLoading} />
      {loadError && <p className="admin-form-error">{loadError}</p>}
      {loading ? (
        <div className="admin-table-loading">Đang tải sản phẩm…</div>
      ) : (
        <ProductTable
          products={products}
          onView={setViewing}
          onEdit={(product) => {
            setEditing(product);
            setOpen(true);
          }}
          onDelete={setDeleteTarget}
          deletingId={deletingId}
        />
      )}{" "}
      {open && (
        <ProductModal
          product={editing}
          onClose={() => {
            setOpen(false);
            setEditing(undefined);
          }}
          onSaved={(p) => {
            setProducts((current) =>
              editing
                ? current.map((item) => (item.id === p.id ? p : item))
                : [p, ...current],
            );
            void loadDashboard();
          }}
        />
      )}
      {deleteTarget && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            deletingId == null &&
            setDeleteTarget(undefined)
          }
        >
          <section
            className="admin-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
          >
            <div className="admin-delete-icon">
              <Icon>delete_forever</Icon>
            </div>
            <div className="admin-delete-copy">
              <small>XÁC NHẬN XÓA</small>
              <h2 id="delete-product-title">Xóa sản phẩm?</h2>
              <p>
                Bạn có chắc muốn xóa <strong>“{deleteTarget.name}”</strong>? Sản
                phẩm sẽ biến mất khỏi cửa hàng và thao tác này không thể hoàn tác.
              </p>
            </div>
            <footer>
              <button
                type="button"
                disabled={deletingId != null}
                onClick={() => setDeleteTarget(undefined)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="danger"
                disabled={deletingId != null}
                onClick={() => deleteProduct(deleteTarget)}
              >
                <Icon>{deletingId != null ? "progress_activity" : "delete"}</Icon>
                {deletingId != null ? "Đang xóa…" : "Xóa sản phẩm"}
              </button>
            </footer>
          </section>
        </div>
      )}
      {viewing && (
        <ProductViewModal
          product={viewing}
          onClose={() => setViewing(undefined)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(undefined);
            setOpen(true);
          }}
        />
      )}
    </>
  );
}

function CustomerManagement() {
  const [customers, setCustomers] = useState<CustomerAccount[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [target, setTarget] = useState<CustomerAccount>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<CustomerAccount[]>("/api/admin/customers")
      .then(setCustomers)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Không tải được khách hàng"))
      .finally(() => setLoading(false));
  }, []);

  const normalized = query.trim().toLocaleLowerCase("vi");
  const filtered = customers.filter((customer) =>
    !normalized || [customer.fullName, customer.email, customer.phone ?? ""].some((value) => value.toLocaleLowerCase("vi").includes(normalized)),
  );
  const activeCount = customers.filter((customer) => customer.status === "ACTIVE").length;
  const lockedCount = customers.filter((customer) => customer.status === "LOCKED").length;

  async function changeStatus() {
    if (!target) return;
    const status = target.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    setSaving(true); setError("");
    try {
      const updated = await apiRequest<CustomerAccount>(`/api/admin/customers/${target.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setCustomers((current) => current.map((customer) => customer.id === updated.id ? updated : customer));
      setTarget(undefined);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể cập nhật tài khoản");
    } finally { setSaving(false); }
  }

  return (
    <>
      <div className="admin-page-head customer-page-head">
        <div>
          <h1>Tài khoản Khách hàng</h1>
          <p>Theo dõi tài khoản đăng ký và kiểm soát trạng thái truy cập cửa hàng.</p>
        </div>
      </div>
      <div className="customer-summary">
        <article><Icon>groups</Icon><div><small>Tổng tài khoản</small><strong>{customers.length}</strong></div></article>
        <article><Icon>verified_user</Icon><div><small>Đang hoạt động</small><strong>{activeCount}</strong></div></article>
        <article><Icon>lock</Icon><div><small>Đã khóa</small><strong>{lockedCount}</strong></div></article>
      </div>
      <div className="customer-toolbar">
        <label><Icon>search</Icon><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, email hoặc số điện thoại…" /></label>
        <span>{filtered.length} khách hàng</span>
      </div>
      {error && <p className="admin-form-error">{error}</p>}
      {loading ? <div className="admin-table-loading">Đang tải tài khoản khách hàng…</div> : (
        <div className="admin-table-card customer-table-card">
          <table>
            <thead><tr><th>Khách hàng</th><th>Liên hệ</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td><div className="customer-identity"><span>{customer.fullName.charAt(0).toUpperCase()}</span><div><b>{customer.fullName}</b><small>ID #{customer.id}</small></div></div></td>
                  <td><b>{customer.email}</b><small>{customer.phone || "Chưa cập nhật số điện thoại"}</small></td>
                  <td><span className="customer-role">CUSTOMER</span></td>
                  <td><span className={`customer-status ${customer.status.toLowerCase()}`}>{customer.status === "ACTIVE" ? "Đang hoạt động" : customer.status === "LOCKED" ? "Đã khóa" : "Vô hiệu hóa"}</span></td>
                  <td><button className={`customer-status-action ${customer.status === "ACTIVE" ? "lock" : "unlock"}`} onClick={() => setTarget(customer)}><Icon>{customer.status === "ACTIVE" ? "lock" : "lock_open"}</Icon>{customer.status === "ACTIVE" ? "Khóa" : "Mở khóa"}</button></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={5}><div className="customer-empty"><Icon>person_search</Icon>Không tìm thấy khách hàng phù hợp.</div></td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {target && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && setTarget(undefined)}>
          <section className="admin-delete-modal customer-status-modal" role="alertdialog" aria-modal="true">
            <div className="admin-delete-icon"><Icon>{target.status === "ACTIVE" ? "lock" : "lock_open"}</Icon></div>
            <div className="admin-delete-copy"><small>XÁC NHẬN TRẠNG THÁI</small><h2>{target.status === "ACTIVE" ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}</h2><p>{target.status === "ACTIVE" ? <>Khách hàng <strong>“{target.fullName}”</strong> sẽ không thể đăng nhập cho đến khi được mở khóa.</> : <>Khách hàng <strong>“{target.fullName}”</strong> sẽ có thể đăng nhập trở lại.</>}</p></div>
            <footer><button disabled={saving} onClick={() => setTarget(undefined)}>Hủy</button><button className={target.status === "ACTIVE" ? "danger" : "customer-unlock-confirm"} disabled={saving} onClick={changeStatus}><Icon>{saving ? "progress_activity" : target.status === "ACTIVE" ? "lock" : "lock_open"}</Icon>{saving ? "Đang cập nhật…" : target.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}</button></footer>
          </section>
        </div>
      )}
    </>
  );
}

function ReviewManagement(){
 const [reviews,setReviews]=useState<AdminReview[]>([]);const [view,setView]=useState<"grid"|"table">(()=>localStorage.getItem("nhaminh-admin-review-view")==="table"?"table":"grid");const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [target,setTarget]=useState<AdminReview>();const [deleting,setDeleting]=useState(false);
 useEffect(()=>{apiRequest<AdminReview[]>("/api/admin/reviews").then(setReviews).catch(e=>setError(e instanceof Error?e.message:"Không tải được đánh giá")).finally(()=>setLoading(false));},[]);
 function changeView(next:"grid"|"table"){setView(next);localStorage.setItem("nhaminh-admin-review-view",next);}
 async function remove(){if(!target)return;setDeleting(true);setError("");try{await apiRequest<void>(`/api/admin/reviews/${target.id}`,{method:"DELETE"});setReviews(current=>current.filter(item=>item.id!==target.id));setTarget(undefined);}catch(e){setError(e instanceof Error?e.message:"Không thể xóa đánh giá");}finally{setDeleting(false);}}
 const date=(value:string)=>value?new Date(value).toLocaleString("vi-VN"):"—";
 return <>
  <div className="admin-page-head review-page-head"><div><h1>Đánh giá & Feedback</h1><p>Đánh giá được hiển thị tự động. Chỉ xóa những nội dung vi phạm tiêu chuẩn cộng đồng.</p></div><div className="review-view-toggle"><button className={view==="grid"?"active":""} onClick={()=>changeView("grid")} title="Dạng lưới"><Icon>grid_view</Icon>Lưới</button><button className={view==="table"?"active":""} onClick={()=>changeView("table")} title="Dạng bảng"><Icon>table_rows</Icon>Bảng</button></div></div>
  <div className="review-overview"><article><Icon>reviews</Icon><div><small>TỔNG ĐÁNH GIÁ</small><strong>{reviews.length}</strong></div></article><article><Icon>star</Icon><div><small>ĐIỂM TRUNG BÌNH</small><strong>{reviews.length?(reviews.reduce((sum,item)=>sum+item.rating,0)/reviews.length).toFixed(1):"0.0"}</strong></div></article></div>
  {error&&<p className="admin-form-error">{error}</p>}
  {loading?<div className="admin-table-loading">Đang tải đánh giá…</div>:view==="grid"?<div className="review-list">{reviews.map(review=><article key={review.id} className="review-admin-card"><header><div className="customer-identity"><span>{review.authorName.charAt(0).toUpperCase()}</span><div><b>{review.authorName}</b><small>{review.email||`Khách hàng #${review.customerId??"—"}`}</small></div></div><button className="review-delete-icon" onClick={()=>setTarget(review)} title="Xóa đánh giá"><Icon>delete</Icon></button></header><div className="review-admin-stars">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)} <small>Sản phẩm #{review.productId??"—"}</small></div><p>{review.comment}</p><footer><time>{date(review.createdAt)}</time><button className="review-delete" onClick={()=>setTarget(review)}><Icon>delete</Icon>Xóa vi phạm</button></footer></article>)}{!reviews.length&&<div className="customer-empty"><Icon>reviews</Icon>Chưa có đánh giá nào.</div>}</div>:<div className="admin-table-card review-table-card"><table><thead><tr><th>Khách hàng</th><th>Sản phẩm</th><th>Đánh giá</th><th>Nội dung</th><th>Thời gian</th><th>Thao tác</th></tr></thead><tbody>{reviews.map(review=><tr key={review.id}><td><div className="customer-identity"><span>{review.authorName.charAt(0).toUpperCase()}</span><div><b>{review.authorName}</b><small>{review.email||"—"}</small></div></div></td><td>#{review.productId??"—"}</td><td><span className="review-table-stars">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></td><td className="review-comment-cell">{review.comment}</td><td>{date(review.createdAt)}</td><td><button className="review-delete-icon" onClick={()=>setTarget(review)} title="Xóa vi phạm"><Icon>delete</Icon></button></td></tr>)}</tbody></table>{!reviews.length&&<div className="customer-empty"><Icon>reviews</Icon>Chưa có đánh giá nào.</div>}</div>}
  {target&&<div className="admin-modal-backdrop" onMouseDown={event=>event.target===event.currentTarget&&!deleting&&setTarget(undefined)}><section className="admin-delete-modal" role="alertdialog" aria-modal="true"><div className="admin-delete-icon"><Icon>delete_forever</Icon></div><div className="admin-delete-copy"><small>XÓA NỘI DUNG VI PHẠM</small><h2>Xóa đánh giá này?</h2><p>Đánh giá của <strong>“{target.authorName}”</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống và không còn hiển thị trên cửa hàng.</p></div><footer><button disabled={deleting} onClick={()=>setTarget(undefined)}>Hủy</button><button className="danger" disabled={deleting} onClick={remove}><Icon>{deleting?"progress_activity":"delete"}</Icon>{deleting?"Đang xóa…":"Xóa đánh giá"}</button></footer></section></div>}
 </>;
}

function GreenMemberManagement() {
  const [members, setMembers] = useState<GreenMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    apiRequest<GreenMember[]>("/api/admin/green-members")
      .then(setMembers)
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được danh sách thành viên"))
      .finally(() => setLoading(false));
  }, []);
  const money = (value:number) => value.toLocaleString("vi-VN", { style:"currency", currency:"VND" });
  return <>
    <div className="admin-page-head"><div><h1>Thành viên Sống Xanh</h1><p>Xếp hạng khách hàng theo tổng số sản phẩm trong các đơn hàng hợp lệ, không bao gồm đơn đã hủy.</p></div></div>
    <div className="member-summary"><article><Icon>groups</Icon><div><small>KHÁCH ĐÃ MUA HÀNG</small><strong>{members.length}</strong></div></article><article><Icon>shopping_bag</Icon><div><small>TỔNG SẢN PHẨM ĐÃ MUA</small><strong>{members.reduce((sum,item)=>sum+item.totalItems,0)}</strong></div></article></div>
    {error && <p className="admin-form-error">{error}</p>}
    {loading ? <div className="admin-table-loading">Đang tổng hợp dữ liệu mua hàng…</div> : <div className="admin-table-card member-ranking-table"><table><thead><tr><th>Hạng</th><th>Khách hàng</th><th>Sản phẩm đã mua</th><th>Số đơn hợp lệ</th><th>Tổng chi tiêu</th><th>Lần mua gần nhất</th></tr></thead><tbody>{members.map((member,index)=><tr key={member.id}><td><span className={`member-rank rank-${index+1}`}>{index+1}</span></td><td><div className="customer-identity"><span>{member.fullName.charAt(0).toUpperCase()}</span><div><b>{member.fullName}</b><small>{member.email}{member.phone ? ` · ${member.phone}` : ""}</small></div></div></td><td><strong>{member.totalItems}</strong> sản phẩm</td><td>{member.totalOrders} đơn</td><td><strong>{money(member.totalSpent)}</strong></td><td>{new Date(member.lastOrderAt).toLocaleString("vi-VN")}</td></tr>)}</tbody></table>{!members.length&&<div className="customer-empty"><Icon>eco</Icon>Chưa có khách hàng nào đặt hàng.</div>}</div>}
  </>;
}

function OrderManagement() {
  const [orders,setOrders]=useState<OrderNotification[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [deleting,setDeleting]=useState<OrderNotification>();
  const [savingId,setSavingId]=useState<number>();
  useEffect(()=>{
    apiRequest<OrderNotification[]>("/api/admin/order-notifications")
      .then(items=>{
        setOrders(items);
        if(items.length){
          const newest=Math.max(...items.map(item=>item.id));
          localStorage.setItem("nhaminh-admin-last-seen-order",String(newest));
          window.dispatchEvent(new Event("nhaminh-orders-read"));
        }
      })
      .catch(e=>setError(e instanceof Error?e.message:"Không tải được đơn hàng"))
      .finally(()=>setLoading(false));
  },[]);
  const confirm=async(order:OrderNotification)=>{setSavingId(order.id);setError("");try{const updated=await apiRequest<OrderNotification>(`/api/admin/orders/${order.id}/confirm`,{method:"PATCH"});setOrders(current=>current.map(item=>item.id===updated.id?updated:item));}catch(e){setError(e instanceof Error?e.message:"Không thể xác nhận đơn hàng");}finally{setSavingId(undefined);}};
  const cancel=async(order:OrderNotification)=>{if(!window.confirm(`Hủy đơn #${order.orderCode}?`))return;setSavingId(order.id);setError("");try{const updated=await apiRequest<OrderNotification>(`/api/admin/orders/${order.id}/cancel`,{method:"PATCH"});setOrders(current=>current.map(item=>item.id===updated.id?updated:item));}catch(e){setError(e instanceof Error?e.message:"Không thể hủy đơn hàng");}finally{setSavingId(undefined);}};
  const remove=async()=>{if(!deleting)return;setSavingId(deleting.id);setError("");try{await apiRequest<void>(`/api/admin/orders/${deleting.id}`,{method:"DELETE"});setOrders(current=>current.filter(item=>item.id!==deleting.id));setDeleting(undefined);}catch(e){setError(e instanceof Error?e.message:"Không thể xóa đơn hàng");}finally{setSavingId(undefined);}};
  const status=(value:string)=>value==="PENDING"?"Chờ xác nhận":value==="CONFIRMED"?"Đã xác nhận":value==="PREPARING"?"Đang chuẩn bị":value==="SHIPPING"?"Đang giao":value==="COMPLETED"?"Hoàn thành":value==="CANCELLED"?"Đã hủy":value;
  return <>
    <div className="admin-page-head"><div><h1>Thông báo Đơn hàng</h1><p>Theo dõi các đơn mới được khách hàng gửi đến cửa hàng.</p></div></div>
    {error&&<p className="admin-form-error">{error}</p>}
    {loading?<div className="admin-table-loading">Đang tải đơn hàng…</div>:<div className="admin-table-card order-notification-table"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng thanh toán</th><th>Trạng thái</th><th>Thời gian đặt</th><th>Thao tác</th></tr></thead><tbody>{orders.map(order=><tr key={order.id}><td><strong>#{order.orderCode}</strong></td><td><div className="customer-identity"><span>{order.customerName.charAt(0).toUpperCase()}</span><div><b>{order.customerName}</b><small>Đơn hàng mới</small></div></div></td><td><strong>{order.totalAmount.toLocaleString("vi-VN")}đ</strong></td><td><span className={`order-status ${order.status.toLowerCase()}`}>{status(order.status)}</span></td><td>{new Date(order.createdAt).toLocaleString("vi-VN")}</td><td><div className="order-actions">{order.status==="PENDING"&&<button className="confirm" disabled={savingId===order.id} onClick={()=>confirm(order)}><Icon>check_circle</Icon>{savingId===order.id?"Đang xử lý…":"Xác nhận"}</button>}{["PENDING","CONFIRMED"].includes(order.status)&&<button className="cancel" disabled={savingId===order.id} onClick={()=>cancel(order)}><Icon>cancel</Icon>Hủy đơn</button>}<button className="delete" disabled={savingId===order.id} onClick={()=>setDeleting(order)}><Icon>delete</Icon>Xóa</button></div></td></tr>)}</tbody></table>{!orders.length&&<div className="customer-empty"><Icon>local_shipping</Icon>Chưa có đơn đặt hàng nào.</div>}</div>}
    {deleting&&<div className="admin-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&!savingId&&setDeleting(undefined)}><section className="admin-delete-modal" role="alertdialog" aria-modal="true"><div className="admin-delete-icon"><Icon>delete_forever</Icon></div><div className="admin-delete-copy"><small>XÓA ĐƠN HÀNG</small><h2>Xóa đơn #{deleting.orderCode}?</h2><p>Đơn hàng của <strong>{deleting.customerName}</strong> và toàn bộ chi tiết sản phẩm trong đơn sẽ bị xóa vĩnh viễn.</p></div><footer><button disabled={!!savingId} onClick={()=>setDeleting(undefined)}>Hủy</button><button className="danger" disabled={!!savingId} onClick={remove}><Icon>delete</Icon>{savingId?"Đang xóa…":"Xóa đơn"}</button></footer></section></div>}
  </>;
}

function EmptyPage({ type }: { type: string }) {
  return (
    <div className="admin-empty">
      <Icon>{type === "orders" ? "local_shipping" : "dashboard"}</Icon>
      <h1>{type === "orders" ? "Đơn hàng & Vận chuyển" : "Dashboard"}</h1>
      <p>Khu vực này đã được bảo vệ và đang sẵn sàng kết nối dữ liệu.</p>
      <Link to="/admin/dashboard">Về quản lý sản phẩm</Link>
    </div>
  );
}
function Layout({ page = "products" }: { page?: string }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <main className="admin-content">
          {page === "products" ? <ProductManagement /> : page === "customers" ? <CustomerManagement /> : page === "reviews" ? <ReviewManagement /> : page === "messages" ? <MessageManagement /> : page === "members" ? <GreenMemberManagement /> : page === "orders" ? <OrderManagement /> : <EmptyPage type={page} />}
        </main>
      </div>
    </div>
  );
}

export function AdminApp() {
  return (
    <Routes>
      <Route index element={<AdminLogin />} />
      <Route
        path="dashboard"
        element={
          <Guard>
            <Layout />
          </Guard>
        }
      />
      <Route
        path="products"
        element={
          <Guard>
            <Layout />
          </Guard>
        }
      />
      <Route
        path="orders"
        element={
          <Guard>
            <Layout page="orders" />
          </Guard>
        }
      />
      <Route
        path="customers"
        element={
          <Guard>
            <Layout page="customers" />
          </Guard>
        }
      />
      <Route path="reviews" element={<Guard><Layout page="reviews" /></Guard>} />
      <Route path="messages" element={<Guard><Layout page="messages" /></Guard>} />
      <Route path="members" element={<Guard><Layout page="members" /></Guard>} />
      <Route path="*" element={<Navigate to="/login/admin" replace />} />
    </Routes>
  );
}
