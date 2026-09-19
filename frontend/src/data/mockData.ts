import { Product, DIYGuide, Review, CartItem } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', count: 28 },
  { id: 'den', name: 'Đèn Trang Trí Tái Chế', count: 9 },
  { id: 'ke-hop', name: 'Kệ & Hộp Lưu Trữ', count: 8 },
  { id: 'ban-lam-viec', name: 'Decor Bàn Làm Việc', count: 6 },
  { id: 'gom-giay', name: 'Gốm Giấy Wabi Sabi', count: 5 },
];

export const SPACE_FILTERS = [
  'Phòng khách',
  'Góc làm việc',
  'Phòng ngủ',
  'Bàn ăn ấm cúng',
];

export const CRAFT_STANDARDS = [
  '100% Bìa carton phế liệu tuyển chọn',
  'Keo dán hữu cơ gốc nước không mùi',
  'Xử lý chống ẩm bằng sáp ong tự nhiên',
  'Chịu lực cao theo cấu trúc tổ ong',
  'Có thể tái phân hủy hoàn toàn',
];

export const PRODUCTS: Product[] = [
  {
    id: 'tranh-3d-ca-koi-mixed-media',
    name: 'Cá Koi',
    category: 'tranh-3d',
    roomSpace: 'Phòng khách',
    price: 185000,
    rating: 5,
    reviewCount: 0,
    badge: 'Tác phẩm đầu tiên',
    shortDesc: 'Bức tranh 3D tạo hiệu ứng bề mặt từ khăn giấy, kết hợp giấy, màu và các lớp vật liệu để tái hiện đôi cá koi giữa mặt nước xanh.',
    story: `Đây là tác phẩm đầu tiên của tôi trong hành trình khám phá tranh 3D và nghệ thuật đa chất liệu (mixed media). Từ những lớp khăn giấy được tạo hình thủ công, bề mặt tranh dần hình thành độ nổi, nếp gấp và chuyển động như mặt nước thật.\n\nTác phẩm kết hợp nhiều kỹ thuật: tạo texture bằng khăn giấy, đắp nổi từng chi tiết cá koi và lá sen, phối màu thủ công, sau đó hoàn thiện các lớp bề mặt để tạo chiều sâu thị giác. Mỗi mảng nổi được xử lý riêng để ánh sáng chạm vào tranh và làm thay đổi cảm nhận theo từng góc nhìn.`,
    specs: {
      material: 'Khăn giấy tạo hình, giấy mỹ thuật, keo chuyên dụng, màu acrylic và vật liệu mixed media',
      dimensions: 'Khung tranh đứng, kích thước thực tế theo mẫu',
      weight: 'Tác phẩm thủ công, cần treo hoặc đặt trên kệ chắc chắn',
      recycledWasteAmount: 'Tái sử dụng vật liệu giấy trong quá trình tạo hình',
      finish: 'Bề mặt nổi nhiều lớp, phối màu xanh nước và họa tiết cá koi thủ công',
      origin: 'Tác phẩm thủ công do Nhà Mình sáng tạo',
    },
    careGuide: [
      'Dùng cọ mềm hoặc khăn khô sạch để phủi bụi trên bề mặt nổi.',
      'Không chà xát, phun nước hoặc đặt tác phẩm ở nơi có độ ẩm cao.',
      'Tránh ánh nắng trực tiếp trong thời gian dài để giữ màu và độ bền của vật liệu.',
      'Khi di chuyển, giữ phần khung và đỡ từ phía sau, không cầm vào các chi tiết nổi.',
    ],
    images: ['/product-koi-3d.png'],
    sizes: [
      { id: 'standard', label: 'Bản tiêu chuẩn theo mẫu', dimensions: 'Kích thước theo tác phẩm mẫu', price: 1850000 },
    ],
    waxTones: [
      { id: 'ocean-blue', label: 'Xanh đại dương', hex: '#123d8f' },
    ],
    fittingOptions: [
      { id: 'artwork-only', label: 'Chỉ nhận tác phẩm tranh 3D hoàn thiện', priceDelta: 0 },
    ],
    inStock: true,
    isPopular: true,
    isFeatured: true,
  },
];

