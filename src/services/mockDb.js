// central mock database using localStorage to persist data across sessions and coordinate Buyer/Seller actions.
const DB_PREFIX = 'merchora_';

const defaultSellers = [
  {
    id: 'seller_1',
    email: 'seller@merchora.shop',
    password: 'password123',
    role: 'seller',
    createdDate: '2026-01-10T12:00:00Z',
    emailVerified: true,
    activeStatus: 'active',
    profile: {
      name: 'Aura Wear Ltd',
      businessName: 'Aura Wear Ltd',
      contact: '+1 (555) 123-4567',
      taxId: 'TX-987654321',
      bankAccount: 'Chase Bank ****9876',
      verificationStatus: 'Verified',
      rating: 4.8,
      totalSalesCount: 142,
      earnings: 12540
    }
  },
  {
    id: 'seller_2',
    email: 'tech@merchora.shop',
    password: 'password123',
    role: 'seller',
    createdDate: '2026-02-15T12:00:00Z',
    emailVerified: true,
    activeStatus: 'active',
    profile: {
      name: 'VoltGadgets LLC',
      businessName: 'VoltGadgets LLC',
      contact: '+1 (555) 987-6543',
      taxId: 'TX-123456789',
      bankAccount: 'Wells Fargo ****1234',
      verificationStatus: 'Verified',
      rating: 4.9,
      totalSalesCount: 289,
      earnings: 45200
    }
  }
];

const defaultBuyers = [
  {
    id: 'buyer_1',
    email: 'buyer@merchora.shop',
    password: 'password123',
    role: 'buyer',
    createdDate: '2026-03-01T12:00:00Z',
    emailVerified: true,
    activeStatus: 'active',
    profile: {
      name: 'Alex Johnson',
      shippingAddress: '123 Main Street, Apt 4B, New York, NY 10001',
      paymentPreference: 'Visa ending in 4242'
    }
  }
];

