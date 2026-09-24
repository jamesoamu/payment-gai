import React, { useState } from 'react';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
  MessageSquare,
  Search,
  Users,
  CreditCard,
  Building,
  Filter,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { Student, PaymentRecord, InstitutionProfile, AppBillingState } from '../types';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../utils/formatters';

interface DashboardOverviewProps {
  students: Student[];
  payments: PaymentRecord[];
  institution: InstitutionProfile;
  billing: AppBillingState;
  onSelectStudent: (student: Student) => void;
  onOpenRecordPayment: (student?: Student) => void;
  onOpenReminderModal: (student: Student) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  payments,
  institution,
  billing,
  onSelectStudent,
  onOpenRecordPayment,
  onOpenReminderModal,
  onViewReceipt,
  onNavigateTab,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'school' | 'tutorial_center' | 'training_academy'>('all');

  const filteredStudents = students.filter((s) => {
    if (filterType === 'all') return true;
    return s.institutionType === filterType;
  });

  const totalBilled = filteredStudents.reduce((sum, s) => sum + s.totalBilled, 0);
  const totalPaid = filteredStudents.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalPending = filteredStudents.reduce((sum, s) => sum + s.balance, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const paidCount = filteredStudents.filter((s) => s.status === 'paid').length;
  const partialCount = filteredStudents.filter((s) => s.status === 'partial').length;
  const overdueCount = filteredStudents.filter((s) => s.status === 'overdue').length;

  // Urgent pending balances list (students with pending balance, sorted by highest balance)
  const urgentPending = [...filteredStudents]
    .filter((s) => s.balance > 0)
    .sort((a, b) => (b.status === 'overdue' ? 1 : 0) - (a.status === 'overdue' ? 1 : 0) || b.balance - a.balance)
    .slice(0, 5);

  // Group by class to show class-by-class collection performance
  const classMap = new Map<string, { totalBilled: number; totalPaid: number; count: number }>();
  filteredStudents.forEach((s) => {
    const existing = classMap.get(s.className) || { totalBilled: 0, totalPaid: 0, count: 0 };
    classMap.set(s.className, {
      totalBilled: existing.totalBilled + s.totalBilled,
      totalPaid: existing.totalPaid + s.totalPaid,
      count: existing.count + 1,
    });
  });

  const classPerformances = Array.from(classMap.entries())
    .map(([name, data]) => ({
      name,
      ...data,
      rate: data.totalBilled > 0 ? Math.round((data.totalPaid / data.totalBilled) * 100) : 0,
      balance: data.totalBilled - data.totalPaid,
    }))
    .sort((a, b) => b.totalBilled - a.totalBilled);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Context + Quick Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Fee Collection & Balance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time tracking of student payments, outstanding balances, and Paystack settlement.
          </p>
        </div>

        {/* Segmented Filter Control */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-xs text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Programs
          </button>
          <button
            onClick={() => setFilterType('school')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterType === 'school'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            K-12 School
          </button>
          <button
            onClick={() => setFilterType('tutorial_center')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterType === 'tutorial_center'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tutorials / JAMB
          </button>
          <button
            onClick={() => setFilterType('training_academy')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filterType === 'training_academy'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tech Academy
          </button>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Billed */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Billed Fees</span>
            <span className="text-slate-400 text-xs">Term Gross</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(totalBilled, institution.currencySymbol)}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across <span className="font-semibold text-slate-700">{filteredStudents.length}</span> enrolled students
          </div>
        </div>

        {/* Total Collected */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue Collected</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              {collectionRate}%
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-emerald-600 font-mono tabular-nums">
              {formatCurrency(totalPaid, institution.currencySymbol)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Settled & cleared</span>
            <span className="font-semibold text-emerald-700 font-mono tabular-nums">{paidCount} Fully Paid</span>
          </div>
        </div>

        {/* Total Pending / Outstanding Balances */}
        <div className="rounded-xl border border-rose-200/80 bg-rose-50/30 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">Pending Balances</span>
            <span className="text-xs font-semibold text-rose-700">
              {100 - collectionRate}% balance
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-rose-700 font-mono tabular-nums">
              {formatCurrency(totalPending, institution.currencySymbol)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-rose-600">
            <span>Awaiting settlement</span>
            <span className="font-semibold font-mono tabular-nums">{partialCount + overdueCount} Accounts</span>
          </div>
        </div>

        {/* Overdue / Action Needed */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Accounts</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {overdueCount}
            </div>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5"
            >
              Filter list
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Past due deadline · Requires follow-up
          </div>
        </div>
      </div>

      {/* Main Grid: Class Performance + Urgent Pending Balances */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Class / Cohort Collection Performance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Collection Progress by Class & Cohort</h2>
              <p className="text-xs text-slate-500">Monitoring collection percentage versus outstanding balances</p>
            </div>
            <div className="text-xs font-medium text-slate-400">
              {classPerformances.length} Active Classes
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {classPerformances.map((c) => (
              <div key={c.name} className="space-y-1.5 rounded-lg p-2.5 transition-colors hover:bg-slate-50">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    <span className="text-slate-400">({c.count} students)</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="text-emerald-700 font-medium">
                      {formatCurrency(c.totalPaid, institution.currencySymbol)}
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500">
                      {formatCurrency(c.totalBilled, institution.currencySymbol)}
                    </span>
                    <span className="w-12 text-right font-bold text-slate-900">
                      {c.rate}%
                    </span>
                  </div>
                </div>

                {/* Multi-segment progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-500 ${
                      c.rate >= 80 ? 'bg-emerald-600' : c.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${c.rate}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Collected: {formatCurrency(c.totalPaid, institution.currencySymbol)}</span>
                  <span className="text-rose-600 font-medium font-mono tabular-nums">
                    Outstanding: {formatCurrency(c.balance, institution.currencySymbol)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Paystack Gateway & App Billing Quick Status */}
        <div className="space-y-6">
          {/* Paystack Connection Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white font-bold text-xs">
                  P
                </span>
                <span className="text-sm font-bold text-slate-900">Paystack Billing Services</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Live & Connected
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">Software Plan:</span>
                <span className="font-semibold text-slate-900 capitalize">{billing.currentPlan} Tier</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="font-medium text-slate-800 capitalize">{billing.billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Renewal:</span>
                <span className="font-mono tabular-nums text-slate-800">{formatDate(billing.nextBillingDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-medium text-slate-800">
                  {billing.cardBrand} (•••• {billing.cardLast4})
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('billing')}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                Manage Paystack Subscription
              </button>
            </div>
          </div>

          {/* Quick Action Reminders Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Fee Collection Actions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated workflows for bursars</p>

            <div className="mt-3 space-y-2">
              <button
                onClick={() => onOpenRecordPayment()}
                className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-left hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Record Offline / Bank Payment</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('fee_structure')}
                className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-left hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-600" />
                  <span className="font-semibold text-slate-800">Generate Bulk Term Invoices</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Pending Balances List (Requires Immediate Follow-up) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Urgent Pending Balances & Overdue Action</h2>
            <p className="text-xs text-slate-500">Students with outstanding fees requiring payment follow-up</p>
          </div>
          <button
            onClick={() => onNavigateTab('students')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all {filteredStudents.filter((s) => s.balance > 0).length} debtors
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student & Reg No.</th>
                <th className="py-3 px-4">Class / Cohort</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-right">Total Billed</th>
                <th className="py-3 px-4 text-right">Pending Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {urgentPending.map((student) => {
                const statusStyle = getStatusColor(student.status);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{student.regNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {student.className}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{student.guardianName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{student.guardianPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                      {formatCurrency(student.totalBilled, institution.currencySymbol)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-rose-700">
                      {formatCurrency(student.balance, institution.currencySymbol)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusStyle.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}></span>
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenReminderModal(student)}
                          className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Send WhatsApp or SMS reminder"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Remind
                        </button>
                        <button
                          onClick={() => onOpenRecordPayment(student)}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                          title="Record payment"
                        >
                          <Receipt className="h-3 w-3 text-slate-500" />
                          Pay
                        </button>
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          title="View Ledger Statement"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payments Ledger */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Payment Transactions</h2>
            <p className="text-xs text-slate-500">Live payment activity across Paystack online and bank deposits</p>
          </div>
          <button
            onClick={() => onOpenRecordPayment()}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            + Record New Payment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Receipt No.</th>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.slice(0, 6).map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {pay.receiptNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{pay.studentName}</div>
                    <div className="text-[11px] text-slate-500">{pay.className}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {pay.paymentDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                      {pay.paymentMethod === 'Paystack Online' ? (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      {pay.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {pay.reference}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                    {formatCurrency(pay.amount, institution.currencySymbol)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onViewReceipt(pay)}
                      className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-2xs"
                    >
                      <Receipt className="h-3 w-3" />
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
