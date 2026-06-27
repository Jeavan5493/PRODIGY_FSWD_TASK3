import React, { useState } from 'react';
import { Compass, Clock, MapPin, Sparkles, Filter, ChevronRight, HelpCircle, ArrowRight, Instagram, Mail, Phone, Calendar } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, STORE_FAQS } from './data/products';
import { Product, Review, CartItem, Order, UserProfile } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import OrderTracker from './components/OrderTracker';
import SupportChat from './components/SupportChat';
import AuthPage from './components/AuthPage';
import AccountPage from './components/AccountPage';

export default function App() {
  const [activeView, setActiveView] = useState<'shop' | 'tracker' | 'faqs' | 'sale' | 'account' | 'auth'>('shop');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Persistent Client Session
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('ch_pantry_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('ch_pantry_user', JSON.stringify(updatedProfile));
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('ch_pantry_user', JSON.stringify(profile));
    setActiveView('account');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ch_pantry_user');
    setActiveView('shop');
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [priceMax, setPriceMax] = useState<number>(500);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Derive Categories dynamically for filtering
  const categories = ['All', ...Array.from(new Set(INITIAL_PRODUCTS.map((p) => p.category)))];

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((it) => it.product.id === product.id);
      if (existing) {
        return prevCart.map((it) =>
          it.product.id === product.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Autotrigger slide out drawer on add
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((it) => {
          if (it.product.id === productId) {
            const nextQty = it.quantity + delta;
            return { ...it, quantity: nextQty };
          }
          return it;
        })
        .filter((it) => it.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((it) => it.product.id !== productId));
  };

  const handleClearCart = () => setCart([]);

  const handlePlaceOrder = (newOrder: Order) => {
    // Add real-time order history for lookup
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Live reviews and average rating recalculator
  const handleAddReview = (productId: string, userName: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: `${userName} (Verified Buyer)`,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate average rating
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const productReviews = [newRev, ...reviews.filter((r) => r.productId === productId)];
          const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
          return {
            ...p,
            rating: parseFloat(avg.toFixed(1)),
            reviewsCount: productReviews.length
          };
        }
        return p;
      })
    );
  };

  // Live order tracker accelerator/simulator
  const handleFastForwardOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id === orderId) {
          let nextStatus: 'pending' | 'preparing' | 'transit' | 'delivered' = 'pending';
          let title = '';
          let description = '';

          if (o.status === 'pending') {
            nextStatus = 'preparing';
            title = 'Curating & Waxing Box';
            description = 'Your organic reserves are gathered and safe-wrapped inside cedar cedar wood dust.';
          } else if (o.status === 'preparing') {
            nextStatus = 'transit';
            title = 'Courier Route Active';
            description = o.deliveryType === 'pickup' 
              ? 'Package registered on the pickup shelves at 12th & Pike.'
              : 'Our zero-emission cargo e-bike rider loaded your crate and left the shop!';
          } else if (o.status === 'transit') {
            nextStatus = 'delivered';
            title = 'Secured Handover';
            description = o.deliveryType === 'pickup'
              ? 'EasyGrocery Guest claimed reservation bundle successfully!'
              : 'Package hand-delivered on step threshold by rider.';
          } else {
            return o;
          }

          const freshLog = [
            ...o.trackingHistory,
            {
              status: nextStatus,
              title,
              description,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];

          return {
            ...o,
            status: nextStatus,
            trackingHistory: freshLog
          };
        }
        return o;
      })
    );
  };

  // Filter and Sort operations on Product Catalog
  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = p.price <= priceMax;
      return matchSearch && matchCat && matchPrice;
    })
    .sort((a, b) => {
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      return 0; // featured/default
    });

  const cartItemsCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f7f6f4] text-[#2b2927] font-sans antialiased flex flex-col selection:bg-stone-900 selection:text-white">
      
      {/* Dynamic persistent Header Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
      />

      {/* Main Container Stage */}
      <main className="flex-1">
        
        {/* VIEW 1: PRODUCT CATALOG & SOURCING */}
        {activeView === 'shop' && (
          <div>
            
            {/* Elegant Hero Banner */}
            <section className="relative overflow-hidden bg-white py-12 border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Brand Pitch */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    Central Seattle Heritage
                  </div>
                  <h1 className="font-display font-bold text-3xl sm:text-5xl text-stone-900 leading-tight">
                    Pure Seattle Soil.<br />
                    <span className="font-light text-stone-500">Masterful Dry Goods.</span>
                  </h1>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-md">
                    Supporting our Cascade foothill berry foragers, organic salt-smokers, and Ballard carpenters. Explore local small-batch jams, whole espresso reserves, and kitchen blocks. Pick up within 2 hours or enjoy heavy-cargo bike dispatch central-bound.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 text-xs border-t border-stone-100 mt-4 h-fit">
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium font-mono">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span>Ready in 2h</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium font-mono">
                      <MapPin className="w-4 h-4 text-stone-400" />
                      <span>E Pike St Seattle</span>
                    </div>
                  </div>
                </div>

                {/* Hero Accents Stage */}
                <div className="relative">
                  <div className="aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
                      alt="Organic Local Food Basket EasyGrocery"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-stone-900 text-white rounded-2xl p-4 shadow-xl border border-stone-800 flex items-center gap-3.5 max-w-xs">
                    <span className="text-3xl">🌿</span>
                    <div>
                      <p className="font-display font-bold text-xs">Sustainability Vetted</p>
                      <p className="text-[10px] text-stone-400 leading-normal mt-0.5">100% of ingredients are traced to organic family cooperative plots in regional Cascades.</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Catalog & Filter Sidebar Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Side: Parameters Form Filter */}
                <aside className="w-full lg:w-64 shrink-0 space-y-6">
                  
                  <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-6">
                    
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <span className="font-display font-bold text-sm text-stone-900 flex items-center gap-1.5 uppercase tracking-wide">
                        <Filter className="w-4 h-4 text-stone-500" />
                        Parameters
                      </span>
                      {(selectedCategory !== 'All' || searchQuery !== '' || priceMax !== 500) && (
                        <button
                          onClick={() => {
                            setSelectedCategory('All');
                            setSearchQuery('');
                            setPriceMax(500);
                          }}
                          className="text-[10px] uppercase font-bold text-stone-400 hover:text-stone-700 underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Mobile Search block */}
                    <div className="block sm:hidden space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Search Keywords</label>
                      <input
                        type="text"
                        placeholder="Search easygrocery..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                      />
                    </div>

                    {/* Category Checkboxes */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Category</label>
                      <div className="flex flex-col gap-1.5">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between ${
                              selectedCategory === cat
                                ? 'bg-stone-900 text-white font-semibold'
                                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                            }`}
                          >
                            <span>{cat === 'All' ? 'Browse All' : cat}</span>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedCategory === cat ? 'rotate-90' : 'text-stone-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Upper Price</label>
                        <span className="font-mono text-xs font-bold text-stone-900">₹{priceMax.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="500"
                        value={priceMax}
                        onChange={(e) => setPriceMax(parseFloat(e.target.value))}
                        className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between font-mono text-[9px] text-stone-400">
                        <span>₹20.00</span>
                        <span>₹500.00</span>
                      </div>
                    </div>

                    {/* Sort Selector */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Sort By</label>
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none"
                      >
                        <option value="featured">EasyGrocery Curator Picks</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Top Rated Customers</option>
                      </select>
                    </div>

                  </div>

                </aside>

                {/* Right Side: Grid of Product Results */}
                <div className="flex-1 space-y-6">
                  
                  {/* Results Count Summary */}
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1 bg-white p-3.5 rounded-2xl border border-stone-200/60 shadow-xs">
                    <span>
                      Presenting <strong className="font-mono text-stone-900">{filteredProducts.length}</strong> beautiful boutique items
                    </span>
                    {selectedCategory !== 'All' && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                        Category: {selectedCategory}
                      </span>
                    )}
                  </div>

                  {/* Empty State */}
                  {filteredProducts.length === 0 ? (
                    <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center max-w-sm mx-auto space-y-4">
                      <div className="text-3xl text-stone-400">🔍</div>
                      <h3 className="font-display font-semibold text-stone-800 text-sm">No dry goods matched</h3>
                      <p className="text-xs text-stone-500">We couldn't locate any products matching your search keywords or price filters.</p>
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setSearchQuery('');
                          setPriceMax(45);
                        }}
                        className="px-4 py-2 bg-stone-950 text-white rounded-xl text-xs font-medium"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {filteredProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onViewDetails={(prod) => setSelectedProduct(prod)}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  )}

                </div>

              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: ORDER TRACKING LOGISTICS PANEL */}
        {activeView === 'tracker' && (
          <section className="py-8 sm:py-12 bg-[#f7f6f4]">
            <OrderTracker
              orders={orders}
              onFastForwardOrder={handleFastForwardOrder}
            />
          </section>
        )}

        {/* VIEW 3: STORE DETAILS AND ACCORDION FAQS */}
        {activeView === 'faqs' && (
          <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            
            {/* Intro Header */}
            <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
              <h1 className="font-display font-medium text-3xl text-stone-900">
                Lobby Hours & Local Operations
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                EASYGROCERY exists as an online grocery platform committed to quality, sustainability, and fair producer wages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Address Card */}
              <div className="md:col-span-1 bg-white border border-stone-200 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Visit the Counter</h3>
                  <p className="text-xs font-semibold text-stone-950">1205 E Pike St</p>
                  <p className="text-xs text-stone-600">Seattle, WA 98122</p>
                  <span className="text-[10px] text-stone-400 block mt-1 font-mono">Capitol Hill central pathway</span>
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Weekly Hours</h3>
                  <div className="text-xs text-stone-600 space-y-1 font-mono">
                    <p className="flex justify-between"><span>Tue – Sun:</span> <span>8 AM – 7 PM</span></p>
                    <p className="flex justify-between text-stone-400 font-sans italic"><span>Mon:</span> <span>Counter Closed</span></p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400">Get in Touch</h3>
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>dasarijeavan1234@gmail.com</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>(206) 555-0144</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: FAQ Accordions */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold font-display text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-stone-500" />
                  Frequently Answered Guidelines
                </h3>
                <div className="space-y-3">
                  {STORE_FAQS.map((faq, i) => (
                    <div key={i} className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
                      <h4 className="text-xs sm:text-sm font-bold font-display text-stone-900 flex items-start gap-1.5">
                        <span className="text-amber-600">Q.</span>
                        {faq.q}
                      </h4>
                      <p className="text-xs sm:text-xs text-stone-600 leading-relaxed pl-4.5 border-l border-amber-100 font-sans">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </section>
        )}

        {/* VIEW 4: SEPARATE ITEMS ON SALE ROUTE */}
        {activeView === 'sale' && (
          <div>
            <section className="relative overflow-hidden bg-red-700 py-12 border-b-2 border-[#1A1A1A] text-[#FCFAF7]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white text-[10px] font-black tracking-widest uppercase border border-stone-800">
                  ⚡ Seasonal Co-Op Offerings ⚡
                </div>
                <h1 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-wider">
                  The Clearance Shelf
                </h1>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-serif italic">
                  Premium local PNW ingredients and lifestyle items at temporary, direct-grower discounts. Restock with zero waste and full co-op backing.
                </p>
              </div>
            </section>

            {/* Grid of On Sale Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {products
                  .filter((p) => p.onSale)
                  .map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 5: SECURITY SECURE CO-OP REGISTRATION / LOGIN */}
        {activeView === 'auth' && (
          <section className="py-12 bg-[#f7f6f4]">
            <AuthPage onLoginSuccess={handleLoginSuccess} />
          </section>
        )}

        {/* VIEW 6: BESPOKE CO-OP WORKSPACE ACCOUNT DETAIL MANAGER */}
        {activeView === 'account' && user && (
          <section className="py-2 bg-[#f7f6f4]">
            <AccountPage
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              orders={orders}
              onSelectView={(v) => setActiveView(v as any)}
            />
          </section>
        )}

      </main>

      {/* Exquisite Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="p-1 px-2 rounded bg-white text-stone-900 font-display font-semibold tracking-wider text-sm">EG</span>
              <span className="font-display font-bold text-lg">EASYGROCERY</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An independent online grocery store bringing premium quality South Indian staples and organic products straight to your home, offering unmatched freshness and convenience.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-300">Neighborhood Network</h4>
            <ul className="text-xs space-y-2">
              <li className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                <span className="hover:text-stone-200 transition-colors cursor-pointer" onClick={() => setActiveView('shop')}>Browse Handpicked Goods</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                <span className="hover:text-stone-200 transition-colors cursor-pointer" onClick={() => setActiveView('tracker')}>Seattle Package Locater</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                <span className="hover:text-stone-200 transition-colors cursor-pointer" onClick={() => setActiveView('faqs')}>Sourcing Audits & Hours</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-stone-300">Sustainability Pledge</h3>
            <p className="text-xs text-stone-400 leading-normal">
              Our e-bike cargo delivery uses zero petrol, packaging utilizes recycled sugarcane fibers, and woodblocks are handcarved exclusively from storm-fallen Seattle cedars.
            </p>
            <div className="flex gap-4">
              <span className="text-xs font-mono font-bold text-stone-400">EST. 2026 CENTRAL CASCADE</span>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
          <p>© 2026 EASYGROCERY & Co. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0 font-mono">
            <span>Seattle, WA Central Ground</span>
          </div>
        </div>
      </footer>

      {/* Product Detail Popup Overlay */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      )}

      {/* Shopping Cart Drawer Backdrop */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        user={user}
      />

      {/* Floating Customer Support Interactive Portal */}
      <SupportChat />

    </div>
  );
}
