import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ChevronRight, MapPin, Truck, Bike, ShieldCheck, Ticket } from 'lucide-react';
import { CartItem, Product, Order, UserProfile } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
  user?: UserProfile | null;
}

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'success';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearCart,
  user
}: CartDrawerProps) {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'eco_courier' | 'shipping'>('eco_courier');
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98122',
    phone: ''
  });
  const [email, setEmail] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Custom multi-payment and coupon application state managers
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cash_on_delivery' | 'upi'>('credit_card');
  const [upiId, setUpiId] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === 'PANTRY10' || appliedCoupon === 'EASY10') {
      return itemsSubtotal * 0.1;
    }
    if (appliedCoupon === 'SEATTLECOOP') {
      return itemsSubtotal * 0.2;
    }
    if (appliedCoupon === 'FREESHIP') {
      return getDeliveryCost();
    }
    if (appliedCoupon === 'MAEVESPECIAL') {
      return Math.min(100.0, itemsSubtotal);
    }
    return 0;
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const validCodes = ['PANTRY10', 'EASY10', 'SEATTLECOOP', 'FREESHIP', 'MAEVESPECIAL'];
    if (validCodes.includes(code)) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('COUPON INVALID OR EXPIRED.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setCouponInput('');
  };

  // Pre-fill profile details when co-op session is active
  React.useEffect(() => {
    if (user && isOpen) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        street: prev.street || user.address,
        zipCode: prev.zipCode || user.pincode,
        phone: prev.phone || user.phone,
      }));
      setEmail((prev) => prev || user.email);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const itemsSubtotal = cartItems.reduce((acc, item) => {
    const activePrice = item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);
  
  const getDeliveryCost = () => {
    if (deliveryType === 'pickup') return 0;
    if (deliveryType === 'eco_courier') return 50.00;
    return 30.00;
  };
  
  const discountAmount = getDiscountAmount();
  const totalCost = Math.max(0, itemsSubtotal + getDeliveryCost() - discountAmount);

  const handleNextStep = () => {
    if (step === 'cart') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
  };

  const handlePrevStep = () => {
    if (step === 'delivery') setStep('cart');
    else if (step === 'payment') setStep('delivery');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (paymentMethod === 'upi' && !upiId) {
      setCouponError('PLEASE ENTER A VALID UPI ID.');
      return;
    }

    const trackingNo = `CH-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toISOString().split('T')[0];
    
    const newOrder: Order = {
      id: trackingNo,
      items: [...cartItems],
      total: totalCost,
      date: nowStr,
      status: 'pending',
      deliveryType,
      shippingAddress: { ...address },
      email,
      paymentMethod: paymentMethod === 'credit_card' ? 'Credit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
      couponCode: appliedCoupon || undefined,
      couponDiscount: discountAmount > 0 ? discountAmount : undefined,
      trackingHistory: [
        {
          status: 'pending',
          title: 'Order Approved',
          description: `We received your booking! Preparing ${cartItems.length} select dry goods. Payment selected: ${paymentMethod === 'credit_card' ? 'Credit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}.`,
          time: 'Just now'
        }
      ]
    };

    onPlaceOrder(newOrder);
    setLastPlacedOrder(newOrder);
    onClearCart();
    setStep('success');
  };

  const handleReset = () => {
    setStep('cart');
    setDeliveryType('eco_courier');
    setAddress({
      fullName: '',
      street: '',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98122',
      phone: ''
    });
    setEmail('');
    setPaymentMethod('credit_card');
    setUpiId('');
    setCouponInput('');
    setAppliedCoupon(null);
    setCouponError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1A1A1A]/70 backdrop-blur-xs transition-opacity" onClick={step === 'success' ? handleReset : onClose} />

      {/* Slideout Panel with Bold border */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCFAF7] shadow-xl flex flex-col h-full border-l-2 border-[#1A1A1A]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b-2 border-[#1A1A1A] flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[#1A1A1A]">
              {step === 'success' ? 'ORDER CONFIRMED' : 'YOUR SHOPPING BAG'}
            </h2>
            <button
              onClick={step === 'success' ? handleReset : onClose}
              className="p-1 rounded-none border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Stepper bar (Not visible on success) */}
          {step !== 'success' && (
            <div className="bg-[#EAE8E4] border-b-2 border-[#1A1A1A] py-3.5 px-6 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-stone-600">
              <span className={step === 'cart' ? 'text-stone-900 border-b-2 border-[#1A1A1A]' : 'text-stone-400'}>01. Bag</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span className={step === 'delivery' ? 'text-stone-900 border-b-2 border-[#1A1A1A]' : 'text-stone-400'}>02. Delivery</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span className={step === 'payment' ? 'text-stone-900 border-b-2 border-[#1A1A1A]' : 'text-stone-400'}>03. Checkout</span>
            </div>
          )}

          {/* Core scrollable content based on current step */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            
            {/* Step 1: Cart items list */}
            {step === 'cart' && (
              <>
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="p-4 rounded-none border-2 border-[#1A1A1A] bg-[#EAE8E4] text-[#1A1A1A]">
                      <Trash2 className="w-8 h-8 stroke-2" />
                    </div>
                    <div>
                      <h3 className="font-sans font-black uppercase tracking-wider text-stone-900 text-xs">YOUR BAG IS EMPTY</h3>
                      <p className="text-xs font-serif text-stone-500 mt-2 max-w-[220px] mx-auto">Add some Seattle goods to start building your order!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-4 p-3.5 rounded-none bg-white border border-stone-300 hover:border-[#1A1A1A] transition-colors">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-none object-cover bg-stone-200 border border-[#1A1A1A]"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-sans font-bold text-[#1A1A1A] leading-tight">{item.product.name}</h4>
                            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest mt-0.5">{item.product.sizeOrWeight}</span>
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 mt-2">
                            <div className="flex items-center border border-[#1A1A1A] bg-[#FCFAF7] rounded-none p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                className="p-1 rounded-none text-stone-600 hover:bg-[#1A1A1A] hover:text-white cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 font-mono text-xs font-black text-[#1A1A1A] min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                className="p-1 rounded-none text-stone-600 hover:bg-[#1A1A1A] hover:text-white cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif italic font-black text-sm text-[#1A1A1A]">
                                ₹{((item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price) * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="p-1.5 text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Step 2: Delivery & Sourcing options */}
            {step === 'delivery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] font-black mb-3">
                    DELIVERY PREFERENCES
                  </h3>
                  <div className="space-y-3">
                    
                    {/* Eco-Courier (CARGO E-BIKE) */}
                    <div
                      onClick={() => setDeliveryType('eco_courier')}
                      className={`p-4 rounded-none border-2 cursor-pointer flex gap-4 items-start transition-all ${
                        deliveryType === 'eco_courier'
                          ? 'border-[#1A1A1A] bg-[#EAE8E4]'
                          : 'border-stone-300 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-none border border-[#1A1A1A] ${deliveryType === 'eco_courier' ? 'bg-[#1A1A1A] text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <Bike className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-stone-900">Cargo E-Bike Courier</span>
                          <span className="font-serif italic font-black text-xs">₹50.00</span>
                        </div>
                        <p className="text-[10px] text-stone-600 font-serif leading-relaxed mt-1">
                          Zero-emission dispatch. Arrives same-day if ordered before 2 PM. Pristine local delivery.
                        </p>
                      </div>
                    </div>

                    {/* Local pickup */}
                    <div
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-4 rounded-none border-2 cursor-pointer flex gap-4 items-start transition-all ${
                        deliveryType === 'pickup'
                          ? 'border-[#1A1A1A] bg-[#EAE8E4]'
                          : 'border-stone-300 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-none border border-[#1A1A1A] ${deliveryType === 'pickup' ? 'bg-[#1A1A1A] text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-stone-900">In-Store Pickup</span>
                          <span className="font-serif italic font-black text-xs text-stone-500">Free</span>
                        </div>
                        <p className="text-[10px] text-stone-600 font-serif leading-relaxed mt-1">
                          Pick up at 12th & Pike. Ready in-store within 2 hours.
                        </p>
                      </div>
                    </div>

                    {/* Standard Courier */}
                    <div
                      onClick={() => setDeliveryType('shipping')}
                      className={`p-4 rounded-none border-2 cursor-pointer flex gap-4 items-start transition-all ${
                        deliveryType === 'shipping'
                          ? 'border-[#1A1A1A] bg-[#EAE8E4]'
                          : 'border-stone-300 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-none border border-[#1A1A1A] ${deliveryType === 'shipping' ? 'bg-[#1A1A1A] text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-stone-900">Regional Courier</span>
                          <span className="font-serif italic font-black text-xs text-stone-950">₹30.00</span>
                        </div>
                        <p className="text-[10px] text-stone-600 font-serif leading-relaxed mt-1">
                          StandardPriority courier. Dispatched overnight, overnight delivery.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {deliveryType !== 'pickup' && (
                  <div className="border-t-2 border-[#1A1A1A] pt-5 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A]">
                      DELIVERY ADDRESS
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="HANNAH STONE"
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none uppercase font-bold placeholder-stone-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          placeholder="1406 E PINE ST"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none uppercase font-bold placeholder-stone-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">ZIP Code</label>
                          <input
                            type="text"
                            required
                            placeholder="98122"
                            value={address.zipCode}
                            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                            className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none font-mono font-bold placeholder-stone-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="(206) 555-0192"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                            className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none font-bold placeholder-stone-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Checkout Details (Email & Simulated Payment) */}
            {step === 'payment' && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A] mb-3">
                    CONTACT & RECEIPT
                  </h3>
                  <div>
                    <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="YOU@DOMAIN.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none font-mono font-bold placeholder-stone-400"
                    />
                    <p className="text-[10px] text-stone-500 font-serif mt-1.5 leading-relaxed">We will email your confirmation order and tracking details here.</p>
                  </div>
                </div>

                <div className="border-t-2 border-[#1A1A1A] pt-5 space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A]">
                    PAYMENT METHOD
                  </h3>
                  
                  {/* Select Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`py-2 px-1 text-[9px] uppercase tracking-wider font-black border-2 transition-all cursor-pointer text-center rounded-none ${
                        paymentMethod === 'credit_card'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-stone-705 border-stone-300 hover:border-black'
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-1 text-[9px] uppercase tracking-wider font-black border-2 transition-all cursor-pointer text-center rounded-none ${
                        paymentMethod === 'upi'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-stone-705 border-stone-300 hover:border-black'
                      }`}
                    >
                      UPI ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`py-2 px-1 text-[9px] uppercase tracking-wider font-black border-2 transition-all cursor-pointer text-center rounded-none ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-stone-705 border-stone-300 hover:border-black'
                      }`}
                    >
                      Cash on Del.
                    </button>
                  </div>

                  <div className="p-3 bg-[#EAE8E4] border border-[#1A1A1A] rounded-none flex items-start gap-2">
                    <Ticket className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                    <p className="text-[9px] text-stone-800 font-serif leading-relaxed">
                      {paymentMethod === 'credit_card' && "Safe card sandbox mode. Enter any simulated credentials to submit your dry goods reservation."}
                      {paymentMethod === 'upi' && "Enter your standard UPI address. A payment confirmation ping will simulate instantly on order."}
                      {paymentMethod === 'cash_on_delivery' && "Pay via cash or digital scan-on-delivery upon arrival of our eco e-bike courier."}
                    </p>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">Credit Card Number</label>
                        <input
                          type="text"
                          placeholder="•••• •••• •••• 4242"
                          className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none font-mono font-bold placeholder-stone-400"
                          required
                          disabled={paymentDone}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">Expires</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none font-mono font-bold placeholder-stone-400"
                            required
                            disabled={paymentDone}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={3}
                            className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none font-mono font-bold placeholder-stone-400"
                            required
                            disabled={paymentDone}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-black text-stone-600 uppercase tracking-widest mb-1">UPI Address (ID) *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.G., USERNAME@UPI"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none font-mono font-bold placeholder-stone-400"
                        />
                        <p className="text-[9px] text-stone-500 font-serif mt-1">Accepts any standard format (e.g. mobile@upi, name@okaxis).</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="p-3.5 bg-white border border-[#1A1A1A] rounded-none space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-900">📦 Pay on Delivery</p>
                      <p className="text-[10px] text-stone-600 font-serif leading-relaxed">
                        Order total will be collected at your address door. Our dispatch driver carries card readers, exact currency change, and mobile UPI QR code scanners!
                      </p>
                    </div>
                  )}
                </div>

                <button type="submit" className="hidden" id="simulate-checkout-form-submit" />
              </form>
            )}

            {/* Step 4: Success confirmation screens */}
            {step === 'success' && lastPlacedOrder && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-5">
                <div className="w-16 h-16 rounded-none border-2 border-[#1A1A1A] bg-[#EAE8E4] text-[#1A1A1A] flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 stroke-[2.5]" />
                </div>
                
                <div>
                  <h3 className="font-sans font-black text-lg text-[#1A1A1A] uppercase tracking-wider">THANK YOU FOR YOUR ORDER!</h3>
                  <p className="text-xs text-stone-600 mt-2 px-2 leading-relaxed font-serif">
                    We have successfully approved your purchase. An order receipt was sent to <strong className="font-mono text-[#1A1A1A]">{email}</strong>.
                  </p>
                </div>

                <div className="w-full p-4.5 rounded-none border-2 border-[#1A1A1A] bg-[#FCFAF7] space-y-2.5 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black text-stone-500 uppercase tracking-widest text-[9px]">Order Number</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{lastPlacedOrder.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-stone-200 pt-2.5">
                    <span className="font-black text-stone-500 uppercase tracking-widest text-[9px]">Delivery Type</span>
                    <span className="text-stone-700 capitalize text-xs font-serif font-bold">
                      {deliveryType === 'pickup' ? 'Store Pickup' : deliveryType === 'eco_courier' ? 'E-Bike Courier' : 'Regional Courier'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-stone-200 pt-2.5">
                    <span className="font-black text-stone-500 uppercase tracking-widest text-[9px]">Total Paid</span>
                    <span className="font-serif italic font-black text-stone-950 text-base">₹{lastPlacedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-[10px] text-stone-800 italic bg-[#EAE8E4] border border-[#1A1A1A] rounded-none p-3.5 flex gap-2 text-left leading-relaxed font-serif">
                  <span>💡</span>
                  <span>
                    Copy your order number above! You can paste it into the <strong>Track location</strong> tab at the top of the store to check live delivery progress.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-none bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            )}

          </div>

          {/* Persistent Footer Actions */}
          {step !== 'success' && cartItems.length > 0 && (
            <div className="p-6 border-t-2 border-[#1A1A1A] bg-[#EAE8E4] space-y-4">
              
              {/* Coupon Section */}
              <div className="border-b border-stone-300 pb-3.5 space-y-2">
                <span className="block text-[9px] font-black text-stone-600 uppercase tracking-widest">
                  Promo / Co-op Coupon Code
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="COOP DISPATCH CODE..."
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    className="flex-1 text-[10px] px-2 py-1.5 border border-[#1A1A1A] bg-white rounded-none focus:outline-none uppercase font-black"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-[#1A1A1A] text-white hover:bg-white hover:text-[#1A1A1A] transition-all text-[9px] font-black uppercase tracking-widest border border-[#1A1A1A] cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
                {couponError && (
                  <p className="text-[9px] text-red-700 font-mono font-black uppercase tracking-wider mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between mt-1.5 bg-neutral-900 text-white px-2 py-1 text-[9px] font-black uppercase tracking-wider border border-black">
                    <span>🎉 {appliedCoupon} APPLIED (-₹{discountAmount.toFixed(2)})</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-stone-300 hover:text-red-500 font-extrabold uppercase text-[8px] cursor-pointer"
                    >
                      REMOVE
                    </button>
                  </div>
                )}
                <p className="text-[8px] text-stone-500 font-bold uppercase tracking-widest">
                  Try: EASY10, SEATTLECOOP, FREESHIP, MAEVESPECIAL
                </p>
              </div>

              {/* Receipt Breakdowns */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <span>Items subtotal</span>
                  <span className="font-serif font-black text-xs text-stone-800">₹{itemsSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-red-800 font-bold uppercase tracking-wider text-[10px]">
                    <span>Co-Op Discount ({appliedCoupon})</span>
                    <span className="font-serif font-black text-xs text-red-700">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {step !== 'cart' && (
                  <div className="flex justify-between text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                    <span>
                      {deliveryType === 'pickup' ? 'In-store Pickup' : 'Courier Delivery'}
                    </span>
                    <span className="font-serif font-black text-xs text-stone-800">
                      {getDeliveryCost() === 0 ? 'FREE' : `₹${getDeliveryCost().toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-black text-stone-900 text-xs uppercase tracking-widest border-t-2 border-[#1A1A1A] pt-3 mt-3">
                  <span>Estimated Total</span>
                  <span className="font-serif italic font-black text-lg text-[#1A1A1A]">₹{totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Progress Buttons */}
              <div className="flex gap-2.5">
                {step !== 'cart' && (
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 py-3 border-2 border-[#1A1A1A] text-[#1A1A1A] bg-white hover:bg-stone-50 font-black text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Back
                  </button>
                )}
                
                {step === 'payment' ? (
                  <button
                    onClick={() => document.getElementById('simulate-checkout-form-submit')?.click()}
                    className="flex-[2] py-3.5 bg-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] border-2 border-[#1A1A1A] text-white font-black text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                  >
                    Authorize & order
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    disabled={step === 'delivery' && deliveryType !== 'pickup' && (!address.fullName || !address.street || !address.phone)}
                    className="flex-[2] py-3.5 bg-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] border-2 border-[#1A1A1A] text-white font-black text-[10px] uppercase tracking-widest rounded-none cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                  >
                    Continue to {step === 'cart' ? 'Delivery' : 'Receipt'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
