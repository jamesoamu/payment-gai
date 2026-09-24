import React, { useState } from 'react';
import {
  X,
  School,
  Building,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { InstitutionProfile } from '../types';

interface InstitutionSettingsModalProps {
  institution: InstitutionProfile;
  onClose: () => void;
  onSave: (updated: InstitutionProfile) => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const InstitutionSettingsModal: React.FC<InstitutionSettingsModalProps> = ({
  institution,
  onClose,
  onSave,
  onResetData,
  onExportData,
}) => {
  const [formData, setFormData] = useState<InstitutionProfile>({ ...institution });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 700);
  };

  const handleCurrencyChange = (curr: string) => {
    let sym = '₦';
    if (curr === 'USD') sym = '$';
    if (curr === 'GHS') sym = 'GH₵';
    if (curr === 'KES') sym = 'KSh';
    if (curr === 'GBP') sym = '£';

    setFormData({
      ...formData,
      currency: curr,
      currencySymbol: sym,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Institution & Bursary Profile</h3>
              <p className="text-xs text-slate-500">Configure receipt letterhead, bank details and currency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {savedMessage && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Settings saved successfully!
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Institution Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-500 focus:outline-none"
              >
                <option value="school">K-12 Primary / Secondary School</option>
                <option value="tutorial_center">JAMB / WAEC Tutorial Center</option>
                <option value="training_academy">Vocational / Tech Training Academy</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-500 focus:outline-none"
              >
                <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="GHS">GHS (GH₵ - Ghanaian Cedi)</option>
                <option value="KES">KES (KSh - Kenyan Shilling)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Current Academic Term / Session</label>
              <input
                type="text"
                value={formData.currentTerm}
                onChange={(e) => setFormData({ ...formData, currentTerm: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Official Bank Account for Parent Transfers */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
              Bank Wire Transfer Details (Printed on Invoices & Reminders)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. GTBank"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Account Number (10 digits)</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-slate-600 mb-1">Official Account Name</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Bursar Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Bursar Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Campus Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Backup & Data Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onExportData}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Backup Database (JSON)</span>
            </button>

            <button
              type="button"
              onClick={onResetData}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Sample Ledger</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
