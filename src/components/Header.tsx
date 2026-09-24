import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  School,
  LogOut,
  Globe,
  User,
  ChevronDown,
} from 'lucide-react';
import { InstitutionProfile, AppBillingState, UserAccount } from '../types';

interface HeaderProps {
  institution: InstitutionProfile;
  billing: AppBillingState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: UserAccount | null;
  onOpenRecordPayment: () => void;
  onOpenSettings: () => void;
  onViewLandingPage?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  institution,
  billing,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenRecordPayment,
  onOpenSettings,
  onViewLandingPage,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-emerald-700"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-xs">
            EP
          </span>
          <span className="font-extrabold tracking-tight">EduPay Ledger</span>
        </button>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`whitespace-nowrap transition-colors hover:text-slate-900 ${
            activeTab === 'dashboard'
              ? 'font-semibold text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-8'
              : ''
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`whitespace-nowrap transition-colors hover:text-slate-900 ${
            activeTab === 'students'
              ? 'font-semibold text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-8'
              : ''
          }`}
        >
          Students & Balances
        </button>
        <button
          onClick={() => setActiveTab('fee_structure')}
          className={`whitespace-nowrap transition-colors hover:text-slate-900 ${
            activeTab === 'fee_structure'
              ? 'font-semibold text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-8'
              : ''
          }`}
        >
          Fee Structure
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`whitespace-nowrap transition-colors hover:text-slate-900 ${
            activeTab === 'billing'
              ? 'font-semibold text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-8'
              : ''
          }`}
        >
          Paystack Billing
        </button>
      </nav>

      {/* Zone 3: Actions + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onViewLandingPage && (
          <button
            onClick={onViewLandingPage}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="View Public Landing Page"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-600" />
            <span>Landing Page</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('billing')}
          className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          title="App Subscription via Paystack"
        >
          <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
          <span className="capitalize">{billing.currentPlan} Plan</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-600 font-semibold">Active</span>
        </button>

        <button
          onClick={onOpenRecordPayment}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Record Payment</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Institution Settings"
        >
          <School className="h-4 w-4" />
        </button>

        {/* User Account / Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 pl-2 pr-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <div className="font-semibold text-slate-900 max-w-[110px] truncate leading-tight">
                {currentUser?.fullName || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-500 capitalize leading-tight">
                {currentUser?.role || 'Bursar'}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.fullName || 'Administrator'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email || institution.email}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">
                  {institution.name}
                </div>
              </div>

              <div className="py-1">
                {onViewLandingPage && (
                  <button
                    onClick={onViewLandingPage}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span>View Public Landing Page</span>
                  </button>
                )}

                <button
                  onClick={onOpenSettings}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <School className="h-3.5 w-3.5 text-slate-400" />
                  <span>Institution Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  <span>Paystack Subscription</span>
                </button>
              </div>

              {onSignOut && (
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={onSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

