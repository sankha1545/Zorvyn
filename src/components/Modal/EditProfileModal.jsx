import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';
import { getCountries, getStatesByCountry, getDialCode, getCountryCodeByName } from '../../utils/countriesAPI';

export default function EditProfileModal({ isOpen, onClose }) {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const [formData, setFormData] = useState(profile);
  const [countries] = useState(getCountries());
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (formData.countryCode) {
      setStates(getStatesByCountry(formData.countryCode));
    }
  }, [formData.countryCode]);

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const country = countries.find(c => c.name === countryName);
    
    if (country) {
      setFormData(prev => ({
        ...prev,
        country: countryName,
        countryCode: country.code,
        dialCode: country.dialCode,
        state: '', // Reset state when country changes
      }));
      setStates(getStatesByCountry(country.code));
    }
  };

  const handleStateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      state: e.target.value,
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-20 sm:pt-0 px-4 sm:px-0 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg sm:max-w-2xl rounded-2xl shadow-2xl my-auto max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-100px)] flex flex-col"
        style={{ backgroundColor: 'var(--bg-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Edit Profile
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Update your personal information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-opacity-10 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleFieldChange}
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFieldChange}
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFieldChange}
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>

            {/* Currency */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleFieldChange}
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              >
                <option value="USD" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>USD - US Dollar</option>
                <option value="EUR" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>EUR - Euro</option>
                <option value="GBP" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>GBP - British Pound</option>
                <option value="JPY" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>JPY - Japanese Yen</option>
                <option value="INR" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>INR - Indian Rupee</option>
                <option value="AUD" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>AUD - Australian Dollar</option>
                <option value="CAD" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>CAD - Canadian Dollar</option>
              </select>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Country
              </label>
              <select
                value={formData.country}
                onChange={handleCountryChange}
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              >
                <option value="" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Select Country</option>
                {countries.map((country) => (
                  <option 
                    key={country.code}
                    value={country.name}
                    style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                  >
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            {states.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  State/Province
                </label>
                <select
                  value={formData.state}
                  onChange={handleStateChange}
                  className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-input)',
                    borderWidth: '1px',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
                >
                  <option value="" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Select State</option>
                  {states.map((state) => (
                    <option 
                      key={state}
                      value={state}
                      style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dial Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Dial Code
              </label>
              <input
                type="text"
                name="dialCode"
                value={formData.dialCode}
                readOnly
                className="rounded-xl px-3 py-2 text-sm outline-none opacity-60"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t shrink-0"
        >
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-primary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
