import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Coffee, TrendingUp, Package, Users, Lock, FolderOpen, CreditCard, Settings, LogOut, Layers } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';
import { addOnCategories } from '../data/menuData';
import { useMenu } from '../hooks/useMenu';
import { useCategories, Category } from '../hooks/useCategories';
import ImageUpload from './ImageUpload';
import CategoryManager from './CategoryManager';
import PaymentMethodManager from './PaymentMethodManager';
import SiteSettingsManager from './SiteSettingsManager';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('beracah_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const { categories } = useCategories();
  const [currentView, setCurrentView] = useState<'dashboard' | 'items' | 'add' | 'edit' | 'categories' | 'payments' | 'settings'>('dashboard');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    basePrice: 0,
    category: 'hot-coffee',
    popular: false,
    available: true,
    variations: [],
    addOns: []
  });

  const handleAddItem = () => {
    setCurrentView('add');
    const defaultCategory = categories.length > 0 ? categories[0].id : 'dim-sum';
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      category: defaultCategory,
      popular: false,
      available: true,
      variations: [],
      addOns: []
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setCurrentView('edit');
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        setIsProcessing(true);
        await deleteMenuItem(id);
      } catch (error) {
        alert('Failed to delete item. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveItem = async () => {
    if (!formData.name || !formData.description || !formData.basePrice) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await addMenuItem(formData as Omit<MenuItem, 'id'>);
      }
      setCurrentView('items');
      setEditingItem(null);
    } catch (error) {
      alert('Failed to save item');
    }
  };

  const handleCancel = () => {
    setCurrentView(currentView === 'add' || currentView === 'edit' ? 'items' : 'dashboard');
    setEditingItem(null);
    setSelectedItems([]);
  };

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to delete');
      return;
    }

    const itemNames = selectedItems.map(id => {
      const item = menuItems.find(i => i.id === id);
      return item ? item.name : 'Unknown Item';
    }).slice(0, 5); // Show first 5 items

    const displayNames = itemNames.join(', ');
    const moreItems = selectedItems.length > 5 ? ` and ${selectedItems.length - 5} more items` : '';

    if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?\n\nItems to delete: ${displayNames}${moreItems}\n\nThis action cannot be undone.`)) {
      try {
        setIsProcessing(true);
        // Delete items one by one
        for (const itemId of selectedItems) {
          await deleteMenuItem(itemId);
        }
        setSelectedItems([]);
        setShowBulkActions(false);
        alert(`Successfully deleted ${selectedItems.length} item(s).`);
      } catch (error) {
        alert('Failed to delete some items. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  const handleBulkCategoryChange = async (newCategoryId: string) => {
    if (selectedItems.length === 0) {
      alert('Please select items to update');
      return;
    }

    const categoryName = categories.find(cat => cat.id === newCategoryId)?.name;
    if (confirm(`Are you sure you want to change the category of ${selectedItems.length} item(s) to "${categoryName}"?`)) {
      try {
        setIsProcessing(true);
        // Update category for each selected item
        for (const itemId of selectedItems) {
          const item = menuItems.find(i => i.id === itemId);
          if (item) {
            await updateMenuItem(itemId, { ...item, category: newCategoryId });
          }
        }
        setSelectedItems([]);
        setShowBulkActions(false);
        alert(`Successfully updated category for ${selectedItems.length} item(s)`);
      } catch (error) {
        alert('Failed to update some items');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === menuItems.length) {
      setSelectedItems([]);
      setShowBulkActions(false);
    } else {
      setSelectedItems(menuItems.map(item => item.id));
      setShowBulkActions(true);
    }
  };

  // Update bulk actions visibility when selection changes
  React.useEffect(() => {
    setShowBulkActions(selectedItems.length > 0);
  }, [selectedItems]);

  const addVariation = () => {
    const newVariation: Variation = {
      id: `var-${Date.now()}`,
      name: '',
      price: 0
    };
    setFormData({
      ...formData,
      variations: [...(formData.variations || []), newVariation]
    });
  };

  const updateVariation = (index: number, field: keyof Variation, value: string | number) => {
    const updatedVariations = [...(formData.variations || [])];
    updatedVariations[index] = { ...updatedVariations[index], [field]: value };
    setFormData({ ...formData, variations: updatedVariations });
  };

  const removeVariation = (index: number) => {
    const updatedVariations = formData.variations?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, variations: updatedVariations });
  };

  const addAddOn = () => {
    const newAddOn: AddOn = {
      id: `addon-${Date.now()}`,
      name: '',
      price: 0,
      category: 'extras'
    };
    setFormData({
      ...formData,
      addOns: [...(formData.addOns || []), newAddOn]
    });
  };

  const updateAddOn = (index: number, field: keyof AddOn, value: string | number) => {
    const updatedAddOns = [...(formData.addOns || [])];
    updatedAddOns[index] = { ...updatedAddOns[index], [field]: value };
    setFormData({ ...formData, addOns: updatedAddOns });
  };

  const removeAddOn = (index: number) => {
    const updatedAddOns = formData.addOns?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, addOns: updatedAddOns });
  };

  // Dashboard Stats
  const totalItems = menuItems.length;
  const popularItems = menuItems.filter(item => item.popular).length;
  const availableItems = menuItems.filter(item => item.available).length;
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: menuItems.filter(item => item.category === cat.id).length
  }));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SouthSteak@Admin!2025') {
      setIsAuthenticated(true);
      localStorage.setItem('beracah_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('beracah_admin_auth');
    setPassword('');
    setCurrentView('dashboard');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-steak-black flex items-center justify-center p-4">
        <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-8 w-full max-w-md border border-steak-gold/10 ring-1 ring-white/5">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-steak-black/40 rounded-full flex items-center justify-center mb-6 border border-white/5 ring-1 ring-white/5">
              <Lock className="h-10 w-10 text-steak-gold opacity-80" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin <span className="text-steak-gold">Login</span></h1>
            <p className="text-gray-500 mt-2 text-xs font-black uppercase tracking-[0.2em]">Please log in to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-widest placeholder-white/10"
                placeholder="••••••••••••"
                required
              />
              {loginError && (
                <p className="text-steak-red text-[10px] font-black uppercase tracking-widest mt-3 text-center">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-steak-gold text-steak-black py-5 rounded-2xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(244,164,30,0.2)]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-steak-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-steak-gold mx-auto mb-6"></div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Accessing Vault...</p>
        </div>
      </div>
    );
  }

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
                  {currentView === 'add' ? 'Add New' : 'Edit'} <span className="text-steak-gold">Item</span>
                </h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center space-x-2 font-black uppercase tracking-widest text-[10px]"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveItem}
                  className="px-6 py-3 bg-steak-gold text-steak-black rounded-xl hover:bg-white transition-all duration-300 flex items-center space-x-2 font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(244,164,30,0.2)]"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-8 border border-steak-gold/10 ring-1 ring-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Item Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight placeholder-white/10"
                  placeholder="E.G., TOMAHAWK SPECIAL"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Base Price (₱) *</label>
                <input
                  type="number"
                  value={formData.basePrice || ''}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight placeholder-white/10"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Category *</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-steak-charcoal">{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-center space-y-4 pt-4">
                <label className="group flex items-center space-x-4 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.popular || false}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData.popular ? 'bg-steak-gold' : 'bg-steak-black/60'}`} />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.popular ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">Mark as Popular</span>
                </label>

                <label className="group flex items-center space-x-4 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.available ?? true}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData.available ?? true ? 'bg-steak-gold' : 'bg-steak-black/60'}`} />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.available ?? true ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">Available</span>
                </label>
              </div>
            </div>

            {/* Discount Pricing Section */}
            <div className="mb-10 p-6 bg-steak-black/40 rounded-2xl border border-steak-gold/10">
              <h3 className="text-sm font-black text-steak-gold mb-6 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Discount Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Discount Price (₱)</label>
                  <input
                    type="number"
                    value={formData.discountPrice || ''}
                    onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) || undefined })}
                    className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight placeholder-white/10"
                    placeholder="E.G., 999"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <label className="group flex items-center space-x-4 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.discountActive || false}
                        onChange={(e) => setFormData({ ...formData, discountActive: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData.discountActive ? 'bg-steak-gold' : 'bg-steak-black/60'}`} />
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.discountActive ? 'translate-x-6' : ''}`} />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">Activate Discount</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Discount Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.discountStartDate || ''}
                    onChange={(e) => setFormData({ ...formData, discountStartDate: e.target.value || undefined })}
                    className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Discount End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.discountEndDate || ''}
                    onChange={(e) => setFormData({ ...formData, discountEndDate: e.target.value || undefined })}
                    className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-4 uppercase font-bold tracking-widest opacity-50">
                Temporal overrides only execute when active and within designated chronological windows.
              </p>
            </div>

            <div className="mb-10 space-y-3">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Description *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight placeholder-white/10 min-h-[120px]"
                placeholder="DESCRIBE THE TEXTURE, AGING PROCESS, OR UNIQUE FLAVOR PROFILE..."
                rows={3}
              />
            </div>

            <div className="mb-8">
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
              />
            </div>

            {/* Variations Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-steak-gold uppercase tracking-widest flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Item Variations
                </h3>
                <button
                  onClick={addVariation}
                  className="flex items-center space-x-2 px-4 py-2 bg-steak-gold/10 text-steak-gold rounded-lg hover:bg-steak-gold hover:text-steak-black transition-all duration-300 font-black uppercase tracking-widest text-[10px] border border-steak-gold/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Variation</span>
                </button>
              </div>

              {formData.variations?.map((variation, index) => (
                <div key={variation.id} className="flex items-center space-x-4 mb-4 p-4 bg-steak-black/40 rounded-2xl border border-white/5 group">
                  <input
                    type="text"
                    value={variation.name}
                    onChange={(e) => updateVariation(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-3 bg-steak-black/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-steak-gold outline-none font-bold text-sm"
                    placeholder="e.g., 500g, WHOLE SLAB"
                  />
                  <input
                    type="number"
                    value={variation.price}
                    onChange={(e) => updateVariation(index, 'price', Number(e.target.value))}
                    className="w-28 px-4 py-3 bg-steak-black/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-steak-gold outline-none font-bold text-sm"
                    placeholder="₱"
                  />
                  <button
                    onClick={() => removeVariation(index)}
                    className="p-3 text-steak-red/40 hover:text-steak-red hover:bg-steak-red/10 rounded-xl transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add-ons Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-steak-gold uppercase tracking-widest flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add-ons</span>
                </h3>
                <button
                  onClick={addAddOn}
                  className="flex items-center space-x-2 px-4 py-2 bg-steak-gold/10 text-steak-gold rounded-lg hover:bg-steak-gold hover:text-steak-black transition-all duration-300 font-black uppercase tracking-widest text-[10px] border border-steak-gold/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Add-on</span>
                </button>
              </div>

              {formData.addOns?.map((addOn, index) => (
                <div key={addOn.id} className="flex items-center space-x-4 mb-4 p-4 bg-steak-black/40 rounded-2xl border border-white/5 group">
                  <input
                    type="text"
                    value={addOn.name}
                    onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-3 bg-steak-black/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-steak-gold outline-none font-bold text-sm"
                    placeholder="Add-on designation"
                  />
                  <select
                    value={addOn.category}
                    onChange={(e) => updateAddOn(index, 'category', e.target.value)}
                    className="px-4 py-3 bg-steak-black/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-steak-gold outline-none font-bold text-sm appearance-none cursor-pointer"
                  >
                    {addOnCategories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-steak-charcoal">{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={addOn.price}
                    onChange={(e) => updateAddOn(index, 'price', Number(e.target.value))}
                    className="w-28 px-4 py-3 bg-steak-black/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-steak-gold outline-none font-bold text-sm"
                    placeholder="₱"
                  />
                  <button
                    onClick={() => removeAddOn(index)}
                    className="p-3 text-steak-red/40 hover:text-steak-red hover:bg-steak-red/10 rounded-xl transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Items List View
  if (currentView === 'items') {
    return (
      <div className="min-h-screen bg-steak-black">
        <div className="bg-steak-charcoal shadow-2xl border-b border-white/5 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-3 text-gray-500 hover:text-white transition-all duration-300 group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Dashboard</span>
                </button>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Menu <span className="text-steak-gold">Items</span></h1>
              </div>
              <div className="flex items-center space-x-4">
                {showBulkActions && (
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {selectedItems.length} Selection(s)
                    </span>
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="flex items-center space-x-2 bg-blue-600/10 text-blue-500 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
                    >
                      <span>Operations</span>
                    </button>
                  </div>
                )}
                <button
                  onClick={handleAddItem}
                  className="flex items-center space-x-2 bg-steak-gold text-steak-black px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(244,164,30,0.2)]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Bulk Actions Panel */}
          {showBulkActions && selectedItems.length > 0 && (
            <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-8 mb-10 border border-blue-500/20 ring-1 ring-blue-500/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-sm font-black text-white mb-1 uppercase tracking-widest">Bulk Change</h3>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{selectedItems.length} ITEMS SELECTED</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Change Category */}
                  <div className="flex items-center space-x-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Category:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkCategoryChange(e.target.value);
                          e.target.value = ''; // Reset selection
                        }
                      }}
                      className="px-4 py-2 bg-steak-black/60 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-blue-500 outline-none text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer"
                      disabled={isProcessing}
                    >
                      <option value="" className="bg-steak-charcoal">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-steak-charcoal">{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Items */}
                  <button
                    onClick={handleBulkRemove}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 bg-steak-red/10 text-steak-red px-6 py-2 rounded-xl border border-steak-red/20 hover:bg-steak-red hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-widest text-[10px]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isProcessing ? 'Deleting...' : 'Delete Selected'}</span>
                  </button>

                  {/* Clear Selection */}
                  <button
                    onClick={() => {
                      setSelectedItems([]);
                      setShowBulkActions(false);
                    }}
                    className="flex items-center space-x-2 bg-gray-500/10 text-gray-400 px-6 py-2 rounded-xl border border-white/10 hover:bg-gray-500 hover:text-white transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Selection</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-steak-charcoal rounded-3xl shadow-2xl overflow-hidden border border-steak-gold/10 ring-1 ring-white/5">
            {/* Bulk Actions Bar */}
            {menuItems.length > 0 && (
              <div className="bg-steak-black/40 border-b border-white/5 px-8 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === menuItems.length && menuItems.length > 0}
                          onChange={handleSelectAll}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${selectedItems.length === menuItems.length ? 'bg-steak-gold border-steak-gold' : 'bg-steak-black/60 border-white/10 group-hover:border-steak-gold/40'}`}>
                          {selectedItems.length === menuItems.length && <Plus className="h-4 w-4 text-steak-black" />}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                        Select All ({menuItems.length} items)
                      </span>
                    </label>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-black text-steak-gold uppercase tracking-widest">
                        {selectedItems.length} ITEMS SELECTED
                      </span>
                      <button
                        onClick={() => setSelectedItems([])}
                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors duration-200"
                      >
                        Clear Selection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-steak-black/60 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Select
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Designation</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Classification</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Valuation</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Nodes</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors duration-300 group">
                      <td className="px-8 py-6">
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${selectedItems.includes(item.id) ? 'bg-blue-600 border-blue-600' : 'bg-steak-black/60 border-white/10 group-hover:border-blue-500/40'}`}>
                            {selectedItems.includes(item.id) && <Plus className="h-3 w-3 text-white" />}
                          </div>
                        </label>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <div className="text-sm font-black text-white uppercase tracking-tight mb-1 group-hover:text-steak-gold transition-colors">{item.name}</div>
                          <div className="text-[10px] text-gray-500 font-medium uppercase tracking-widest truncate max-w-[200px]">{item.description}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">
                          {categories.find(cat => cat.id === item.category)?.name}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          {item.isOnDiscount && item.discountPrice ? (
                            <>
                              <span className="text-sm font-black text-steak-red tracking-tight">₱{item.discountPrice}</span>
                              <span className="text-[10px] text-gray-500 line-through font-bold opacity-50">₱{item.basePrice}</span>
                            </>
                          ) : (
                            <span className="text-sm font-black text-steak-gold tracking-tight">₱{item.basePrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col space-y-1">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.variations?.length || 0} Variations</span>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.addOns?.length || 0} Add-ons</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col space-y-2">
                          {item.popular && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black bg-steak-red text-white uppercase tracking-widest w-fit">
                              Popular
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest w-fit ${item.available
                            ? 'bg-steak-gold/10 text-steak-gold border border-steak-gold/20'
                            : 'bg-white/5 text-gray-600 border border-white/5'
                            }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleEditItem(item)}
                            disabled={isProcessing}
                            className="p-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl border border-white/5 transition-all duration-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isProcessing}
                            className="p-3 bg-steak-red/5 text-steak-red/40 hover:text-steak-red hover:bg-steak-red/10 rounded-xl border border-steak-red/10 transition-all duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-white/5">
              {menuItems.map((item) => (
                <div key={item.id} className="p-8 hover:bg-white/[0.02] transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all duration-300 ${selectedItems.includes(item.id) ? 'bg-blue-600 border-blue-600' : 'bg-steak-black/60 border-white/10'}`}>
                          {selectedItems.includes(item.id) && <Plus className="h-4 w-4 text-white" />}
                        </div>
                      </label>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight mb-2">{item.name}</div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">
                          {categories.find(cat => cat.id === item.category)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {item.isOnDiscount && item.discountPrice ? (
                        <>
                          <span className="text-sm font-black text-steak-red tracking-tight">₱{item.discountPrice}</span>
                          <span className="text-[10px] text-gray-500 line-through font-bold opacity-50">₱{item.basePrice}</span>
                        </>
                      ) : (
                        <span className="text-sm font-black text-steak-gold tracking-tight">₱{item.basePrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <div className="flex space-x-3">
                      {item.popular && (
                        <span className="inline-flex items-center px-4 py-1 rounded text-[8px] font-black bg-steak-red text-white uppercase tracking-widest">
                          Popular
                        </span>
                      )}
                      <span className={`inline-flex items-center px-4 py-1 rounded text-[8px] font-black uppercase tracking-widest ${item.available
                        ? 'bg-steak-gold/10 text-steak-gold border border-steak-gold/20'
                        : 'bg-white/5 text-gray-600 border border-white/5'
                        }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-4 bg-white/5 text-gray-400 rounded-2xl border border-white/5 hover:text-white transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-4 bg-steak-red/5 text-steak-red/40 rounded-2xl border border-steak-red/10 hover:text-steak-red transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Categories View
  if (currentView === 'categories') {
    return <CategoryManager onBack={() => setCurrentView('dashboard')} />;
  }

  // Payment Methods View
  if (currentView === 'payments') {
    return <PaymentMethodManager onBack={() => setCurrentView('dashboard')} />;
  }

  // Site Settings View
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-steak-black">
        <div className="bg-steak-charcoal shadow-2xl border-b border-white/5 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-3 text-gray-500 hover:text-white transition-all duration-300 group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Dashboard</span>
                </button>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Site <span className="text-steak-gold">Settings</span></h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <SiteSettingsManager />
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-steak-black">
      <div className="bg-steak-charcoal shadow-2xl border-b border-white/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-steak-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(244,164,30,0.3)]">
                <Coffee className="h-6 w-6 text-steak-black" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Admin <span className="text-steak-gold">Dashboard</span></h1>
            </div>
            <div className="flex items-center space-x-8">
              <a
                href="/"
                className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors duration-300 hidden md:block"
              >
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-gray-500 hover:text-steak-red transition-all duration-300 font-black uppercase tracking-widest text-[10px] group"
              >
                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-steak-charcoal p-8 rounded-3xl shadow-2xl border border-steak-gold/10 hover:border-steak-gold/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-steak-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-4 bg-steak-gold/10 text-steak-gold rounded-2xl border border-steak-gold/20 group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 relative z-10">Total Items</h3>
            <p className="text-4xl font-black text-white tracking-tighter group-hover:text-steak-gold transition-colors relative z-10">{totalItems}</p>
          </div>

          <div className="bg-steak-charcoal p-8 rounded-3xl shadow-2xl border border-steak-gold/10 hover:border-steak-gold/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl border border-green-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 relative z-10">Available Items</h3>
            <p className="text-4xl font-black text-white tracking-tighter group-hover:text-green-500 transition-colors relative z-10">{availableItems}</p>
          </div>

          <div className="bg-steak-charcoal p-8 rounded-3xl shadow-2xl border border-steak-gold/10 hover:border-steak-gold/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-steak-red/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-4 bg-steak-red/10 text-steak-red rounded-2xl border border-steak-red/20 group-hover:scale-110 transition-transform">
                <Coffee className="h-8 w-8" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 relative z-10">Popular Items</h3>
            <p className="text-4xl font-black text-white tracking-tighter group-hover:text-steak-red transition-colors relative z-10">{popularItems}</p>
          </div>

          <div className="bg-steak-charcoal p-8 rounded-3xl shadow-2xl border border-steak-gold/10 hover:border-steak-gold/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 relative z-10">System Status</h3>
            <p className="text-4xl font-black text-white tracking-tighter group-hover:text-blue-500 transition-colors relative z-10">ACTIVE</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-10 border border-steak-gold/10 ring-1 ring-white/5">
            <h3 className="text-sm font-black text-steak-gold mb-8 uppercase tracking-widest flex items-center gap-3">
              <Settings className="h-5 w-5" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleAddItem}
                className="w-full flex items-center justify-between p-6 bg-steak-black/40 hover:bg-steak-gold hover:text-steak-black rounded-2xl border border-white/5 transition-all duration-500 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-steak-gold/10 rounded-xl group-hover:bg-white/10">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Add New Item</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
              </button>

              <button
                onClick={() => setCurrentView('items')}
                className="w-full flex items-center justify-between p-6 bg-steak-black/40 hover:bg-white/5 rounded-2xl border border-white/5 transition-all duration-500 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Package className="h-6 w-6" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Menu Items</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
              </button>

              <button
                onClick={() => setCurrentView('categories')}
                className="w-full flex items-center justify-between p-6 bg-steak-black/40 hover:bg-white/5 rounded-2xl border border-white/5 transition-all duration-500 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Categories</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
              </button>

              <button
                onClick={() => setCurrentView('payments')}
                className="w-full flex items-center justify-between p-6 bg-steak-black/40 hover:bg-white/5 rounded-2xl border border-white/5 transition-all duration-500 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Payment Methods</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
              </button>

              <button
                onClick={() => setCurrentView('settings')}
                className="w-full flex items-center justify-between p-6 bg-steak-black/40 hover:bg-white/5 rounded-2xl border border-white/5 transition-all duration-500 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Settings className="h-6 w-6" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Site Settings</span>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>

          <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-10 border border-steak-gold/10 ring-1 ring-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-steak-gold/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            <h3 className="text-sm font-black text-steak-gold mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <Layers className="h-5 w-5" />
              Category Overview
            </h3>
            <div className="space-y-6 relative z-10">
              {categoryCounts.map((category) => (
                <div key={category.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-steak-black/60 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest block mb-1">{category.name}</span>
                      <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-steak-gold rounded-full transition-all duration-1000"
                          style={{ width: `${(category.count / totalItems) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-steak-gold block">{category.count}</span>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Metadata Nodes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;