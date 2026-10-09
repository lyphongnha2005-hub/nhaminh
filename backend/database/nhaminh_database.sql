/*
    NHA MINH - SQL SERVER DATABASE
    --------------------------------
    Muc dich:
      - Quan ly tai khoan va phan quyen ADMIN/CUSTOMER
      - Quan ly danh muc, san pham, anh va bien the
      - Quan ly danh sach yeu thich
      - Quan ly don hang va chi tiet don hang
      - Chi tao cau truc; khong chen san du lieu nghiep vu

    Cach chay:
      1. Mo SQL Server Management Studio (SSMS).
      2. Ket noi SQL Server.
      3. Mo file nay va chay toan bo script mot lan.

    Luu y:
      - Script chi tao database neu NhaMinhDb chua ton tai.
      - Mat khau phai duoc ma hoa BCrypt tai backend Java.
      - Khong luu mat khau ro trong database.
*/

USE master;
GO

IF DB_ID(N'NhaMinhDb') IS NULL
BEGIN
    CREATE DATABASE NhaMinhDb;
END;
GO

USE NhaMinhDb;
GO

/* =========================
   1. PHAN QUYEN VA TAI KHOAN
   ========================= */

CREATE TABLE dbo.roles (
    id          TINYINT IDENTITY(1,1) NOT NULL,
    name        VARCHAR(20) NOT NULL,
    description NVARCHAR(255) NULL,
    created_at  DATETIME2(0) NOT NULL
        CONSTRAINT DF_roles_created_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_roles PRIMARY KEY (id),
    CONSTRAINT UQ_roles_name UNIQUE (name),
    CONSTRAINT CK_roles_name CHECK (name IN ('ADMIN', 'CUSTOMER'))
);
GO

CREATE TABLE dbo.admins (
    id            BIGINT IDENTITY(1,1) NOT NULL,
    role_id       TINYINT NOT NULL,
    full_name     NVARCHAR(120) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    phone         VARCHAR(20) NULL,
    password_hash VARCHAR(100) NOT NULL,
    status        VARCHAR(20) NOT NULL
        CONSTRAINT DF_admins_status DEFAULT 'ACTIVE',
    created_at    DATETIME2(0) NOT NULL
        CONSTRAINT DF_admins_created_at DEFAULT SYSUTCDATETIME(),
    updated_at    DATETIME2(0) NOT NULL
        CONSTRAINT DF_admins_updated_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_admins PRIMARY KEY (id),
    CONSTRAINT FK_admins_roles FOREIGN KEY (role_id) REFERENCES dbo.roles(id),
    CONSTRAINT UQ_admins_email UNIQUE (email),
    CONSTRAINT CK_admins_status CHECK (status IN ('ACTIVE', 'LOCKED', 'DISABLED'))
);
GO

CREATE UNIQUE INDEX UX_admins_phone
    ON dbo.admins(phone)
    WHERE phone IS NOT NULL;
GO

CREATE TABLE dbo.customers (
    id            BIGINT IDENTITY(1,1) NOT NULL,
    role_id       TINYINT NOT NULL,
    full_name     NVARCHAR(120) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    phone         VARCHAR(20) NULL,
    password_hash VARCHAR(100) NOT NULL,
    status        VARCHAR(20) NOT NULL
        CONSTRAINT DF_customers_status DEFAULT 'ACTIVE',
    created_at    DATETIME2(0) NOT NULL
        CONSTRAINT DF_customers_created_at DEFAULT SYSUTCDATETIME(),
    updated_at    DATETIME2(0) NOT NULL
        CONSTRAINT DF_customers_updated_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_customers PRIMARY KEY (id),
    CONSTRAINT FK_customers_roles FOREIGN KEY (role_id) REFERENCES dbo.roles(id),
    CONSTRAINT UQ_customers_email UNIQUE (email),
    CONSTRAINT CK_customers_status CHECK (status IN ('ACTIVE', 'LOCKED', 'DISABLED'))
);
GO

CREATE UNIQUE INDEX UX_customers_phone
    ON dbo.customers(phone)
    WHERE phone IS NOT NULL;
GO

/* =========================
   2. DANH MUC VA SAN PHAM
   ========================= */

CREATE TABLE dbo.categories (
    id          BIGINT IDENTITY(1,1) NOT NULL,
    name        NVARCHAR(120) NOT NULL,
    slug        VARCHAR(160) NOT NULL,
    description NVARCHAR(1000) NULL,
    status      VARCHAR(20) NOT NULL
        CONSTRAINT DF_categories_status DEFAULT 'ACTIVE',
    created_at  DATETIME2(0) NOT NULL
        CONSTRAINT DF_categories_created_at DEFAULT SYSUTCDATETIME(),
    updated_at  DATETIME2(0) NOT NULL
        CONSTRAINT DF_categories_updated_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_categories PRIMARY KEY (id),
    CONSTRAINT UQ_categories_name UNIQUE (name),
    CONSTRAINT UQ_categories_slug UNIQUE (slug),
    CONSTRAINT CK_categories_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);
