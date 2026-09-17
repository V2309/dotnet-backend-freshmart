-- ============================================================
--  FRESHMART POS SYSTEM — PostgreSQL Database Schema
--  Version: 1.0.0
--  Encoding: UTF-8
--  Created: 2026-09-11
-- ============================================================
--
--  MODULE LIST:
--    1. Extensions & Schema Setup
--    2. Enums (Types)
--    3. Suppliers (Nhà cung cấp)
--    4. Categories (Danh mục hàng hoá)
--    5. Products (Sản phẩm / Hàng hoá)
--    6. Customers & Loyalty (Khách hàng & Tích điểm)
--    7. Employees & Shifts (Nhân viên & Ca làm việc)
--    8. Orders & POS (Đơn bán hàng)
--    9. Purchases / Purchase Orders (Nhập hàng)
--   10. Inventory & Adjustments (Tồn kho & Kiểm kê)
--   11. Notifications (Thông báo)
--   12. Reports Snapshot (Báo cáo tổng hợp)
--   13. Indexes
--   14. Functions & Triggers (Tự động cập nhật)
--   15. Sample seed data (dữ liệu mẫu)
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS & SCHEMA SETUP
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "unaccent";    -- Vietnamese search support
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- fuzzy name search

-- App schema (namespace isolation)
CREATE SCHEMA IF NOT EXISTS freshmart;
SET search_path TO freshmart, public;

-- ============================================================
-- 2. ENUMS
-- ============================================================
CREATE TYPE stock_status     AS ENUM ('in_stock', 'low_stock', 'out_of_stock');
CREATE TYPE payment_method   AS ENUM ('cash', 'vietqr', 'pos_card');
CREATE TYPE order_status     AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE purchase_status  AS ENUM ('draft', 'pending', 'received', 'cancelled');
CREATE TYPE shift_status     AS ENUM ('active', 'closed');
CREATE TYPE notif_type       AS ENUM ('warning', 'info', 'success');
CREATE TYPE loyalty_tier     AS ENUM ('Than thiet', 'Bac', 'Vang', 'Kim Cuong');
CREATE TYPE employee_role    AS ENUM ('cashier', 'store_manager', 'warehouse_staff', 'admin');
CREATE TYPE adjust_reason    AS ENUM ('stock_count', 'damage', 'expiry', 'return', 'other');

