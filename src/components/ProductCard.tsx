import React from 'react';
import { Star, Plus, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-[#FCFAF7] rounded-none overflow-hidden border-2 border-[#1A1A1A] shadow-none hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_#1A1A1A] transition-all duration-200 flex flex-col h-full">
      
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer border-b-2 border-[#1A1A1A]" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-[#FCFAF7]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            type="button"
            className="px-4 py-2 bg-[#FCFAF7] text-[#1A1A1A] border-2 border-[#1A1A1A] font-sans text-[10px] font-black uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all shadow-none duration-150"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
          >
            QUICK VIEW
          </button>
        </div>
        {product.stock <= 5 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-none bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
            ONLY {product.stock} LEFT
          </span>
        )}
        {product.onSale && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-none bg-red-700 text-white font-mono text-[9px] font-black uppercase tracking-widest">
            SALE
          </span>
        )}
      </div>

      {/* Card Content Area - Crafted Editorial Column */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Weight */}
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em]">
            <span>{product.category}</span>
            <span className="font-mono text-stone-600 lowercase bg-[#EAE8E4] px-1.5 py-0.5 rounded-none border border-stone-300">
              {product.sizeOrWeight}
            </span>
          </div>

          {/* Title - Georgia or bold space display */}
          <h3 
            className="mt-3 font-sans font-black text-base sm:text-lg text-[#1A1A1A] leading-tight cursor-pointer hover:underline decoration-2 transition-all"
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-xs text-stone-600 font-serif leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="mt-3.5 flex items-center gap-1.5">
            <div className="flex items-center text-[#1A1A1A]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-mono text-xs font-bold text-[#1A1A1A]">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">({product.reviewsCount} REVIEWS)</span>
          </div>
        </div>

        {/* Price & Primary Action with Serif Styling */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-[#1A1A1A] font-black">PRICE</span>
            <div className="flex items-baseline">
              {product.onSale && product.salePrice ? (
                <>
                  <span className="font-serif italic font-black text-red-700 text-lg sm:text-xl mr-1.5">
                    ₹{product.salePrice.toFixed(2)}
                  </span>
                  <span className="font-mono text-stone-400 line-through text-xs">
                    ₹{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-serif italic font-black text-[#1A1A1A] text-lg sm:text-xl">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1 px-3 py-2 bg-[#1A1A1A] text-[#FCFAF7] border border-[#1A1A1A] rounded-none hover:bg-[#FCFAF7] hover:text-[#1A1A1A] active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
            ADD TO BAG
          </button>
        </div>
      </div>
    </div>
  );
}
