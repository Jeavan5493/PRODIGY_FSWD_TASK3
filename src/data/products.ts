import { Product, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'toor-dal',
    name: 'Ooty Organic Toor Dal',
    description: 'Premium bold-grain high-protein unpolished arhar dal sourced from the organic farms of Ooty.',
    longDescription: 'Our organic Toor Dal (split pigeon peas) is grown sustainably in the cool, rich soils of the Ooty hills. It is completely unpolished, retaining its natural nutrients, dietary fibers, and rich earthy flavor. Easy to cook and perfect for making traditional, aromatic Sambar and comforting daily Dal Tadka.',
    category: 'Lentils & Rice',
    price: 180.00,
    image: 'https://images.unsplash.com/photo-1585993003614-51e7aee7dcee?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 24,
    ingredients: ['100% Organic Unpolished Toor Dal'],
    sizeOrWeight: '1 kg pack',
    stock: 15,
    onSale: true,
    salePrice: 150.00
  },
  {
    id: 'filter-coffee',
    name: 'Mylapore Filter Coffee Decoction Blend',
    description: 'Traditional 80:20 Arabica & Chicory medium-dark roast blend for authentic South Indian filter Kaapi.',
    longDescription: 'Experience the soul of Madras with our signature Mylapore Filter Coffee. Expertly blended with 80% premium high-altitude Arabica coffee beans from Chikmagalur and 20% high-grade roasted chicory, this blend yields a thick, aromatic decoction with rich chocolatey notes and a smooth, bold body when brewed in a traditional brass filter.',
    category: 'Beverages',
    price: 240.00,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 38,
    ingredients: ['80% Premium Roasted Arabica Beans', '20% High-Grade Roasted Chicory'],
    sizeOrWeight: '500g ground coffee pouch',
    stock: 22,
    onSale: true,
    salePrice: 190.00
  },
  {
    id: 'white-bread',
    name: 'Traditional White Bread Slices',
    description: 'Classic, soft daily sandwich milk bread loaf, freshly baked and perfectly sliced.',
    longDescription: 'Baked fresh every morning in our co-op kitchens, this traditional white bread is soft, fluffy, and has a delicate buttery flavor. Perfectly sliced for morning toast, local style bread-butter-jam, or making crispy vegetable Bombay sandwiches.',
    category: 'Bakery & Bread',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    rating: 4.6,
    reviewsCount: 19,
    ingredients: ['Premium Wheat Flour', 'Milk Solids', 'Yeast', 'Purified Water', 'Organic Butter', 'Sea Salt'],
    sizeOrWeight: '400g sliced loaf',
    stock: 12
  },
  {
    id: 'lays-chips',
    name: 'Lays Potato Chips - India Magic Masala',
    description: 'Crisp, golden potato chips perfectly seasoned with a rich, aromatic blend of hot Indian spices.',
    longDescription: 'Bring home the famous taste of India with Lays India Magic Masala potato chips. Made from high-quality sun-ripened local potatoes, thinly sliced and fried to crunchy perfection, then coated with an iconic secret mix of coriander, red chilli, turmeric, garlic, tomato powder, and dry mango powder.',
    category: 'Snacks & Savouries',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 15,
    ingredients: ['Select Potatoes', 'Edible Vegetable Oil', 'Spices & Condiments (Onion Powder, Chilli, Coriander, Dry Mango, Garlic, Turmeric)'],
    sizeOrWeight: '90g packet',
    stock: 30
  },
  {
    id: 'dairy-milk',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    description: 'Indulgently smooth, rich, and creamy milk chocolate bar made with premium cocoa.',
    longDescription: 'Treat your senses with the velvet smoothness of Cadbury Dairy Milk Silk. Specially formulated with a higher cocoa butter content to melt effortlessly on your tongue, this classic chocolate bar delivers a premium sweet creaminess that has been a favorite for generations.',
    category: 'Chocolates & Sweets',
    price: 80.00,
    image: 'https://images.unsplash.com/photo-1548907040-4bb42b100975?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 42,
    ingredients: ['Sugar', 'Milk Solids', 'Cocoa Butter', 'Cocoa Solids', 'Emulsifiers'],
    sizeOrWeight: '150g bar',
    stock: 18
  },
  {
    id: 'sona-masoori-rice',
    name: 'Sona Masoori Rice (Aged 2 Years)',
    description: 'Lightweight, aromatic, low-starch premium medium grain rice harvested from the Krishna river basin.',
    longDescription: 'Our premium Sona Masoori Rice is aged for 2 full years to ensure maximum fluffiness, distinct non-sticky grains, and lower starch index. Widely loved in South Indian households, it is perfect for daily steaming, preparing fluffy lemon rice, coconut rice, tamarind rice (puliyogare), or soft ven pongal.',
    category: 'Lentils & Rice',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 11,
    ingredients: ['100% Aged Sona Masoori Rice'],
    sizeOrWeight: '5 kg bag',
    stock: 8
  },
  {
    id: 'banana-chips',
    name: 'Kerala Nendran Banana Chips',
    description: 'Crispy, salty banana chips sliced thin and fried in 100% pure cold-pressed coconut oil.',
    longDescription: 'Crafted the traditional way! We source fresh, high-grade organic Nendran plantains directly from Kerala farms, slice them extremely thin, and deep-fry them in pure cold-pressed coconut oil. Sprinkled lightly with rock salt and a dash of turmeric, these chips boast an unbeatable crunch and rich local aroma.',
    category: 'Snacks & Savouries',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1594756202469-9ff9799a2e4e?q=80&w=600&auto=format&fit=crop',
    rating: 4.5,
    reviewsCount: 7,
    ingredients: ['Organic Nendran Bananas', '100% Pure Coconut Oil', 'Turmeric Powder', 'Rock Salt'],
    sizeOrWeight: '250g packet',
    stock: 5
  },
  {
    id: 'sambar-powder',
    name: 'Mylapore Fresh Sambar Powder',
    description: 'Traditional slow-roasted spice blend of coriander, Guntur red chillies, fenugreek, and high-grade hing.',
    longDescription: 'Our secret multi-generational recipe! This Sambar powder is prepared in small batches by slow-roasting premium Guntur red chillies, coriander seeds, chana dal, toor dal, cumin, fenugreek, black pepper, and premium asafoetida (hing). Ground to a perfect texture to release rich flavors and an authentic South Indian dining hall aroma.',
    category: 'Spices & Condiments',
    price: 90.00,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 16,
    ingredients: ['Coriander Seeds', 'Guntur Red Chillies', 'Chana Dal', 'Toor Dal', 'Cumin', 'Fenugreek Seeds', 'Black Pepper', 'Asafoetida (Hing)', 'Curry Leaves'],
    sizeOrWeight: '200g spice box',
    stock: 25
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'toor-dal',
    userName: 'Hannah S. (Mylapore, Chennai)',
    rating: 5,
    comment: 'Unbelievably good quality! It cooks very fast in the pressure cooker and makes the absolute thickest and most aromatic sambar I have had in years.',
    date: '2026-05-14'
  },
  {
    id: 'rev-2',
    productId: 'toor-dal',
    userName: 'Oliver P. (Bangalore, KA)',
    rating: 4,
    comment: 'Fresh, clean, and completely stone-free. Packaging was great and the unpolished nature makes a real difference in the taste.',
    date: '2026-06-02'
  },
  {
    id: 'rev-3',
    productId: 'filter-coffee',
    userName: 'Marcus B. (Malleshwaram, Bangalore)',
    rating: 5,
    comment: 'The 80:20 ratio is perfect! Rich, deep flavor with the exact amount of bitterness needed for a strong morning tumbler of filter Kaapi.',
    date: '2026-06-10'
  },
  {
    id: 'rev-4',
    productId: 'white-bread',
    userName: 'Evelyn T. (Kochi, KL)',
    rating: 5,
    comment: 'Very soft, moist, and delicious white bread. Perfect for making quick sandwiches or just enjoying with butter and sugar.',
    date: '2026-05-28'
  },
  {
    id: 'rev-5',
    productId: 'dairy-milk',
    userName: 'Daniel K. (Hyderabad, TS)',
    rating: 5,
    comment: 'Dairy Milk Silk never disappoints! Melted perfectly in transit and was as smooth as ever. High-quality packaging!',
    date: '2026-06-12'
  }
];

