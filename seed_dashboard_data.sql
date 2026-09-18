-- ============================================================================
-- FRESHMART POS SYSTEM — SEED DATA CHO DASHBOARD & BÁO CÁO THỜI GIAN THỰC
-- Chạy trên PostgreSQL Database để nạp dữ liệu phong phú, sinh động và đầy đủ
-- ============================================================================

-- Đảm bảo extension pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Đặt search path nếu cần
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'freshmart') THEN
        SET search_path TO freshmart, public;
    ELSE
        SET search_path TO public;
    END IF;
END $$;

-- 1. DANH MỤC SẢN PHẨM (Categories)
INSERT INTO categories (id, slug, name, icon, sort_order, is_active, created_at)
VALUES
    ('c1111111-1111-1111-1111-111111111101', 'drinks',    'Đồ uống',            'Coffee',          1, TRUE, NOW() - INTERVAL '180 days'),
    ('c1111111-1111-1111-1111-111111111102', 'noodles',   'Mì & Ăn liền',       'UtensilsCrossed', 2, TRUE, NOW() - INTERVAL '180 days'),
    ('c1111111-1111-1111-1111-111111111103', 'snacks',    'Bánh kẹo & Snack',   'Cookie',          3, TRUE, NOW() - INTERVAL '180 days'),
    ('c1111111-1111-1111-1111-111111111104', 'dairy',     'Sữa & Bơ phô mai',   'Milk',            4, TRUE, NOW() - INTERVAL '180 days'),
    ('c1111111-1111-1111-1111-111111111105', 'spices',    'Gia vị & Hóa phẩm',  'Sparkles',        5, TRUE, NOW() - INTERVAL '180 days'),
    ('c1111111-1111-1111-1111-111111111106', 'fresh',     'Rau củ & Tươi sống', 'Apple',           6, TRUE, NOW() - INTERVAL '180 days'),
    ('c1111111-1111-1111-1111-111111111107', 'frozen',    'Thực phẩm đông lạnh','Package',        7, TRUE, NOW() - INTERVAL '180 days'),
    ('c1111111-1111-1111-1111-111111111108', 'personal',  'Hóa mỹ phẩm cá nhân','Sparkles',        8, TRUE, NOW() - INTERVAL '180 days')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active;

-- 2. NHÀ CUNG CẤP (Suppliers)
INSERT INTO suppliers (id, code, name, contact_name, phone, email, address, tax_code, is_active, created_at, updated_at)
VALUES
    ('s1111111-1111-1111-1111-111111111101', 'NCC-001', 'Công ty Coca-Cola Việt Nam', 'Nguyễn Minh Tuấn', '02838123456', 'sales@coca-cola.vn', 'KCN Linh Trung, TP. Thủ Đức, TP.HCM', '0301456789', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111102', 'NCC-002', 'Suntory PepsiCo Việt Nam', 'Lê Hoàng Yến', '02838456789', 'contact@pepsico.vn', 'Cao ốc Sheraton, Quận 1, TP.HCM', '0301456790', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111103', 'NCC-003', 'Acecook Việt Nam', 'Trần Thanh Phong', '02838741852', 'order@acecook.vn', 'KCN Tân Bình, Tây Thạnh, Tân Phú, TP.HCM', '0301456791', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111104', 'NCC-004', 'CTCP Sữa Việt Nam (Vinamilk)', 'Vũ Đình Trọng', '02838963147', 'vinamilk@vinamilk.com.vn', 'Số 10 Tân Trào, Tân Phú, Quận 7, TP.HCM', '0301456792', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111105', 'NCC-005', 'Công ty TNHH Calofic', 'Đặng Thúy An', '02838258147', 'support@calofic.com.vn', 'KCN Hiệp Phước, Nhà Bè, TP.HCM', '0301456793', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111106', 'NCC-006', 'Công ty TNHH Orion Vina', 'Kim Sung Woo', '02838147258', 'sales@orion.vn', 'KCN Mỹ Phước, Bến Cát, Bình Dương', '0301456794', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111107', 'NCC-007', 'Heineken Việt Nam', 'Hoàng Bảo Long', '02838369258', 'orders@heineken.vn', 'Tầng 18, Vietcombank Tower, Quận 1, TP.HCM', '0301456795', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111108', 'NCC-008', 'DNTN Gạo Hồ Quang Trí (ST25)', 'Hồ Quang Cua', '0939111222', 'gaost25@soctrang.vn', '198 Đường 30/4, TP. Sóc Trăng', '0301456796', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111109', 'NCC-009', 'Masan Consumer', 'Nguyễn Thị Hải', '02838951753', 'masan@masangroup.com', 'Mplaza Saigon, 39 Lê Duẩn, Quận 1, TP.HCM', '0301456797', TRUE, NOW() - INTERVAL '200 days', NOW()),
    ('s1111111-1111-1111-1111-111111111110', 'NCC-010', 'Unilever Việt Nam', 'Trần Mai Phương', '02838654321', 'unilever@unilever.com', '156 Nguyễn Lương Bằng, Tân Phú, Quận 7', '0301456798', TRUE, NOW() - INTERVAL '200 days', NOW())
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, contact_name = EXCLUDED.contact_name, phone = EXCLUDED.phone, is_active = EXCLUDED.is_active;

