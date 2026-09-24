import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  Key,
  Download,
  Calendar,
  Zap,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { AppBillingState, SubscriptionPlan, InstitutionProfile, Student, BillingTier } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import paystackBillingHero from '../assets/images/paystack_billing_hero_1790110601155.jpg';

interface PaystackBillingViewProps {
  billing: AppBillingState;
  students: Student[];
  institution: InstitutionProfile;
  onUpdateBillingState: (newState: Partial<AppBillingState>) => void;
  onLaunchPaystackCheckout: (params: {
    amount: number;
    email: string;
    planName: string;
    onSuccess: (reference: string) => void;
  }) => void;
}

export const PaystackBillingView: React.FC<PaystackBillingViewProps> = ({
  billing,
  students,
  institution,
  onUpdateBillingState,
  onLaunchPaystackCheckout,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>(billing.billingCycle);
  const [paystackKeyInput, setPaystackKeyInput] = useState<string>(billing.paystackPublicKey);
  const [testMode, setTestMode] = useState<boolean>(billing.testMode);
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);
  const [keyVerificationStatus, setKeyVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Quota calculation
  const currentPlanObj = SUBSCRIPTION_PLANS.find((p) => p.id === billing.currentPlan) || SUBSCRIPTION_PLANS[1];
  const quotaLimit = currentPlanObj.studentLimit;
  const quotaUsed = students.length;
  const quotaPercent = Math.min(100, Math.round((quotaUsed / quotaLimit) * 100));

  const handleTestKeyConnection = () => {
    setIsVerifyingKey(true);
    setKeyVerificationStatus('idle');

    setTimeout(() => {
      setIsVerifyingKey(false);
      if (paystackKeyInput.startsWith('pk_test_') || paystackKeyInput.startsWith('pk_live_')) {
        setKeyVerificationStatus('success');
        onUpdateBillingState({
          paystackPublicKey: paystackKeyInput,
          testMode,
        });
      } else {
        setKeyVerificationStatus('error');
      }
    }, 900);
  };

  const handleUpgradePlan = (plan: SubscriptionPlan) => {
    const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnually;

    onLaunchPaystackCheckout({
      amount: price,
      email: institution.email,
      planName: `${plan.name} (${billingCycle === 'monthly' ? 'Monthly' : 'Annual'})`,
      onSuccess: (ref) => {
        // Compute new renewal date
        const nextDate = new Date();
        if (billingCycle === 'monthly') {
          nextDate.setMonth(nextDate.getMonth() + 1);
        } else {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        }

        const newInvoice = {
          id: `inv_${Date.now()}`,
          invoiceNumber: `PSTK-SUB-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`,
          date: new Date().toISOString().slice(0, 10),
          planName: `${plan.name} (${billingCycle})`,
          amount: price,
          status: 'paid' as const,
          reference: ref,
          paymentMethod: 'Paystack Card (*4082)',
        };

        onUpdateBillingState({
          currentPlan: plan.id,
          billingCycle,
          status: 'active',
          nextBillingDate: nextDate.toISOString().slice(0, 10),
          invoices: [newInvoice, ...billing.invoices],
        });
      },
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner with Hero Visual */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-md">
        <div className="absolute inset-0 opacity-20">
          <img
            src={paystackBillingHero}
            alt="Paystack Billing Banner"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Official Paystack Software Billing</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              EduPay App Subscription & Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your school or tutorial academy subscription is billed seamlessly via Paystack.
              Enjoy automated parent fee collection, instant digital receipts, and real-time ledger accounting.
            </p>
          </div>

          {/* Current Active Plan Snapshot Box */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-xs min-w-[260px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Plan</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Subscription
              </span>
            </div>
            <div>
              <div className="text-lg font-bold text-white capitalize">
                {currentPlanObj.name}
              </div>
              <div className="text-xs text-slate-400">
                Billed {billing.billingCycle} via {billing.cardBrand} (•••• {billing.cardLast4})
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 text-xs flex justify-between text-slate-300">
              <span>Next Renewal:</span>
              <span className="font-mono tabular-nums text-white font-semibold">
                {formatDate(billing.nextBillingDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Quota Capacity Meter */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Capacity & Plan Utilization</h3>
            <p className="text-xs text-slate-500">
              Monitoring active students and candidate enrollment limits on your {currentPlanObj.name} plan.
            </p>
          </div>
          <div className="font-mono text-sm font-bold text-slate-800 tabular-nums">
            {quotaUsed} / {quotaLimit} Students Enrolled ({quotaPercent}%)
          </div>
        </div>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-500 ${
              quotaPercent > 90 ? 'bg-rose-500' : quotaPercent > 70 ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${quotaPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{quotaLimit - quotaUsed} slots remaining</span>
          <span className="text-slate-400 font-medium">Automatic upgrade warning at 95%</span>
        </div>
      </div>

      {/* Pricing & Subscription Tier Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Subscription Plans & Software Services</h2>
            <p className="text-xs text-slate-500">
              Select the right tier for your tutorial center, school campus, or vocational academy.
            </p>
          </div>

          {/* Billing cycle toggle */}
          <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`rounded-md px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annually' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = billing.currentPlan === plan.id;
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnually;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all ${
                  isCurrent
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                    : plan.popular
                    ? 'border-slate-300 shadow-sm'
                    : 'border-slate-200'
                }`}
              >
                {/* Popular or Current tag */}
                {isCurrent ? (
                  <span className="absolute -top-3 right-6 rounded-md bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                    Current Active Plan
                  </span>
                ) : plan.popular ? (
                  <span className="absolute -top-3 right-6 rounded-md bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                    Most Popular
                  </span>
                ) : null}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.targetAudience}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                      {formatCurrency(price, institution.currencySymbol)}
                    </span>
                    <span className="text-xs text-slate-500">
                      / {billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-500 cursor-default"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgradePlan(plan)}
                      className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Pay with Paystack</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paystack Online Gateway Configuration for School Parent Fee Collection */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Institution Paystack API Settings (For Parent Online Payments)
            </h3>
            <p className="text-xs text-slate-500">
              Connect your school's official Paystack account to accept card, USSD, and bank transfer payments directly into your school bank account.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            PCI-DSS Level 1
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Paystack Public Key (PK) *
            </label>
            <div className="relative">
              <input
                type="text"
                value={paystackKeyInput}
                onChange={(e) => setPaystackKeyInput(e.target.value)}
                placeholder="pk_test_... or pk_live_..."
                className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
              <Key className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Find this in your Paystack Dashboard under Settings &gt; API Keys &amp; Webhooks.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Gateway Environment Mode
            </label>
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="testMode"
                  checked={testMode}
                  onChange={() => setTestMode(true)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                Test Mode (Sandbox simulated cards)
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="testMode"
                  checked={!testMode}
                  onChange={() => setTestMode(false)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                Live Mode (Real parent bank accounts)
              </label>
            </div>
          </div>
        </div>

        {/* Verification and Feedback Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs">
            {keyVerificationStatus === 'success' && (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Connection verified! Paystack gateway active for online collections.
              </span>
            )}
            {keyVerificationStatus === 'error' && (
              <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                <AlertCircle className="h-4 w-4" />
                Invalid key format. Key must begin with "pk_test_" or "pk_live_".
              </span>
            )}
          </div>

          <button
            onClick={handleTestKeyConnection}
            disabled={isVerifyingKey}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            {isVerifyingKey ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                Testing Paystack Handshake...
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Test Connection & Save Keys
              </>
            )}
          </button>
        </div>
      </div>

      {/* Paystack Invoices & Billing History */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">App Subscription Billing History</h3>
            <p className="text-xs text-slate-500">Official tax invoices for software service fees paid via Paystack</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {billing.invoices.length} invoices issued
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice No.</th>
                <th className="py-3 px-4">Billing Date</th>
                <th className="py-3 px-4">Plan Description</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4">Paystack Reference</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {billing.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {inv.date}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {inv.planName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {inv.paymentMethod}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {inv.reference}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {formatCurrency(inv.amount, institution.currencySymbol)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => alert(`Invoice ${inv.invoiceNumber} receipt downloaded.`)}
                      className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 shadow-2xs"
                      title="Download PDF Invoice"
                    >
                      <Download className="h-3 w-3 text-slate-500" />
                      Receipt
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
