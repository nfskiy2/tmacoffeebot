
import { Shop, Category, Product, Banner } from '../../model/types';
import { DELIVERY_SHOP_ID } from '../../config/constants';

export const MOCK_SHOP_ID = 'shop_1';
// Re-export for compatibility if needed within mocks, but external consumers should use config
export { DELIVERY_SHOP_ID };

// --- SHOPS LIST ---

export const MOCK_SHOPS: Shop[] = [
  {
    id: 'shop_1',
    name: 'Коммунистический 50',
    description: '(Чижик)',
    address: 'пр. Коммунистический, 50',
    logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=600&fit=crop',
    currency: 'RUB',
    themeColor: '#38bdf8',
    isClosed: false,
    openingHours: 'Пн - Вс: 08:00 - 22:00'
  },
  {
    id: 'shop_2',
    name: 'Коммунистический 119',
    description: '(Витим)',
    address: 'пр. Коммунистический, 119',
    logoUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&h=600&fit=crop',
    currency: 'RUB',
    themeColor: '#38bdf8',
    isClosed: false,
    openingHours: 'Пн - Вс: 09:00 - 23:00'
  },
  {
    id: 'shop_3',
    name: 'Реки-ушайки 34',
    description: '(Мирамикс)',
    address: 'ул. Набережная реки Ушайки, 34',
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&h=600&fit=crop',
    currency: 'RUB',
    themeColor: '#38bdf8',
    isClosed: true,
    openingHours: 'Пн - Вс: 10:00 - 20:00'
  },
  {
    id: DELIVERY_SHOP_ID,
    name: 'Томск', 
    description: 'Доставка',
    address: 'Центральный склад',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
    bannerUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=1200&h=600&fit=crop',
    currency: 'RUB',
    themeColor: '#38bdf8',
    isClosed: false,
    openingHours: 'Круглосуточно'
  }
];

export const MOCK_SHOP: Shop = MOCK_SHOPS[0];

// --- BANNERS ---

export const MOCK_BANNERS: Banner[] = [
    {
        id: 'ban_1',
        title: 'Бизнес-ланч',
        description: 'Каждый понедельник\nс 22.00 до 23.00',
        imageUrl: 'https://images.unsplash.com/photo-1549488344-c7052fb51c9b?w=800&q=80',
        actionUrl: '',
        textColor: '#ffffff'
    },
    {
        id: 'ban_2',
        title: 'Кофе с собой -20%',
        description: 'При заказе через приложение\nс 8:00 до 10:00',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        actionUrl: '',
        textColor: '#ffffff'
    },
    {
        id: 'ban_3',
        title: 'Новые Десерты',
        description: 'Попробуйте наши круассаны\nи чизкейки',
        imageUrl: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?w=800&q=80',
        actionUrl: '',
        textColor: '#ffffff'
    }
];

// --- CATEGORIES DEFINITIONS ---