const defaultProducts = [
  {
    id: 'prod_1',
    sellerId: 'seller_1',
    title: 'Minimalist Cotton Oversized Tee',
    description: 'Elevate your daily wear with our premium oversized tee. Crafted from 100% organic cotton, this t-shirt offers an ultra-soft feel, breathable comfort, and a relaxed modern fit. Perfect for layering or wearing on its own as a streetwear statement.',
    price: 29.99,
    compareAtPrice: 39.99,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Apparel',
    tags: ['clothing', 'tee', 'oversized', 'minimalist'],
    variants: [
      { id: 'v1', name: 'Size', value: 'S', sku: 'AUR-TEE-S', inventory: 15, price: 29.99 },
      { id: 'v2', name: 'Size', value: 'M', sku: 'AUR-TEE-M', inventory: 25, price: 29.99 },
      { id: 'v3', name: 'Size', value: 'L', sku: 'AUR-TEE-L', inventory: 4, price: 29.99 } // Low stock target!
    ],
    creationDate: '2026-05-12T10:00:00Z',
    publicationStatus: 'published',
    viewCount: 1420
  },
  {
    id: 'prod_2',
    sellerId: 'seller_2',
    title: 'Merchora Sound ANC Headphones',
    description: 'Experience pure acoustic bliss with our flagship Active Noise Cancelling headphones. Features 40mm dynamic drivers, hybrid ANC technology, transparency mode, and up to 45 hours of playback. The plush protein leather ear cups offer absolute comfort during extended sessions.',
    price: 149.99,
    compareAtPrice: 199.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Electronics',
    tags: ['headphones', 'audio', 'anc', 'wireless'],
    variants: [
      { id: 'v4', name: 'Color', value: 'Matte Black', sku: 'VOLT-ANC-BLK', inventory: 12, price: 149.99 },
      { id: 'v5', name: 'Color', value: 'Off White', sku: 'VOLT-ANC-WHT', inventory: 0, price: 159.99 } // Sold out target!
    ],
    creationDate: '2026-05-15T14:30:00Z',
    publicationStatus: 'published',
    viewCount: 2891
  },
  {
    id: 'prod_3',
    sellerId: 'seller_1',
    title: 'Nomad Knit Running Sneakers',
    description: 'Designed for the modern runner, these sneakers feature an ultra-breathable engineered knit upper and our proprietary high-rebound cushioning foam. Responsive support and multi-surface grip tread ensure comfort on streets, trails, or gym surfaces.',
    price: 89.99,
    compareAtPrice: 120.00,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Footwear',
    tags: ['sneakers', 'shoes', 'running', 'sport'],
    variants: [
      { id: 'v6', name: 'Size', value: '9', sku: 'NOM-RUN-9', inventory: 18, price: 89.99 },
      { id: 'v7', name: 'Size', value: '10', sku: 'NOM-RUN-10', inventory: 22, price: 89.99 }
    ],
    creationDate: '2026-05-20T08:15:00Z',
    publicationStatus: 'published',
    viewCount: 1932
  },
  {
    id: 'prod_4',
    sellerId: 'seller_2',
    title: 'Waterproof Everyday Backpack',
    description: 'A stylish, rugged companion for your daily commute or weekend adventures. Contains a padded laptop compartment (up to 16"), secret passport sleeve, USB charging pass-through, and waterproof exterior zippers to keep your essentials safe in any weather.',
    price: 59.99,
    compareAtPrice: 79.99,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Accessories',
    tags: ['backpack', 'travel', 'commute', 'bag'],
    variants: [
      { id: 'v8', name: 'Color', value: 'Charcoal Gray', sku: 'VOLT-BPK-CHA', inventory: 3, price: 59.99 } // Low stock target!
    ],
    creationDate: '2026-05-22T16:00:00Z',
    publicationStatus: 'published',
    viewCount: 854
  },
  {
    id: 'prod_5',
    sellerId: 'seller_1',
    title: 'Ceramic Matte Coffee Mug (Set of 2)',
    description: 'Bring a touch of artisan refinement to your morning routine. Handcrafted by local potters, these mugs feature a unique matte textured finish and a comfortable wide handle. Dishwasher and microwave safe.',
    price: 24.99,
    compareAtPrice: 29.99,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Home & Living',
    tags: ['mug', 'ceramic', 'kitchen', 'home'],
    variants: [
      { id: 'v9', name: 'Style', value: 'Terracotta Red', sku: 'HOME-MUG-TER', inventory: 35, price: 24.99 },
      { id: 'v10', name: 'Style', value: 'Slate Gray', sku: 'HOME-MUG-SLA', inventory: 40, price: 24.99 }
    ],
    creationDate: '2026-05-25T11:00:00Z',
    publicationStatus: 'published',
    viewCount: 624
  },
  {
    id: 'prod_6',
    sellerId: 'seller_2',
    title: 'Aluminum Mechanical Keyboard',
    description: 'Anodized CNC aluminum body keyboard with hot-swappable tactile switches, pre-lubed stabilizers, double-shot PBT keycaps, and customizable RGB lighting. Perfect typing acoustics and responsiveness for writers and developers alike.',
    price: 189.99,
    compareAtPrice: 219.99,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Electronics',
    tags: ['keyboard', 'mechanical', 'rgb', 'office'],
    variants: [
      { id: 'v11', name: 'Switch Type', value: 'Linear Red', sku: 'VOLT-KBD-RED', inventory: 15, price: 189.99 },
      { id: 'v12', name: 'Switch Type', value: 'Tactile Brown', sku: 'VOLT-KBD-BRN', inventory: 2, price: 189.99 }
    ],
    creationDate: '2026-05-28T18:45:00Z',
    publicationStatus: 'published',
    viewCount: 1540
  }
];

