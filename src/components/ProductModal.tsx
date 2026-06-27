import React, { useState } from 'react';
import { X, Star, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  reviews: Review[];
  onAddReview: (productId: string, userName: string, rating: number, comment: string) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  reviews,
  onAddReview,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddReview(product.id, formData.name, formData.rating, formData.comment);
      setFormData({ name: '', rating: 5, comment: '' });
      setIsSubmitting(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/80 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="bg-[#FCFAF7] w-full max-w-4xl rounded-none shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh] border-2 border-[#1A1A1A]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-none bg-[#FCFAF7] border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Left Side: Product Image & Spec Tags */}
        <div className="w-full md:w-1/2 bg-stone-100 flex flex-col max-h-[300px] md:max-h-full border-b-2 md:border-b-0 md:border-r-2 border-[#1A1A1A]">
          <div className="relative flex-1 min-h-[200px] md:min-h-0 bg-stone-200">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 bg-[#FCFAF7] border-t-2 border-[#1A1A1A] hidden md:block">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] font-black mb-3">
              SOURCING & COMPOSITION
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-none bg-stone-100 border border-stone-300 text-stone-800 font-mono text-xs font-semibold lowercase"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Scrollable Details & Review Engine */}
        <div className="w-full md:w-1/2 overflow-y-auto flex flex-col p-6 sm:p-8 max-h-[55vh] md:max-h-full">
          <div className="flex-1">
            <div className="text-[9px] uppercase font-black text-white bg-stone-800 px-2.5 py-1 rounded-none inline-block tracking-[0.2em] mb-4">
              {product.category}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-[#1A1A1A] leading-tight">
              {product.name}
            </h2>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="font-mono text-xs uppercase tracking-wider text-stone-500 font-bold">PACK SIZE:</span>
              <span className="text-xs font-mono font-semibold bg-[#EAE8E4] border border-stone-300 rounded-none px-2 py-0.5">
                {product.sizeOrWeight}
              </span>
            </div>

            {/* Price & Add to Cart Header Panel */}
            <div className="mt-6 p-4 rounded-none bg-[#FCFAF7] border-2 border-[#1A1A1A] flex items-center justify-between">
              <div>
                <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-bold">TOTAL PRICE</span>
                <div className="flex items-baseline gap-2">
                  {product.onSale && product.salePrice ? (
                    <>
                      <span className="font-serif italic font-black text-2xl text-red-700">₹{product.salePrice.toFixed(2)}</span>
                      <span className="font-mono text-xs text-stone-400 line-through">₹{product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="font-serif italic font-black text-2xl text-[#1A1A1A]">₹{product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="px-5 py-3 rounded-none bg-[#1A1A1A] hover:bg-[#FCFAF7] hover:text-[#1A1A1A] border-2 border-[#1A1A1A] text-white font-sans text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                ADD TO BAG
              </button>
            </div>

            {/* In-depth Narrative */}
            <div className="mt-6">
              <h3 className="text-[10px] uppercase tracking-[0.15em] font-black text-[#1A1A1A]">
                ABOUT THIS PRODUCT
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                {product.longDescription}
              </p>
            </div>

            <div className="mt-8 border-t-2 border-[#1A1A1A] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-[0.15em] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  CUSTOMER REVIEWS
                </h3>
                <div className="flex items-center gap-1.5 bg-[#EAE8E4] border border-[#1A1A1A] rounded-none px-2.5 py-1">
                  <Star className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                  <span className="font-mono text-xs font-black text-[#1A1A1A]">{product.rating.toFixed(1)}</span>
                  <span className="text-[9px] text-[#1A1A1A] font-bold uppercase tracking-wider">({productReviews.length} TOTAL)</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 mb-6 scrollbar-thin">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-stone-400 font-serif italic">No reviews yet. Be the first to share your experience!</p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#FCFAF7] border border-stone-300 rounded-none space-y-1.5 shadow-none">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#1A1A1A] font-sans uppercase tracking-wider">{rev.userName}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-[#1A1A1A] text-[#1A1A1A]' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-700 font-serif leading-relaxed">
                        {rev.comment}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-stone-400 font-mono font-bold uppercase">
                        <Calendar className="w-3 h-3" />
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Custom Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-[#EAE8E4] border-2 border-[#1A1A1A] rounded-none p-5 space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A]">WRITE A REVIEW</h4>
                
                {successMsg && (
                  <div className="p-3 bg-stone-900 border border-stone-700 text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 rounded-none">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    Review submitted successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest mb-1">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="E.G., ALEX CARTER"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] focus:outline-none focus:ring-0 focus:border-[#1A1A1A] uppercase font-bold placeholder-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest mb-1">Star Rating</label>
                    <div className="flex items-center h-[38px] gap-1.5 px-3 bg-[#FCFAF7] border border-[#1A1A1A] rounded-none">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1;
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setFormData({ ...formData, rating: starVal })}
                            className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                starVal <= formData.rating ? 'fill-[#1A1A1A] text-[#1A1A1A]' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest mb-1">Your Comments</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="WHAT DID YOU THINK ABOUT THIS GROCERY ITEM?"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] focus:outline-none focus:ring-0 focus:border-[#1A1A1A] resize-none uppercase font-bold placeholder-stone-400"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#FCFAF7] hover:text-[#1A1A1A] border border-[#1A1A1A] text-[#FCFAF7] font-black text-[10px] uppercase tracking-widest rounded-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
