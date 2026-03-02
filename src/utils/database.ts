// Database utilities using localStorage
// This simulates a database for the marketplace application

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, never store plain passwords
  role: 'user' | 'shop_owner' | 'admin';
  createdAt: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  category: 'clothes' | 'accessories';
  instagram: string;
  location: string;
  description: string;
  pan_number: string;
  is_verified: boolean;
  createdAt: string;
  rating?: number;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  createdAt: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  timestamp: string;
}

export interface Review {
  id: string;
  user_id: string;
  shop_id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
}

// Database class
class Database {
  private storageKey = 'instashop_db';

  private defaultData = {
    users: [] as User[],
    shops: [] as Shop[],
    products: [] as Product[],
    orders: [] as Order[],
    messages: [] as Message[],
    reviews: [] as Review[],
  };

  constructor() {
    this.initializeDB();
  }

  private initializeDB() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.defaultData));
      this.seedDefaultData();
    }
  }

  private seedDefaultData() {
    // Add default admin user
    this.addUser({
      name: 'Admin User',
      email: 'admin@instashop.np',
      password: 'admin123', // Demo password
      role: 'admin',
    });

    // Add sample shop owner
    const shopOwnerId = this.addUser({
      name: 'Ravi Sharma',
      email: 'ravi@instashop.np',
      password: 'shop123',
      role: 'shop_owner',
    });

    // Add sample shop
    const shopId = this.addShop({
      owner_id: shopOwnerId,
      name: 'Trendy Threads Nepal',
      category: 'clothes',
      instagram: 'https://instagram.com/trendythreads',
      location: 'Kathmandu',
      description: 'Modern clothing for fashion-forward individuals',
      pan_number: '123456789',
      is_verified: true,
    });

    // Add sample products
    this.addProduct({
      shop_id: shopId,
      name: 'Premium Cotton T-Shirt',
      price: 599,
      image: 'https://via.placeholder.com/300x300?text=TShirt',
      description: 'Comfortable and durable cotton t-shirt',
    });

    this.addProduct({
      shop_id: shopId,
      name: 'Designer Jeans',
      price: 1299,
      image: 'https://via.placeholder.com/300x300?text=Jeans',
      description: 'Stylish designer jeans for every occasion',
    });

    // Add sample users
    this.addUser({
      name: 'John Customer',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });
  }

  private getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.defaultData;
  }

  private saveData(data: typeof this.defaultData) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // User operations
  addUser(user: Omit<User, 'id' | 'createdAt'>): string {
    const data = this.getData();
    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    this.saveData(data);
    return id;
  }

  getUser(id: string): User | undefined {
    const data = this.getData();
    return data.users.find((u: User) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    const data = this.getData();
    return data.users.find((u: User) => u.email === email);
  }

  getAllUsers(): User[] {
    const data = this.getData();
    return data.users;
  }

  // Shop operations
  addShop(shop: Omit<Shop, 'id' | 'createdAt'>): string {
    const data = this.getData();
    const id = 'shop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newShop: Shop = {
      ...shop,
      id,
      createdAt: new Date().toISOString(),
    };
    data.shops.push(newShop);
    this.saveData(data);
    return id;
  }

  getShop(id: string): Shop | undefined {
    const data = this.getData();
    return data.shops.find((s: Shop) => s.id === id);
  }

  getShopsByOwner(owner_id: string): Shop[] {
    const data = this.getData();
    return data.shops.filter((s: Shop) => s.owner_id === owner_id);
  }

  getVerifiedShops(): Shop[] {
    const data = this.getData();
    return data.shops.filter((s: Shop) => s.is_verified);
  }

  getAllShops(): Shop[] {
    const data = this.getData();
    return data.shops;
  }

  updateShop(id: string, updates: Partial<Shop>): boolean {
    const data = this.getData();
    const shop = data.shops.find((s: Shop) => s.id === id);
    if (shop) {
      Object.assign(shop, updates);
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Product operations
  addProduct(product: Omit<Product, 'id' | 'createdAt'>): string {
    const data = this.getData();
    const id = 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newProduct: Product = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
    };
    data.products.push(newProduct);
    this.saveData(data);
    return id;
  }

  getProduct(id: string): Product | undefined {
    const data = this.getData();
    return data.products.find((p: Product) => p.id === id);
  }

  getProductsByShop(shop_id: string): Product[] {
    const data = this.getData();
    return data.products.filter((p: Product) => p.shop_id === shop_id);
  }

  updateProduct(id: string, updates: Partial<Product>): boolean {
    const data = this.getData();
    const product = data.products.find((p: Product) => p.id === id);
    if (product) {
      Object.assign(product, updates);
      this.saveData(data);
      return true;
    }
    return false;
  }

  deleteProduct(id: string): boolean {
    const data = this.getData();
    const index = data.products.findIndex((p: Product) => p.id === id);
    if (index !== -1) {
      data.products.splice(index, 1);
      this.saveData(data);
      return true;
    }
    return false;
  }

  getAllProducts(): Product[] {
    const data = this.getData();
    return data.products;
  }

  // Order operations
  addOrder(order: Omit<Order, 'id' | 'createdAt'>): string {
    const data = this.getData();
    const id = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date().toISOString(),
    };
    data.orders.push(newOrder);
    this.saveData(data);
    return id;
  }

  getOrder(id: string): Order | undefined {
    const data = this.getData();
    return data.orders.find((o: Order) => o.id === id);
  }

  getOrdersByUser(user_id: string): Order[] {
    const data = this.getData();
    return data.orders.filter((o: Order) => o.user_id === user_id);
  }

  getOrdersByShop(shop_id: string): Order[] {
    const data = this.getData();
    const shopProducts = this.getProductsByShop(shop_id).map((p) => p.id);
    return data.orders.filter((o: Order) => shopProducts.includes(o.product_id));
  }

  updateOrder(id: string, updates: Partial<Order>): boolean {
    const data = this.getData();
    const order = data.orders.find((o: Order) => o.id === id);
    if (order) {
      Object.assign(order, updates);
      this.saveData(data);
      return true;
    }
    return false;
  }

  getAllOrders(): Order[] {
    const data = this.getData();
    return data.orders;
  }

  // Message operations
  addMessage(message: Omit<Message, 'id'>): string {
    const data = this.getData();
    const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newMessage: Message = {
      ...message,
      id,
    };
    data.messages.push(newMessage);
    this.saveData(data);
    return id;
  }

  getMessages(userId: string): Message[] {
    const data = this.getData();
    return data.messages.filter(
      (m: Message) => m.sender_id === userId || m.receiver_id === userId
    );
  }

  getConversation(userId1: string, userId2: string): Message[] {
    const data = this.getData();
    return data.messages.filter(
      (m: Message) =>
        (m.sender_id === userId1 && m.receiver_id === userId2) ||
        (m.sender_id === userId2 && m.receiver_id === userId1)
    );
  }

  // Review operations
  addReview(review: Omit<Review, 'id' | 'createdAt'>): string {
    const data = this.getData();
    const id = 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newReview: Review = {
      ...review,
      id,
      createdAt: new Date().toISOString(),
    };
    data.reviews.push(newReview);
    this.saveData(data);
    return id;
  }

  getReviewsByShop(shop_id: string): Review[] {
    const data = this.getData();
    return data.reviews.filter((r: Review) => r.shop_id === shop_id);
  }

  getShopRating(shop_id: string): number {
    const reviews = this.getReviewsByShop(shop_id);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  getAllReviews(): Review[] {
    const data = this.getData();
    return data.reviews;
  }
}

export const db = new Database();