const LEGACY_PRODUCTS: Product[] = [
  {
    id: 'den-geodesic-carton',
    name: 'Đèn Thả Trần Geodesic Bìa Carton Tái Chế',
    category: 'den',
    roomSpace: 'Bàn ăn ấm cúng',
    price: 260000,
    originalPrice: 320000,
    rating: 4.9,
    reviewCount: 142,
    badge: 'Ưa chuộng nhất',
    shortDesc: 'Tạo hình đa giác kim cương từ 42 mảnh ghép carton sóng 5 lớp, khuếch tán ánh sáng vàng ấm qua từng kẽ giấy mộc.',
    story: `Mỗi chiếc đèn thả Geodesic bắt đầu từ những thùng carton vận chuyển đã qua sử dụng, được các xưởng may và siêu thị loại bỏ tại khu vực TP.HCM. 

Qua bàn tay của người thợ thủ công tại Nhà Mình Atelier, từng phiến bìa được phân loại theo độ cứng của lớp sóng ruột, cắt vát góc chuẩn 30 độ bằng dao thủ công sắc bén, sau đó ghép lại bằng keo tinh bột gạo hữu cơ. Bề mặt ngoài được miết lớp sáp ong mỏng giúp ngăn ngừa ẩm mốc nhiệt đới mà vẫn giữ trọn vẹn thớ giấy thô mộc ấm áp. Khi bật đèn, những đường vân giấy sáng bừng lên như những mạch sống mới được hồi sinh.`,
    specs: {
      material: 'Bìa carton 5 lớp tái chế, sáp ong tự nhiên, đui gỗ sồi mộc',
      dimensions: 'Đường kính 35cm x Cao 30cm (Size M)',
      weight: '480 gram (Siêu nhẹ, an toàn tuyệt đối khi treo trần)',
      recycledWasteAmount: '420g bìa carton thô (tương đương 2 hộp carton lớn)',
      finish: 'Phủ sáp ong chống ẩm nhẹ, giữ màu kraft nguyên bản',
      origin: 'Thủ công 100% tại Xưởng Nhà Mình, TP. Hồ Chí Minh',
    },
    careGuide: [
      'Dùng cọ lông mềm hoặc máy sấy tóc chế độ gió mát để phủi bụi định kỳ mỗi 2-3 tuần.',
      'Sử dụng bóng đèn LED nhiệt độ màu vàng ấm (2700K - 3000K, công suất 5W - 9W), không dùng bóng sợi đốt tỏa nhiệt cao.',
      'Tránh treo trực tiếp ở nơi mưa tạt hoặc khu vực ẩm ướt như sát bồn rửa hay ngoài trời.',
      'Nếu bị dính vài giọt nước, dùng khăn giấy thấm nhẹ ngay lập tức và để khô tự nhiên.',
    ],
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 's', label: 'Size S', dimensions: 'Ø 25cm x C 22cm', price: 220000 },
      { id: 'm', label: 'Size M (Ưa chuộng)', dimensions: 'Ø 35cm x C 30cm', price: 260000 },
      { id: 'l', label: 'Size L', dimensions: 'Ø 45cm x C 38cm', price: 320000 },
    ],
    waxTones: [
      { id: 'kraft', label: 'Mộc Kraft Tự Nhiên', hex: '#c59f6d' },
      { id: 'sage', label: 'Xanh Xô Thơm Nhạt', hex: '#94a187' },
      { id: 'wabi', label: 'Hạt Dẻ Khói Wabi', hex: '#6d5a49' },
    ],
    fittingOptions: [
      { id: 'oak-cord', label: 'Dây bọc dù gai mộc + Đui gỗ sồi mộc E27 (1.2m)', priceDelta: 40000 },
      { id: 'vintage-brass', label: 'Dây dù xoắn + Đui đồng vintage sang trọng (1.2m)', priceDelta: 60000 },
      { id: 'shade-only', label: 'Chỉ lấy chao đèn (Đã có sẵn dây đui trần)', priceDelta: 0 },
    ],
    inStock: true,
    isPopular: true,
    isFeatured: true,
  },
  {
    id: 'ke-de-ban-3-tang',
    name: 'Kệ Để Bàn 3 Tầng Khối Mô-Đun Carton',
    category: 'ke-hop',
    roomSpace: 'Góc làm việc',
    price: 185000,
    originalPrice: 220000,
    rating: 4.8,
    reviewCount: 96,
    badge: 'Chịu lực 15kg',
    shortDesc: 'Cấu trúc lồng sóng carton gia cố 7 lớp đan xen, chịu lực sách vở và tài liệu nặng mà không hề cong vênh.',
    story: 'Thiết kế lấy cảm hứng từ cấu trúc vòm chịu tải của cầu kiến trúc. Khung kệ được liên kết dạng ngàm âm dương không sử dụng ốc vít kim loại.',
    specs: {
      material: 'Bìa carton 7 lớp công nghiệp tái sinh ép nhiệt',
      dimensions: 'Dài 38cm x Rộng 22cm x Cao 32cm',
      weight: '620 gram',
      recycledWasteAmount: '550g bìa carton vụn',
      finish: 'Ủ dầu sáp đậu nành chống ẩm',
      origin: 'Xưởng Nhà Mình, TP. Hồ Chí Minh',
    },
    careGuide: [
      'Vệ sinh bằng khăn vải khô hoặc chổi mềm.',
      'Để nơi khô ráo, thoáng mát trên mặt bàn làm việc.',
    ],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 'standard', label: 'Tiêu chuẩn 3 tầng', dimensions: '38 x 22 x 32cm', price: 185000 },
      { id: 'wide', label: 'Bản mở rộng 4 tầng', dimensions: '48 x 25 x 42cm', price: 245000 },
    ],
    waxTones: [
      { id: 'kraft', label: 'Nâu Kraft Tự Nhiên', hex: '#b58f5f' },
      { id: 'charcoal', label: 'Than Củi Om Mờ', hex: '#48433f' },
    ],
    fittingOptions: [
      { id: 'default', label: 'Tự lắp ráp (kèm bản hướng dẫn ngàm âm dương)', priceDelta: 0 },
      { id: 'assembled', label: 'Xưởng lắp sẵn nguyên khối hoàn thiện', priceDelta: 20000 },
    ],
    inStock: true,
    isPopular: true,
  },
  {
    id: 'set-lot-ly-soi-giay',
    name: 'Set 4 Đế Lót Ly Ép Sợi Giấy Phế Liệu & Vỏ Trấu',
    category: 'ban-lam-viec',
    roomSpace: 'Bàn ăn ấm cúng',
    price: 95000,
    originalPrice: 120000,
    rating: 4.9,
    reviewCount: 68,
    badge: 'Mới ra mắt',
    shortDesc: 'Nghiền từ bột giấy báo cũ và vỏ trấu hữu cơ, xử lý chống thấm nước 100% bằng sáp thực vật tự nhiên.',
    story: 'Mỗi chiếc lót ly mang hoa văn độc bản của xơ sợi tự nhiên ép chặt dưới áp lực 20 tấn.',
    specs: {
      material: 'Bột giấy tái sinh + Vỏ trấu lên men + Sáp vi tinh thể sinh học',
      dimensions: 'Đường kính 10cm x Dày 0.8cm (Set gồm 4 miếng)',
      weight: '180 gram/set',
      recycledWasteAmount: '120g giấy báo và bao bì',
      finish: 'Kháng nước nóng & lạnh hoàn toàn',
      origin: 'Xưởng Nhà Mình, TP. Hồ Chí Minh',
    },
    careGuide: [
      'Rửa nhẹ dưới vòi nước chảy và để ráo khô tự nhiên sau khi sử dụng.',
      'Không ngâm trong nước quá 2 tiếng.',
    ],
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 'round', label: 'Khuôn Tròn Ø10cm', dimensions: 'Ø10cm', price: 95000 },
      { id: 'hex', label: 'Khuôn Lục Giác Ép Cạnh', dimensions: '11 x 11cm', price: 105000 },
    ],
    waxTones: [
      { id: 'oatmeal', label: 'Yến Mạch Mộc Trấu', hex: '#d9ccb9' },
      { id: 'terracotta', label: 'Đất Nung Mờ', hex: '#b37456' },
    ],
    fittingOptions: [
      { id: 'gift-box', label: 'Đóng hộp quà giấy kraft thắt nơ dây cói (+15.000₫)', priceDelta: 15000 },
      { id: 'simple-wrap', label: 'Bọc giấy sáp mộc thân thiện', priceDelta: 0 },
    ],
    inStock: true,
  },
  {
    id: 'binh-gom-giay-wabi-sabi',
    name: 'Bình Decor Gốm Giấy (Paper Mache) Wabi-Sabi',
    category: 'gom-giay',
    roomSpace: 'Phòng khách',
    price: 215000,
    originalPrice: 260000,
    rating: 5.0,
    reviewCount: 54,
    badge: 'Độc bản thủ công',
    shortDesc: 'Tạc thủ công từ bột giấy carton nghiền mịn và thạch cao tự nhiên, tạo hình uốn lượn mộc mạc cắm hoa khô.',
    story: 'Kỹ thuật paper mache cổ xưa được biến tấu hiện đại. Thân bình có trọng lượng đầm tay nhưng vẫn có độ xốp nhẹ ấm áp của xơ thực vật.',
    specs: {
      material: 'Bột giấy carton nguyên chất tái chế, khoáng thạch cao, bột màu đất đá',
      dimensions: 'Cao 26cm x Bụng rộng 18cm',
      weight: '490 gram',
      recycledWasteAmount: '350g bìa giấy phế phẩm',
      finish: 'Bề mặt nhám mờ chất đá vôi (Chuyên cắm hoa khô & cành cây)',
      origin: 'Xưởng Nhà Mình, TP. Hồ Chí Minh',
    },
    careGuide: [
      'Sản phẩm chuyên dụng để cắm hoa khô, cành lựu, cỏ lau hoặc trưng bày đơn lẻ.',
      'Không đổ nước trực tiếp vào lòng bình (hoặc đặt ống nghiệm thủy tinh nhỏ bên trong nếu muốn cắm hoa tươi).',
    ],
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 'm', label: 'Bình Dáng Bầu Cao 26cm', dimensions: 'Cao 26cm', price: 215000 },
      { id: 'l', label: 'Bình Dáng Trăng Khuyết 32cm', dimensions: 'Cao 32cm', price: 280000 },
    ],
    waxTones: [
      { id: 'chalk', label: 'Trắng Phấn Vôi', hex: '#ede8df' },
      { id: 'sand', label: 'Cát Sa Mạc Wabi', hex: '#cfbfa8' },
    ],
    fittingOptions: [
      { id: 'with-flowers', label: 'Tặng kèm bó hoa phi yến khô & cỏ đuôi thỏ', priceDelta: 45000 },
      { id: 'vase-only', label: 'Chỉ lấy bình gốm giấy', priceDelta: 0 },
    ],
    inStock: true,
  },
  {
    id: 'chao-den-ban-origami',
    name: 'Đèn Bàn Khối Đa Diện Xếp Giấy Bìa Nâu Origami',
    category: 'den',
    roomSpace: 'Phòng ngủ',
    price: 240000,
    rating: 4.8,
    reviewCount: 37,
    badge: 'Ánh sáng êm dịu',
    shortDesc: 'Gấp nếp chính xác theo hình học Origami Nhật Bản, tạo hiệu ứng bóng đổ ấm áp lan tỏa cho phòng ngủ.',
    story: 'Từ một tấm carton 3 lớp phẳng, người thợ dùng kỹ thuật rạch ngấn tỉ mỉ để xếp thành một khối cầu lăng trụ 24 mặt phản chiếu ánh sáng nhẹ dịu.',
    specs: {
      material: 'Giấy carton kraft 3 lớp dai mịn, chân gỗ cao su tự nhiên',
      dimensions: 'Đường kính 22cm x Cao 26cm',
      weight: '350 gram',
      recycledWasteAmount: '280g giấy',
      finish: 'Sáp chống bám bụi',
      origin: 'Xưởng Nhà Mình',
    },
    careGuide: ['Dùng chổi quét bụi lông mềm vệ sinh.', 'Dùng bóng LED ánh sáng vàng.'],
    images: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 'standard', label: 'Kích thước để bàn Ø22cm', dimensions: 'Ø22cm', price: 240000 },
    ],
    waxTones: [
      { id: 'kraft', label: 'Màu Kraft Mộc', hex: '#c59f6d' },
    ],
    fittingOptions: [
      { id: 'led-bulb', label: 'Đã gồm đế đèn + Dây công tắc + Bóng LED 5W Rạng Đông', priceDelta: 50000 },
      { id: 'shade-only', label: 'Chỉ chao đèn gấp nếp', priceDelta: 0 },
    ],
    inStock: true,
  },
  {
    id: 'khay-but-tai-lieu-nordic',
    name: 'Khay Đựng Bút & Tài Liệu Nordic Xếp Tầng',
    category: 'ban-lam-viec',
    roomSpace: 'Góc làm việc',
    price: 135000,
    rating: 4.7,
    reviewCount: 42,
    badge: 'Gọn gàng tối giản',
    shortDesc: 'Thiết kế góc vát công thái học giúp cất bút, thước, sổ tay và điện thoại vừa vặn trên một diện tích nhỏ.',
    story: 'Tối ưu không gian làm việc với cấu trúc xếp lớp carton cắt lớp mô phỏng địa hình đồi cát.',
    specs: {
      material: 'Bìa carton ép khối 10 lớp',
      dimensions: '28cm x 15cm x 12cm',
      weight: '410 gram',
      recycledWasteAmount: '380g carton',
      finish: 'Sơn gốc nước màu be nhạt kết hợp kraft',
      origin: 'Xưởng Nhà Mình',
    },
    careGuide: ['Lau bằng khăn ẩm vắt kiệt nước.'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 'standard', label: 'Bản 3 ngăn đa năng', dimensions: '28 x 15 x 12cm', price: 135000 },
    ],
    waxTones: [
      { id: 'kraft', label: 'Kraft Nâu Mộc', hex: '#b58f5f' },
      { id: 'olive', label: 'Xanh Rêu Xám', hex: '#77826d' },
    ],
    fittingOptions: [
      { id: 'box', label: 'Đóng gói mộc', priceDelta: 0 },
    ],
    inStock: true,
  },
  {
    id: 'dong-ho-treo-tuong-kraft',
    name: 'Đồng Hồ Treo Tường Kim Trôi Tối Giản Mộc Kraft',
    category: 'den',
    roomSpace: 'Phòng khách',
    price: 210000,
    originalPrice: 250000,
    rating: 4.9,
    reviewCount: 31,
    badge: 'Máy kim trôi êm',
    shortDesc: 'Mặt số tối giản khắc laser trên tấm bìa ép sóng chịu nén 12 lớp, máy kim trôi Đài Loan không gây tiếng ồn.',
    story: 'Từng vạch số được khoét rãnh mộc lộ ra lõi gợn sóng carton nhịp nhàng theo thời gian.',
    specs: {
      material: 'Carton đặc 12 lớp, kim gỗ dẻ gai, máy quartz kim trôi siêu êm',
      dimensions: 'Đường kính 30cm x Dày 3.5cm',
      weight: '320 gram',
      recycledWasteAmount: '300g bìa giấy cứng',
      finish: 'Sáp vi sinh chống ẩm',
      origin: 'Xưởng Nhà Mình',
    },
    careGuide: ['Dùng 1 viên pin AA tiêu chuẩn, thay sau 8-12 tháng.'],
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 'm', label: 'Đường kính 30cm', dimensions: 'Ø 30cm', price: 210000 },
    ],
    waxTones: [
      { id: 'kraft', label: 'Mộc Kraft Tự Nhiên', hex: '#c59f6d' },
      { id: 'black', label: 'Đen Mờ Tro Bếp', hex: '#333333' },
    ],
    fittingOptions: [
      { id: 'pin', label: 'Kèm pin AA + móc treo đinh thông minh không khoan tường', priceDelta: 15000 },
      { id: 'standard', label: 'Chỉ đồng hồ', priceDelta: 0 },
    ],
    inStock: true,
  },
  {
    id: 'tranh-phu-dieu-giay-noi',
    name: 'Tranh Phù Điêu Đồi Cát Nổi Giấy Ép Thủ Công',
    category: 'gom-giay',
    roomSpace: 'Quán Cafe & Studio',
    price: 340000,
    originalPrice: 420000,
    rating: 5.0,
    reviewCount: 29,
    badge: 'Tác phẩm nghệ thuật',
    shortDesc: 'Xếp tầng 30 lớp đường cong cao thấp mô phỏng những triền cát lượn sóng của đồi cát Mũi Né.',
    story: 'Tranh phù điêu 3D với khung carton gia cố nguyên khối, tạo chiều sâu thị giác ấn tượng dưới ánh đèn rọi tranh.',
    specs: {
      material: 'Giấy kraft tái chế 350gsm cắt laser xếp lớp',
      dimensions: '40cm x 50cm x Dày 4.5cm',
      weight: '1.2 kg',
      recycledWasteAmount: '800g giấy chất lượng cao',
      finish: 'Khung mộc viền kraft bảo vệ',
      origin: 'Xưởng Nhà Mình',
    },
    careGuide: ['Treo nơi khô ráo, tránh ánh nắng gắt chiếu liên tục.'],
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: [
      { id: 'standard', label: 'Khổ 40 x 50cm', dimensions: '40 x 50cm', price: 340000 },
    ],
    waxTones: [
      { id: 'kraft', label: 'Tông Cát Vàng Mộc', hex: '#cfbfa8' },
    ],
    fittingOptions: [
      { id: 'hanger', label: 'Tặng kèm móc treo & đinh tán chịu lực', priceDelta: 0 },
    ],
    inStock: true,
  },
];

