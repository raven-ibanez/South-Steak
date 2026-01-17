import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { usePaymentMethods, PaymentMethod } from '../hooks/usePaymentMethods';
import ImageUpload from './ImageUpload';

interface PaymentMethodManagerProps {
  onBack: () => void;
}

const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({ onBack }) => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, refetchAll } = usePaymentMethods();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    account_number: '',
    account_name: '',
    qr_code_url: '',
    active: true,
    sort_order: 0
  });

  React.useEffect(() => {
    refetchAll();
  }, []);

  const handleAddMethod = () => {
    const nextSortOrder = Math.max(...paymentMethods.map(m => m.sort_order), 0) + 1;
    setFormData({
      id: '',
      name: '',
      account_number: '',
      account_name: '',
      qr_code_url: '',
      active: true,
      sort_order: nextSortOrder
    });
    setCurrentView('add');
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      id: method.id,
      name: method.name,
      account_number: method.account_number,
      account_name: method.account_name,
      qr_code_url: method.qr_code_url,
      active: method.active,
      sort_order: method.sort_order
    });
    setCurrentView('edit');
  };

  const handleDeleteMethod = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deletePaymentMethod(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete payment method');
      }
    }
  };

  const handleSaveMethod = async () => {
    if (!formData.id || !formData.name || !formData.account_number || !formData.account_name || !formData.qr_code_url) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate ID format (kebab-case)
    const idRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!idRegex.test(formData.id)) {
      alert('Payment method ID must be in kebab-case format (e.g., "gcash", "bank-transfer")');
      return;
    }

    try {
      if (editingMethod) {
        await updatePaymentMethod(editingMethod.id, formData);
      } else {
        await addPaymentMethod(formData);
      }
      setCurrentView('list');
      setEditingMethod(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save payment method');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingMethod(null);
  };

  const generateIdFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      id: currentView === 'add' ? generateIdFromName(name) : formData.id
    });
  };

  // Form View (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-steak-black">
        <div className="bg-steak-charcoal shadow-2xl border-b border-white/5 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-3 text-gray-500 hover:text-white transition-all duration-300 group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Back</span>
                </button>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
                  {currentView === 'add' ? 'Add New' : 'Edit'} <span className="text-steak-gold">Payment Method</span>
                </h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveMethod}
                  className="px-8 py-2.5 bg-steak-gold text-steak-black rounded-xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(244,164,30,0.2)]"
                >
                  <span>Save Payment Method</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-10 border border-steak-gold/10 ring-1 ring-white/5">
            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3">Payment Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight placeholder-white/10"
                  placeholder="E.G., GCASH, MAYA, BANK TRANSFER"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3">Payment ID *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight placeholder-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="kebab-case-id"
                  disabled={currentView === 'edit'}
                />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-3 ml-2">
                  {currentView === 'edit'
                    ? 'Payment ID cannot be changed'
                    : 'Example: gcash, bank-transfer, cash, etc.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3">Account Number *</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                    placeholder="09XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3">Account Name *</label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                    placeholder="ACCOUNT HOLDER"
                  />
                </div>
              </div>

              <div className="p-6 bg-steak-black/40 rounded-3xl border border-white/5">
                <ImageUpload
                  currentImage={formData.qr_code_url}
                  onImageChange={(imageUrl) => setFormData({ ...formData, qr_code_url: imageUrl || '' })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                  placeholder="0"
                />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-3 ml-2">
                  Display hierarchy position
                </p>
              </div>

              <div className="flex items-center pt-4">
                <label className="relative flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-all duration-500 border-2 ${formData.active ? 'bg-steak-gold/20 border-steak-gold' : 'bg-steak-black border-white/10'}`}>
                    <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 ${formData.active ? 'translate-x-6 bg-steak-gold' : 'bg-gray-600'}`}></div>
                  </div>
                  <span className="ml-4 text-[10px] font-black text-white uppercase tracking-[0.2em] group-hover:text-steak-gold transition-colors">Active</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-steak-black">
      <div className="bg-steak-charcoal shadow-2xl border-b border-white/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className="flex items-center space-x-3 text-gray-500 hover:text-white transition-all duration-300 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-black uppercase tracking-widest text-[10px]">Dashboard</span>
              </button>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Payment <span className="text-steak-gold">Methods</span></h1>
            </div>
            <button
              onClick={handleAddMethod}
              className="flex items-center space-x-3 bg-steak-gold text-steak-black px-8 py-3 rounded-xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(244,164,30,0.2)]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Method</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-steak-charcoal rounded-3xl shadow-2xl overflow-hidden border border-white/5">
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm font-black text-steak-gold uppercase tracking-[0.3em]">All Payment Methods</h2>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-steak-black px-4 py-1.5 rounded-full border border-white/5">
                {paymentMethods.length} Methods Available
              </span>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-20 bg-steak-black/20 rounded-3xl border border-dashed border-white/5">
                <CreditCard className="h-16 w-16 text-gray-700 mx-auto mb-8" />
                <p className="text-gray-600 font-black uppercase tracking-widest text-[10px] mb-8">No payment methods found</p>
                <button
                  onClick={handleAddMethod}
                  className="bg-steak-gold/10 text-steak-gold px-8 py-3 rounded-xl border border-steak-gold/20 hover:bg-steak-gold hover:text-steak-black transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
                >
                  Add First Method
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-steak-black/40 border border-white/5 rounded-3xl hover:border-steak-gold/40 transition-all duration-500 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                      <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-steak-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                          src={method.qr_code_url}
                          alt={`${method.name} QR Code`}
                          className="w-24 h-24 rounded-2xl border-2 border-white/5 object-cover relative z-10 shadow-2xl group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-steak-gold transition-colors">{method.name}</h3>
                          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-full">ID: {method.id}</span>
                        </div>
                        <p className="text-xl font-bold text-steak-gold tracking-tighter mb-1">{method.account_number}</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Account Name: <span className="text-white">{method.account_name}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end space-x-6 mt-6 md:mt-0">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${method.active
                        ? 'bg-steak-gold/10 text-steak-gold border-steak-gold/20'
                        : 'bg-white/5 text-gray-600 border-white/5'
                        }`}>
                        {method.active ? 'Active' : 'Inactive'}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditMethod(method)}
                          className="p-4 bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl border border-white/5 transition-all duration-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteMethod(method.id)}
                          className="p-4 bg-steak-red/5 text-steak-red/40 hover:text-steak-red hover:bg-steak-red/10 rounded-xl border border-steak-red/10 transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodManager;