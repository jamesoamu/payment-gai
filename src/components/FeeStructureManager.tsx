import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  FileCheck,
  CheckCircle2,
  Building,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { FeeItem, InstitutionProfile, Student } from '../types';
import { formatCurrency } from '../utils/formatters';

interface FeeStructureManagerProps {
  feeCatalog: FeeItem[];
  institution: InstitutionProfile;
  students: Student[];
  onUpdateFeeCatalog: (newCatalog: FeeItem[]) => void;
  onBulkGenerateInvoices: (selectedFeeIds: string[], targetClass: string) => void;
}

export const FeeStructureManager: React.FC<FeeStructureManagerProps> = ({
  feeCatalog,
  institution,
  students,
  onUpdateFeeCatalog,
  onBulkGenerateInvoices,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState<number>(20000);
  const [newFeeCategory, setNewFeeCategory] = useState<FeeItem['category']>('Tuition');
  const [isMandatory, setIsMandatory] = useState<boolean>(true);

  // Bulk Invoicing Tool State
  const [targetClass, setTargetClass] = useState<string>('all');
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>(
    feeCatalog.map((f) => f.id)
  );
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null);

  const uniqueClasses = Array.from(new Set(students.map((s) => s.className))).sort();

  const handleAddFeeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeName || newFeeAmount <= 0) return;

    const newItem: FeeItem = {
      id: `fee_${Date.now()}`,
      name: newFeeName,
      amount: newFeeAmount,
      category: newFeeCategory,
      isMandatory,
    };

    onUpdateFeeCatalog([...feeCatalog, newItem]);
    setNewFeeName('');
    setNewFeeAmount(20000);
    setIsAddModalOpen(false);
  };

  const handleDeleteFeeItem = (id: string) => {
    if (confirm('Are you sure you want to remove this fee item?')) {
      onUpdateFeeCatalog(feeCatalog.filter((f) => f.id !== id));
    }
  };

  const handleExecuteBulkInvoice = () => {
    if (selectedFeeIds.length === 0) {
      alert('Please select at least one fee component.');
      return;
    }

    onBulkGenerateInvoices(selectedFeeIds, targetClass);
    const affectedCount = targetClass === 'all'
      ? students.length
      : students.filter((s) => s.className === targetClass).length;

    setBulkSuccessMessage(
      `Successfully generated official fee invoices for ${affectedCount} students in ${targetClass === 'all' ? 'all classes' : targetClass}.`
    );

    setTimeout(() => {
      setBulkSuccessMessage(null);
    }, 4500);
  };

  const totalMandatoryFees = feeCatalog
    .filter((f) => f.isMandatory)
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Fee Structure & Term Invoicing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure standard tuition items, WAEC/JAMB exam fees, and generate class-wide term invoices.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Fee Component
        </button>
      </div>

      {/* Standard Fee Catalog Grid */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Standard Term Fee Catalog</h2>
            <p className="text-xs text-slate-500">
              Active fee components assessed for {institution.currentTerm}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Mandatory Term Fee</span>
            <div className="text-base font-bold font-mono text-emerald-700 tabular-nums">
              {formatCurrency(totalMandatoryFees, institution.currencySymbol)}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Fee Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Applicability</th>
                <th className="py-3 px-4 text-right">Standard Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeCatalog.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.isMandatory ? (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Mandatory for all students
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        Optional / Specific classes
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {formatCurrency(item.amount, institution.currencySymbol)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDeleteFeeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                      title="Delete fee item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Term Invoicing Generator Box */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Bulk Term Invoicing Generator
          </h2>
          <p className="text-xs text-slate-500">
            Issue automated term invoices across an entire cohort or class with pre-configured fee items.
          </p>
        </div>

        {bulkSuccessMessage && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{bulkSuccessMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Target Student Cohort / Class *
            </label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Enrolled Students ({students.length} students)</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls} ({students.filter((s) => s.className === cls).length} students)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Fee Items to Include in Invoice:
            </label>
            <div className="space-y-1.5 rounded-lg border border-slate-200 p-2.5 max-h-36 overflow-y-auto bg-slate-50">
              {feeCatalog.map((f) => {
                const isSelected = selectedFeeIds.includes(f.id);
                return (
                  <label key={f.id} className="flex items-center justify-between text-xs cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeeIds([...selectedFeeIds, f.id]);
                          } else {
                            setSelectedFeeIds(selectedFeeIds.filter((id) => id !== f.id));
                          }
                        }}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-800 font-medium">{f.name}</span>
                    </div>
                    <span className="font-mono tabular-nums text-slate-600">
                      {formatCurrency(f.amount, institution.currencySymbol)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Selected Total: <span className="font-mono font-bold text-slate-900">
              {formatCurrency(
                feeCatalog
                  .filter((f) => selectedFeeIds.includes(f.id))
                  .reduce((sum, f) => sum + f.amount, 0),
                institution.currencySymbol
              )}
            </span> per candidate
          </div>

          <button
            onClick={handleExecuteBulkInvoice}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Generate &amp; Apply Invoices</span>
          </button>
        </div>
      </div>

      {/* Add Fee Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Fee Component</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddFeeItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Laboratory Practicals"
                  value={newFeeName}
                  onChange={(e) => setNewFeeName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard Amount ({institution.currencySymbol}) *</label>
                <input
                  type="number"
                  required
                  min="500"
                  value={newFeeAmount}
                  onChange={(e) => setNewFeeAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newFeeCategory}
                  onChange={(e) => setNewFeeCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Tuition">Tuition</option>
                  <option value="Exam / Certification">Exam / Certification</option>
                  <option value="Tech / Lab Fee">Tech / Lab Fee</option>
                  <option value="Materials & Books">Materials & Books</option>
                  <option value="PTA / Facilities">PTA / Facilities</option>
                  <option value="Coaching / Workshops">Coaching / Workshops</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 pt-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={isMandatory}
                    onChange={(e) => setIsMandatory(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mandatory for all students by default</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
