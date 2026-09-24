import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  FileText,
  Smartphone,
  Sparkles,
  School,
  BookOpen,
  GraduationCap,
  Users,
  ChevronDown,
  QrCode,
  Lock,
  Percent,
  Play,
  Check,
  Zap,
} from 'lucide-react';
import { BillingTier } from '../types';
import { formatCurrency } from '../utils/formatters';

interface LandingPageProps {
  onOpenSignIn: () => void;
  onOpenSignUp: (plan?: BillingTier) => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSignIn,
  onOpenSignUp,
  onLaunchDemo,
}) => {
  // Interactive micro-preview tab on hero
  const [heroPreviewTab, setHeroPreviewTab] = useState<'whatsapp' | 'receipt' | 'paystack'>('whatsapp');

  // Sector solutions tab
  const [activeSector, setActiveSector] = useState<'school' | 'tutorial' | 'bootcamp'>('school');

  // ROI Calculator State
  const [calcStudents, setCalcStudents] = useState<number>(350);
  const [calcTermFee, setCalcTermFee] = useState<number>(120000);
  const [calcUncollectedRate, setCalcUncollectedRate] = useState<number>(24);

  // Billing Cycle Toggle (Monthly vs Annual)
  const [isAnnualBilling, setIsAnnualBilling] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculator computations
  const totalBilledRevenue = calcStudents * calcTermFee;
  const currentUncollectedDebt = totalBilledRevenue * (calcUncollectedRate / 100);
  // Average recovery increase with automated WhatsApp reminders & Paystack is ~18% of total billed
  const estimatedRecovered = Math.round(currentUncollectedDebt * 0.75); // 75% of uncollected recovered
  const monthlySoftwareCost = calcStudents <= 150 ? 15000 : calcStudents <= 600 ? 35000 : 85000;
  const termSoftwareCost = monthlySoftwareCost * 3; // 3 months per term
  const netFinancialGain = Math.max(0, estimatedRecovered - termSoftwareCost);
  const roiMultiplier = Math.round(netFinancialGain / termSoftwareCost);

  const faqItems = [
    {
      q: 'Do parents need to download an app or create an account to pay?',
      a: 'No. Parents do not need any login or special app. When you click Send Reminder, EduPay generates a personalized WhatsApp or SMS message containing their student’s exact pending balance, your school’s bank transfer details, and a direct Paystack checkout link where they can pay using their Debit Card, Virtual Bank Transfer, or USSD.',
    },
    {
      q: 'Can we still record offline cash deposits and direct bank transfers?',
      a: 'Absolutely. EduPay is built for real African school environments. Bursars and front-desk officers can record payments made via physical Cash Deposit, POS Terminal slip, Direct Bank Transfer, or Bank Draft, instantly generating an official electronic receipt with a QR verification code.',
    },
    {
      q: 'How does our school receive money collected through Paystack?',
      a: 'Payments made via Paystack online checkout go directly into your school’s commercial bank account (GTBank, Zenith, Access, First Bank, etc.). Settled funds arrive automatically the next business day (T+1) with zero manual teller reconciliation needed.',
    },
    {
      q: 'Can we configure different fee items and sibling/scholarship discounts?',
      a: 'Yes! You can configure custom fee items (Tuition, WAEC Registration, Computer Lab, Uniforms, PTA levy) and apply bulk invoices to specific cohorts or entire classes with 1 click. You can also assign percentage discounts for siblings, staff children, or scholarship recipients.',
    },
    {
      q: 'How does EduPay billing work for our institution?',
      a: 'EduPay operates on a transparent flat subscription billed monthly or annually via Paystack. You get a 14-day free trial on all plans. No percentage commissions or hidden setup fees on offline cash or bank transfer records.',
    },
    {
      q: 'Is our student and financial data secure and private?',
      a: 'Yes. All data transmissions are 256-bit SSL encrypted. System records adhere to NDPR (Nigeria Data Protection Regulation) data privacy guidelines with comprehensive audit logs of all bursary transactions.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ===================== NAVBAR ===================== */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-xs">
              EP
            </span>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                EduPay Ledger
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Paystack Powered
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#solutions" className="hover:text-slate-900 transition-colors">
              Solutions
            </a>
            <a href="#calculator" className="hover:text-slate-900 transition-colors">
              ROI Calculator
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onLaunchDemo}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
              <span>Explore Demo</span>
            </button>

            <button
              onClick={onOpenSignIn}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:text-slate-950 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => onOpenSignUp()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-linear-to-b from-white via-slate-50/50 to-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Domain Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-md">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>The Modern School Fee Ledger &amp; Paystack Collection Suite</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
                Automate School Fees, Recover Debtors &amp; Issue Instant QR Receipts.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Stop chasing uncollected tuition and dealing with chaotic paper bank tellers. Track
                installment balances, trigger 1-click WhatsApp payment reminders with direct Paystack
                checkout, and print official verification receipts for every payment.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onOpenSignUp()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onLaunchDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                  <span>Launch Live Interactive Demo</span>
                </button>
              </div>

              {/* Zero-Risk Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  No Credit Card Required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Setup in 5 Minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Paystack Verified
                </span>
              </div>
            </div>

            {/* Right Hero Interactive Micro-Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
                {/* Micro preview header */}
                <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
                    <span className="text-xs font-semibold tracking-wide">Live Bursary Workflow</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Interactive Preview</span>
                </div>

                {/* Preview Tabs */}
                <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-600">
                  <button
                    onClick={() => setHeroPreviewTab('whatsapp')}
                    className={`py-2.5 px-2 text-center transition-colors border-r border-slate-200 ${
                      heroPreviewTab === 'whatsapp'
                        ? 'bg-white text-emerald-700 font-semibold border-b-2 border-b-emerald-600'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    1-Click WhatsApp
                  </button>
                  <button
                    onClick={() => setHeroPreviewTab('receipt')}
                    className={`py-2.5 px-2 text-center transition-colors border-r border-slate-200 ${
                      heroPreviewTab === 'receipt'
                        ? 'bg-white text-emerald-700 font-semibold border-b-2 border-b-emerald-600'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Official Receipt
                  </button>
                  <button
                    onClick={() => setHeroPreviewTab('paystack')}
                    className={`py-2.5 px-2 text-center transition-colors ${
                      heroPreviewTab === 'paystack'
                        ? 'bg-white text-emerald-700 font-semibold border-b-2 border-b-emerald-600'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Paystack Direct
                  </button>
                </div>

                {/* Tab 1: WhatsApp Preview */}
                {heroPreviewTab === 'whatsapp' && (
                  <div className="p-4 bg-emerald-950/5 space-y-3">
                    <div className="rounded-xl bg-white p-3.5 border border-emerald-100 shadow-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            WA
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              Apex Horizon Bursary Office
                            </div>
                            <div className="text-[10px] text-slate-500">To: Mrs. Okonjo (Guardian)</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">12:30 PM</span>
                      </div>

                      <div className="bg-emerald-50/70 p-3 rounded-lg text-xs text-slate-800 space-y-1.5 font-sans leading-relaxed">
                        <p>
                          Dear <strong>Mrs. Okonjo</strong>, this is an official fee reminder regarding{' '}
                          <strong>Chidinma Okonjo</strong> (SS3 Science).
                        </p>
                        <div className="bg-white p-2 rounded border border-emerald-200 text-xs">
                          <div>
                            Outstanding Balance:{' '}
                            <span className="font-bold text-rose-600">₦85,000</span>
                          </div>
                          <div className="text-[11px] text-slate-500">Due: Sept 30, 2026</div>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Settle instantly via Paystack link:{' '}
                          <span className="text-emerald-700 font-medium underline">
                            paystack.com/pay/ep-chidinma-88
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={onLaunchDemo}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Live Test Reminder</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Official Receipt Preview */}
                {heroPreviewTab === 'receipt' && (
                  <div className="p-4 bg-slate-50 space-y-3">
                    <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-xs space-y-2 font-mono text-[11px]">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <div className="font-bold text-xs text-slate-900">APEX HORIZON ACADEMY</div>
                          <div className="text-[10px] text-slate-500 font-sans">
                            Official Bursary Electronic Receipt
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            VERIFIED
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-slate-700 font-sans text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Student:</span>
                          <span className="font-semibold text-slate-900">Emeka Eze (APX/2026/088)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Amount Paid:</span>
                          <span className="font-bold text-emerald-700">₦155,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Channel:</span>
                          <span>Paystack Online (Card)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reference:</span>
                          <span className="font-mono text-[10px]">pstk_sch_99182</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-sans">
                          <QrCode className="h-5 w-5 text-slate-800" />
                          <span>Scan to verify on school portal</span>
                        </div>
                        <button
                          onClick={onLaunchDemo}
                          className="px-2 py-1 text-[11px] font-sans font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                        >
                          Print Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Paystack Direct Preview */}
                {heroPreviewTab === 'paystack' && (
                  <div className="p-4 bg-slate-900 text-white space-y-3">
                    <div className="rounded-xl bg-slate-800/90 p-3.5 border border-slate-700 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs font-bold">Paystack Instant Checkout</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                          Live T+1 Bank Settlement
                        </span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700 space-y-1 text-xs">
                        <div className="text-slate-400">Total Fee Settlement:</div>
                        <div className="text-lg font-extrabold text-emerald-400">₦85,000.00</div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-[11px] text-center">
                        <div className="p-1.5 bg-slate-700/60 rounded border border-slate-600">
                          Debit Card
                        </div>
                        <div className="p-1.5 bg-slate-700/60 rounded border border-slate-600">
                          Bank Transfer
                        </div>
                        <div className="p-1.5 bg-slate-700/60 rounded border border-slate-600">
                          USSD (*737#)
                        </div>
                      </div>

                      <button
                        onClick={onLaunchDemo}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                      >
                        Try Checkout in Demo
                      </button>
                    </div>
                  </div>
                )}

                {/* Micro preview footer */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Automates 90% of Bursar reconciliation
                  </span>
                  <button
                    onClick={onLaunchDemo}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Open Live App →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SOCIAL PROOF STATS ===================== */}
      <section className="bg-white py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Empowering Education Administrators Across Nigeria, Ghana &amp; Kenya
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ₦1.8B+
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">School Fees Reconciled</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                94.2%
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">On-Time Collection Rate</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                450+
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Academies &amp; Centers</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                1-Click
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">WhatsApp Settle Links</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== KEY FEATURES SECTION ===================== */}
      <section id="features" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
            Engineered for Modern Bursars
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Everything your school needs to collect fees on time without friction.
          </p>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Say goodbye to endless follow-up phone calls, unverified paper bank deposit slips, and
            unidentified bank alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1-Click WhatsApp &amp; SMS Reminders
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Generate personalized reminders pre-filled with the student&apos;s exact debt balance,
              your verified bank account number, and an instant Paystack payment link.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Paystack Multi-Channel Payments
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Accept Debit Cards, Virtual Bank Transfer accounts, and USSD banking codes. Zero manual
              teller matching; payments auto-reconcile to the student&apos;s ledger.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              QR-Verified Official Receipts
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instant generation of tamper-evident receipts with the academy&apos;s official crest,
              receipt serial number, payment channel, and scannable QR verification code.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Cohort &amp; Class Bulk Invoicing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Issue term fees or national examination levies to an entire class of 60 students in one
              click. Auto-calculates sibling discounts and partial installments.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
              <Lock className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Exam Clearance &amp; Debtors Roster
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instantly filter students by payment status (Overdue, Partial, Fully Paid). Issue
              examination clearance passes to prevent exam-day confusion.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Offline Cash &amp; Bank Transfer Audit
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Easily record physical cash counter deposits and POS slips with teller references. Keep
              an immutable audit trail of who recorded each payment.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== SECTOR SOLUTIONS TABS ===================== */}
      <section id="solutions" className="py-16 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              Custom-Fit for Your Institution
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Whether you run a K-12 school or a coaching academy
            </p>
          </div>

          {/* Sector Segmented Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setActiveSector('school')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  activeSector === 'school'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="h-4 w-4" />
                <span>K-12 Primary &amp; Secondary</span>
              </button>
              <button
                onClick={() => setActiveSector('tutorial')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  activeSector === 'tutorial'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>WAEC &amp; JAMB Centers</span>
              </button>
              <button
                onClick={() => setActiveSector('bootcamp')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  activeSector === 'bootcamp'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Tech &amp; Vocational Academies</span>
              </button>
            </div>
          </div>

          {/* Active Sector Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
            {activeSector === 'school' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                    K-12 Nursery, Primary &amp; College
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">
                    Termly Tuitions, PTA Levies &amp; Examination Clearances
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Easily manage First, Second, and Third Term fee schedules across JSS1 to SS3.
                    Automate PTA levy collection, track sibling discounts, and give parents complete
                    transparency over itemized school statements.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Automatic 5% – 10% sibling discount rules
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Bus, boarding &amp; uniform fee bundles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Pre-examination entrance pass printing
                    </li>
                  </ul>
                  <button
                    onClick={() => onOpenSignUp()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline pt-2"
                  >
                    <span>Create K-12 School Account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-800 flex justify-between">
                    <span>Sample JSS2 Term Statement</span>
                    <span className="text-emerald-700">₦145,000 Total</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Tuition Fee</span>
                      <span>₦95,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>STEM Computer Lab</span>
                      <span>₦20,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Textbooks &amp; Workbooks</span>
                      <span>₦20,000</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>PTA Development Levy</span>
                      <span>₦10,000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSector === 'tutorial' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                    Coaching &amp; Exam Centers
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">
                    JAMB/UTME, WAEC, NECO &amp; Post-UTME Registrations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Handle rapid influxes of tutorial students during registration seasons. Bundle 4-subject
                    packages with CBT mock exams and Saturday clinics, while ensuring full payment before
                    national exam submission deadlines.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Rapid student registration with guardian phone tagging
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Direct WhatsApp payment link to guardians
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Exam registration deadline countdown alerts
                    </li>
                  </ul>
                  <button
                    onClick={() => onOpenSignUp()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline pt-2"
                  >
                    <span>Create Tutorial Center Account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-800 flex justify-between">
                    <span>UTME Intensive Crash Program</span>
                    <span className="text-emerald-700">₦85,000 Total</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>4 Core Subjects Coaching</span>
                      <span>₦45,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>CBT Software License &amp; Mock</span>
                      <span>₦15,000</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Past Questions Compendium</span>
                      <span>₦25,000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSector === 'bootcamp' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                    Vocational &amp; Tech Bootcamps
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">
                    Installment Plans, Admission Deposits &amp; Certification
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Offer flexible 2-to-4 part installment plans for coding bootcamps, product design,
                    and culinary or fashion academies. Enforce certificate clearance only upon complete
                    settlement.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      50% deposit + 25% + 25% milestone tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Automatic Paystack debit card recurring charges
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Digital Certificate clearance certificate badge
                    </li>
                  </ul>
                  <button
                    onClick={() => onOpenSignUp()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline pt-2"
                  >
                    <span>Create Training Academy Account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-800 flex justify-between">
                    <span>Full-Stack Web Dev Cohort 6</span>
                    <span className="text-emerald-700">₦220,000 Total</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Admission Deposit (Month 1)</span>
                      <span className="text-emerald-600 font-semibold">₦110,000 (Paid)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Milestone 2 (Month 2)</span>
                      <span className="text-amber-600 font-semibold">₦55,000 (Due)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Certification Final (Month 3)</span>
                      <span className="text-slate-400">₦55,000 (Upcoming)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================== ROI / DEBT RECOVERY CALCULATOR ===================== */}
      <section id="calculator" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Calculator Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
                  <Percent className="h-3.5 w-3.5" />
                  Interactive Fee Recovery Calculator
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Calculate how much uncollected revenue your school can recover this term
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  Adjust the sliders according to your school&apos;s current student count and average
                  term fee.
                </p>
              </div>

              {/* Slider 1: Students */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-medium">
                  <span className="text-slate-300">Enrolled Students:</span>
                  <span className="text-emerald-400 font-bold">{calcStudents} students</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={calcStudents}
                  onChange={(e) => setCalcStudents(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>50 students</span>
                  <span>750 students</span>
                  <span>1,500 students</span>
                </div>
              </div>

              {/* Slider 2: Average Term Fee */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-medium">
                  <span className="text-slate-300">Average Term Tuition Fee:</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(calcTermFee, '₦')}</span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="450000"
                  step="10000"
                  value={calcTermFee}
                  onChange={(e) => setCalcTermFee(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>₦30,000</span>
                  <span>₦240,000</span>
                  <span>₦450,000</span>
                </div>
              </div>

              {/* Slider 3: Current Uncollected Debt Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-medium">
                  <span className="text-slate-300">Current Overdue / Uncollected Debt Rate:</span>
                  <span className="text-rose-400 font-bold">{calcUncollectedRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="2"
                  value={calcUncollectedRate}
                  onChange={(e) => setCalcUncollectedRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10% (Low)</span>
                  <span>25% (Average)</span>
                  <span>50% (Severe)</span>
                </div>
              </div>
            </div>

            {/* Live Financial Impact Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/95 rounded-2xl p-6 border border-slate-700 space-y-4 shadow-xl">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Estimated Financial Impact
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-700">
                    <span className="text-slate-400">Total Billed Revenue:</span>
                    <span className="font-semibold text-slate-200">
                      {formatCurrency(totalBilledRevenue, '₦')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-700">
                    <span className="text-slate-400">Debt at Risk (Before EduPay):</span>
                    <span className="font-semibold text-rose-400">
                      {formatCurrency(currentUncollectedDebt, '₦')}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/30">
                    <div className="text-[11px] text-emerald-300 font-medium">
                      Projected Debt Recovered with EduPay:
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">
                      +{formatCurrency(estimatedRecovered, '₦')}
                    </div>
                    <div className="text-[10px] text-emerald-200/80 mt-1">
                      Via 1-click WhatsApp reminders &amp; Paystack instant checkout links
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-400">Software Investment (1 Term):</span>
                    <span className="font-medium text-slate-300">
                      {formatCurrency(termSoftwareCost, '₦')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-700">
                    <span className="text-slate-300 font-semibold">Net Financial Return:</span>
                    <span className="font-extrabold text-emerald-400">
                      +{formatCurrency(netFinancialGain, '₦')} ({roiMultiplier}x ROI)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenSignUp()}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Start Recovering Revenue Today</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING SECTION ===================== */}
      <section id="pricing" className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              Transparent Paystack Subscriptions
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Predictable pricing for institutions of all sizes.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every plan includes a 14-day free trial. Direct card and bank billing managed via Paystack.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-6 inline-flex items-center gap-3 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setIsAnnualBilling(false)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  !isAnnualBilling ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsAnnualBilling(true)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  isAnnualBilling ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Starter Center</div>
                <div className="text-xs text-slate-500 mb-4">
                  For private coaching clinics and small tutorial centers
                </div>

                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                    {isAnnualBilling ? '₦150,000' : '₦15,000'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-1">
                    {isAnnualBilling ? '/year' : '/month'}
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Up to 150 active student records
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Pending balances &amp; installments ledger
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Instant QR official electronic receipts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    1-Click WhatsApp payment reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Cash, POS &amp; bank transfer recording
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenSignUp('starter')}
                className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs font-semibold transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Pro Plan (Popular) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-600 shadow-lg relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Most Popular for Schools
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Academy Pro</div>
                <div className="text-xs text-slate-500 mb-4">
                  For established K-12 schools and multi-cohort academies
                </div>

                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                    {isAnnualBilling ? '₦350,000' : '₦35,000'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-1">
                    {isAnnualBilling ? '/year' : '/month'}
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 mb-8">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Up to 600 active student records
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Direct Paystack Online Card/USSD checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Automated bank transfer reconciliation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Class &amp; Cohort 1-click bulk invoicing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Custom school crest emblem branding
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Examination Hall Clearance pass generator
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenSignUp('pro')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Campus Enterprise</div>
                <div className="text-xs text-slate-500 mb-4">
                  For large institutions, multiple campuses &amp; colleges
                </div>

                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                    {isAnnualBilling ? '₦850,000' : '₦85,000'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-1">
                    {isAnnualBilling ? '/year' : '/month'}
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 mb-8">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Unlimited student records
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Multi-campus bursar &amp; cashier logins
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Custom Paystack Subaccounts &amp; Split Payments
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Priority 24/7 WhatsApp &amp; Phone Support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    Automated Daily Financial Excel/PDF Exports
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenSignUp('enterprise')}
                className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs font-semibold transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              Trusted by School Leaders
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              What Bursars and Center Directors Say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {'★★★★★'}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;Before EduPay, parents brought forged physical bank tellers or claimed they
                transferred money to our GTBank account. Now, the 1-click WhatsApp link with Paystack
                eliminates all excuses. Our collection rate jumped from 71% to 94% this term.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">Mrs. Funke Adeyemi</div>
                <div className="text-[11px] text-slate-500">Chief Bursar, Apex Horizon Academy</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {'★★★★★'}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;Managing 250 JAMB tutorial candidates with partial installment payments was a
                nightmare. EduPay keeps an exact live balance for every student and lets us issue
                official printed receipts in 5 seconds flat.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">Engr. Kenneth Okafor</div>
                <div className="text-[11px] text-slate-500">Director, Prime Excellence Center</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {'★★★★★'}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;Our coding bootcamp students pay in 3 installments. EduPay handles our cohort
                milestones smoothly, and Paystack integration ensures fees land directly in our bank
                account the next business day without hassle.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">Sarah Danladi</div>
                <div className="text-[11px] text-slate-500">Operations Lead, FutureCoders Africa</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ACCORDION ===================== */}
      <section id="faq" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Common questions from School Administrators
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== FINAL HIGH-IMPACT CTA ===================== */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-500/30">
            <Zap className="h-3.5 w-3.5" />
            <span>Join 450+ Educational Institutions</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to eliminate unpaid school fees and automate your bursary ledger?
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
            Create your account in under 3 minutes, customize your school details, and start collecting
            fees smoothly with Paystack.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenSignUp()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg"
            >
              <span>Create School Account (Free Trial)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Play className="h-4 w-4 fill-slate-300" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-white font-extrabold text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-slate-950">
                  EP
                </span>
                <span>EduPay Ledger</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Smart school fee tracking, automated WhatsApp balance reminders, and Paystack
                subscription billing for schools, tutorial centers, and training academies.
              </p>
            </div>

            <div>
              <div className="text-white font-semibold text-xs mb-2">Solutions</div>
              <ul className="space-y-1.5 text-[11px]">
                <li>K-12 Primary &amp; Secondary</li>
                <li>WAEC &amp; JAMB Tutorial Centers</li>
                <li>Vocational &amp; Coding Bootcamps</li>
                <li>Examination Clearance Passes</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold text-xs mb-2">Platform</div>
              <ul className="space-y-1.5 text-[11px]">
                <li>Paystack Online Gateway</li>
                <li>WhatsApp Balance Reminders</li>
                <li>Official QR Receipts</li>
                <li>Debtors Roster &amp; Ledger</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold text-xs mb-2">Security &amp; Compliance</div>
              <p className="text-[11px] text-slate-400 mb-2">
                256-Bit SSL Encryption · Paystack Certified Partner · NDPR Data Compliant
              </p>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Next-Day T+1 Bank Payouts</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
            <div>
              &copy; {new Date().getFullYear()} EduPay Ledger Systems Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={onOpenSignIn} className="hover:text-white">
                Sign In
              </button>
              <button onClick={() => onOpenSignUp()} className="hover:text-white">
                Sign Up
              </button>
              <button onClick={onLaunchDemo} className="hover:text-white">
                Live Demo
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
