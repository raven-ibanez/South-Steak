import React, { useState } from 'react';
import { Upload, Settings, Shield, Globe } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code
      });
      setLogoPreview(siteSettings.site_logo);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let logoUrl = logoPreview;

      // Upload new logo if selected
      if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile);
        logoUrl = uploadedUrl;
      }

      // Update all settings
      await updateSiteSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        currency: formData.currency,
        currency_code: formData.currency_code,
        site_logo: logoUrl
      });

      setIsEditing(false);
      setLogoFile(null);
    } catch (error) {
      console.error('Error saving site settings:', error);
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code
      });
      setLogoPreview(siteSettings.site_logo);
    }
    setIsEditing(false);
    setLogoFile(null);
  };

  if (loading) {
    return (
      <div className="bg-steak-charcoal rounded-3xl shadow-2xl p-10 border border-white/5 animate-pulse">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-steak-black/40 rounded-xl"></div>
          <div className="h-8 bg-steak-black/40 rounded-lg w-1/3"></div>
        </div>
        <div className="space-y-6">
          <div className="h-12 bg-steak-black/40 rounded-2xl w-full"></div>
          <div className="h-12 bg-steak-black/40 rounded-2xl w-full"></div>
          <div className="h-32 bg-steak-black/40 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-steak-charcoal rounded-3xl shadow-2xl overflow-hidden border border-white/5">
      <div className="p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-steak-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(244,164,30,0.2)]">
              <Settings className="h-6 w-6 text-steak-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Site <span className="text-steak-gold">Settings</span></h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">General site configuration</p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-steak-gold text-steak-black rounded-xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(244,164,30,0.2)]"
            >
              Edit Settings
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="px-8 py-3 bg-steak-gold text-steak-black rounded-xl hover:bg-white transition-all duration-300 font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(244,164,30,0.2)] disabled:opacity-50"
              >
                {uploading ? 'Finalizing...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-10">
          {/* Site Logo */}
          <div className="flex flex-col md:flex-row md:items-center gap-8 p-8 bg-steak-black/40 rounded-3xl border border-white/5">
            <div className="relative group">
              <div className="absolute inset-0 bg-steak-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-steak-black border-2 border-white/5 flex items-center justify-center relative z-10 shadow-2xl">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Site Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl">☕</div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-[10px] font-black text-steak-gold uppercase tracking-[0.3em] mb-2">Site Logo</h3>
              <p className="text-sm text-gray-500 mb-6 uppercase font-bold">The primary brand identity displayed across the site.</p>

              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/5 text-white hover:bg-white/10 rounded-xl border border-white/5 transition-all duration-300 font-black uppercase tracking-widest text-[10px] cursor-pointer"
                  >
                    <Upload className="h-4 w-4 text-steak-gold" />
                    <span>Upload New Logo</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Site Name */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Site Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="site_name"
                  value={formData.site_name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                  placeholder="Enter site name"
                />
              ) : (
                <div className="px-6 py-4 bg-steak-black/20 rounded-2xl border border-white/5">
                  <p className="text-2xl font-black text-white tracking-tighter uppercase">{siteSettings?.site_name}</p>
                </div>
              )}
            </div>

            {/* Site Description */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3">
                Site Description
              </label>
              {isEditing ? (
                <textarea
                  name="site_description"
                  value={formData.site_description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight resize-none"
                  placeholder="Enter site description"
                />
              ) : (
                <div className="px-6 py-4 bg-steak-black/20 rounded-2xl border border-white/5">
                  <p className="text-gray-400 font-bold leading-relaxed">{siteSettings?.site_description}</p>
                </div>
              )}
            </div>

            {/* Currency Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3 flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  Currency Symbol
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                    placeholder="e.g., ₱, $, €"
                  />
                ) : (
                  <div className="px-6 py-4 bg-steak-black/20 rounded-2xl border border-white/5">
                    <p className="text-xl font-black text-steak-gold">{siteSettings?.currency}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-3">
                  Currency Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="currency_code"
                    value={formData.currency_code}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-steak-black/60 border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-steak-gold outline-none font-bold tracking-tight"
                    placeholder="e.g., PHP, USD, EUR"
                  />
                ) : (
                  <div className="px-6 py-4 bg-steak-black/20 rounded-2xl border border-white/5">
                    <p className="text-xl font-black text-white tracking-widest">{siteSettings?.currency_code}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