-- 3. NHÂN VIÊN (Employees)
INSERT INTO employees (id, code, name, phone, email, role, status, pin, is_active, created_at, updated_at)
VALUES
    ('e1111111-1111-1111-1111-111111111101', 'NV-001', 'Nguyễn Văn An',    '0901234567', 'an.nguyen@freshmart.vn',    'cashier',         'active', '1234', TRUE, NOW() - INTERVAL '250 days', NOW()),
    ('e1111111-1111-1111-1111-111111111102', 'NV-002', 'Lê Thị Thu Thảo',  '0902345678', 'thao.le@freshmart.vn',      'cashier',         'active', '1234', TRUE, NOW() - INTERVAL '250 days', NOW()),
    ('e1111111-1111-1111-1111-111111111103', 'NV-003', 'Trần Quốc Hùng',   '0903456789', 'hung.tran@freshmart.vn',    'store_manager',   'active', '1234', TRUE, NOW() - INTERVAL '250 days', NOW()),
    ('e1111111-1111-1111-1111-111111111104', 'NV-004', 'Phạm Thị Hoa',     '0904567890', 'hoa.pham@freshmart.vn',     'warehouse_staff', 'active', '1234', TRUE, NOW() - INTERVAL '250 days', NOW()),
    ('e1111111-1111-1111-1111-111111111105', 'NV-005', 'Đỗ Thanh Tuấn',    '0905678901', 'tuan.do@freshmart.vn',      'cashier',         'active', '1234', TRUE, NOW() - INTERVAL '250 days', NOW())
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, phone = EXCLUDED.phone, role = EXCLUDED.role, is_active = EXCLUDED.is_active;

-- 4. KHÁCH HÀNG (Customers)
INSERT INTO customers (id, code, name, phone, email, points, total_spent, tier, is_active, last_visit, created_at, updated_at)
VALUES
    ('k1111111-1111-1111-1111-111111111101', 'KH-001', 'Nguyễn Thị Mai Lan',   '0988123456', 'mailan@gmail.com',     1250, 18500000, 'Kim Cuong', TRUE, NOW() - INTERVAL '1 hours', NOW() - INTERVAL '180 days', NOW()),
    ('k1111111-1111-1111-1111-111111111102', 'KH-002', 'Hoàng Tuấn Hưng',     '0912345678', 'tuanhung@gmail.com',    640,  8900000,  'Vang',      TRUE, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '160 days', NOW()),
    ('k1111111-1111-1111-1111-111111111103', 'KH-003', 'Phạm Thu Hương',      '0903888999', 'thuhuong@gmail.com',    890,  14200000, 'Kim Cuong', TRUE, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '140 days', NOW()),
    ('k1111111-1111-1111-1111-111111111104', 'KH-004', 'Vũ Đức Thành',        '0977456123', 'ducthanh@gmail.com',     180,  2450000,  'Bac',       TRUE, NOW() - INTERVAL '1 days',  NOW() - INTERVAL '120 days', NOW()),
    ('k1111111-1111-1111-1111-111111111105', 'KH-005', 'Trần Minh Trí',       '0933654987', 'minhtri@gmail.com',      450,  6100000,  'Vang',      TRUE, NOW() - INTERVAL '2 days',  NOW() - INTERVAL '100 days', NOW()),
    ('k1111111-1111-1111-1111-111111111106', 'KH-006', 'Đỗ Bích Ngọc',        '0945112233', 'bichngoc@gmail.com',      65,   820000,   'Bac',       TRUE, NOW() - INTERVAL '4 days',  NOW() - INTERVAL '90 days',  NOW()),
    ('k1111111-1111-1111-1111-111111111107', 'KH-007', 'Lê Gia Huy',          '0918778899', 'giahuy@gmail.com',        40,   450000,   'Than thiet',TRUE, NOW() - INTERVAL '5 days',  NOW() - INTERVAL '80 days',  NOW()),
    ('k1111111-1111-1111-1111-111111111108', 'KH-008', 'Ngô Thanh Vân',       '0909667788', 'thanhvan@gmail.com',     520,  7300000,  'Vang',      TRUE, NOW() - INTERVAL '6 days',  NOW() - INTERVAL '70 days',  NOW())
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, points = EXCLUDED.points, total_spent = EXCLUDED.total_spent, tier = EXCLUDED.tier, last_visit = EXCLUDED.last_visit;

