import React, { useState } from 'react';
import { ArrowLeft, Clock, CreditCard, Camera } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = serviceType === 'pickup'
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';

    const dineInInfo = serviceType === 'dine-in'
      ? `👥 Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\n🕐 Preferred Time: ${new Date(dineInTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`
      : '';

    const orderDetails = `
🥩 SOUTH STEAK ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📍 Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
${serviceType === 'delivery' ? `🏠 Address: ${address}${landmark ? `\n🗺️ Landmark: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `⏰ Pickup Time: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


📋 YOUR ORDER:
${cartItems.map(item => {
      let itemDetails = `• ${item.name.toUpperCase()}`;
      if (item.selectedVariation) {
        itemDetails += ` [${item.selectedVariation.name}]`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        itemDetails += ` + ${item.selectedAddOns.map(addOn =>
          addOn.quantity && addOn.quantity > 1
            ? `${addOn.name} (x${addOn.quantity})`
            : addOn.name
        ).join(', ')}`;
      }
      itemDetails += ` x${item.quantity} - ₱${(item.totalPrice * item.quantity).toFixed(2)}`;
      return itemDetails;
    }).join('\n')}

💰 TOTAL AMOUNT: ₱${totalPrice.toFixed(2)}
${serviceType === 'delivery' ? `🛵 DELIVERY FEE: [To be confirmed]` : ''}

💳 PAYMENT METHOD: ${selectedPaymentMethod?.name || paymentMethod}
📸 VERIFICATION: [Please attach screenshot of payment]

${notes ? `📝 NOTES: ${notes}` : ''}

Thank you for choosing South Steak. Exceptionally grilled for you. �
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/61578847334426?text=${encodedMessage}`;

    window.open(messengerUrl, '_blank');

  };

  const isDetailsValid = customerName && contactNumber &&
    (serviceType !== 'delivery' || address) &&
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-3 text-gray-500 hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-xs">Back to Cart</span>
          </button>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Check<span className="text-steak-gold">out</span></h1>
          <div className="hidden md:block w-32 h-px bg-steak-gold/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-steak-charcoal rounded-3xl p-8 border border-steak-gold/10 ring-1 ring-white/5 shadow-2xl sticky top-32">
              <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-steak-gold rounded-full" />
                Order Summary
              </h2>

              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto scrollbar-hide pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between py-4 border-b border-white/5 group">
                    <div className="flex-1 pr-4">
                      <h4 className="font-black text-white group-hover:text-steak-gold transition-colors duration-300">{item.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {item.selectedVariation && (
                          <span className="text-[10px] font-black uppercase text-gray-500 bg-white/5 px-2 py-0.5 rounded tracking-widest">{item.selectedVariation.name}</span>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <span className="text-[10px] font-black uppercase text-steak-gold/60 bg-steak-gold/5 px-2 py-0.5 rounded tracking-widest">+{item.selectedAddOns.length} Add-ons</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 font-bold tracking-widest uppercase">₱{item.totalPrice.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <span className="font-black text-steak-gold">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-steak-gold/20 pt-8 mt-2">
                <div className="flex items-center justify-between text-2xl md:text-3xl font-black text-white">
                  <span className="uppercase tracking-tighter">Total Amount</span>
                  <span className="text-steak-gold">₱{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-steak-charcoal rounded-3xl p-8 md:p-12 border border-steak-gold/10 ring-1 ring-white/5 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-10 uppercase tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-steak-gold rounded-full" />
                Customer Information
              </h2>

              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleProceedToPayment(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-steak-black/60 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:ring-2 focus:ring-steak-gold focus:border-transparent transition-all duration-300 font-bold tracking-tight outline-none"
                      placeholder="E.G. JOHN DOE"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Contact Number</label>
                    <input
                      type="tel"
                      className="w-full bg-steak-black/60 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:ring-2 focus:ring-steak-gold focus:border-transparent transition-all duration-300 font-bold tracking-tight outline-none"
                      placeholder="09XX XXX XXXX"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Order Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
                    {[
                      { value: 'dine-in', label: 'Dine In', icon: '🪑' },
                      { value: 'pickup', label: 'Pickup', icon: '🚶' },
                      { value: 'delivery', label: 'Delivery', icon: '🛵' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setServiceType(option.value as ServiceType)}
                        className={`p-4 md:p-6 rounded-2xl border transition-all duration-500 flex flex-row sm:flex-col items-center justify-center gap-4 sm:gap-2 group ring-1 ${serviceType === option.value
                          ? 'bg-steak-gold border-steak-gold ring-steak-gold/50 text-steak-black scale-[1.02]'
                          : 'bg-steak-black/40 border-white/5 ring-white/5 text-gray-400 hover:border-steak-gold/30'
                          }`}
                      >
                        <span className={`text-2xl md:text-3xl transition-transform duration-500 ${serviceType === option.value ? 'scale-110' : 'group-hover:scale-110 opacity-40'}`}>{option.icon}</span>
                        <span className="font-black uppercase tracking-widest text-[10px]">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 animate-fade-in">
                  {/* Dine-in Details */}
                  {serviceType === 'dine-in' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Party Size</label>
                        <div className="flex items-center bg-steak-black/60 border border-white/5 rounded-2xl p-2 h-[66px]">
                          <button
                            type="button"
                            onClick={() => setPartySize(Math.max(1, partySize - 1))}
                            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-steak-gold hover:bg-steak-gold hover:text-steak-black transition-all duration-300 font-black text-xl"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center">
                            <span className="text-xl font-black text-white">{partySize}</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">GUESTS</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPartySize(Math.min(20, partySize + 1))}
                            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-steak-gold hover:bg-steak-gold hover:text-steak-black transition-all duration-300 font-black text-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Arrival Time</label>
                        <input
                          type="datetime-local"
                          className="w-full bg-steak-black/60 border border-white/5 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold"
                          value={dineInTime}
                          onChange={(e) => setDineInTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Pickup Time Selection */}
                  {serviceType === 'pickup' && (
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Preparation Window</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { value: '5-10', label: '10 MINS' },
                          { value: '15-20', label: '20 MINS' },
                          { value: '25-30', label: '30 MINS' },
                          { value: 'custom', label: 'CUSTOM' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setPickupTime(option.value)}
                            className={`p-4 rounded-xl border transition-all duration-300 text-[10px] font-black tracking-widest ${pickupTime === option.value
                              ? 'bg-steak-gold border-steak-gold text-steak-black'
                              : 'bg-steak-black/40 border-white/5 text-gray-400 hover:border-steak-gold/30'
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {pickupTime === 'custom' && (
                        <input
                          type="text"
                          className="w-full bg-steak-black/60 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                          placeholder="E.G., 45 MINUTES"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value.toUpperCase())}
                          required
                        />
                      )}
                    </div>
                  )}

                  {/* Delivery Address */}
                  {serviceType === 'delivery' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Delivery Address</label>
                        <textarea
                          className="w-full bg-steak-black/60 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight min-h-[120px]"
                          placeholder="COMPLETE RESIDENTIAL OR OFFICE ADDRESS"
                          value={address}
                          onChange={(e) => setAddress(e.target.value.toUpperCase())}
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Landmark</label>
                        <input
                          type="text"
                          className="w-full bg-steak-black/60 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                          placeholder="E.G., NEAR CATHEDRAL"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value.toUpperCase())}
                        />
                      </div>
                    </div>
                  )}

                  {/* Special Notes */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Additional Notes</label>
                    <textarea
                      className="w-full bg-steak-black/60 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight min-h-[120px]"
                      placeholder="ANY SPECIAL REQUESTS (E.G., MEDIUM RARE, ALLERGIES)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    className={`w-full h-20 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 transform ${isDetailsValid
                      ? 'bg-steak-gold text-steak-black hover:bg-white hover:scale-[1.02] shadow-[0_0_40px_rgba(244,164,30,0.2)]'
                      : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                      }`}
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-3 text-gray-500 hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Back to Details</span>
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Pay<span className="text-steak-gold">ment</span></h1>
        <div className="hidden md:block w-32 h-px bg-steak-gold/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Payment Method Selection */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="bg-steak-charcoal rounded-3xl p-8 md:p-12 border border-steak-gold/10 ring-1 ring-white/5 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-10 uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-steak-gold rounded-full" />
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-3 ring-1 ${paymentMethod === method.id
                    ? 'bg-steak-gold border-steak-gold ring-steak-gold/50 text-steak-black'
                    : 'bg-steak-black/40 border-white/5 ring-white/5 text-gray-400 hover:border-steak-gold/30'
                    }`}
                >
                  <CreditCard className="h-6 w-6 opacity-80" />
                  <span className="font-black uppercase tracking-widest text-[10px]">{method.name}</span>
                </button>
              ))}
            </div>

            {/* Payment Details with QR Code */}
            {selectedPaymentMethod && (
              <div className="bg-steak-black/60 rounded-3xl p-8 border border-steak-gold/20 ring-1 ring-steak-gold/10 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-steak-gold/5 blur-3xl -mr-16 -mt-16" />

                <h3 className="text-xs font-black text-steak-gold uppercase tracking-[0.3em] mb-6">Payment Details</h3>

                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Institution</p>
                      <p className="text-lg font-black text-white">{selectedPaymentMethod.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Account Number</p>
                      <p className="text-2xl font-black text-steak-gold tracking-tight font-mono">{selectedPaymentMethod.account_number}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Account Holder</p>
                      <p className="text-sm font-bold text-gray-300 uppercase">{selectedPaymentMethod.account_name}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:scale-105">
                      <img
                        src={selectedPaymentMethod.qr_code_url}
                        alt={`${selectedPaymentMethod.name} QR Code`}
                        className="w-40 h-40 object-contain rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                        }}
                      />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-4">Scan for validation</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Notice */}
            <div className="bg-steak-red/10 border border-steak-red/20 rounded-2xl p-6 flex items-start gap-4">
              <Camera className="h-6 w-6 text-steak-red" />
              <div>
                <h4 className="font-black text-steak-red uppercase tracking-widest text-[10px] mb-1">Verification Required</h4>
                <p className="text-sm text-gray-400 font-medium">
                  Customers are requested to capture their payment confirmation. Please attach this screenshot when finalizing your order through Messenger.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Summary */}
        <div className="lg:col-span-12 xl:col-span-5">
          <div className="bg-steak-charcoal rounded-3xl p-8 border border-steak-gold/10 ring-1 ring-white/5 shadow-2xl sticky top-32">
            <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-steak-gold rounded-full" />
              Order Review
            </h2>

            <div className="space-y-6 mb-10">
              <div className="bg-steak-black/40 rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Patron</span>
                  <span className="text-sm font-black text-white text-right">{customerName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logistics</span>
                  <span className="text-sm font-black text-white text-right uppercase tracking-tighter">{serviceType}</span>
                </div>
                {serviceType === 'delivery' && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Destination</span>
                    <span className="text-[11px] font-bold text-gray-400 text-right line-clamp-2">{address}</span>
                  </div>
                )}
              </div>

              <div className="max-h-[20vh] overflow-y-auto scrollbar-hide pr-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs font-bold text-gray-400">{item.name} x{item.quantity}</span>
                    <span className="text-xs font-black text-white">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-steak-gold/20 pt-8">
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-tighter text-[10px] font-black text-gray-500">Total Amount</span>
                  <span className="text-4xl font-black text-steak-gold">₱{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full h-24 bg-steak-gold text-steak-black rounded-2xl hover:bg-white transition-all duration-500 transform hover:scale-[1.02] font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_50px_rgba(244,164,30,0.3)] flex items-center justify-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">Place Order on Messenger</span>
              <div className="h-px w-10 bg-steak-black/20 relative z-10" />
            </button>

            <p className="text-[9px] font-black text-gray-600 text-center mt-6 uppercase tracking-[0.3em]">
              Redirecting to Messenger for Order Confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;