-- ============================================================
-- 3. SUPPLIERS (Nha cung cap)
-- ============================================================
CREATE TABLE suppliers (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    code          VARCHAR(20)   NOT NULL UNIQUE,
    name          VARCHAR(255)  NOT NULL,
    contact_name  VARCHAR(150),
    phone         VARCHAR(20),
    email         VARCHAR(150),
    address       TEXT,
    tax_code      VARCHAR(20),
    bank_account  VARCHAR(50),
    bank_name     VARCHAR(150),
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    notes         TEXT,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE suppliers IS 'Danh sach nha cung cap hang hoa';

-- ============================================================
-- 4. CATEGORIES (Danh muc hang hoa)
-- ============================================================
CREATE TABLE categories (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    slug       VARCHAR(50)  NOT NULL UNIQUE,
    name       VARCHAR(100) NOT NULL,
    icon       VARCHAR(50),
    sort_order SMALLINT     NOT NULL DEFAULT 0,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'Danh muc / nhom hang hoa';

-- ============================================================
-- 5. PRODUCTS (San pham)
-- ============================================================
CREATE TABLE products (
    id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    sku          VARCHAR(30)    NOT NULL UNIQUE,
    barcode      VARCHAR(50)    UNIQUE,
    name         VARCHAR(255)   NOT NULL,
    description  TEXT,
    category_id  UUID           NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    supplier_id  UUID           REFERENCES suppliers(id) ON DELETE SET NULL,
    unit         VARCHAR(20)    NOT NULL DEFAULT 'Cai',
    cost_price   NUMERIC(15,2)  NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
    sell_price   NUMERIC(15,2)  NOT NULL DEFAULT 0 CHECK (sell_price >= 0),
    vat_rate     NUMERIC(5,2)   NOT NULL DEFAULT 8.00,
    stock        INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock    INTEGER        NOT NULL DEFAULT 0,
    image_url    TEXT,  
    status       stock_status   NOT NULL DEFAULT 'in_stock',
    is_active    BOOLEAN        NOT NULL DEFAULT TRUE,
    expiry_date  DATE,
    notes        TEXT,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE products IS 'Danh muc hang hoa / san pham cua cua hang';
COMMENT ON COLUMN products.stock IS 'So luong ton kho hien tai';
COMMENT ON COLUMN products.min_stock IS 'Nguong ton kho toi thieu, khi stock < min_stock se chuyen sang low_stock';

-- ============================================================
-- 6. CUSTOMERS & LOYALTY (Khach hang & Tich diem)
-- ============================================================
CREATE TABLE customers (
    id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    code         VARCHAR(20)    NOT NULL UNIQUE,
    name         VARCHAR(150)   NOT NULL,
    phone        VARCHAR(20)    UNIQUE,
    email        VARCHAR(150),
    address      TEXT,
    birth_date   DATE,
    gender       CHAR(1),
    points       INTEGER        NOT NULL DEFAULT 0 CHECK (points >= 0),
    total_spent  NUMERIC(15,2)  NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
    tier         loyalty_tier   NOT NULL DEFAULT 'Than thiet',
    last_visit   DATE,
    is_active    BOOLEAN        NOT NULL DEFAULT TRUE,
    notes        TEXT,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE customers IS 'Ho so khach hang thanh vien, tich diem va hang the';

CREATE TABLE loyalty_transactions (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id      UUID        NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_id         UUID,
    transaction_type VARCHAR(20) NOT NULL,
    points_delta     INTEGER     NOT NULL,
    points_before    INTEGER     NOT NULL,
    points_after     INTEGER     NOT NULL,
    note             TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE loyalty_transactions IS 'Lich su tich luy / doi diem thuong cua khach hang';

-- ============================================================
-- 7. EMPLOYEES & SHIFTS (Nhan vien & Ca lam viec)
-- ============================================================
CREATE TABLE employees (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    code         VARCHAR(20)   NOT NULL UNIQUE,
    name         VARCHAR(150)  NOT NULL,
    phone        VARCHAR(20),
    email        VARCHAR(150),
    role         employee_role NOT NULL DEFAULT 'cashier',
    pin_hash     TEXT,
    is_active    BOOLEAN       NOT NULL DEFAULT TRUE,
    hired_date   DATE,
    notes        TEXT,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE employees IS 'Danh sach nhan vien (thu ngan, quan ly, thu kho)';

CREATE TABLE shifts (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id    UUID           NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    shift_name     VARCHAR(100)   NOT NULL,
    start_time     TIMESTAMPTZ    NOT NULL,
    end_time       TIMESTAMPTZ,
    starting_cash  NUMERIC(15,2)  NOT NULL DEFAULT 0,
    expected_cash  NUMERIC(15,2)  NOT NULL DEFAULT 0,
    actual_cash    NUMERIC(15,2),
    total_revenue  NUMERIC(15,2)  NOT NULL DEFAULT 0,
    order_count    INTEGER        NOT NULL DEFAULT 0,
    status         shift_status   NOT NULL DEFAULT 'active',
    notes          TEXT,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE shifts IS 'Ca lam viec cua thu ngan, ghi nhan doanh thu theo ca';

-- ============================================================
-- 8. ORDERS & POS (Don ban hang)
-- ============================================================
CREATE TABLE orders (
    id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    code             VARCHAR(20)    NOT NULL UNIQUE,
    shift_id         UUID           REFERENCES shifts(id) ON DELETE SET NULL,
    customer_id      UUID           REFERENCES customers(id) ON DELETE SET NULL,
    customer_name    VARCHAR(150)   NOT NULL DEFAULT 'Khach le vang lai',
    customer_phone   VARCHAR(20),
    cashier_id       UUID           REFERENCES employees(id) ON DELETE SET NULL,
    cashier_name     VARCHAR(150)   NOT NULL,
    subtotal         NUMERIC(15,2)  NOT NULL DEFAULT 0,
    discount_amount  NUMERIC(15,2)  NOT NULL DEFAULT 0,
    discount_percent NUMERIC(5,2)   NOT NULL DEFAULT 0,
    vat_amount       NUMERIC(15,2)  NOT NULL DEFAULT 0,
    total            NUMERIC(15,2)  NOT NULL DEFAULT 0,
    payment_method   payment_method NOT NULL,
    amount_received  NUMERIC(15,2)  NOT NULL DEFAULT 0,
    change_amount    NUMERIC(15,2)  NOT NULL DEFAULT 0,
    status           order_status   NOT NULL DEFAULT 'completed',
    note             TEXT,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Don ban hang tai quay POS';

CREATE TABLE order_items (
    id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id       UUID           NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name     VARCHAR(255)   NOT NULL,
    sku              VARCHAR(30)    NOT NULL,
    quantity         INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price       NUMERIC(15,2)  NOT NULL,
    cost_price       NUMERIC(15,2)  NOT NULL DEFAULT 0,
    discount_percent NUMERIC(5,2)   NOT NULL DEFAULT 0,
    line_total       NUMERIC(15,2)  NOT NULL,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE order_items IS 'Chi tiet tung dong san pham trong don hang';

ALTER TABLE loyalty_transactions
    ADD CONSTRAINT fk_loyalty_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- ============================================================
-- 9. PURCHASES / PURCHASE ORDERS (Don nhap hang tu NCC)
-- ============================================================
CREATE TABLE purchase_orders (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(20)     NOT NULL UNIQUE,
    supplier_id     UUID            NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    supplier_name   VARCHAR(255)    NOT NULL,
    created_by_id   UUID            REFERENCES employees(id) ON DELETE SET NULL,
    created_by_name VARCHAR(150)    NOT NULL,
    expected_date   DATE,
    received_date   DATE,
    total_items     INTEGER         NOT NULL DEFAULT 0,
    total_value     NUMERIC(15,2)   NOT NULL DEFAULT 0,
    paid_amount     NUMERIC(15,2)   NOT NULL DEFAULT 0,
    status          purchase_status NOT NULL DEFAULT 'draft',
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE purchase_orders IS 'Don dat / nhap hang tu nha cung cap';

CREATE TABLE purchase_order_items (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID          NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id        UUID          NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name      VARCHAR(255)  NOT NULL,
    sku               VARCHAR(30)   NOT NULL,
    quantity_ordered  INTEGER       NOT NULL CHECK (quantity_ordered > 0),
    quantity_received INTEGER       NOT NULL DEFAULT 0,
    unit_cost         NUMERIC(15,2) NOT NULL,
    line_total        NUMERIC(15,2) NOT NULL,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE purchase_order_items IS 'Chi tiet tung dong hang trong don nhap';

-- ============================================================
-- 10. INVENTORY ADJUSTMENTS (Dieu chinh ton kho / Kiem ke)
-- ============================================================
CREATE TABLE inventory_adjustments (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id   UUID          NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    employee_id  UUID          REFERENCES employees(id) ON DELETE SET NULL,
    reason       adjust_reason NOT NULL DEFAULT 'stock_count',
    qty_before   INTEGER       NOT NULL,
    qty_change   INTEGER       NOT NULL,
    qty_after    INTEGER       NOT NULL,
    note         TEXT,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE inventory_adjustments IS 'Nhat ky dieu chinh ton kho thu cong (kiem ke, hang hong, het han)';

-- ============================================================
-- 11. NOTIFICATIONS (Thong bao he thong)
-- ============================================================
CREATE TABLE notifications (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(200) NOT NULL,
    message     TEXT         NOT NULL,
    type        notif_type   NOT NULL DEFAULT 'info',
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    target_role employee_role,
    product_id  UUID         REFERENCES products(id) ON DELETE SET NULL,
    order_id    UUID         REFERENCES orders(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'Thong bao noi bo: canh bao ton kho, don hang, doanh thu ca';

-- ============================================================
-- 12. REPORTS SNAPSHOT (Bao cao tong hop)
-- ============================================================
CREATE TABLE daily_report_snapshots (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date      DATE          NOT NULL UNIQUE,
    total_orders     INTEGER       NOT NULL DEFAULT 0,
    total_revenue    NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_discount   NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_vat        NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_cost       NUMERIC(15,2) NOT NULL DEFAULT 0,
    gross_profit     NUMERIC(15,2) NOT NULL DEFAULT 0,
    cash_revenue     NUMERIC(15,2) NOT NULL DEFAULT 0,
    qr_revenue       NUMERIC(15,2) NOT NULL DEFAULT 0,
    card_revenue     NUMERIC(15,2) NOT NULL DEFAULT 0,
    new_customers    INTEGER       NOT NULL DEFAULT 0,
    top_product_id   UUID          REFERENCES products(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE daily_report_snapshots IS 'Bao cao tong hop theo tung ngay';

CREATE TABLE hourly_sales (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE          NOT NULL,
    hour        SMALLINT      NOT NULL CHECK (hour BETWEEN 0 AND 23),
    order_count INTEGER       NOT NULL DEFAULT 0,
    amount      NUMERIC(15,2) NOT NULL DEFAULT 0,
    UNIQUE (report_date, hour)
);

COMMENT ON TABLE hourly_sales IS 'Doanh thu theo gio trong ngay, dung cho bieu do xu huong ban hang';

CREATE TABLE category_sales_summary (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date  DATE          NOT NULL,
    category_id  UUID          NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_qty    INTEGER       NOT NULL DEFAULT 0,
    UNIQUE (report_date, category_id)
);

COMMENT ON TABLE category_sales_summary IS 'Ty trong doanh thu theo danh muc tung ngay';

-- ============================================================
-- 13. INDEXES
-- ============================================================

-- Products
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_supplier    ON products(supplier_id);
CREATE INDEX idx_products_status      ON products(status);
CREATE INDEX idx_products_barcode     ON products(barcode);
CREATE INDEX idx_products_sku         ON products(sku);

-- Customers
CREATE INDEX idx_customers_phone      ON customers(phone);
CREATE INDEX idx_customers_tier       ON customers(tier);

-- Orders
CREATE INDEX idx_orders_created_at    ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_id   ON orders(customer_id);
CREATE INDEX idx_orders_cashier_id    ON orders(cashier_id);
CREATE INDEX idx_orders_shift_id      ON orders(shift_id);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_orders_code          ON orders(code);

-- Order items
CREATE INDEX idx_order_items_order    ON order_items(order_id);
CREATE INDEX idx_order_items_product  ON order_items(product_id);

-- Purchase orders
CREATE INDEX idx_po_supplier          ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status            ON purchase_orders(status);
CREATE INDEX idx_po_created_at        ON purchase_orders(created_at DESC);

-- Inventory adjustments
CREATE INDEX idx_inv_adj_product      ON inventory_adjustments(product_id);
CREATE INDEX idx_inv_adj_created_at   ON inventory_adjustments(created_at DESC);

-- Shifts
CREATE INDEX idx_shifts_employee      ON shifts(employee_id);
CREATE INDEX idx_shifts_status        ON shifts(status);

-- Notifications
CREATE INDEX idx_notif_is_read        ON notifications(is_read);
CREATE INDEX idx_notif_created_at     ON notifications(created_at DESC);

-- ============================================================
-- 14. FUNCTIONS & TRIGGERS
-- ============================================================

-- 14.1 Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION freshmart.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

CREATE TRIGGER trg_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

CREATE TRIGGER trg_shifts_updated_at
    BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

CREATE TRIGGER trg_purchase_orders_updated_at
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

CREATE TRIGGER trg_daily_report_updated_at
    BEFORE UPDATE ON daily_report_snapshots
    FOR EACH ROW EXECUTE FUNCTION freshmart.set_updated_at();

-- ----------------------------------------------------------
-- 14.2 Auto-update product stock_status based on stock level
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION freshmart.sync_product_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.stock = 0 THEN
        NEW.status := 'out_of_stock';
    ELSIF NEW.stock < NEW.min_stock THEN
        NEW.status := 'low_stock';
    ELSE
        NEW.status := 'in_stock';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_sync_status
    BEFORE INSERT OR UPDATE OF stock, min_stock ON products
    FOR EACH ROW EXECUTE FUNCTION freshmart.sync_product_status();

-- ----------------------------------------------------------
-- 14.3 Deduct stock when an order_item is inserted (POS sale)
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION freshmart.deduct_stock_on_sale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE products
       SET stock = stock - NEW.quantity
     WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_order_item_deduct_stock
    AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION freshmart.deduct_stock_on_sale();

-- ----------------------------------------------------------
-- 14.4 Restore stock when order is cancelled
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION freshmart.restore_stock_on_cancel()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
        UPDATE products p
           SET stock = p.stock + oi.quantity
          FROM order_items oi
         WHERE oi.order_id = NEW.id
           AND p.id = oi.product_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_order_restore_stock
    AFTER UPDATE OF status ON orders
    FOR EACH ROW EXECUTE FUNCTION freshmart.restore_stock_on_cancel();

-- ----------------------------------------------------------
-- 14.5 Update stock & cost_price when PO is marked received
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION freshmart.update_stock_on_receive()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.status = 'received' AND OLD.status <> 'received' THEN
        UPDATE products p
           SET stock      = p.stock + poi.quantity_received,
               cost_price = poi.unit_cost
          FROM purchase_order_items poi
         WHERE poi.purchase_order_id = NEW.id
           AND p.id = poi.product_id;

        UPDATE purchase_order_items
           SET quantity_received = quantity_ordered
         WHERE purchase_order_id = NEW.id;

        NEW.received_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_po_receive_stock
    BEFORE UPDATE OF status ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION freshmart.update_stock_on_receive();

-- ----------------------------------------------------------
-- 14.6 Auto-create low-stock notification
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION freshmart.notify_low_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.status IN ('low_stock', 'out_of_stock')
       AND OLD.status = 'in_stock' THEN
        INSERT INTO notifications (title, message, type, product_id)
        VALUES (
            CASE NEW.status
                WHEN 'out_of_stock' THEN 'Het hang trong kho'
                ELSE 'Canh bao ton kho thap'
            END,
            NEW.name || ' con ' || NEW.stock::TEXT ||
            CASE NEW.status
                WHEN 'out_of_stock' THEN ' — da het hang.'
                ELSE ' (duoi muc toi thieu ' || NEW.min_stock::TEXT || ').'
            END,
            'warning',
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_low_stock_notify
    AFTER UPDATE OF stock ON products
    FOR EACH ROW EXECUTE FUNCTION freshmart.notify_low_stock();

-- ----------------------------------------------------------
-- 14.7 Auto-calculate customer loyalty tier based on total_spent
--   Tier thresholds:
--     >= 5,000,000  -> Kim Cuong
--     >= 2,000,000  -> Vang
--     >= 500,000    -> Bac
--     < 500,000     -> Than thiet
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION freshmart.sync_customer_tier()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.tier := CASE
        WHEN NEW.total_spent >= 5000000 THEN 'Kim Cuong'::loyalty_tier
        WHEN NEW.total_spent >= 2000000 THEN 'Vang'::loyalty_tier
        WHEN NEW.total_spent >= 500000  THEN 'Bac'::loyalty_tier
        ELSE 'Than thiet'::loyalty_tier
    END;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_customers_sync_tier
    BEFORE INSERT OR UPDATE OF total_spent ON customers
    FOR EACH ROW EXECUTE FUNCTION freshmart.sync_customer_tier();

-- ----------------------------------------------------------
-- 14.8 Earn loyalty points on completed order
--   Rule: 1 point per 1,000 VND spent
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION freshmart.earn_loyalty_points()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_points_earn   INTEGER;
    v_points_before INTEGER;
BEGIN
    IF NEW.status = 'completed'
       AND NEW.customer_id IS NOT NULL
       AND (OLD IS NULL OR OLD.status <> 'completed') THEN

        v_points_earn  := FLOOR(NEW.total / 1000)::INTEGER;

        SELECT points INTO v_points_before
          FROM customers WHERE id = NEW.customer_id;

        UPDATE customers
           SET points      = points + v_points_earn,
               total_spent = total_spent + NEW.total,
               last_visit  = CURRENT_DATE
         WHERE id = NEW.customer_id;

        INSERT INTO loyalty_transactions (
            customer_id, order_id, transaction_type,
            points_delta, points_before, points_after, note
        ) VALUES (
            NEW.customer_id, NEW.id, 'earn',
            v_points_earn,
            v_points_before,
            v_points_before + v_points_earn,
            'Tich diem tu hoa don ' || NEW.code
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_order_earn_points
    AFTER INSERT OR UPDATE OF status ON orders
    FOR EACH ROW EXECUTE FUNCTION freshmart.earn_loyalty_points();

-- ============================================================
-- 15. SAMPLE SEED DATA
-- ============================================================

-- 15.1 Categories
INSERT INTO categories (slug, name, icon, sort_order) VALUES
    ('drinks',  'Do uong',          'Coffee',           1),
    ('noodles', 'Mi & Thuc pham',   'UtensilsCrossed',  2),
    ('snacks',  'Banh keo',         'Cookie',           3),
    ('dairy',   'Sua & Bo',         'Milk',             4),
    ('spices',  'Gia vi & Hoa pham','Sparkles',         5),
    ('fresh',   'Do tuoi song',     'Apple',            6);

-- 15.2 Suppliers
INSERT INTO suppliers (code, name, phone) VALUES
    ('NCC-001', 'Cong ty Coca-Cola VN',               '02838123456'),
    ('NCC-002', 'Suntory PepsiCo VN',                 '02838456789'),
    ('NCC-003', 'Acecook Viet Nam',                   '02838741852'),
    ('NCC-004', 'CTCP Sua Viet Nam (Vinamilk)',        '02838963147'),
    ('NCC-005', 'Cong ty TNHH Calofic',               '02838258147'),
    ('NCC-006', 'Cong ty TNHH Thuc pham Orion Vina',  '02838147258'),
    ('NCC-007', 'Heineken Viet Nam',                  '02838369258'),
    ('NCC-008', 'DNTN Ho Quang Tri',                  '0939111222'),
    ('NCC-009', 'Masan Consumer',                     '02838951753'),
    ('NCC-010', 'La Vie Viet Nam',                    '02838753951'),
    ('NCC-011', 'Mondelez Kinh Do',                   '02838852456'),
    ('NCC-012', 'Unilever Viet Nam',                  '02838654321'),
    ('NCC-013', 'URC Viet Nam',                       '02838123987');

-- 15.3 Employees
INSERT INTO employees (code, name, role) VALUES
    ('NV-001', 'Nguyen Van An',    'cashier'),
    ('NV-002', 'Le Thi Thu Thao',  'cashier'),
    ('NV-003', 'Tran Quoc Hung',   'store_manager'),
    ('NV-004', 'Pham Thi Hoa',     'warehouse_staff');

-- 15.4 Products (16 san pham mau)
INSERT INTO products (sku, barcode, name, category_id, supplier_id, unit, cost_price, sell_price, stock, min_stock, image_url)
SELECT
    t.sku, t.barcode, t.name,
    (SELECT id FROM categories WHERE slug = t.cat_slug),
    (SELECT id FROM suppliers   WHERE code = t.sup_code),
    t.unit, t.cost_price, t.sell_price, t.stock, t.min_stock, t.image_url
FROM (VALUES
    ('DOU-001','8934588012110','Coca-Cola Sleek Lon 320ml',              'drinks', 'NCC-001','Lon',   7800,  10000,145,48,'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300'),
    ('DOU-002','8934588012127','Nuoc tang luc Sting Dau 330ml',          'drinks', 'NCC-002','Chai',  8200,  11000, 12,30,'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300'),
    ('MTP-001','8934563020019','Mi Hao Hao Tom Chua Cay 75g',            'noodles','NCC-003','Goi',   3400,   4500,320,60,'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300'),
    ('SUB-001','8934673510023','Sua tuoi Vinamilk 100pct Co Duong 1L',   'dairy',  'NCC-004','Hop',  28500,  34000, 24,20,'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300'),
    ('GVH-001','8936036010112','Dau an tinh luyen Simply 1 Lit',         'spices', 'NCC-005','Chai', 46000,  56000, 18,25,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300'),
    ('BKE-001','8935001712015','Banh ChocoPie Orion Hop 12 Cai 360g',   'snacks', 'NCC-006','Hop',  43000,  54000, 42,15,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300'),
    ('DOU-003','8934588019904','Bia Heineken Silver Lon 330ml',           'drinks', 'NCC-007','Lon',  17500,  21500, 85,24,'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300'),
    ('MTP-002','8936011400234','Gao ST25 Ong Cua Tui 5kg',               'noodles','NCC-008','Tui', 165000, 195000, 14,10,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300'),
    ('GVH-002','8934563820114','Nuoc mam Nam Ngu De Nhi 900ml',          'spices', 'NCC-009','Chai', 23000,  29000, 36,20,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'),
    ('DOU-004','8934588013346','Nuoc khoang Lavie 500ml',                'drinks', 'NCC-010','Chai',  3800,   6000,110,40,'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300'),
    ('SUB-002','8934673510887','Sua dac co duong Ong Tho Do 380g',       'dairy',  'NCC-004','Lon',  21000,  26000,  0,15,'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300'),
    ('BKE-002','8935001718826','Banh quy AFC Dinh duong Vi Rau 172g',    'snacks', 'NCC-011','Hop',  19000,  25000, 50,20,'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300'),
    ('GVH-003','8934563820999','Hat nem Knorr Thit Than Xuong Ong 400g', 'spices', 'NCC-012','Goi',  28000,  35000,  8,25,'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=300'),
    ('MTP-003','8934563028886','Xuc xich tiet trung Ponnie Thit Heo 4 cay','noodles','NCC-009','Goi',14500, 18500, 64,20,'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300'),
    ('GVH-004','8934563820442','Nuoc rua chen Sunlight Chanh 750g',      'spices', 'NCC-012','Chai', 22000,  28000, 45,15,'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300'),
    ('DOU-005','8934588014490','Tra xanh khong do C2 Chanh 455ml',       'drinks', 'NCC-013','Chai',  6500,   9000, 96,30,'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300')
) AS t(sku, barcode, name, cat_slug, sup_code, unit, cost_price, sell_price, stock, min_stock, image_url);

-- 15.5 Customers (tier will be auto-calculated by trigger)
INSERT INTO customers (code, name, phone, points, total_spent, last_visit) VALUES
    ('KH-001', 'Chi Mai Lan',       '0988123456', 420,  4250000, '2026-09-10'),
    ('KH-002', 'Anh Tuan Hung',     '0912345678', 150,  1680000, '2026-09-09'),
    ('KH-003', 'Co Thu Huong',      '0903888999', 890,  9200000, '2026-09-10'),
    ('KH-004', 'Bac Duc Thanh',     '0977456123',  65,   750000, '2026-09-08'),
    ('KH-005', 'Anh Tran Minh Tri', '0933654987', 310,  3420000, '2026-09-07');

-- 15.6 Current shift (already closed)
INSERT INTO shifts (employee_id, shift_name, start_time, end_time, starting_cash, expected_cash, total_revenue, order_count, status)
VALUES (
    (SELECT id FROM employees WHERE code = 'NV-001'),
    'Ca Sang (06:00 - 14:00)',
    '2026-09-10 06:00:00+07',
    '2026-09-10 14:00:00+07',
    2000000, 11450000, 24580000, 248, 'closed'
);

-- 15.7 Sample purchase orders
INSERT INTO purchase_orders (code, supplier_id, supplier_name, created_by_id, created_by_name, expected_date, total_items, total_value, status)
VALUES
(
    'NH-2041',
    (SELECT id FROM suppliers WHERE code = 'NCC-003'),
    'Acecook Viet Nam',
    (SELECT id FROM employees WHERE code = 'NV-001'),
    'Nguyen Van An',
    '2026-09-12', 350, 12500000, 'pending'
),
(
    'NH-2040',
    (SELECT id FROM suppliers WHERE code = 'NCC-004'),
    'CTCP Sua Viet Nam (Vinamilk)',
    (SELECT id FROM employees WHERE code = 'NV-002'),
    'Le Thi Thu Thao',
    '2026-09-10', 120, 8640000, 'received'
),
(
    'NH-2039',
    (SELECT id FROM suppliers WHERE code = 'NCC-002'),
    'Suntory PepsiCo VN',
    (SELECT id FROM employees WHERE code = 'NV-001'),
    'Nguyen Van An',
    '2026-09-09', 240, 15300000, 'received'
),
(
    'NH-2038',
    (SELECT id FROM suppliers WHERE code = 'NCC-012'),
    'Unilever Viet Nam',
    (SELECT id FROM employees WHERE code = 'NV-002'),
    'Le Thi Thu Thao',
    '2026-09-11', 80, 6850000, 'pending'
);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
