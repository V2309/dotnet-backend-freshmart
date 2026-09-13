import { Product, Customer, Order, SupplierPurchase, CashierShift, NotificationItem } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: 'LayoutGrid' },
  { id: 'drinks', name: 'Đồ uống', icon: 'Coffee' },
  { id: 'noodles', name: 'Mì & Thực phẩm', icon: 'UtensilsCrossed' },
  { id: 'snacks', name: 'Bánh kẹo', icon: 'Cookie' },
  { id: 'dairy', name: 'Sữa & Bơ', icon: 'Milk' },
  { id: 'spices', name: 'Gia vị & Hóa phẩm', icon: 'Sparkles' },
  { id: 'fresh', name: 'Đồ tươi sống', icon: 'Apple' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-01',
    sku: 'DOU-001',
    barcode: '8934588012110',
    name: 'Coca-Cola Sleek Lon 320ml',
    category: 'Đồ uống',
    unit: 'Lon',
    costPrice: 7800,
    sellPrice: 10000,
    stock: 145,
    minStock: 48,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Công ty Coca-Cola VN'
  },
  {
    id: 'p-02',
    sku: 'DOU-002',
    barcode: '8934588012127',
    name: 'Nước tăng lực Sting Dâu 330ml',
    category: 'Đồ uống',
    unit: 'Chai',
    costPrice: 8200,
    sellPrice: 11000,
    stock: 12,
    minStock: 30,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    status: 'low_stock',
    supplier: 'Suntory PepsiCo VN'
  },
  {
    id: 'p-03',
    sku: 'MTP-001',
    barcode: '8934563020019',
    name: 'Mì Hảo Hảo Tôm Chua Cay 75g',
    category: 'Mì & Thực phẩm',
    unit: 'Gói',
    costPrice: 3400,
    sellPrice: 4500,
    stock: 320,
    minStock: 60,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Acecook Việt Nam'
  },
  {
    id: 'p-04',
    sku: 'SUB-001',
    barcode: '8934673510023',
    name: 'Sữa tươi Vinamilk 100% Có Đường 1L',
    category: 'Sữa & Bơ',
    unit: 'Hộp',
    costPrice: 28500,
    sellPrice: 34000,
    stock: 24,
    minStock: 20,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'CTCP Sữa Việt Nam (Vinamilk)'
  },
  {
    id: 'p-05',
    sku: 'GVH-001',
    barcode: '8936036010112',
    name: 'Dầu ăn tinh luyện Simply 1 Lít',
    category: 'Gia vị & Hóa phẩm',
    unit: 'Chai',
    costPrice: 46000,
    sellPrice: 56000,
    stock: 18,
    minStock: 25,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    status: 'low_stock',
    supplier: 'Công ty TNHH Calofic'
  },
  {
    id: 'p-06',
    sku: 'BKE-001',
    barcode: '8935001712015',
    name: 'Bánh ChocoPie Orion Hộp 12 Cái 360g',
    category: 'Bánh kẹo',
    unit: 'Hộp',
    costPrice: 43000,
    sellPrice: 54000,
    stock: 42,
    minStock: 15,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Công ty TNHH Thực phẩm Orion Vina'
  },
  {
    id: 'p-07',
    sku: 'DOU-003',
    barcode: '8934588019904',
    name: 'Bia Heineken Silver Lon 330ml',
    category: 'Đồ uống',
    unit: 'Lon',
    costPrice: 17500,
    sellPrice: 21500,
    stock: 85,
    minStock: 24,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Heineken Việt Nam'
  },
  {
    id: 'p-08',
    sku: 'MTP-002',
    barcode: '8936011400234',
    name: 'Gạo ST25 Ông Cua Túi 5kg',
    category: 'Mì & Thực phẩm',
    unit: 'Túi',
    costPrice: 165000,
    sellPrice: 195000,
    stock: 14,
    minStock: 10,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'DNTN Hồ Quang Trí'
  },
  {
    id: 'p-09',
    sku: 'GVH-002',
    barcode: '8934563820114',
    name: 'Nước mắm Nam Ngư Đệ Nhị 900ml',
    category: 'Gia vị & Hóa phẩm',
    unit: 'Chai',
    costPrice: 23000,
    sellPrice: 29000,
    stock: 36,
    minStock: 20,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Masan Consumer'
  },
  {
    id: 'p-10',
    sku: 'DOU-004',
    barcode: '8934588013346',
    name: 'Nước khoáng Lavie 500ml',
    category: 'Đồ uống',
    unit: 'Chai',
    costPrice: 3800,
    sellPrice: 6000,
    stock: 110,
    minStock: 40,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'La Vie Việt Nam'
  },
  {
    id: 'p-11',
    sku: 'SUB-002',
    barcode: '8934673510887',
    name: 'Sữa đặc có đường Ông Thọ Đỏ 380g',
    category: 'Sữa & Bơ',
    unit: 'Lon',
    costPrice: 21000,
    sellPrice: 26000,
    stock: 0,
    minStock: 15,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&auto=format&fit=crop&q=80',
    status: 'out_of_stock',
    supplier: 'CTCP Sữa Việt Nam (Vinamilk)'
  },
  {
    id: 'p-12',
    sku: 'BKE-002',
    barcode: '8935001718826',
    name: 'Bánh quy AFC Dinh dưỡng Vị Rau 172g',
    category: 'Bánh kẹo',
    unit: 'Hộp',
    costPrice: 19000,
    sellPrice: 25000,
    stock: 50,
    minStock: 20,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Mondelez Kinh Đô'
  },
  {
    id: 'p-13',
    sku: 'GVH-003',
    barcode: '8934563820999',
    name: 'Hạt nêm Knorr Thịt Thăn Xương Ống 400g',
    category: 'Gia vị & Hóa phẩm',
    unit: 'Gói',
    costPrice: 28000,
    sellPrice: 35000,
    stock: 8,
    minStock: 25,
    image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=300&auto=format&fit=crop&q=80',
    status: 'low_stock',
    supplier: 'Unilever Việt Nam'
  },
  {
    id: 'p-14',
    sku: 'MTP-003',
    barcode: '8934563028886',
    name: 'Xúc xích tiệt trùng Ponnie Thịt Heo 4 cây',
    category: 'Mì & Thực phẩm',
    unit: 'Gói',
    costPrice: 14500,
    sellPrice: 18500,
    stock: 64,
    minStock: 20,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Masan Consumer'
  },
  {
    id: 'p-15',
    sku: 'GVH-004',
    barcode: '8934563820442',
    name: 'Nước rửa chén Sunlight Chanh 750g',
    category: 'Gia vị & Hóa phẩm',
    unit: 'Chai',
    costPrice: 22000,
    sellPrice: 28000,
    stock: 45,
    minStock: 15,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'Unilever Việt Nam'
  },
  {
    id: 'p-16',
    sku: 'DOU-005',
    barcode: '8934588014490',
    name: 'Trà xanh không độ C2 Chanh 455ml',
    category: 'Đồ uống',
    unit: 'Chai',
    costPrice: 6500,
    sellPrice: 9000,
    stock: 96,
    minStock: 30,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'URC Việt Nam'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-01',
    code: 'KH-001',
    name: 'Chị Mai Lan',
    phone: '0988 123 456',
    points: 420,
    totalSpent: 4250000,
    tier: 'Vàng',
    lastVisit: '2026-09-10'
  },
  {
    id: 'c-02',
    code: 'KH-002',
    name: 'Anh Tuấn Hưng',
    phone: '0912 345 678',
    points: 150,
    totalSpent: 1680000,
    tier: 'Bạc',
    lastVisit: '2026-09-09'
  },
  {
    id: 'c-03',
    code: 'KH-003',
    name: 'Cô Thu Hương',
    phone: '0903 888 999',
    points: 890,
    totalSpent: 9200000,
    tier: 'Kim Cương',
    lastVisit: '2026-09-10'
  },
  {
    id: 'c-04',
    code: 'KH-004',
    name: 'Bác Đức Thành',
    phone: '0977 456 123',
    points: 65,
    totalSpent: 750000,
    tier: 'Thân thiết',
    lastVisit: '2026-09-08'
  },
  {
    id: 'c-05',
    code: 'KH-005',
    name: 'Anh Trần Minh Trí',
    phone: '0933 654 987',
    points: 310,
    totalSpent: 3420000,
    tier: 'Vàng',
    lastVisit: '2026-09-07'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1048',
    code: 'HD1048',
    createdAt: '2026-09-10T20:45:00',
    customerName: 'Chị Mai Lan',
    customerPhone: '0988 123 456',
    cashierName: 'Nguyễn Văn An',
    items: [
      { productId: 'p-01', productName: 'Coca-Cola Sleek Lon 320ml', sku: 'DOU-001', quantity: 6, unitPrice: 10000, total: 60000 },
      { productId: 'p-06', productName: 'Bánh ChocoPie Orion Hộp 12 Cái', sku: 'BKE-001', quantity: 1, unitPrice: 54000, total: 54000 },
      { productId: 'p-04', productName: 'Sữa tươi Vinamilk 100% Có Đường 1L', sku: 'SUB-001', quantity: 2, unitPrice: 34000, total: 68000 }
    ],
    subtotal: 182000,
    discount: 0,
    vat: 14560,
    total: 196560,
    paymentMethod: 'vietqr',
    amountReceived: 196560,
    change: 0,
    status: 'completed'
  },
  {
    id: 'ord-1047',
    code: 'HD1047',
    createdAt: '2026-09-10T20:20:00',
    customerName: 'Khách lẻ vãng lai',
    cashierName: 'Nguyễn Văn An',
    items: [
      { productId: 'p-03', productName: 'Mì Hảo Hảo Tôm Chua Cay 75g', sku: 'MTP-001', quantity: 10, unitPrice: 4500, total: 45000 },
      { productId: 'p-14', productName: 'Xúc xích tiệt trùng Ponnie 4 cây', sku: 'MTP-003', quantity: 2, unitPrice: 18500, total: 37000 }
    ],
    subtotal: 82000,
    discount: 0,
    vat: 6560,
    total: 88560,
    paymentMethod: 'cash',
    amountReceived: 100000,
    change: 11440,
    status: 'completed'
  },
  {
    id: 'ord-1046',
    code: 'HD1046',
    createdAt: '2026-09-10T19:55:00',
    customerName: 'Cô Thu Hương',
    customerPhone: '0903 888 999',
    cashierName: 'Nguyễn Văn An',
    items: [
      { productId: 'p-08', productName: 'Gạo ST25 Ông Cua Túi 5kg', sku: 'MTP-002', quantity: 2, unitPrice: 195000, total: 390000 },
      { productId: 'p-05', productName: 'Dầu ăn tinh luyện Simply 1 Lít', sku: 'GVH-001', quantity: 2, unitPrice: 56000, total: 112000 },
      { productId: 'p-09', productName: 'Nước mắm Nam Ngư Đệ Nhị 900ml', sku: 'GVH-002', quantity: 1, unitPrice: 29000, total: 29000 }
    ],
    subtotal: 531000,
    discount: 26550, // 5% VIP discount
    vat: 40356,
    total: 544806,
    paymentMethod: 'pos_card',
    amountReceived: 544806,
    change: 0,
    status: 'completed'
  },
  {
    id: 'ord-1045',
    code: 'HD1045',
    createdAt: '2026-09-10T19:15:00',
    customerName: 'Anh Tuấn Hưng',
    customerPhone: '0912 345 678',
    cashierName: 'Nguyễn Văn An',
    items: [
      { productId: 'p-07', productName: 'Bia Heineken Silver Lon 330ml', sku: 'DOU-003', quantity: 12, unitPrice: 21500, total: 258000 },
      { productId: 'p-12', productName: 'Bánh quy AFC Dinh dưỡng Vị Rau 172g', sku: 'BKE-002', quantity: 2, unitPrice: 25000, total: 50000 }
    ],
    subtotal: 308000,
    discount: 0,
    vat: 24640,
    total: 332640,
    paymentMethod: 'vietqr',
    amountReceived: 332640,
    change: 0,
    status: 'completed'
  },
  {
    id: 'ord-1044',
    code: 'HD1044',
    createdAt: '2026-09-10T18:40:00',
    customerName: 'Khách lẻ vãng lai',
    cashierName: 'Nguyễn Văn An',
    items: [
      { productId: 'p-10', productName: 'Nước khoáng Lavie 500ml', sku: 'DOU-004', quantity: 3, unitPrice: 6000, total: 18000 },
      { productId: 'p-16', productName: 'Trà xanh không độ C2 Chanh 455ml', sku: 'DOU-005', quantity: 2, unitPrice: 9000, total: 18000 }
    ],
    subtotal: 36000,
    discount: 0,
    vat: 2880,
    total: 38880,
    paymentMethod: 'cash',
    amountReceived: 50000,
    change: 11120,
    status: 'completed'
  },
  {
    id: 'ord-1043',
    code: 'HD1043',
    createdAt: '2026-09-10T17:50:00',
    customerName: 'Anh Trần Minh Trí',
    customerPhone: '0933 654 987',
    cashierName: 'Lê Thị Thu Thảo',
    items: [
      { productId: 'p-15', productName: 'Nước rửa chén Sunlight Chanh 750g', sku: 'GVH-004', quantity: 2, unitPrice: 28000, total: 56000 },
      { productId: 'p-13', productName: 'Hạt nêm Knorr Thịt Thăn Xương Ống 400g', sku: 'GVH-003', quantity: 2, unitPrice: 35000, total: 70000 }
    ],
    subtotal: 126000,
    discount: 0,
    vat: 10080,
    total: 136080,
    paymentMethod: 'vietqr',
    amountReceived: 136080,
    change: 0,
    status: 'completed'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Cảnh báo tồn kho',
    message: 'Nước tăng lực Sting Dâu 330ml còn 12 chai (dưới mức tối thiểu 30).',
    time: '5 phút trước',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Hết hàng trong kho',
    message: 'Sữa đặc có đường Ông Thọ Đỏ 380g đã hết hàng.',
    time: '20 phút trước',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Đơn nhập hàng thành công',
    message: 'Đơn nhập #NH2040 từ Acecook đã nhập kho đủ 50 thùng.',
    time: '1 giờ trước',
    type: 'success',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Mục tiêu doanh số ca trực',
    message: 'Doanh thu ca sáng đã đạt ₫12,450,000 (vượt 15% chỉ tiêu).',
    time: '3 giờ trước',
    type: 'info',
    read: true
  }
];

