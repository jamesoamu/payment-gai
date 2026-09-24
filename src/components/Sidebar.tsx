import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Layers,
  MessageSquareShare,
  Sliders,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  LogOut,
  User,
} from 'lucide-react';
import { InstitutionProfile, AppBillingState, Student, UserAccount } from '../types';

interface SidebarProps {
  institution: InstitutionProfile;
  billing: AppBillingState;
  students: Student[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: UserAccount | null;
  onOpenRecordPayment: () => void;
  onOpenReminderModal: (student?: Student) => void;
  onViewLandingPage?: () => void;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  institution,
  billing,
  students,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenRecordPayment,
  onOpenReminderModal,
  onViewLandingPage,
  onSignOut,
}) => {
  const planLimits: Record<string, number> = {
    starter: 150,
    pro: 600,
    enterprise: 2500,
  };
  const limit = planLimits[billing.currentPlan] || 600;
  const usagePercent = Math.min(100, Math.round((students.length / limit) * 100));

  const overdueCount = students.filter((s) => s.status === 'overdue').length;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-4">
      {/* Institution header */}
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-900">
            {institution.logoUrl ? (
              <img
                src={institution.logoUrl}
                alt={institution.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-white text-xs">
                ED
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xs font-bold text-slate-900" title={institution.name}>
              {institution.name}
            </h2>
            <p className="truncate text-[11px] text-slate-500">
              {institution.type === 'school'
                ? 'K-12 School'
                : institution.type === 'tutorial_center'
                ? 'Exam Tutorial Center'
                : 'Training Academy'}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate">{institution.currentTerm}</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400">
            FEE MANAGEMENT
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span className="truncate">Overview Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'students'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Users className="h-4 w-4 shrink-0" />
              <span className="truncate">Students & Balances</span>
            </div>
            {overdueCount > 0 && (
              <span className="ml-2 font-mono text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                {overdueCount} overdue
              </span>
            )}
          </button>

          <button
            onClick={onOpenRecordPayment}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Receipt className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate">Record Payment</span>
          </button>

          <button
            onClick={() => setActiveTab('fee_structure')}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'fee_structure'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4 shrink-0" />
            <span className="truncate">Fee Structure & Invoicing</span>
          </button>

          <button
            onClick={() => onOpenReminderModal()}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <MessageSquareShare className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate">WhatsApp Reminders</span>
          </button>
        </div>

        {/* SaaS & Paystack Billing section */}
        <div className="space-y-1 pt-2">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400">
            APP SERVICES
          </div>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'billing'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <CreditCard className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="font-semibold truncate">Paystack Billing</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-300">
              PRO
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sliders className="h-4 w-4 shrink-0" />
            <span className="truncate">Institution Profile</span>
          </button>

          {onViewLandingPage && (
            <button
              onClick={onViewLandingPage}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Globe className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="truncate">Public Landing Page</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Section: Paystack Subscription Quota Meter + User Log out */}
      <div className="space-y-3 pt-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">App Subscription</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              Active
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Enrolled Students</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {students.length} / {limit}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setActiveTab('billing')}
            className="flex w-full items-center justify-center gap-1 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-1"
          >
            <span>Manage Plan & Paystack</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* User Session Bar */}
        {currentUser && (
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-slate-900">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-slate-500 capitalize truncate">
                  {currentUser.role}
                </div>
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