-- 5. SẢN PHẨM HÀNG HOÁ (Products)
INSERT INTO products (id, sku, barcode, name, category_id, supplier_id, unit, cost_price, sell_price, stock, min_stock, is_active, image_url, created_at, updated_at)
VALUES
    ('p1111111-1111-1111-1111-111111111101', 'DOU-001', '8934588012110', 'Coca-Cola Sleek Lon 320ml',              'c1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101', 'Lon',   7800,  10000, 145, 48, TRUE, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111102', 'DOU-002', '8934588012127', 'Nước tăng lực Sting Dâu 330ml',          'c1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111102', 'Chai',  8200,  11000,   8, 30, TRUE, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111103', 'DOU-003', '8934588019904', 'Bia Heineken Silver Lon 330ml',           'c1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111107', 'Lon',  17500,  21500,  85, 24, TRUE, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111104', 'DOU-004', '8934588013346', 'Nước khoáng Lavie 500ml',                'c1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111102', 'Chai',  3800,   6000, 110, 40, TRUE, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111105', 'DOU-005', '8934588014490', 'Trà xanh không độ C2 Chanh 455ml',       'c1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111102', 'Chai',  6500,   9000,  96, 30, TRUE, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111106', 'MTP-001', '8934563020019', 'Mì Hảo Hảo Tôm Chua Cay 75g',            'c1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111103', 'Gói',   3400,   4500, 320, 60, TRUE, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111107', 'MTP-002', '8936011400234', 'Gạo ST25 Ông Cua Túi 5kg',               'c1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111108', 'Túi', 165000, 195000,  14, 10, TRUE, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111108', 'MTP-003', '8934563028886', 'Xúc xích tiệt trùng Ponnie Thịt Heo',   'c1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111109', 'Gói',  14500,  18500,  64, 20, TRUE, 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111109', 'BKE-001', '8935001712015', 'Bánh ChocoPie Orion Hộp 12 Cái 360g',   'c1111111-1111-1111-1111-111111111103', 's1111111-1111-1111-1111-111111111106', 'Hộp',  43000,  54000,  42, 15, TRUE, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111110', 'BKE-002', '8935001718826', 'Bánh quy AFC Dinh Dưỡng Vị Rau 172g',    'c1111111-1111-1111-1111-111111111103', 's1111111-1111-1111-1111-111111111106', 'Hộp',  19000,  25000,  50, 20, TRUE, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111111', 'SUB-001', '8934673510023', 'Sữa tươi Vinamilk 100% Có Đường 1L',   'c1111111-1111-1111-1111-111111111104', 's1111111-1111-1111-1111-111111111104', 'Hộp',  28500,  34000,  24, 20, TRUE, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111112', 'SUB-002', '8934673510887', 'Sữa đặc có đường Ông Thọ Đỏ 380g',       'c1111111-1111-1111-1111-111111111104', 's1111111-1111-1111-1111-111111111104', 'Lon',  21000,  26000,   4, 15, TRUE, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111113', 'GVH-001', '8936036010112', 'Dầu ăn tinh luyện Simply 1 Lít',         'c1111111-1111-1111-1111-111111111105', 's1111111-1111-1111-1111-111111111105', 'Chai', 46000,  56000,  18, 25, TRUE, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111114', 'GVH-002', '8934563820114', 'Nước mắm Nam Ngư Đệ Nhị 900ml',          'c1111111-1111-1111-1111-111111111105', 's1111111-1111-1111-1111-111111111109', 'Chai', 23000,  29000,  36, 20, TRUE, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111115', 'GVH-003', '8934563820999', 'Hạt nêm Knorr Thịt Thăn Xương Ống 400g', 'c1111111-1111-1111-1111-111111111105', 's1111111-1111-1111-1111-111111111110', 'Gói',  28000,  35000,   6, 25, TRUE, 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=300', NOW() - INTERVAL '150 days', NOW()),
    ('p1111111-1111-1111-1111-111111111116', 'GVH-004', '8934563820442', 'Nước rửa chén Sunlight Chanh 750g',      'c1111111-1111-1111-1111-111111111105', 's1111111-1111-1111-1111-111111111110', 'Chai', 22000,  28000,  45, 15, TRUE, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300', NOW() - INTERVAL '150 days', NOW())
ON CONFLICT (sku) DO UPDATE 
SET name = EXCLUDED.name, cost_price = EXCLUDED.cost_price, sell_price = EXCLUDED.sell_price, stock = EXCLUDED.stock, min_stock = EXCLUDED.min_stock, image_url = EXCLUDED.image_url;

-- 6. CA LÀM VIỆC (Shifts)
INSERT INTO shifts (id, employee_id, shift_name, start_time, end_time, starting_cash, expected_cash, actual_cash, total_revenue, order_count, status, notes, created_at, updated_at)
VALUES
    ('h1111111-1111-1111-1111-111111111101', 'e1111111-1111-1111-1111-111111111101', 'Ca Sáng (06:00 - 14:00)', NOW() - INTERVAL '8 hours', NOW(), 2000000, 15850000, 15850000, 13850000, 48, 'closed', 'Ca làm việc tốt, khớp tiền 100%', NOW() - INTERVAL '8 hours', NOW()),
    ('h1111111-1111-1111-1111-111111111102', 'e1111111-1111-1111-1111-111111111102', 'Ca Chiều (14:00 - 22:00)', NOW() - INTERVAL '1 hours', NULL, 2000000, NULL, NULL, 4200000, 16, 'active', 'Đang trong ca', NOW() - INTERVAL '1 hours', NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. ĐƠN HÀNG MẪU (Orders & Order Items)
INSERT INTO orders (id, code, customer_id, customer_name, employee_id, shift_id, subtotal, discount, vat, total, payment_method, status, notes, created_at, updated_at)
VALUES
    ('o1111111-1111-1111-1111-111111111101', 'HD-9801', 'k1111111-1111-1111-1111-111111111101', 'Nguyễn Thị Mai Lan', 'e1111111-1111-1111-1111-111111111102', 'h1111111-1111-1111-1111-111111111102', 245000, 0, 19600, 264600, 'vietqr',   'completed', 'Khách VIP quét VietQR', NOW() - INTERVAL '15 minutes', NOW()),
    ('o1111111-1111-1111-1111-111111111102', 'HD-9802', 'k1111111-1111-1111-1111-111111111102', 'Hoàng Tuấn Hưng',   'e1111111-1111-1111-1111-111111111102', 'h1111111-1111-1111-1111-111111111102', 195000, 0, 15600, 210600, 'cash',     'completed', 'Tiền mặt',            NOW() - INTERVAL '35 minutes', NOW()),
    ('o1111111-1111-1111-1111-111111111103', 'HD-9803', NULL,                               'Khách lẻ vãng lai',  'e1111111-1111-1111-1111-111111111101', 'h1111111-1111-1111-1111-111111111101',  85000, 0,  6800,  91800, 'pos_card', 'completed', 'Thẻ POS Visa',       NOW() - INTERVAL '2 hours',   NOW()),
    ('o1111111-1111-1111-1111-111111111104', 'HD-9804', 'k1111111-1111-1111-1111-111111111103', 'Phạm Thu Hương',    'e1111111-1111-1111-1111-111111111101', 'h1111111-1111-1111-1111-111111111101', 540000, 0, 43200, 583200, 'vietqr',   'completed', 'Khách kim cương',     NOW() - INTERVAL '4 hours',   NOW()),
    ('o1111111-1111-1111-1111-111111111105', 'HD-9805', NULL,                               'Khách lẻ vãng lai',  'e1111111-1111-1111-1111-111111111101', 'h1111111-1111-1111-1111-111111111101',  65000, 0,  5200,  70200, 'cash',     'completed', 'Mua nước giải khát',  NOW() - INTERVAL '6 hours',   NOW()),
    ('o1111111-1111-1111-1111-111111111106', 'HD-9806', 'k1111111-1111-1111-1111-111111111105', 'Trần Minh Trí',     'e1111111-1111-1111-1111-111111111101', 'h1111111-1111-1111-1111-111111111101', 320000, 0, 25600, 345600, 'pos_card', 'completed', 'Gia đình mua sắm',    NOW() - INTERVAL '7 hours',   NOW()),
    ('o1111111-1111-1111-1111-111111111107', 'HD-9807', NULL,                               'Khách hủy đơn',      'e1111111-1111-1111-1111-111111111101', 'h1111111-1111-1111-1111-111111111101',  54000, 0,  4320,  58320, 'cash',     'cancelled', 'Khách quên mang ví',  NOW() - INTERVAL '5 hours',   NOW())
ON CONFLICT (code) DO NOTHING;

-- 7.2 Chi tiết đơn hàng (Order Items)
INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, cost_price, line_total, created_at)
VALUES
    ('oi111111-1111-1111-1111-111111111101', 'o1111111-1111-1111-1111-111111111101', 'p1111111-1111-1111-1111-111111111101', 'Coca-Cola Sleek Lon 320ml',            5,  10000,  7800,   50000, NOW() - INTERVAL '15 minutes'),
    ('oi111111-1111-1111-1111-111111111102', 'o1111111-1111-1111-1111-111111111101', 'p1111111-1111-1111-1111-111111111107', 'Gạo ST25 Ông Cua Túi 5kg',             1, 195000, 165000, 195000, NOW() - INTERVAL '15 minutes'),
    ('oi111111-1111-1111-1111-111111111103', 'o1111111-1111-1111-1111-111111111102', 'p1111111-1111-1111-1111-111111111107', 'Gạo ST25 Ông Cua Túi 5kg',             1, 195000, 165000, 195000, NOW() - INTERVAL '35 minutes'),
    ('oi111111-1111-1111-1111-111111111104', 'o1111111-1111-1111-1111-111111111103', 'p1111111-1111-1111-1111-111111111106', 'Mì Hảo Hảo Tôm Chua Cay 75g',         10,   4500,   3400,  45000, NOW() - INTERVAL '2 hours'),
    ('oi111111-1111-1111-1111-111111111105', 'o1111111-1111-1111-1111-111111111103', 'p1111111-1111-1111-1111-111111111109', 'Bánh ChocoPie Orion Hộp 12 Cái 360g', 1,  54000,  43000,  54000, NOW() - INTERVAL '2 hours'),
    ('oi111111-1111-1111-1111-111111111106', 'o1111111-1111-1111-1111-111111111104', 'p1111111-1111-1111-1111-111111111109', 'Bánh ChocoPie Orion Hộp 12 Cái 360g', 10, 54000,  43000, 540000, NOW() - INTERVAL '4 hours'),
    ('oi111111-1111-1111-1111-111111111107', 'o1111111-1111-1111-1111-111111111105', 'p1111111-1111-1111-1111-111111111103', 'Bia Heineken Silver Lon 330ml',         3,  21500,  17500,  64500, NOW() - INTERVAL '6 hours'),
    ('oi111111-1111-1111-1111-111111111108', 'o1111111-1111-1111-1111-111111111106', 'p1111111-1111-1111-1111-111111111111', 'Sữa tươi Vinamilk 100% Có Đường 1L',  5,  34000,  28500, 170000, NOW() - INTERVAL '7 hours'),
    ('oi111111-1111-1111-1111-111111111109', 'o1111111-1111-1111-1111-111111111106', 'p1111111-1111-1111-1111-111111111113', 'Dầu ăn tinh luyện Simply 1 Lít',       2,  56000,  46000, 112000, NOW() - INTERVAL '7 hours'),
    ('oi111111-1111-1111-1111-111111111110', 'o1111111-1111-1111-1111-111111111107', 'p1111111-1111-1111-1111-111111111109', 'Bánh ChocoPie Orion Hộp 12 Cái 360g', 1,  54000,  43000,  54000, NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- 8. ĐƠN NHẬP HÀNG (Purchase Orders)
INSERT INTO purchase_orders (id, code, supplier_id, supplier_name, created_by_id, created_by_name, expected_date, received_date, total_items, total_value, status, notes, created_at, updated_at)
VALUES
    ('po111111-1111-1111-1111-111111111101', 'PO-2026-001', 's1111111-1111-1111-1111-111111111103', 'Acecook Việt Nam',             'e1111111-1111-1111-1111-111111111104', 'Phạm Thị Hoa', CURRENT_DATE, CURRENT_DATE, 500, 1700000, 'received', 'Đã nhập kho đủ 500 gói', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ('po111111-1111-1111-1111-111111111102', 'PO-2026-002', 's1111111-1111-1111-1111-111111111104', 'CTCP Sữa Việt Nam (Vinamilk)', 'e1111111-1111-1111-1111-111111111104', 'Phạm Thị Hoa', CURRENT_DATE, CURRENT_DATE, 150, 4275000, 'received', 'Đã nhập sữa tươi 1L', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ('po111111-1111-1111-1111-111111111103', 'PO-2026-003', 's1111111-1111-1111-1111-111111111101', 'Công ty Coca-Cola Việt Nam',   'e1111111-1111-1111-1111-111111111104', 'Phạm Thị Hoa', CURRENT_DATE + INTERVAL '2 days', NULL, 300, 2340000, 'pending',  'Đang giao hàng',     NOW() - INTERVAL '1 days', NOW()),
    ('po111111-1111-1111-1111-111111111104', 'PO-2026-004', 's1111111-1111-1111-1111-111111111108', 'DNTN Gạo Hồ Quang Trí (ST25)', 'e1111111-1111-1111-1111-111111111104', 'Phạm Thị Hoa', CURRENT_DATE + INTERVAL '3 days', NULL,  50, 8250000, 'pending',  'Đặt thêm gạo ST25',  NOW() - INTERVAL '12 hours', NOW())
ON CONFLICT (code) DO NOTHING;

-- 9. THÔNG BÁO HỆ THỐNG (Notifications)
INSERT INTO notifications (id, title, message, type, product_id, is_read, created_at)
VALUES
    ('n1111111-1111-1111-1111-111111111101', 'Cảnh báo tồn kho thấp', 'Sữa đặc Ông Thọ Đỏ 380g chỉ còn 4 lon trong kho (Dưới mức tối thiểu 15).', 'warning', 'p1111111-1111-1111-1111-111111111112', FALSE, NOW() - INTERVAL '10 minutes'),
    ('n1111111-1111-1111-1111-111111111102', 'Cảnh báo tồn kho thấp', 'Hạt nêm Knorr Thịt Thăn 400g chỉ còn 6 gói trong kho.',                      'warning', 'p1111111-1111-1111-1111-111111111115', FALSE, NOW() - INTERVAL '1 hours'),
    ('n1111111-1111-1111-1111-111111111103', 'Nhập hàng thành công', 'Đơn nhập hàng PO-2026-001 (Acecook Việt Nam) đã được nhập kho thành công.',     'success', NULL,                                    TRUE,  NOW() - INTERVAL '2 days'),
    ('n1111111-1111-1111-1111-111111111104', 'Đóng ca làm việc',     'Nhân viên Nguyễn Văn An đã đóng Ca Sáng thành công. Tổng doanh thu: 13.850.000đ.','info',    NULL,                                    TRUE,  NOW() - INTERVAL '8 hours')
ON CONFLICT (id) DO NOTHING;