export const INITIAL_PURCHASES: SupplierPurchase[] = [
  {
    id: 'po-1',
    code: 'NH-2041',
    supplierName: 'Acecook Việt Nam',
    createdAt: '2026-09-10',
    expectedDate: '2026-09-12',
    totalItems: 350,
    totalValue: 12500000,
    status: 'pending',
    createdBy: 'Nguyễn Văn An'
  },
  {
    id: 'po-2',
    code: 'NH-2040',
    supplierName: 'CTCP Sữa Việt Nam (Vinamilk)',
    createdAt: '2026-09-09',
    expectedDate: '2026-09-10',
    totalItems: 120,
    totalValue: 8640000,
    status: 'received',
    createdBy: 'Lê Thị Thu Thảo'
  },
  {
    id: 'po-3',
    code: 'NH-2039',
    supplierName: 'Suntory PepsiCo VN',
    createdAt: '2026-09-08',
    expectedDate: '2026-09-09',
    totalItems: 240,
    totalValue: 15300000,
    status: 'received',
    createdBy: 'Nguyễn Văn An'
  },
  {
    id: 'po-4',
    code: 'NH-2038',
    supplierName: 'Unilever Việt Nam',
    createdAt: '2026-09-07',
    expectedDate: '2026-09-11',
    totalItems: 80,
    totalValue: 6850000,
    status: 'pending',
    createdBy: 'Lê Thị Thu Thảo'
  }
];

