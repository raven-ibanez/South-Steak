import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-6 right-6 bg-steak-gold text-steak-black p-4 rounded-2xl shadow-2xl hover:bg-white transition-all duration-300 transform hover:scale-110 z-40 md:hidden ring-1 ring-white/10"
    >
      <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -top-3 -right-3 bg-white text-steak-black text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black shadow-lg">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;