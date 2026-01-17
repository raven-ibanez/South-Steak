import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart, Utensils } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  quantity,
  onUpdateQuantity
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations && item.variations.length > 0 ? item.variations[0] : undefined
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn =>
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);

      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }

      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className="group bg-steak-charcoal rounded-2xl overflow-hidden border border-steak-gold/10 hover:border-steak-gold/40 transition-all duration-500 shadow-2xl hover:shadow-steak-gold/5 flex flex-col h-full ring-1 ring-white/5 animate-scale-in">
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center bg-steak-black/40 ${item.image ? 'hidden' : ''}`}>
            <Utensils className="h-16 w-16 opacity-10 text-steak-gold" />
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-steak-red text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl tracking-tighter animate-pulse">
                OFFER
              </div>
            )}
            {item.popular && (
              <div className="bg-steak-gold text-steak-black text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl tracking-tighter">
                BEST SELLER
              </div>
            )}
          </div>

          {!item.available && (
            <div className="absolute inset-0 bg-steak-black/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-steak-charcoal border border-steak-gold/20 text-steak-gold text-xs font-black px-6 py-3 rounded-full tracking-widest uppercase">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-xl font-black text-white leading-tight flex-1 pr-2 tracking-tight group-hover:text-steak-gold transition-colors duration-300">
              {item.name}
            </h4>
          </div>

          <p className={`text-sm mb-6 leading-relaxed flex-1 ${!item.available ? 'text-gray-600' : 'text-gray-400'}`}>
            {!item.available ? 'Currently unavailable from the kitchen.' : item.description}
          </p>

          {/* Pricing Section */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                {item.isOnDiscount && item.discountPrice ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-black text-steak-gold">
                        ₱{item.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₱{item.basePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-steak-gold">
                    ₱{item.basePrice.toFixed(2)}
                  </div>
                )}

                {item.variations && item.variations.length > 0 && (
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">
                    Customizable
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0">
                {!item.available ? (
                  <button
                    disabled
                    className="bg-steak-charcoal text-gray-600 px-6 py-3 rounded-xl cursor-not-allowed font-black text-xs uppercase tracking-widest border border-white/5"
                  >
                    N/A
                  </button>
                ) : quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="bg-steak-gold text-steak-black px-4 md:px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(244,164,30,0.2)]"
                  >
                    {item.variations?.length || item.addOns?.length ? 'Customize' : 'Order Now'}
                  </button>
                ) : (
                  <div className="flex items-center space-x-3 bg-steak-charcoal rounded-xl p-1.5 border border-steak-gold/20 shadow-inner">
                    <button
                      onClick={handleDecrement}
                      className="p-1.5 hover:bg-steak-gold/10 rounded-lg transition-colors duration-200"
                    >
                      <Minus className="h-4 w-4 text-steak-gold" />
                    </button>
                    <span className="font-black text-white min-w-[28px] text-center text-sm">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      className="p-1.5 hover:bg-steak-gold/10 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 text-steak-gold" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Extras indicator */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-tighter text-gray-500 font-bold border-t border-white/5 pt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-steak-gold/40" />
                <span>Premium Add-ons Available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-steak-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-steak-charcoal border border-steak-gold/20 rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="sticky top-0 bg-steak-charcoal/80 backdrop-blur-md border-b border-steak-gold/10 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Customize Your <span className="text-steak-gold">Order</span></h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Options & Add-ons</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-steak-gold/10 rounded-full transition-colors duration-200 group"
              >
                <X className="h-6 w-6 text-gray-500 group-hover:text-steak-gold" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-steak-gold mb-4">Select Cut / Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        onClick={() => setSelectedVariation(variation)}
                        className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${selectedVariation?.id === variation.id
                          ? 'border-steak-gold bg-steak-gold/5 shadow-[0_0_15px_rgba(244,164,30,0.1)]'
                          : 'border-white/5 bg-steak-black/40 hover:border-steak-gold/30'
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${selectedVariation?.id === variation.id ? 'border-steak-gold bg-steak-gold' : 'border-white/20'
                            }`}>
                            {selectedVariation?.id === variation.id && <div className="w-2 h-2 bg-steak-black rounded-full" />}
                          </div>
                          <span className="font-bold text-white tracking-tight">{variation.name}</span>
                        </div>
                        <span className="text-steak-gold font-black">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-8">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-steak-gold mb-4">Premium Extras</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      <h5 className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest border-b border-white/5 pb-2">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 bg-steak-black/40 border border-white/5 rounded-2xl hover:border-steak-gold/30 transition-all duration-300"
                          >
                            <div className="flex-1">
                              <span className="font-bold text-white text-sm tracking-tight">{addOn.name}</span>
                              <div className="text-[10px] font-black text-steak-gold uppercase mt-0.5">
                                {addOn.price > 0 ? `+ ₱${addOn.price.toFixed(2)}` : 'Complimentary'}
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-3 bg-steak-charcoal rounded-xl p-1.5 border border-steak-gold/20">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1 px-2 hover:bg-steak-gold/10 rounded-lg transition-colors duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-steak-gold" />
                                  </button>
                                  <span className="font-black text-white min-w-[20px] text-center text-xs">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1 px-2 hover:bg-steak-gold/10 rounded-lg transition-colors duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-steak-gold" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="w-10 h-10 flex items-center justify-center bg-steak-charcoal text-steak-gold border border-steak-gold/20 rounded-xl hover:bg-steak-gold hover:text-steak-black transition-all duration-300 group"
                                >
                                  <Plus className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-steak-charcoal border-t border-steak-gold/10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Price</span>
                <span className="text-3xl font-black text-steak-gold">₱{calculatePrice().toFixed(2)}</span>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-steak-gold text-steak-black py-5 rounded-2xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-3 shadow-[0_0_30px_rgba(244,164,30,0.2)]"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;