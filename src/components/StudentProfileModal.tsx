import React from 'react';
import {
  X,
  Printer,
  Receipt,
  MessageSquare,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { Student, PaymentRecord, InstitutionProfile } from '../types';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../utils/formatters';

interface StudentProfileModalProps {
  student: Student;
  payments: PaymentRecord[];
  institution: InstitutionProfile;
  onClose: () => void;
  onOpenRecordPayment: (student: Student) => void;
  onOpenReminderModal: (student: Student) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  payments,
  institution,
  onClose,
  onOpenRecordPayment,
  onOpenReminderModal,
  onViewReceipt,
}) => {
  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const statusStyle = getStatusColor(student.status);

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[92vh] flex flex-col overflow-hidden print-card">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Student Statement of Account
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-xs text-slate-600">{student.regNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintStatement}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Statement
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{student.fullName}</h2>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${statusStyle.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}></span>
                    {getStatusText(student.status)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700">{student.className}</span>
                  <span>·</span>
                  <span className="capitalize">{student.institutionType.replace('_', ' ')}</span>
                  <span>·</span>
                  <span>Admitted {formatDate(student.enrollmentDate)}</span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => onOpenRecordPayment(student)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  Record Payment
                </button>
                {student.balance > 0 && (
                  <button
                    onClick={() => onOpenReminderModal(student)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Send Reminder
                  </button>
                )}
              </div>
            </div>

            {/* Financial Ledger Big Numbers */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-4 border-t border-slate-100">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Total Term Assessment
                </div>
                <div className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(student.totalBilled, institution.currencySymbol)}
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50/50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                  Total Fees Settled
                </div>
                <div className="mt-1 text-xl font-bold text-emerald-700 font-mono tabular-nums">
                  {formatCurrency(student.totalPaid, institution.currencySymbol)}
                </div>
              </div>

              <div className="rounded-lg bg-rose-50/50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                  Pending Balance
                </div>
                <div className="mt-1 text-xl font-bold text-rose-700 font-mono tabular-nums">
                  {formatCurrency(student.balance, institution.currencySymbol)}
                </div>
                <div className="mt-0.5 text-[10px] text-rose-600">
                  Due: {formatDate(student.dueDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Guardian / Sponsor Profile Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Guardian & Contact Profile
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Guardian</span>
                <span className="font-semibold text-slate-900">{student.guardianName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Phone / WhatsApp</span>
                <a
                  href={`tel:${student.guardianPhone}`}
                  className="font-mono font-medium text-slate-800 hover:text-emerald-700"
                >
                  {student.guardianPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email Address</span>
                <a
                  href={`mailto:${student.guardianEmail}`}
                  className="font-mono text-slate-700 hover:text-emerald-700"
                >
                  {student.guardianEmail || 'Not provided'}
                </a>
              </div>
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Itemized Term Fee Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Fee Item Name</th>
                    <th className="py-2.5 px-4 text-right">Assessed Fee</th>
                    <th className="py-2.5 px-4 text-right">Amount Paid</th>
                    <th className="py-2.5 px-4 text-right">Item Balance</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.feeItems && student.feeItems.length > 0 ? (
                    student.feeItems.map((item, idx) => {
                      const itemBal = item.amount - (item.paidAmount || 0);
                      const isItemCleared = itemBal <= 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                            {formatCurrency(item.amount, institution.currencySymbol)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700 font-medium">
                            {formatCurrency(item.paidAmount || 0, institution.currencySymbol)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                            {itemBal > 0 ? (
                              <span className="text-rose-700">
                                {formatCurrency(itemBal, institution.currencySymbol)}
                              </span>
                            ) : (
                              <span className="text-slate-400">₦0</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isItemCleared ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Cleared
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                <Clock className="h-3.5 w-3.5 text-amber-600" />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        Tuition aggregate fee plan assigned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History / Receipts Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Payment History & Receipts
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {studentPayments.length} recorded payments
              </span>
            </div>

            {studentPayments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <Receipt className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                No payments recorded yet for this student.
                <div className="mt-2">
                  <button
                    onClick={() => onOpenRecordPayment(student)}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    Click here to record the first payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Receipt No.</th>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Payment Method</th>
                      <th className="py-2.5 px-4">Reference</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                      <th className="py-2.5 px-4 text-center no-print">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                          {p.receiptNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {p.paymentDate}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">
                          {p.paymentMethod}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {p.reference}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                          {formatCurrency(p.amount, institution.currencySymbol)}
                        </td>
                        <td className="py-3 px-4 text-center no-print">
                          <button
                            onClick={() => onViewReceipt(p)}
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-2xs"
                          >
                            <Receipt className="h-3 w-3" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between no-print">
          <div className="text-[11px] text-slate-500">
            Statement generated on {new Date().toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
