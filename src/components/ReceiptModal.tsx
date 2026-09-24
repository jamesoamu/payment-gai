import React from 'react';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Building,
  QrCode,
  Download,
} from 'lucide-react';
import { PaymentRecord, InstitutionProfile, Student } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';

interface ReceiptModalProps {
  payment: PaymentRecord;
  student?: Student;
  institution: InstitutionProfile;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  student,
  institution,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*OFFICIAL FEE RECEIPT - ${institution.name.toUpperCase()}*\n\n` +
      `*Receipt No:* ${payment.receiptNumber}\n` +
      `*Student:* ${payment.studentName} (${payment.regNumber})\n` +
      `*Class:* ${payment.className}\n` +
      `*Amount Paid:* ${formatCurrency(payment.amount, institution.currencySymbol)}\n` +
      `*Method:* ${payment.paymentMethod} (${payment.reference})\n` +
      `*Date:* ${payment.paymentDate}\n` +
      `*Status:* Confirmed & Audited\n\n` +
      `Thank you for your prompt payment!`;

    const phone = student?.guardianPhone ? student.guardianPhone.replace(/\D/g, '') : '';
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden print-card">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">Official Electronic Fee Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Share via WhatsApp to Parent"
            >
              <Share2 className="h-3.5 w-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Canvas */}
        <div className="p-8 space-y-6 bg-white text-slate-900 text-xs">
          {/* Header with Institution Crest and Details */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-0.5 shadow-xs">
                {institution.logoUrl ? (
                  <img
                    src={institution.logoUrl}
                    alt={institution.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-white text-base">
                    EP
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
                  {institution.name}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">{institution.tagline}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {institution.address} · {institution.phone} · {institution.email}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 uppercase">
                Original Voucher
              </span>
              <div className="mt-1 font-mono text-xs font-bold text-slate-800">
                {payment.receiptNumber}
              </div>
            </div>
          </div>

          {/* Receipt Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Student Full Name
              </span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {payment.studentName}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Reg: {payment.regNumber} · {payment.className}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Payment Timestamp
              </span>
              <div className="text-xs font-mono font-medium text-slate-800 mt-0.5">
                {formatDateTime(payment.paymentDate)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {payment.termOrSession}
              </div>
            </div>
          </div>

          {/* Settlement Details Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Channel / Method</th>
                  <th className="py-2.5 px-3">Audit Reference</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900">Term Fee Installment Settlement</span>
                    <p className="text-[10px] text-slate-500">{payment.notes || 'School fee clearance'}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {payment.paymentMethod}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                    {payment.reference}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-sm text-emerald-700">
                    {formatCurrency(payment.amount, institution.currencySymbol)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Figure Banner */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Cleared Amount</span>
              <p className="text-xs text-slate-300">Audited via Central Bursary Ledger</p>
            </div>
            <div className="font-mono tabular-nums text-2xl font-black text-emerald-400">
              {formatCurrency(payment.amount, institution.currencySymbol)}
            </div>
          </div>

          {/* Verification Badge & Signatures */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {/* Visual QR Code & Verification Tag */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
                <QrCode className="h-10 w-10 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500">
                <div className="flex items-center gap-1 font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  AUTHENTICATED TRANSACTION
                </div>
                <span>Secured with Paystack Settlement verification</span>
              </div>
            </div>

            {/* Bursar Signature Box */}
            <div className="text-right">
              <div className="font-serif italic text-slate-700 text-xs border-b border-slate-300 pb-1 px-4">
                {payment.recordedBy || 'Bursary Accounts Unit'}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                Authorized Bursar Signature
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between no-print">
          <span className="text-[11px] text-slate-400">EduPay Official Digital Receipt</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