GO

CREATE TABLE dbo.products (
    id                      BIGINT IDENTITY(1,1) NOT NULL,
    category_id             BIGINT NOT NULL,
    name                    NVARCHAR(255) NOT NULL,
    slug                    VARCHAR(255) NOT NULL,
    short_description       NVARCHAR(1000) NOT NULL,
    story                   NVARCHAR(MAX) NULL,
    room_space              NVARCHAR(100) NULL,
    base_price              DECIMAL(18,2) NOT NULL,
    original_price          DECIMAL(18,2) NULL,
    badge                   NVARCHAR(100) NULL,
    material                NVARCHAR(500) NULL,
    dimensions              NVARCHAR(255) NULL,
    weight                  NVARCHAR(255) NULL,
    recycled_waste_amount   NVARCHAR(255) NULL,
    finish                  NVARCHAR(500) NULL,
    origin                  NVARCHAR(255) NULL,
    care_guide              NVARCHAR(MAX) NULL,
    stock_quantity          INT NOT NULL
        CONSTRAINT DF_products_stock DEFAULT 0,
    status                  VARCHAR(20) NOT NULL
        CONSTRAINT DF_products_status DEFAULT 'DRAFT',
    is_featured             BIT NOT NULL
        CONSTRAINT DF_products_featured DEFAULT 0,
    is_popular              BIT NOT NULL
        CONSTRAINT DF_products_popular DEFAULT 0,
    created_at              DATETIME2(0) NOT NULL
        CONSTRAINT DF_products_created_at DEFAULT SYSUTCDATETIME(),
    updated_at              DATETIME2(0) NOT NULL
        CONSTRAINT DF_products_updated_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_products PRIMARY KEY (id),
    CONSTRAINT FK_products_categories FOREIGN KEY (category_id)
        REFERENCES dbo.categories(id),
    CONSTRAINT UQ_products_slug UNIQUE (slug),
    CONSTRAINT CK_products_base_price CHECK (base_price >= 0),
    CONSTRAINT CK_products_original_price CHECK (
        original_price IS NULL OR original_price >= 0
    ),
    CONSTRAINT CK_products_stock CHECK (stock_quantity >= 0),
    CONSTRAINT CK_products_status CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE')),
    CONSTRAINT CK_products_care_guide_json CHECK (
        care_guide IS NULL OR ISJSON(care_guide) = 1
    )
);
GO

CREATE INDEX IX_products_category_status
    ON dbo.products(category_id, status);
GO

CREATE INDEX IX_products_name
    ON dbo.products(name);
GO

CREATE TABLE dbo.product_images (
    id            BIGINT IDENTITY(1,1) NOT NULL,
    product_id    BIGINT NOT NULL,
    image_url     NVARCHAR(1000) NOT NULL,
    alt_text      NVARCHAR(255) NULL,
    display_order INT NOT NULL
        CONSTRAINT DF_product_images_order DEFAULT 0,
    is_primary    BIT NOT NULL
        CONSTRAINT DF_product_images_primary DEFAULT 0,
    created_at    DATETIME2(0) NOT NULL
        CONSTRAINT DF_product_images_created_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_product_images PRIMARY KEY (id),
    CONSTRAINT FK_product_images_products FOREIGN KEY (product_id)
        REFERENCES dbo.products(id) ON DELETE CASCADE,
    CONSTRAINT CK_product_images_order CHECK (display_order >= 0)
);
GO

CREATE INDEX IX_product_images_product_order
    ON dbo.product_images(product_id, display_order);
GO

CREATE UNIQUE INDEX UX_product_images_primary
    ON dbo.product_images(product_id)
    WHERE is_primary = 1;
GO