export interface FAQ {
  q: string;
  a: string;
  tag: string;
}

export const STORE_FAQS: FAQ[] = [
  {
    q: 'Where are you located and what are your store hours?',
    a: 'We are located at 1205 E Pike St, Seattle, WA (proudly importing artisanal staples directly from Chennai, Bangalore, and Kerala). Our co-op hours are 8:00 AM - 7:00 PM Tuesday through Sunday.',
    tag: 'location'
  },
  {
    q: 'How does Local Co-Op Pickup work?',
    a: 'Simply select "Local Pickup" during checkout. Orders are packed immediately with fresh curry leaves and ready for pickup at our Pike St shop inside 2 hours.',
    tag: 'pickup'
  },
  {
    q: 'Tell me about Eco-Courier Delivery.',
    a: 'For our local customers, we offer Eco-Courier delivery using zero-emission cargo e-bikes. Placed before 2 PM, orders arrive the very same day at your doorstep!',
    tag: 'delivery'
  },
  {
    q: 'Are your spices and dry goods certified organic?',
    a: 'Yes! We source directly from pesticide-free agricultural co-operatives in South India (including Nilgiri hills and the Wayanad region). All beans are unpolished and spices are freshly ground in micro-batches with no synthetic fillers.',
    tag: 'sustainability'
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 100% satisfaction guarantee. If any packet or ingredient fails to meet your household standards, we will gladly accept a return or exchange within 30 days.',
    tag: 'returns'
  }
];
