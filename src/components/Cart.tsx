import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, Utensils } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center py-20 bg-steak-charcoal rounded-3xl border border-steak-gold/10 shadow-2xl ring-1 ring-white/5">
          <div className="flex items-center justify-center p-8 bg-steak-black/40 rounded-full w-24 h-24 mx-auto mb-8 border border-white/5 ring-1 ring-white/5">
            <Utensils className="h-12 w-12 text-steak-gold opacity-20" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Your cart is empty</h2>
          <p className="text-gray-400 mb-10 max-w-xs mx-auto text-sm font-medium uppercase tracking-widest">Select your premium cuts to get started</p>
          <button
            onClick={onContinueShopping}
            className="bg-steak-gold text-steak-black px-10 py-4 rounded-xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(244,164,30,0.2)]"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-3 text-gray-500 hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Back to grill</span>
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Your <span className="text-steak-gold">Cart</span></h1>
        <button
          onClick={clearCart}
          className="text-steak-red/60 hover:text-steak-red transition-colors duration-300 font-bold uppercase tracking-widest text-[10px]"
        >
          Clear Cart
        </button>
      </div>

      <div className="bg-steak-charcoal rounded-3xl shadow-2xl overflow-hidden mb-10 border border-steak-gold/10 ring-1 ring-white/5">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors duration-300`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-steak-gold transition-colors duration-300">{item.name}</h3>
                <div className="space-y-1.5">
                  {item.selectedVariation && (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black text-steak-gold uppercase tracking-widest bg-steak-gold/10 px-2 py-0.5 rounded">Cut</span>
                      <p className="text-sm text-gray-400 font-medium">{item.selectedVariation.name}</p>
                    </div>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <span className="text-[10px] font-black text-steak-gold uppercase tracking-widest bg-steak-gold/10 px-2 py-0.5 rounded mt-0.5">Sides</span>
                      <p className="text-sm text-gray-400 font-medium">
                        {item.selectedAddOns.map(addOn =>
                          addOn.quantity && addOn.quantity > 1
                            ? `${addOn.name} (x${addOn.quantity})`
                            : addOn.name
                        ).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-8">
                <div className="flex items-center space-x-4 bg-steak-black/60 rounded-2xl p-1.5 border border-white/5 ring-1 ring-white/5 shadow-inner">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-steak-gold/10 rounded-xl transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-steak-gold" />
                  </button>
                  <span className="font-black text-white min-w-[32px] text-center text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-steak-gold/10 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-steak-gold" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Subtotal</p>
                  <p className="text-xl font-black text-steak-gold">₱{(item.totalPrice * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-steak-red/40 hover:text-steak-red hover:bg-steak-red/10 rounded-2xl transition-all duration-300 transform hover:scale-110"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-8 border border-steak-gold/20 ring-1 ring-steak-gold/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-steak-gold/5 blur-3xl -mr-16 -mt-16 group-hover:bg-steak-gold/10 transition-colors duration-500" />

        <div className="flex items-center justify-between text-2xl md:text-3xl font-black text-white mb-8 relative z-10">
          <span className="uppercase tracking-tighter">Grand Total</span>
          <span className="text-steak-gold">₱{getTotalPrice().toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-steak-gold text-steak-black py-4 md:py-5 rounded-2xl hover:bg-white transition-all duration-300 transform hover:scale-[1.02] font-black uppercase tracking-widest text-base md:text-lg shadow-[0_0_30px_rgba(244,164,30,0.3)] flex items-center justify-center space-x-4 h-16 md:h-20"
        >
          <span>Checkout</span>
          <div className="h-px w-8 bg-steak-black/20" />
        </button>
      </div>
    </div>
  );
};

export default Cart;