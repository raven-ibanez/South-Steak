import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-steak-black/90 backdrop-blur-md border-b border-steak-gold/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={onMenuClick}
            className="flex items-center space-x-3 group"
          >
            {loading ? (
              <div className="w-12 h-12 bg-steak-charcoal rounded-full animate-pulse" />
            ) : (
              <img
                src={siteSettings?.site_logo || "/logo.jpg"}
                alt={siteSettings?.site_name || "South Steak"}
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-steak-gold group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <div className="flex flex-col items-start leading-none">
              <span className="text-xl font-bold tracking-tighter text-white group-hover:text-steak-gold transition-colors duration-200">
                SOUTH <span className="text-steak-gold">STEAK</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-steak-gold/80 mt-1 font-medium">
                Premium Steakhouse
              </span>
            </div>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2.5 text-steak-gold hover:text-white hover:bg-steak-gold/10 rounded-xl transition-all duration-300 border border-steak-gold/20"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-steak-red text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-steak-black animate-bounce-gentle">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;