export const CURRENT_SHIFT: CashierShift = {
  id: 'shift-01',
  cashierName: 'Nguyễn Văn An',
  shiftName: 'Ca Sáng (06:00 - 14:00)',
  startTime: '06:00 10/09/2026',
  endTime: '14:00 10/09/2026',
  startingCash: 2000000,
  expectedCash: 11450000,
  totalRevenue: 24580000,
  orderCount: 248,
  status: 'active'
};

export const SALES_TREND_DATA = [
  { time: '07:00', amount: 1450000, orders: 18 },
  { time: '09:00', amount: 3200000, orders: 42 },
  { time: '11:00', amount: 5800000, orders: 65 },
  { time: '13:00', amount: 4100000, orders: 45 },
  { time: '15:00', amount: 3600000, orders: 38 },
  { time: '17:00', amount: 6430000, orders: 72 },
  { time: '19:00', amount: 8900000, orders: 94 },
  { time: '21:00', amount: 5200000, orders: 58 }
];

export const CATEGORY_SALES_SHARE = [
  { name: 'Đồ uống', percent: 34, amount: 8350000, color: '#16A34A' },
  { name: 'Mì & Thực phẩm', percent: 26, amount: 6390000, color: '#2563EB' },
  { name: 'Sữa & Bơ', percent: 18, amount: 4420000, color: '#F59E0B' },
  { name: 'Gia vị & Hóa phẩm', percent: 14, amount: 3440000, color: '#8B5CF6' },
  { name: 'Bánh kẹo & Khác', percent: 8, amount: 1980000, color: '#EC4899' },
];
