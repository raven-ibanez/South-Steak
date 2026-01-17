import React from 'react';
import { useCategories } from '../hooks/useCategories';
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

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'dim-sum':
    case 'dumplings':
      return <Utensils className="h-4 w-4" />;
    case 'noodles':
    case 'ramen':
      return <UtensilsCrossed className="h-4 w-4" />;
    case 'rice-dishes':
    case 'rice':
      return <Utensils className="h-4 w-4" />;
    case 'beverages':
    case 'drinks':
      return <Milk className="h-4 w-4" />;
    case 'hot-coffee':
    case 'coffee':
    case 'love-coffee':
      return <Coffee className="h-4 w-4" />;
    case 'iced-coffee':
      return <IceCream className="h-4 w-4" />;
    case 'desserts':
    case 'pastries':
    case 'sweets':
      return <Cookie className="h-4 w-4" />;
    case 'main-course':
    case 'steaks':
    case 'usda-butter-aged':
    case 'australian-marbled':
    case 'wagyu-cubes':
      return <Flame className="h-4 w-4" />;
    case 'pizza':
      return <Pizza className="h-4 w-4" />;
    case 'seafoods':
    case 'salmon':
    case 'tuna':
      return <Fish className="h-4 w-4" />;
    case 'premium-spirits':
      return <Wine className="h-4 w-4" />;
    case 'frozen-veggies':
    case 'premium-spices':
      return <Leaf className="h-4 w-4" />;
    case 'frozen-processed':
    case 'tonios-sisig':
      return <Package className="h-4 w-4" />;
    default:
      return <Utensils className="h-4 w-4" />;
  }
};

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-16 z-40 bg-steak-black/95 backdrop-blur-md border-b border-steak-gold/10 md:hidden shadow-lg">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group transition-all duration-500"
          >
            <div className={`flex items-center space-x-2 px-1 py-1 transition-all duration-300 ${activeCategory === category.id ? 'text-steak-gold' : 'text-gray-500'
              }`}>
              <span className={`transition-all duration-300 ${activeCategory === category.id ? '' : 'grayscale opacity-50'}`}>
                {getCategoryIcon(category.id)}
              </span>
              <span className="font-black uppercase tracking-[0.2em] text-[10px] whitespace-nowrap">
                {category.name}
              </span>
            </div>
            <div className={`h-0.5 bg-steak-gold transition-all duration-500 rounded-full ${activeCategory === category.id ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;