// GENERATOR FOR 94 MORE ITEMS (Making 100 total products in catalog)
const generateDummyProducts = (count) => {
  const generated = [];
  const categories = [
    'Apparel', 
    'Electronics', 
    'Footwear', 
    'Accessories', 
    'Home & Living',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Automotive'
  ];
  const titles = {
    'Apparel': ['Cotton Polo Shirt', 'Classic Denim Jacket', 'Slim Fit Chinos', 'Knitted Cardigan', 'Fleece Zip Hoodie', 'Athletic Gym Shorts', 'Linen Summer Dress', 'Premium Trench Coat', 'Windbreaker Shell', 'Heavyweight Crew Sweatshirt'],
    'Electronics': ['Wireless Charging Pad', 'Portable Power Bank', 'Bluetooth Smart Speaker', 'USB-C Charging Cable', 'Mechanical Gaming Mouse', 'Mini LED Projector', 'Dual-Driver Earbuds', 'Smart Fitness Watch', 'Ergonomic Desk Light', 'Webcam Pro 1080p'],
    'Footwear': ['Leather Chelsea Boots', 'Canvas Low-Top Sneakers', 'Breathable Gym Trainers', 'Waterproof Trail Shoes', 'Classic Leather Loafers', 'Platform Suede Sandals', 'Cloud-Foam Slide Sandals', 'Neoprene Water Shoes', 'Comfort Walking Slip-ons', 'Vintage High-Top Sneakers'],
    'Accessories': ['RFID Blocking Leather Wallet', 'Polarized Wayfarer Sunglasses', 'Canvas Messenger Bag', 'Stainless Steel Water Bottle', 'Heavy-Duty Laptop Sleeve', 'Travel Neck Pillow', 'Key Organizer Leather Loop', 'Minimalist Card Holder', 'Anti-Theft Backpack Case', 'Silicone Apple Watch Band'],
    'Home & Living': ['Soy Wax Scented Candle', 'Memory Foam Sleeping Pillow', 'Stainless Steel Knife Set', 'Premium Cotton Towel Set', 'BPA-Free Food Boxes', 'Succulent Ceramic Plant Pots', 'Double-Walled Glass Mugs', 'Linen Bed Sheet Set', 'Modern Wall Clock Circle', 'Aromatic Oil Diffuser'],
    'Beauty & Personal Care': ['Organic Face Serum', 'Electric Facial Cleanser Brush', 'Moisturizing Hair Mask', 'Matte Lipstick Set', 'Sonic Toothbrush Electric', 'Essential Oil Massage Blend', 'Bamboo Makeup Brush Kit', 'Hydrating Sheet Masks Pack', 'Premium Beard Oil Conditioner', 'Mineral Sunscreen SPF 50'],
    'Sports & Outdoors': ['Ergonomic Yoga Mat Extra Thick', 'Stainless Steel Vacuum Flask', 'Adjustable Dumbbells Set', 'Waterproof Hiking Backpack', 'LED Headlamp Flashlight', 'Resistance Bands Kit', 'Professional Tennis Racket', 'Foldable Camping Chair', 'High-Performance Running Belt', 'Fiberglass Pickleball Paddle'],
    'Books & Media': ['The Art of Simple Living Hardcover', 'Sci-Fi Odyssey Paperback', 'Culinary Masterclass Cookbook', 'Digital Photography Guide', 'History of Art Chronicles', 'Personal Finance Handbook', 'Mindfulness & Meditation Audio', 'Sustainable Architecture Ideas', 'World Atlas Illustrated Edition', 'Mystery Fiction Anthology'],
    'Toys & Games': ['Wooden Building Blocks Set', 'Space Exploration Puzzle 1000pcs', 'Remote Control Stunt Car', 'Family Strategy Board Game', 'DIY Science Experiment Lab', 'Plush Teddy Bear Classic', 'Metal Brainteaser Puzzle Pack', 'Kids Watercolor Art Studio', 'Compact Folding Chess Set', 'Miniature Drone Toy'],
    'Automotive': ['Portable Digital Tire Inflator', 'Heavy Duty Car Floor Mats', 'Magnetic Dashboard Phone Mount', 'Car Trash Can Waterproof Bag', 'Dual Dashboard Camera 4K', 'Bluetooth OBD2 Scanner Tool', 'Ergonomic Memory Foam Seat Cushion', 'High Gloss Car Wax Kit', 'Leather Car Seat Organizers', 'Emergency Jumper Cable Set']
  };
  const images = {
    'Apparel': [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80'
    ],
    'Electronics': [
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80'
    ],
    'Footwear': [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80'
    ],
    'Accessories': [
      'https://images.unsplash.com/photo-1627124718515-47f9931b3e4f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
    ],
    'Home & Living': [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
    ],
    'Beauty & Personal Care': [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80'
    ],
    'Sports & Outdoors': [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502904582529-de972b947c6a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80'
    ],
    'Books & Media': [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80'
    ],
    'Toys & Games': [
      'https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&auto=format&fit=crop&q=80'
    ],
    'Automotive': [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80'
    ]
  };

  for (let i = 1; i <= count; i++) {
    const cat = categories[i % categories.length];
    const catTitles = titles[cat];
    const title = catTitles[i % catTitles.length] + ' ' + (Math.floor(i / catTitles.length) + 1);
    const catImages = images[cat];
    const img = catImages[i % catImages.length];
    
    const price = parseFloat((15.99 + (i * 4.75) % 150).toFixed(2));
    const compareAtPrice = parseFloat((price * 1.3).toFixed(2));
    const sellerId = i % 2 === 0 ? 'seller_1' : 'seller_2';

    generated.push({
      id: `prod_dummy_${i}`,
      sellerId,
      title,
      description: `This is a high quality dummy ${title.toLowerCase()} configured for Merchora catalog indexing. Constructed from premium materials to offer great long-term reliability and comfort in daily use.`,
      price,
      compareAtPrice,
      images: [img],
      category: cat,
      tags: [cat.toLowerCase(), 'dummy', 'shop'],
      variants: [
        { id: `v_dum_${i}_1`, name: 'Option', value: 'Regular', sku: `DUM-SKU-${i}-REG`, inventory: 10 + (i % 30), price },
        { id: `v_dum_${i}_2`, name: 'Option', value: 'Pro', sku: `DUM-SKU-${i}-PRO`, inventory: 2 + (i % 5), price: parseFloat((price * 1.2).toFixed(2)) }
      ],
      // Stagger dates backwards
      creationDate: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
      publicationStatus: 'published',
      viewCount: 10 * i
    });
  }
  return generated;
};

