import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { SupportMessage } from '../types';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'init-1',
      text: 'Good day! I am Maeve, your EASYGROCERY assistant. Looking for organic South Indian recommendations, pickup instructions, or have general questions about our grocery store?',
      sender: 'bot',
      timestamp: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      let replyText = "I would love to help you with that! At EASYGROCERY, we pride ourselves on authentic South Indian staples and organic products. Ask me about store hours, local bike deliveries, or our unpolished dals and aged rice.";

      if (lowerText.includes('hour') || lowerText.includes('time') || lowerText.includes('open') || lowerText.includes('close') || lowerText.includes('located') || lowerText.includes('where') || lowerText.includes('address')) {
        replyText = "We are located at 1205 E Pike St in Capitol Hill, Seattle. We are open from 8:00 AM to 7:00 PM, Tuesday through Sunday (closed Mondays). Come say hello!";
      } else if (lowerText.includes('delivery') || lowerText.includes('cargo') || lowerText.includes('bike') || lowerText.includes('ship') || lowerText.includes('eco')) {
        replyText = "We offer same-day Eco-Courier cargo e-bike deliveries within central Seattle for orders placed before 2 PM (₹50.00). We also ship regionally via priority couriers in 2 business days (₹30.00)!";
      } else if (lowerText.includes('pickup') || lowerText.includes('pick') || lowerText.includes('store')) {
        replyText = "Local Pickup is entirely free. Just checkout with 'Local Pickup' at payment, and your provisions will be assembled and waiting on our lobby pickup shelves within 2 hours. We will email you once it is ready!";
      } else if (lowerText.includes('rice') || lowerText.includes('sona') || lowerText.includes('masoori')) {
        replyText = "Our aged Sona Masoori Rice is aged for 2 full years, sourced from sustainable Krishna river basin agricultural co-ops. Extremely fluffy and light!";
      } else if (lowerText.includes('dal') || lowerText.includes('toor') || lowerText.includes('sambar')) {
        replyText = "Our unpolished Ooty Toor Dal and hand-ground Mylapore Sambar Powder are perfect for creating traditional South Indian households' wholesome comfort food.";
      } else if (lowerText.includes('coffee') || lowerText.includes('filter') || lowerText.includes('decoction') || lowerText.includes('kaapi')) {
        replyText = "Our signature beverage is the Mylapore Filter Coffee! Authentic 80:20 Arabica-Chicory blend for strong, piping hot South Indian filter Kaapi.";
      } else if (lowerText.includes('return') || lowerText.includes('refund') || lowerText.includes('policy')) {
        replyText = "We offer a 100% customer satisfaction guarantee! If any organic goods, chocolate bars, or lifestyle items do not satisfy you, bring them in or email us for a full refund or friendly exchange within 30 days.";
      } else if (lowerText.includes('ingredients') || lowerText.includes('organic') || lowerText.includes('healthy')) {
        replyText = "Every single dry good, chocolate, and tea we offer is organic, fair-trade, and single-batch. All ingredients are listed fully inside each product details view!";
      }

      const botReply: SupportMessage = {
        id: `msg-${Date.now() + 1}`,
        text: replyText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 900);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Expandable Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-[#FCFAF7] border-2 border-[#1A1A1A] rounded-none flex flex-col overflow-hidden mb-4 shadow-xl">
          
          {/* Header */}
          <div className="bg-[#1A1A1A] px-5 py-4 flex items-center justify-between text-white border-b-2 border-[#1A1A1A]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-none h-2 w-2 bg-emerald-400"></span>
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#FCFAF7] flex items-center gap-1.5">
                  Maeve • EasyGrocery Scout
                </h3>
                <p className="text-[10px] text-stone-300 font-bold uppercase tracking-wider font-sans">ONLINE HELPER</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-none border border-stone-600 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 text-xs leading-relaxed rounded-none border ${
                    m.sender === 'user'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-[#FCFAF7] text-stone-800 border-stone-300 font-serif'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-stone-400 mt-1 font-mono">{m.timestamp}</span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-[#FCFAF7] border border-stone-300 rounded-none px-3 py-2 w-fit">
                <span className="w-1.5 h-1.5 bg-stone-500 rounded-none animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-stone-500 rounded-none animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-stone-500 rounded-none animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Shortcut Chips */}
          <div className="bg-[#EAE8E4] border-t border-stone-300 p-2 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            <button
              onClick={() => handleSendMessage('Where is your shop located?')}
              className="px-3 py-1 bg-white border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors text-[#1A1A1A] rounded-none text-[9px] uppercase font-black tracking-widest shrink-0 cursor-pointer"
            >
              📍 Location / Hours
            </button>
            <button
              onClick={() => handleSendMessage('How does Local Pickup work?')}
              className="px-3 py-1 bg-white border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors text-[#1A1A1A] rounded-none text-[9px] uppercase font-black tracking-widest shrink-0 cursor-pointer"
            >
              📦 Free Pickup
            </button>
            <button
              onClick={() => handleSendMessage('What is your delivery range?')}
              className="px-3 py-1 bg-white border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors text-[#1A1A1A] rounded-none text-[9px] uppercase font-black tracking-widest shrink-0 cursor-pointer"
            >
              🚴 Eco cargo bike
            </button>
          </div>

          {/* Text Input Footer */}
          <form onSubmit={handleInputSubmit} className="border-t border-stone-300 p-3 bg-white flex gap-2">
            <input
              type="text"
              placeholder="ASK EASYGROCERY ASSISTANT..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none text-stone-900 placeholder-stone-400 uppercase font-bold"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 bg-[#1A1A1A] text-white rounded-none border border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] disabled:opacity-40 transition-all cursor-pointer inline-flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 bg-[#FCFAF7] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-sans font-black text-xs rounded-none shadow-md flex items-center gap-2 border-2 border-[#1A1A1A] transition-all duration-100 uppercase tracking-[0.15em] cursor-pointer"
      >
        <MessageSquare className="w-4.5 h-4.5 stroke-[2.5]" />
        {isOpen ? 'Close Chat' : 'EasyGrocery Chat'}
      </button>

    </div>
  );
}
