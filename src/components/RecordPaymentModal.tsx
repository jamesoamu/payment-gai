import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Building2,
  CheckCircle,
  Receipt,
  Sparkles,
  Smartphone,
  Banknote,
  ArrowRight,
} from 'lucide-react';
import { Student, PaymentRecord, InstitutionProfile, AppBillingState } from '../types';
import { formatCurrency } from '../utils/formatters';
import { generatePaystackReference } from '../utils/paystack';

interface RecordPaymentModalProps {
  students: Student[];
  initialStudent?: Student;
  institution: InstitutionProfile;
  billing: AppBillingState;
  onClose: () => void;
  onPaymentSuccess: (payment: PaymentRecord, updatedStudent: Student) => void;
  onLaunchPaystackCheckout?: (params: {
    amount: number;
    email: string;
    studentName: string;
    onSuccess: (reference: string) => void;
  }) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  students,
  initialStudent,
  institution,
  billing,
  onClose,
  onPaymentSuccess,
  onLaunchPaystackCheckout,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const [amount, setAmount] = useState<number>(selectedStudent?.balance || 0);
  const [paymentMethod, setPaymentMethod] = useState<
    'Paystack Online' | 'Bank Transfer' | 'POS Terminal' | 'Cash Deposit'
  >('Paystack Online');
  const [reference, setReference] = useState<string>(generatePaystackReference('PSTK_SCH'));
  const [termOrSession, setTermOrSession] = useState<string>(institution.currentTerm);
  const [notes, setNotes] = useState<string>('');
  const [recordedBy, setRecordedBy] = useState<string>('Bursar Desk (Admin)');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // When student selection changes, update the suggested amount
  useEffect(() => {
    if (selectedStudent) {
      setAmount(selectedStudent.balance > 0 ? selectedStudent.balance : 0);
    }
  }, [selectedStudentId]);

  const handlePaystackParentFlow = () => {
    if (!selectedStudent || amount <= 0) {
      alert('Please select a student and enter a valid payment amount.');
      return;
    }

    if (onLaunchPaystackCheckout) {
      onLaunchPaystackCheckout({
        amount,
        email: selectedStudent.guardianEmail || 'parent@edupay.ng',
        studentName: selectedStudent.fullName,
        onSuccess: (returnedRef) => {
          finalizePayment(returnedRef, 'Paystack Online', 'card');
        },
      });
    } else {
      // Simulate direct instant Paystack authorization
      finalizePayment(reference, 'Paystack Online', 'card');
    }
  };

