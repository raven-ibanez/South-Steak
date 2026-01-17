import React from 'react';
import { MenuItem, CartItem } from '../types';
import {
  Coffee,
  Flame,
  Pizza,
  Wine,
  UtensilsCrossed,
  Cookie,
  Milk,
  IceCream,
  Utensils,
  Fish,
  Leaf,
  Package
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'dim-sum':
    case 'dumplings':
      return <Utensils className="h-full w-full" />;
    case 'noodles':
    case 'ramen':
      return <UtensilsCrossed className="h-full w-full" />;
    case 'rice-dishes':
    case 'rice':
      return <Utensils className="h-full w-full" />;
    case 'beverages':
    case 'drinks':
      return <Milk className="h-full w-full" />;
    case 'hot-coffee':
    case 'coffee':
    case 'love-coffee':
      return <Coffee className="h-full w-full" />;
    case 'iced-coffee':
      return <IceCream className="h-full w-full" />;
    case 'desserts':
    case 'pastries':
    case 'sweets':
      return <Cookie className="h-full w-full" />;
    case 'main-course':
    case 'steaks':
    case 'usda-butter-aged':
    case 'australian-marbled':
    case 'wagyu-cubes':
      return <Flame className="h-full w-full" />;
    case 'pizza':
      return <Pizza className="h-full w-full" />;
    case 'seafoods':
    case 'salmon':
    case 'tuna':
      return <Fish className="h-full w-full" />;
    case 'premium-spirits':
      return <Wine className="h-full w-full" />;
    case 'frozen-veggies':
    case 'premium-spices':
      return <Leaf className="h-full w-full" />;
    case 'frozen-processed':
    case 'tonios-sisig':
      return <Package className="h-full w-full" />;
    default:
      return <Utensils className="h-full w-full" />;
  }
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);

      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      {/* Desktop Category Navigation */}
      <div className="hidden md:block sticky top-20 z-40 bg-steak-black/80 backdrop-blur-xl border-b border-steak-gold/10 py-6 transition-all duration-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center space-x-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`group relative text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 py-2 ${activeCategory === category.id ? 'text-steak-gold' : 'text-gray-500 hover:text-white'
                  }`}
              >
                <span className="relative z-10">{category.name}</span>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-steak-gold transition-all duration-500 ${activeCategory === category.id ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'
                  }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <MobileNav
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-steak-black">

        {categories.map((category) => {
          const categoryItems = menuItems.filter(item => item.category === category.id);

          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-24 scroll-mt-32">
              <div className="flex flex-col items-center mb-12">
                <span className="w-12 h-12 mb-4 bg-steak-gold/10 p-3 rounded-2xl border border-steak-gold/20 shadow-[0_0_15px_rgba(244,164,30,0.1)] flex items-center justify-center text-steak-gold">
                  {getCategoryIcon(category.id)}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                  {category.name}
                </h3>
                <div className="w-12 h-0.5 bg-steak-gold mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => {
                  const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                  return (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                      quantity={cartItem?.quantity || 0}
                      onUpdateQuantity={updateQuantity}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
};

export default Menu;