const defaultReviews = [
  { id: 'rev_1', buyerId: 'buyer_1', buyerName: 'Alex Johnson', productId: 'prod_1', rating: 5, comment: 'Hands down the best oversized t-shirt I own. The material is thick, comfortable, and washes really well. Highly recommend!', createdAt: '2026-05-18T10:00:00Z' },
  { id: 'rev_2', buyerId: 'buyer_1', buyerName: 'Alex Johnson', productId: 'prod_2', rating: 4, comment: 'Active Noise Cancelling is superb. Battery life easily lasts me over a week of commute. Bass is a bit heavy, but soundstage is very clear.', createdAt: '2026-05-19T14:30:00Z' }
];

const defaultOrders = [
  {
    id: 'ord_1',
    buyerId: 'buyer_1',
    buyerName: 'Alex Johnson',
    sellerId: 'seller_1',
    products: [
      { productId: 'prod_1', variantId: 'v2', title: 'Minimalist Cotton Oversized Tee (M)', quantity: 1, price: 29.99, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 29.99,
    shippingAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    paymentStatus: 'paid',
    fulfillmentStatus: 'completed',
    trackingNumber: 'MC-12345678-US',
    createdAt: '2026-06-15T09:00:00Z'
  },
  {
    id: 'ord_2',
    buyerId: 'buyer_1',
    buyerName: 'Alex Johnson',
    sellerId: 'seller_2',
    products: [
      { productId: 'prod_2', variantId: 'v4', title: 'Merchora Sound ANC Headphones (Matte Black)', quantity: 1, price: 149.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 149.99,
    shippingAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    trackingNumber: 'MC-87654321-US',
    createdAt: '2026-06-20T16:45:00Z'
  },
  {
    id: 'ord_3',
    buyerId: 'buyer_1',
    buyerName: 'Alex Johnson',
    sellerId: 'seller_1',
    products: [
      { productId: 'prod_5', variantId: 'v9', title: 'Ceramic Matte Coffee Mug (Terracotta Red)', quantity: 2, price: 24.99, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' }
    ],
    totalAmount: 49.98,
    shippingAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    paymentStatus: 'paid',
    fulfillmentStatus: 'pending',
    trackingNumber: '',
    createdAt: '2026-06-24T18:20:00Z'
  }
];

const defaultCoupons = [
  { code: 'MERCHORA10', discountType: 'percentage', value: 10, description: '10% off your entire order' },
  { code: 'WELCOME15', discountType: 'fixed', value: 15, description: '$15 off your entire order' }
];

// Initialize DB helper
const getFromStorage = (key, defaultValue) => {
  const data = localStorage.getItem(DB_PREFIX + key);
  if (data === null) {
    localStorage.setItem(DB_PREFIX + key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

const writeToStorage = (key, val) => {
  localStorage.setItem(DB_PREFIX + key, JSON.stringify(val));
};

// Database state accessor
export const initializeDb = () => {
  // Check if dummy items migration is needed (if merchora_products has no dummy products, reset)
  const existingProducts = localStorage.getItem(DB_PREFIX + 'products');
  if (existingProducts) {
    try {
      const parsed = JSON.parse(existingProducts);
      if (!parsed.some(p => p.id.startsWith('prod_dummy_')) || !parsed.some(p => p.category === 'Beauty & Personal Care')) {
        console.log('Migrating local storage: seeding 100 dummy products with new departments...');
        localStorage.removeItem(DB_PREFIX + 'products');
      }
    } catch (e) {}
  }

  getFromStorage('users_sellers', defaultSellers);
  getFromStorage('users_buyers', defaultBuyers);
  
  // Combine 6 initial products + 94 generated products to yield 100 items
  const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
  getFromStorage('products', completeProductsList);
  
  getFromStorage('reviews', defaultReviews);
  getFromStorage('orders', defaultOrders);
  getFromStorage('coupons', defaultCoupons);
};

// Simulate network latency (250ms - 500ms)
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockDb = {
  // --- AUTH ENTITIES ---
  registerBuyer: async (email, password, name, shippingAddress, paymentPreference) => {
    await delay();
    const buyers = getFromStorage('users_buyers', defaultBuyers);
    const sellers = getFromStorage('users_sellers', defaultSellers);
    
    const emailExists = buyers.some(b => b.email === email) || sellers.some(s => s.email === email);
    if (emailExists) {
      throw new Error('Email address already registered.');
    }
    
    const newBuyer = {
      id: 'buyer_' + Math.random().toString(36).substr(2, 9),
      email,
      password,
      role: 'buyer',
      createdDate: new Date().toISOString(),
      emailVerified: true,
      activeStatus: 'active',
      profile: {
        name,
        shippingAddress,
        paymentPreference
      }
    };
    
    buyers.push(newBuyer);
    writeToStorage('users_buyers', buyers);
    
    return { token: 'mock-jwt-token-buyer-' + newBuyer.id, user: newBuyer };
  },

  registerSeller: async (email, password, businessName, contact, taxId, bankAccount) => {
    await delay();
    const buyers = getFromStorage('users_buyers', defaultBuyers);
    const sellers = getFromStorage('users_sellers', defaultSellers);
    
    const emailExists = buyers.some(b => b.email === email) || sellers.some(s => s.email === email);
    if (emailExists) {
      throw new Error('Email address already registered.');
    }
    
    const newSeller = {
      id: 'seller_' + Math.random().toString(36).substr(2, 9),
      email,
      password,
      role: 'seller',
      createdDate: new Date().toISOString(),
      emailVerified: true,
      activeStatus: 'active',
      profile: {
        name: businessName,
        businessName,
        contact,
        taxId,
        bankAccount,
        verificationStatus: 'Verified',
        rating: 5.0,
        totalSalesCount: 0,
        earnings: 0
      }
    };
    
    sellers.push(newSeller);
    writeToStorage('users_sellers', sellers);
    
    return { token: 'mock-jwt-token-seller-' + newSeller.id, user: newSeller };
  },

  login: async (email, password) => {
    await delay();
    const buyers = getFromStorage('users_buyers', defaultBuyers);
    const sellers = getFromStorage('users_sellers', defaultSellers);
    
    const buyer = buyers.find(b => b.email === email && b.password === password);
    if (buyer) {
      return { token: 'mock-jwt-token-buyer-' + buyer.id, user: buyer };
    }
    
    const seller = sellers.find(s => s.email === email && s.password === password);
    if (seller) {
      return { token: 'mock-jwt-token-seller-' + seller.id, user: seller };
    }
    
    throw new Error('Invalid email or password combination.');
  },

  updateProfile: async (userId, role, profileData) => {
    await delay();
    const storageKey = role === 'seller' ? 'users_sellers' : 'users_buyers';
    const users = getFromStorage(storageKey, role === 'seller' ? defaultSellers : defaultBuyers);
    
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found.');
    
    users[idx].profile = { ...users[idx].profile, ...profileData };
    writeToStorage(storageKey, users);
    return users[idx];
  },

  // --- PRODUCTS ---
  getProducts: async () => {
    await delay(200);
    // Combine 6 initial products + 94 generated products to yield 100 items on fresh fetches
    const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
    return getFromStorage('products', completeProductsList);
  },

  getProductById: async (id) => {
    await delay(150);
    const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
    const products = getFromStorage('products', completeProductsList);
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found.');
    
    product.viewCount = (product.viewCount || 0) + 1;
    writeToStorage('products', products);
    
    return product;
  },

  createProduct: async (sellerId, productData) => {
    await delay();
    const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
    const products = getFromStorage('products', completeProductsList);
    
    const newProduct = {
      id: 'prod_' + Math.random().toString(36).substr(2, 9),
      sellerId,
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price),
      compareAtPrice: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null,
      images: productData.images && productData.images.length ? productData.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      category: productData.category,
      tags: productData.tags || [],
      variants: productData.variants || [],
      creationDate: new Date().toISOString(),
      publicationStatus: productData.publicationStatus || 'published',
      viewCount: 0
    };
    
    products.unshift(newProduct);
    writeToStorage('products', products);
    return newProduct;
  },

  updateProduct: async (sellerId, productId, productData) => {
    await delay();
    const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
    const products = getFromStorage('products', completeProductsList);
    const idx = products.findIndex(p => p.id === productId);
    
    if (idx === -1) throw new Error('Product not found.');
    if (products[idx].sellerId !== sellerId) throw new Error('Unauthorized to edit this product.');
    
    products[idx] = {
      ...products[idx],
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price),
      compareAtPrice: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null,
      images: productData.images,
      category: productData.category,
      tags: productData.tags || [],
      variants: productData.variants || [],
      publicationStatus: productData.publicationStatus
    };
    
    writeToStorage('products', products);
    return products[idx];
  },

  deleteProduct: async (sellerId, productId) => {
    await delay();
    const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
    const products = getFromStorage('products', completeProductsList);
    const product = products.find(p => p.id === productId);
    
    if (!product) throw new Error('Product not found.');
    if (product.sellerId !== sellerId) throw new Error('Unauthorized to delete this product.');
    
    const filtered = products.filter(p => p.id !== productId);
    writeToStorage('products', filtered);
    return true;
  },

  // --- ORDERS ---
  createOrder: async (buyerId, buyerName, items, totalAmount, shippingAddress, couponCode) => {
    await delay();
    const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
    const products = getFromStorage('products', completeProductsList);
    const orders = getFromStorage('orders', defaultOrders);
    
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) throw new Error(`Product ${item.title} no longer exists.`);
      if (prod.publicationStatus === 'draft') throw new Error(`Product ${item.title} is no longer available.`);
      
      const variant = prod.variants.find(v => v.id === item.variantId);
      if (!variant) throw new Error(`Selected variant for ${item.title} is invalid.`);
      
      if (variant.inventory < item.quantity) {
        throw new Error(`Inventory limit exceeded: Only ${variant.inventory} units of ${item.title} (${variant.value}) are available.`);
      }
    }
    
    const ordersCreated = [];
    const sellersToSplit = [...new Set(items.map(item => item.sellerId))];
    
    for (const sId of sellersToSplit) {
      const sellerItems = items.filter(item => item.sellerId === sId);
      const subtotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      for (const item of sellerItems) {
        const prod = products.find(p => p.id === item.productId);
        const variant = prod.variants.find(v => v.id === item.variantId);
        variant.inventory -= item.quantity;
      }
      
      const newOrder = {
        id: 'ord_' + Math.random().toString(36).substr(2, 9),
        buyerId,
        buyerName,
        sellerId: sId,
        products: sellerItems.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          title: `${i.title} (${i.variantName}: ${i.variantValue})`,
          quantity: i.quantity,
          price: i.price,
          image: i.image
        })),
        totalAmount: parseFloat(subtotal.toFixed(2)),
        shippingAddress,
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        trackingNumber: '',
        createdAt: new Date().toISOString()
      };
      
      orders.unshift(newOrder);
      ordersCreated.push(newOrder);
      
      const sellers = getFromStorage('users_sellers', defaultSellers);
      const sellerIdx = sellers.findIndex(s => s.id === sId);
      if (sellerIdx !== -1) {
        sellers[sellerIdx].profile.totalSalesCount += sellerItems.reduce((acc, i) => acc + i.quantity, 0);
        const earningsGain = parseFloat((subtotal * 0.9).toFixed(2));
        sellers[sellerIdx].profile.earnings = parseFloat((sellers[sellerIdx].profile.earnings + earningsGain).toFixed(2));
        writeToStorage('users_sellers', sellers);
      }
    }
    
    writeToStorage('products', products);
    writeToStorage('orders', orders);
    
    return ordersCreated;
  },

  getBuyerOrders: async (buyerId) => {
    await delay(200);
    const orders = getFromStorage('orders', defaultOrders);
    return orders.filter(o => o.buyerId === buyerId);
  },

  getSellerOrders: async (sellerId) => {
    await delay(200);
    const orders = getFromStorage('orders', defaultOrders);
    return orders.filter(o => o.sellerId === sellerId);
  },

  updateOrderStatus: async (sellerId, orderId, status, trackingNumber) => {
    await delay();
    const orders = getFromStorage('orders', defaultOrders);
    const idx = orders.findIndex(o => o.id === orderId);
    
    if (idx === -1) throw new Error('Order not found.');
    if (orders[idx].sellerId !== sellerId) throw new Error('Unauthorized.');
    
    orders[idx].fulfillmentStatus = status;
    if (trackingNumber) {
      orders[idx].trackingNumber = trackingNumber;
    }
    writeToStorage('orders', orders);
    return orders[idx];
  },

  // --- REVIEWS ---
  getProductReviews: async (productId) => {
    await delay(100);
    const reviews = getFromStorage('reviews', defaultReviews);
    return reviews.filter(r => r.productId === productId);
  },

  addProductReview: async (buyerId, buyerName, productId, rating, comment) => {
    await delay();
    const reviews = getFromStorage('reviews', defaultReviews);
    
    const newReview = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      buyerId,
      buyerName,
      productId,
      rating: parseInt(rating),
      comment,
      createdAt: new Date().toISOString()
    };
    
    reviews.unshift(newReview);
    writeToStorage('reviews', reviews);
    return newReview;
  },

  // --- COUPONS ---
  validateCoupon: async (code) => {
    await delay(150);
    const coupons = getFromStorage('coupons', defaultCoupons);
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) throw new Error('Invalid coupon code.');
    return coupon;
  },

  // --- ANALYTICS ENGINE FOR SELLER DASHBOARD ---
  getSellerAnalytics: async (sellerId) => {
    await delay(300);
    const orders = getFromStorage('orders', defaultOrders).filter(o => o.sellerId === sellerId);
    
    const completeProductsList = [...defaultProducts, ...generateDummyProducts(94)];
    const products = getFromStorage('products', completeProductsList).filter(p => p.sellerId === sellerId);
    
    const sellers = getFromStorage('users_sellers', defaultSellers);
    const currentSeller = sellers.find(s => s.id === sellerId);
    
    const totalEarnings = currentSeller ? currentSeller.profile.earnings : 0;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyRevenue = [1200, 2400, 1800, 3100, 4200, totalEarnings];
    const chartData = months.map((month, idx) => ({
      name: month,
      revenue: idx === 5 ? parseFloat(orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)) : monthlyRevenue[idx]
    }));
    
    const productSalesMap = {};
    orders.forEach(order => {
      order.products.forEach(item => {
        const prodId = item.productId;
        productSalesMap[prodId] = (productSalesMap[prodId] || 0) + item.quantity;
      });
    });
    
    const bestSellers = Object.entries(productSalesMap)
      .map(([prodId, quantity]) => {
        const prod = products.find(p => p.id === prodId);
        return {
          title: prod ? prod.title : 'Deleted Product',
          sales: quantity,
          revenue: parseFloat((quantity * (prod ? prod.price : 0)).toFixed(2))
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
      
    const totalViews = products.reduce((acc, p) => acc + (p.viewCount || 0), 0);
    const totalOrders = orders.length;
    const conversionRate = totalViews > 0 ? parseFloat(((totalOrders / totalViews) * 100).toFixed(2)) : 0;
    
    const lowStockItems = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.inventory <= 5) {
          lowStockItems.push({
            productId: p.id,
            productTitle: p.title,
            variantName: v.name,
            variantValue: v.value,
            sku: v.sku,
            inventory: v.inventory
          });
        }
      });
    });
    
    return {
      revenueTrend: chartData,
      bestSellers,
      conversionRate: conversionRate || 3.45,
      viewCount: totalViews,
      salesCount: orders.reduce((acc, o) => acc + o.products.reduce((accP, p) => accP + p.quantity, 0), 0),
      lowStockItems,
      totalEarnings,
      platformFee: parseFloat((totalEarnings * 0.111).toFixed(2)),
      pendingPayout: parseFloat((totalEarnings * 0.15).toFixed(2))
    };
  }
};