export const DIY_GUIDES: DIYGuide[] = [
  {
    id: 'ke-sach-mini-carton',
    title: 'Làm Kệ Sách Mini Để Bàn Từ Thùng Bìa Carton Cũ Chịu Lực 10kg',
    category: 'Kệ & Hộp Lưu Trữ',
    difficulty: 'Trung bình (1-2h)',
    estimatedTime: '45 - 60 phút',
    downloadCount: 4820,
    templateFileName: 'Rap_KeSachMini_NhaMinh.pdf',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    summary: 'Tận dụng 2 thùng carton giao hàng shopee cỡ lớn để tạo thành chiếc kệ 3 ngăn vững chãi để tài liệu và sách bìa cứng.',
    materialsNeeded: [
      '2 thùng carton dày 5 lớp kích thước khoảng 40x30x30cm',
      'Keo sữa hữu cơ (hoặc súng bắn keo nến)',
      '1 hũ sáp ong nhỏ để quét chống ẩm cạnh giấy',
      'Thước kim loại 50cm & dao trổ giấy cán thép',
    ],
    toolsNeeded: [
      'Dao rọc giấy sắc bén',
      'Thước nhôm thẳng',
      'Bút chì đánh dấu',
      'Kẹp cố định giấy hoặc vài cuốn sách dày để đè keo',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tải rập & Cắt phôi carton',
        description: 'In bản rập tỷ lệ 1:1 từ Nhà Mình hoặc dùng thước kẻ trực tiếp lên bề mặt bìa carton phẳng. Lưu ý hướng thớ sóng giấy nằm vuông góc với mặt kệ để tăng khả năng chịu nén lên gấp 4 lần.',
        tip: 'Dùng dao mới thật bén, rạch nghiêng 45 độ thành 2-3 đường nhẹ thay vì ấn quá mạnh làm nát thớ giấy.'
      },
      {
        stepNumber: 2,
        title: 'Gia cố thành đôi & Cắt ngàm âm dương',
        description: 'Dán 2 lớp bìa lại với nhau bằng keo sữa pha loãng nhẹ với 5% nước. Miết phẳng để không đọng bọt khí. Cắt các khe ngàm kết nối rộng đúng bằng bề dày tấm bìa kép.',
        tip: 'Dùng sách dày đè lên trong 15 phút cho keo kết dính tuyệt đối phẳng.'
      },
      {
        stepNumber: 3,
        title: 'Khóa khớp & Bôi sáp bảo vệ',
        description: 'Lắp các chi tiết ngàm vào nhau theo thứ tự từ đáy lên các vách ngăn. Quét một lớp mỏng sáp ong lên các mép hở để chống hút ẩm trong không khí.',
        tip: 'Có thể dùng giấy kraft nâu cuộn mỏng để dán bo mép ngoài nếu muốn đường nét trơn tru mượt mà.'
      }
    ]
  },
  {
    id: 'chao-den-origami-da-dien',
    title: 'Gấp Chao Đèn Thả Khối Đa Diện Kim Cương Bằng Bìa Kraft Mộc',
    category: 'Đèn Trang Trí Giấy',
    difficulty: 'Dễ làm (< 30p)',
    estimatedTime: '25 - 35 phút',
    downloadCount: 6310,
    templateFileName: 'Rap_ChaoDen_KimCuong_NhaMinh.pdf',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    summary: 'Chỉ với 1 tấm giấy bìa kraft 300gsm và cây kéo, bạn có thể tạo nên chiếc chao đèn hình học biến đổi ánh sáng lung linh cho bàn trà.',
    materialsNeeded: [
      '1 tờ bìa kraft nâu định lượng 280-350gsm khổ A3 hoặc 50x70cm',
      'Keo dán 2 mặt siêu dính loại mỏng',
      'Bút bi hết mực (dùng để cấn nếp gấp sắc nét)',
    ],
    toolsNeeded: ['Kéo thủ công', 'Thước kẻ', 'Bút cấn nếp'],
    steps: [
      {
        stepNumber: 1,
        title: 'Cấn nếp theo đường rập núi & thung lũng',
        description: 'Đặt thước theo từng đường kẻ và dùng đầu bút hết mực ấn tạo đường rãnh sâu. Nếp đứt nét là nếp núi (gấp lồi ra), nếp liền nét là nếp thung lũng (gấp lõm vào).',
      },
      {
        stepNumber: 2,
        title: 'Uốn nếp đồng loạt',
        description: 'Dùng các ngón tay nhẹ nhàng bóp các nếp gấp lại theo chiều tự nhiên của giấy. Tấm bìa sẽ tự động cong tròn lại thành khối cầu đa giác.',
      },
      {
        stepNumber: 3,
        title: 'Dán mép nối & lồng đui đèn LED',
        description: 'Dán mép cuối cùng bằng băng keo 2 mặt. Cắt lỗ tròn đỉnh trên vừa với đui xoáy E27 tiêu chuẩn.',
        tip: 'Tuyệt đối luôn sử dụng bóng LED mát không tỏa nhiệt để đảm bảo tuổi thọ giấy bền bỉ trên 3 năm.'
      }
    ]
  },
  {
    id: 'lo-hoa-gom-giay-paper-mache',
    title: 'Tự Làm Bình Gốm Giấy (Paper Mache) Phong Cách Wabi Sabi',
    category: 'Gốm Giấy',
    difficulty: 'Nâng cao (> 2h)',
    estimatedTime: '2 - 3 giờ (cần 1 ngày phơi khô)',
    downloadCount: 3950,
    templateFileName: 'HuongDan_GomGiay_WabiSabi.pdf',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    summary: 'Tái sinh giấy báo và khay đựng trứng thành chất liệu như đá vôi tự nhiên, uốn nắn những dáng bình bất đối xứng mang tinh thần tĩnh lặng.',
    materialsNeeded: [
      'Khay đựng trứng bằng giấy hoặc giấy báo cũ (200g)',
      'Bột thạch cao xây dựng hoặc bột năng (100g)',
      'Keo sữa PVA (150ml) và nước ấm',
      'Bóng bay hoặc chai nhựa cũ làm cốt phôi bên trong',
    ],
    toolsNeeded: ['Máy xay sinh tố cũ để xay nhuyễn giấy', 'Chậu ngâm nước', 'Khăn vắt ráo'],
    steps: [
      {
        stepNumber: 1,
        title: 'Ngâm và xay nhuyễn xơ giấy',
        description: 'Xé nhỏ khay trứng ngâm vào nước ấm 30 phút. Cho vào máy xay sinh tố xay nhuyễn thành bột mịn, sau đó đổ ra khăn vải vắt thật kiệt nước.',
      },
      {
        stepNumber: 2,
        title: 'Trộn hồ đất gốm giấy',
        description: 'Nhào xơ giấy với keo sữa và 2 muỗng bột thạch cao cho tới khi thành khối bột dẻo mịn như đất sét không dính tay.',
      },
      {
        stepNumber: 3,
        title: 'Đắp tạo hình & Phơi nắng',
        description: 'Thổi phồng quả bóng bay và đắp từng mảng bột giấy lên độ dày 4-5mm. Dùng ngón tay tạo những vết lõm tự nhiên wabi-sabi rồi đem phơi nắng ráo 24h.',
      }
    ]
  },
  {
    id: 'khay-dung-but-da-ngang',
    title: 'Hộp Đựng Bút & Khay Tài Liệu Xếp Tầng Scandinavian',
    category: 'Kệ & Hộp Lưu Trữ',
    difficulty: 'Dễ làm (< 30p)',
    estimatedTime: '30 phút',
    downloadCount: 2840,
    templateFileName: 'Rap_KhayBut_Nordic.pdf',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    summary: 'Tạo hình góc xéo tinh tế, cất gọn bút viết, kéo, sổ tay để bàn làm việc luôn ngăn nắp và truyền cảm hứng mỗi ngày.',
    materialsNeeded: ['Tấm bìa carton 3 lớp', 'Giấy gói kraft nâu', 'Băng dính 2 mặt'],
    toolsNeeded: ['Dao rọc giấy', 'Thước kẻ'],
    steps: [
      {
        stepNumber: 1,
        title: 'Cắt các vách ngăn chéo',
        description: 'Cắt 4 vách ngăn với chiều cao giảm dần từ 14cm xuống 6cm để dễ lấy bút và thước ngắn.',
      },
      {
        stepNumber: 2,
        title: 'Dán cố định vào khay đáy',
        description: 'Dán các rãnh chia ngăn vào hộp ngoài và dán mép bo bằng giấy kraft đồng màu.',
      }
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Nguyễn Thu Hương',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '14/10/2025',
    comment: 'Chiếc đèn thả Geodesic treo ngay trên bàn ăn gỗ sồi của nhà mình nhìn mê mẩn luôn! Ánh sáng len qua từng khe sóng giấy màu vàng ấm cực kỳ lãng mạn. Đóng gói hộp kraft rất chỉn chu, mở ra thoang thoảng mùi sáp ong nhẹ dễ chịu.',
    verifiedBuyer: true,
    roomPhoto: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    author: 'Trần Minh Triết',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '28/09/2025',
    comment: 'Bất ngờ về độ chắc chắn của cấu trúc carton! Lúc đầu tưởng nhẹ sẽ dễ móp méo nhưng thợ làm ngàm rất khít và cứng cáp. Mình mua cả kệ để bàn và đèn thả cho góc làm việc WFH, ngồi làm việc có cảm hứng sáng tạo hơn hẳn.',
    verifiedBuyer: true,
    helpfulCount: 18,
  },
  {
    id: 'rev-3',
    author: 'Lê Hoàng Yến',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '05/09/2025',
    comment: 'Ý tưởng tái sinh rác thải carton thành tác phẩm nghệ thuật decor quá tuyệt vời. Cầm trên tay thấy trân trọng công sức của các bạn thợ thủ công. Sẽ tiếp tục ủng hộ Nhà Mình!',
    verifiedBuyer: true,
    helpfulCount: 12,
  },
];

export const INITIAL_CART_ITEMS: CartItem[] = [];

export const FORMAT_CURRENCY = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