CREATE TABLE dbo.product_variants (
    id               BIGINT IDENTITY(1,1) NOT NULL,
    product_id       BIGINT NOT NULL,
    variant_type     VARCHAR(20) NOT NULL,
    code             VARCHAR(100) NOT NULL,
    name             NVARCHAR(255) NOT NULL,
    dimensions       NVARCHAR(255) NULL,
    color_hex        CHAR(7) NULL,
    price_adjustment DECIMAL(18,2) NOT NULL
        CONSTRAINT DF_product_variants_price DEFAULT 0,
    stock_quantity   INT NOT NULL
        CONSTRAINT DF_product_variants_stock DEFAULT 0,
    status           VARCHAR(20) NOT NULL
        CONSTRAINT DF_product_variants_status DEFAULT 'ACTIVE',
    created_at       DATETIME2(0) NOT NULL
        CONSTRAINT DF_product_variants_created_at DEFAULT SYSUTCDATETIME(),
    updated_at       DATETIME2(0) NOT NULL
        CONSTRAINT DF_product_variants_updated_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_product_variants PRIMARY KEY (id),
    CONSTRAINT FK_product_variants_products FOREIGN KEY (product_id)
        REFERENCES dbo.products(id) ON DELETE CASCADE,
    CONSTRAINT UQ_product_variants_code UNIQUE (product_id, code),
    CONSTRAINT CK_product_variants_type CHECK (
        variant_type IN ('SIZE', 'COLOR', 'FITTING')
    ),
    CONSTRAINT CK_product_variants_stock CHECK (stock_quantity >= 0),
    CONSTRAINT CK_product_variants_status CHECK (status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT CK_product_variants_color_hex CHECK (
        color_hex IS NULL OR color_hex LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'
    )
);
GO

CREATE INDEX IX_product_variants_product_type
    ON dbo.product_variants(product_id, variant_type, status);
GO

/* =========================
   3. DANH SACH YEU THICH
   ========================= */

CREATE TABLE dbo.wishlists (
    id         BIGINT IDENTITY(1,1) NOT NULL,
    customer_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME2(0) NOT NULL
        CONSTRAINT DF_wishlists_created_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_wishlists PRIMARY KEY (id),
    CONSTRAINT FK_wishlists_customers FOREIGN KEY (customer_id)
        REFERENCES dbo.customers(id) ON DELETE CASCADE,
    CONSTRAINT FK_wishlists_products FOREIGN KEY (product_id)
        REFERENCES dbo.products(id) ON DELETE CASCADE,
    CONSTRAINT UQ_wishlists_customer_product UNIQUE (customer_id, product_id)
);
GO

/* =========================
   4. DON HANG
   ========================= */

CREATE TABLE dbo.orders (
    id                BIGINT IDENTITY(1,1) NOT NULL,
    order_code        VARCHAR(30) NOT NULL,
    customer_id       BIGINT NULL,
    customer_name     NVARCHAR(120) NOT NULL,
    customer_phone    VARCHAR(20) NOT NULL,
    customer_email    VARCHAR(255) NULL,
    shipping_address  NVARCHAR(500) NOT NULL,
    note              NVARCHAR(1000) NULL,
    subtotal          DECIMAL(18,2) NOT NULL,
    shipping_fee      DECIMAL(18,2) NOT NULL
        CONSTRAINT DF_orders_shipping_fee DEFAULT 0,
    total_amount      DECIMAL(18,2) NOT NULL,
    payment_method    VARCHAR(20) NOT NULL
        CONSTRAINT DF_orders_payment_method DEFAULT 'COD',
    payment_status    VARCHAR(20) NOT NULL
        CONSTRAINT DF_orders_payment_status DEFAULT 'UNPAID',
    order_status      VARCHAR(20) NOT NULL
        CONSTRAINT DF_orders_order_status DEFAULT 'PENDING',
    created_at        DATETIME2(0) NOT NULL
        CONSTRAINT DF_orders_created_at DEFAULT SYSUTCDATETIME(),
    updated_at        DATETIME2(0) NOT NULL
        CONSTRAINT DF_orders_updated_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_orders PRIMARY KEY (id),
    CONSTRAINT FK_orders_customers FOREIGN KEY (customer_id)
        REFERENCES dbo.customers(id) ON DELETE SET NULL,
    CONSTRAINT UQ_orders_order_code UNIQUE (order_code),
    CONSTRAINT CK_orders_subtotal CHECK (subtotal >= 0),
    CONSTRAINT CK_orders_shipping_fee CHECK (shipping_fee >= 0),
    CONSTRAINT CK_orders_total CHECK (total_amount >= 0),
    CONSTRAINT CK_orders_total_formula CHECK (total_amount = subtotal + shipping_fee),
    CONSTRAINT CK_orders_payment_method CHECK (
        payment_method IN ('COD', 'VIETQR', 'MOMO', 'ZALOPAY')
    ),
    CONSTRAINT CK_orders_payment_status CHECK (
        payment_status IN ('UNPAID', 'PAID', 'FAILED', 'REFUNDED')
    ),
    CONSTRAINT CK_orders_order_status CHECK (
        order_status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED')
    )
);
GO

CREATE INDEX IX_orders_customer_created
    ON dbo.orders(customer_id, created_at DESC);
GO

CREATE INDEX IX_orders_status_created
    ON dbo.orders(order_status, created_at DESC);
GO

CREATE TABLE dbo.order_items (
    id                BIGINT IDENTITY(1,1) NOT NULL,
    order_id          BIGINT NOT NULL,
    product_id        BIGINT NULL,
    product_name      NVARCHAR(255) NOT NULL,
    product_image_url NVARCHAR(1000) NULL,
    selected_variants NVARCHAR(MAX) NULL,
    unit_price        DECIMAL(18,2) NOT NULL,
    quantity          INT NOT NULL,
    line_total        AS (CONVERT(DECIMAL(18,2), unit_price * quantity)) PERSISTED,

    CONSTRAINT PK_order_items PRIMARY KEY (id),
    CONSTRAINT FK_order_items_orders FOREIGN KEY (order_id)
        REFERENCES dbo.orders(id) ON DELETE CASCADE,
    CONSTRAINT FK_order_items_products FOREIGN KEY (product_id)
        REFERENCES dbo.products(id) ON DELETE SET NULL,
    CONSTRAINT CK_order_items_price CHECK (unit_price >= 0),
    CONSTRAINT CK_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT CK_order_items_variants_json CHECK (
        selected_variants IS NULL OR ISJSON(selected_variants) = 1
    )
);
GO

CREATE INDEX IX_order_items_order
    ON dbo.order_items(order_id);
GO

/* =========================
   5. LICH SU CAP NHAT DON HANG
   ========================= */

CREATE TABLE dbo.order_status_history (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    order_id       BIGINT NOT NULL,
    changed_by     BIGINT NULL,
    old_status     VARCHAR(20) NULL,
    new_status     VARCHAR(20) NOT NULL,
    note           NVARCHAR(500) NULL,
    created_at     DATETIME2(0) NOT NULL
        CONSTRAINT DF_order_history_created_at DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_order_status_history PRIMARY KEY (id),
    CONSTRAINT FK_order_history_orders FOREIGN KEY (order_id)
        REFERENCES dbo.orders(id) ON DELETE CASCADE,
    CONSTRAINT FK_order_history_admins FOREIGN KEY (changed_by)
        REFERENCES dbo.admins(id) ON DELETE SET NULL,
    CONSTRAINT CK_order_history_old_status CHECK (
        old_status IS NULL OR old_status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED')
    ),
    CONSTRAINT CK_order_history_new_status CHECK (
        new_status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED')
    )
);
GO

CREATE INDEX IX_order_history_order_created
    ON dbo.order_status_history(order_id, created_at);
GO

/* =========================
   6. DANH GIA VA FEEDBACK
   ========================= */

CREATE TABLE dbo.product_reviews (
    id           BIGINT IDENTITY(1,1) NOT NULL,
    customer_id  BIGINT NULL,
    product_id   BIGINT NULL,
    author_name  NVARCHAR(120) NOT NULL,
    email        VARCHAR(255) NULL,
    rating       TINYINT NOT NULL,
    comment      NVARCHAR(2000) NOT NULL,
    status       VARCHAR(20) NOT NULL
        CONSTRAINT DF_product_reviews_status DEFAULT 'APPROVED',
    created_at   DATETIME2(0) NOT NULL
        CONSTRAINT DF_product_reviews_created_at DEFAULT SYSUTCDATETIME(),
    moderated_at DATETIME2(0) NULL,

    CONSTRAINT PK_product_reviews PRIMARY KEY (id),
    CONSTRAINT FK_product_reviews_customers FOREIGN KEY (customer_id)
        REFERENCES dbo.customers(id) ON DELETE SET NULL,
    CONSTRAINT FK_product_reviews_products FOREIGN KEY (product_id)
        REFERENCES dbo.products(id) ON DELETE SET NULL,
    CONSTRAINT CK_product_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT CK_product_reviews_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);
GO

CREATE INDEX IX_product_reviews_status_created
    ON dbo.product_reviews(status, created_at DESC);
GO

CREATE INDEX IX_product_reviews_product_status
    ON dbo.product_reviews(product_id, status, created_at DESC);
GO

/* =========================
   7. TAI KHOAN ADMIN KHOI TAO
   =========================

   Email:    admin@gmail.com
   Password: 123456

   Password duoc luu bang BCrypt cost 12, khong luu dang chu thuong.
   Nen doi mat khau ngay sau lan dang nhap dau tien.
*/

IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE name = 'ADMIN')
BEGIN
    INSERT INTO dbo.roles(name, description)
    VALUES ('ADMIN', N'Quản trị viên hệ thống');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE name = 'CUSTOMER')
BEGIN
    INSERT INTO dbo.roles(name, description)
    VALUES ('CUSTOMER', N'Khách hàng');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.admins WHERE email = 'admin@gmail.com')
BEGIN
    INSERT INTO dbo.admins(
        role_id,
        full_name,
        email,
        phone,
        password_hash,
        status
    )
    SELECT
        id,
        N'Nhà Mình Admin',
        'admin@gmail.com',
        NULL,
        '$2a$12$NyUzV.rySnIEluyTU0IK1./dvI89.RiC4Eb6akPSi8QM6.Yy.7KNS',
        'ACTIVE'
    FROM dbo.roles
    WHERE name = 'ADMIN';
END;
GO