  const finalizePayment = (
    ref: string,
    method: 'Paystack Online' | 'Bank Transfer' | 'POS Terminal' | 'Cash Deposit',
    channel: 'card' | 'bank_transfer' | 'ussd' | 'cash' | 'pos'
  ) => {
    if (!selectedStudent) return;

    setIsProcessing(true);

    const paidNum = Number(amount);
    const newTotalPaid = selectedStudent.totalPaid + paidNum;
    const newBalance = Math.max(0, selectedStudent.totalBilled - newTotalPaid);
    const newStatus = newBalance <= 0 ? 'paid' : 'partial';

    // Distribute payment across fee items
    let remainingToDistribute = paidNum;
    const updatedFeeItems = selectedStudent.feeItems.map((item) => {
      const itemPending = item.amount - (item.paidAmount || 0);
      if (itemPending <= 0) return item;

      const allocation = Math.min(remainingToDistribute, itemPending);
      remainingToDistribute -= allocation;
      const newPaidAmount = (item.paidAmount || 0) + allocation;

      return {
        ...item,
        paidAmount: newPaidAmount,
        isPaid: newPaidAmount >= item.amount,
      };
    });

    const updatedStudent: Student = {
      ...selectedStudent,
      totalPaid: newTotalPaid,
      balance: newBalance,
      status: newStatus,
      feeItems: updatedFeeItems,
    };

    const newPaymentRecord: PaymentRecord = {
      id: `pay_${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      regNumber: selectedStudent.regNumber,
      className: selectedStudent.className,
      amount: paidNum,
      paymentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      paymentMethod: method,
      channel,
      reference: ref,
      termOrSession,
      verified: true,
      notes: notes || `Settlement recorded for ${selectedStudent.fullName}.`,
      recordedBy,
    };

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(newPaymentRecord, updatedStudent);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    if (amount <= 0) {
      alert('Payment amount must be greater than zero.');
      return;
    }

    if (paymentMethod === 'Paystack Online') {
      handlePaystackParentFlow();
      return;
    }

    let channel: 'bank_transfer' | 'pos' | 'cash' = 'bank_transfer';
    if (paymentMethod === 'POS Terminal') channel = 'pos';
    if (paymentMethod === 'Cash Deposit') channel = 'cash';

    finalizePayment(reference, paymentMethod, channel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Fee Payment</h3>
              <p className="text-xs text-slate-500">Collect via Paystack online or register bank deposits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Student Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Student *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.regNumber}) - {s.className} - Bal: {formatCurrency(s.balance, institution.currencySymbol)}
                </option>
              ))}
            </select>
          </div>

          {/* Student Ledger Quick Context Box */}
          {selectedStudent && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Term Bill:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {formatCurrency(selectedStudent.totalBilled, institution.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Already Settled:</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-700">
                  {formatCurrency(selectedStudent.totalPaid, institution.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                <span className="text-slate-700">Outstanding Pending Balance:</span>
                <span className="font-mono tabular-nums text-rose-700">
                  {formatCurrency(selectedStudent.balance, institution.currencySymbol)}
                </span>
              </div>
            </div>
          )}

          {/* Amount and Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Payment Amount ({institution.currencySymbol}) *</label>
              {selectedStudent && selectedStudent.balance > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAmount(Math.round(selectedStudent.balance / 2))}
                    className="text-[10px] rounded bg-slate-200 px-1.5 py-0.5 text-slate-700 hover:bg-slate-300"
                  >
                    50% Installment
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(selectedStudent.balance)}
                    className="text-[10px] rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700 hover:bg-emerald-200"
                  >
                    Full Balance
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-mono text-xs font-bold text-slate-400">
                {institution.currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 pl-8 pr-4 py-2 font-mono text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Payment Channel / Method *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  paymentMethod === 'Paystack Online'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Paystack Online"
                  checked={paymentMethod === 'Paystack Online'}
                  onChange={() => setPaymentMethod('Paystack Online')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                    Paystack Online
                  </div>
                  <div className="text-[10px] text-slate-500">Card, USSD, Bank App</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                    Direct Bank Transfer
                  </div>
                  <div className="text-[10px] text-slate-500">Direct GTB/Zenith NIP</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  paymentMethod === 'POS Terminal'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="POS Terminal"
                  checked={paymentMethod === 'POS Terminal'}
                  onChange={() => setPaymentMethod('POS Terminal')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    <Smartphone className="h-3.5 w-3.5 text-slate-600" />
                    POS Terminal
                  </div>
                  <div className="text-[10px] text-slate-500">Bursary Card Swipe</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  paymentMethod === 'Cash Deposit'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash Deposit"
                  checked={paymentMethod === 'Cash Deposit'}
                  onChange={() => setPaymentMethod('Cash Deposit')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5 text-amber-600" />
                    Cash Deposit
                  </div>
                  <div className="text-[10px] text-slate-500">Counter receipt</div>
                </div>
              </label>
            </div>
          </div>

          {/* Reference & Term */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Transaction Reference *
              </label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 font-mono text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Academic Term / Session *
              </label>
              <input
                type="text"
                required
                value={termOrSession}
                onChange={(e) => setTermOrSession(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Notes / Bursar Remarks
            </label>
            <input
              type="text"
              placeholder="e.g. Cleared for examination card or WAEC mock"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            {paymentMethod === 'Paystack Online' ? (
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <span>Launch Paystack Checkout</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Confirm & Issue Receipt</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