const CAT_COFFEE: Category = { id: 'cat_coffee', name: 'Кофе', slug: 'coffee', sortOrder: 0, iconUrl: 'https://cdn-icons-png.flaticon.com/512/924/924514.png' };
const CAT_FOOD: Category = { id: 'cat_food', name: 'Еда', slug: 'food', sortOrder: 1, iconUrl: 'https://cdn-icons-png.flaticon.com/512/2713/2713563.png' };
const CAT_DESSERTS: Category = { id: 'cat_desserts', name: 'Десерты', slug: 'desserts', sortOrder: 2, iconUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081967.png' };
const CAT_TEA: Category = { id: 'cat_tea', name: 'Чай', slug: 'tea', sortOrder: 3, iconUrl: 'https://cdn-icons-png.flaticon.com/512/718/718228.png' };
const CAT_SETS: Category = { id: 'cat_sets', name: 'Комбо', slug: 'sets', sortOrder: 0, iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png' };

// --- PRODUCTS POOL ---

const PRODUCTS_POOL: Record<string, Product> = {
  // Coffee - Black
  'espresso': { 
      id: 'prod_espresso', 
      categoryId: 'cat_coffee', 
      name: 'Эспрессо', 
      description: 'Насыщенный вкус и аромат. Идеальное начало дня.', 
      price: 15000, 
      imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80', 
      isAvailable: true,
      subcategory: 'Черный кофе',
      addons: [
        { id: 'a_sugar', name: 'Сахар', price: 0, group: 'Дополнительно' },
        { id: 'a_water', name: 'Вода со льдом', price: 0, group: 'Дополнительно' }
      ]
  },
  
  // Coffee - Milk
  'cap': { 
      id: 'prod_cap', 
      categoryId: 'cat_coffee', 
      name: 'Капучино', 
      description: 'Классика', 
      price: 18000, 
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80', 
      isAvailable: true, 
      addons: [
          { id: 's1', name: 'Карамельный сироп', price: 3000, group: 'Сиропы' },
          { id: 's2', name: 'Ванильный сироп', price: 3000, group: 'Сиропы' },
          { id: 's3', name: 'Ореховый сироп', price: 3000, group: 'Сиропы' },
          { id: 'm1', name: 'Кокосовое молоко', price: 5000, group: 'Молоко' },
          { id: 'm2', name: 'Миндальное молоко', price: 5000, group: 'Молоко' },
          { id: 'm3', name: 'Банановое молоко', price: 5000, group: 'Молоко' },
          { id: 't1', name: 'Корица', price: 0, group: 'Посыпки' },
          { id: 't2', name: 'Шоколад', price: 0, group: 'Посыпки' }
      ],
      subcategory: 'Молочный кофе'
  },
  'latte': { 
      id: 'prod_latte', 
      categoryId: 'cat_coffee', 
      name: 'Латте', 
      description: 'Много молока', 
      price: 20000, 
      imageUrl: 'https://images.unsplash.com/photo-1570968992193-96e0b3c23588?w=800&q=80', 
      isAvailable: true,
      subcategory: 'Молочный кофе',
      addons: [
          { id: 's1', name: 'Карамельный сироп', price: 3000, group: 'Сиропы' },
          { id: 's2', name: 'Ванильный сироп', price: 3000, group: 'Сиропы' },
          { id: 'm1', name: 'Кокосовое молоко', price: 5000, group: 'Молоко' },
      ]
  },
  'flat': { 
      id: 'prod_flat', 
      categoryId: 'cat_coffee', 
      name: 'Флэт Уайт', 
      description: 'Крепкий и молочный', 
      price: 19000, 
      imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&q=80', 
      isAvailable: true,
      subcategory: 'Молочный кофе'
  },
  
  // Food
  'sandwich': { id: 'prod_sandwich', categoryId: 'cat_food', name: 'Сэндвич с курицей', description: 'Свежий хлеб, курица су-вид', price: 25000, imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=800&q=80', isAvailable: true, subcategory: 'Сытные' },
  'toast': { id: 'prod_toast', categoryId: 'cat_food', name: 'Тост с авокадо', description: 'Полезный завтрак', price: 32000, imageUrl: 'https://images.unsplash.com/photo-1541519527009-c23933180129?w=800&q=80', isAvailable: true, subcategory: 'Легкие' },

  // Desserts (Bakery focus)
  'croissant': { id: 'prod_croissant', categoryId: 'cat_desserts', name: 'Круассан', description: 'Свежая выпечка', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?w=800&q=80', isAvailable: true },
  'cheesecake': { id: 'prod_cheesecake', categoryId: 'cat_desserts', name: 'Чизкейк Нью-Йорк', description: 'Нежный творожный вкус', price: 28000, imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80', isAvailable: true },
  'bun': { id: 'prod_bun', categoryId: 'cat_desserts', name: 'Булочка с корицей', description: 'Синнабон', price: 18000, imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80', isAvailable: true },

  // Tea
  'tea_green': { id: 'prod_tea_green', categoryId: 'cat_tea', name: 'Зеленый чай', description: 'Сенча', price: 12000, imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&q=80', isAvailable: true },

  // Delivery Sets
  'set_breakfast': { id: 'prod_set_1', categoryId: 'cat_sets', name: 'Завтрак Чемпиона', description: 'Капучино + Круассан + Тост', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1496042399014-dc73cbb3b347?w=800&q=80', isAvailable: true },
  'set_office': { id: 'prod_set_2', categoryId: 'cat_sets', name: 'Офисный пак (4 кофе)', description: '4 Капучино по цене 3х', price: 54000, imageUrl: 'https://images.unsplash.com/photo-1529511582893-2d7e674514a4?w=800&q=80', isAvailable: true },
};

// --- DATABASE MAPPING ---

interface ShopMenu {
  categories: Category[];
  products: Product[];
}

export const SHOP_DATABASES: Record<string, ShopMenu> = {
  // SHOP 1: Standard Coffee Shop
  'shop_1': {
    categories: [CAT_COFFEE, CAT_FOOD],
    products: [
      PRODUCTS_POOL['espresso'],
      PRODUCTS_POOL['cap'], 
      PRODUCTS_POOL['latte'], 
      PRODUCTS_POOL['flat'],
      PRODUCTS_POOL['sandwich'],
      PRODUCTS_POOL['toast']
    ]
  },

  // SHOP 2: Bakery / Tea house
  'shop_2': {
    categories: [CAT_DESSERTS, CAT_TEA, CAT_COFFEE],
    products: [
      PRODUCTS_POOL['croissant'],
      PRODUCTS_POOL['cheesecake'],
      PRODUCTS_POOL['bun'],
      PRODUCTS_POOL['tea_green'],
      { ...PRODUCTS_POOL['cap'], price: 19000 } // Higher price in this shop
    ]
  },

  // SHOP 3: Small point
  'shop_3': {
    categories: [CAT_COFFEE],
    products: [PRODUCTS_POOL['cap'], PRODUCTS_POOL['latte']]
  },

  // DELIVERY: Sets + Full Menu
  [DELIVERY_SHOP_ID]: {
    categories: [CAT_SETS, CAT_COFFEE, CAT_FOOD, CAT_DESSERTS],
    products: [
      PRODUCTS_POOL['set_breakfast'],
      PRODUCTS_POOL['set_office'],
      PRODUCTS_POOL['espresso'],
      PRODUCTS_POOL['cap'],
      PRODUCTS_POOL['sandwich'],
      PRODUCTS_POOL['cheesecake']
    ]
  }
};

// --- DEFAULT EXPORTS FOR COMPATIBILITY ---
export const MOCK_CATEGORIES = SHOP_DATABASES['shop_1'].categories;
export const MOCK_PRODUCTS = SHOP_DATABASES['shop_1'].products;
