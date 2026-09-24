import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  Smartphone,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { generatePaystackReference } from '../utils/paystack';

interface PaystackCheckoutModalProps {
  amount: number;
  email: string;
  planName?: string;
  reference?: string;
  currency?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export const PaystackCheckoutModal: React.FC<PaystackCheckoutModalProps> = ({
  amount,
  email,
  planName = 'App Software Subscription',
  reference: initialRef,
  currency = '₦',
  onSuccess,
  onClose,
}) => {
  const [activeChannel, setActiveChannel] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [reference] = useState<string>(initialRef || generatePaystackReference('PSTK_SUB'));

  // Card form state
  const [cardNumber, setCardNumber] = useState<string>('4082 0092 8812 4082');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('312');
  const [cardPin, setCardPin] = useState<string>('1234');

  // Checkout flow step: 'details' -> 'processing' -> 'otp' -> 'success'
  const [step, setStep] = useState<'details' | 'processing' | 'otp' | 'success'>('details');
  const [otpCode, setOtpCode] = useState<string>('');
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  // Pre-fill test card helper
  const handleUseTestCard = () => {
    setCardNumber('4082 0000 0000 4082');
    setCardExpiry('12/28');
    setCardCvv('408');
  };

  const handleProcessCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(reference);
      }, 1400);
    }, 1200);
  };

  const handleTransferPaid = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(reference);
      }, 1400);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Paystack Official Brand Header */}
        <div className="bg-[#0ba4db] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white font-black text-[#0ba4db] text-xs shadow-xs">
                P
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-100">
                  Secured by Paystack
                </h4>
                <div className="text-sm font-bold text-white truncate max-w-[240px]">
                  EduPay Software Ltd
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-sky-400/40 pt-3">
            <div className="text-xs text-sky-100 truncate pr-2">
              <span>{email}</span>
              <span className="block text-[10px] text-sky-200 mt-0.5">{planName}</span>
            </div>
            <div className="font-mono text-xl font-black text-white tabular-nums shrink-0">
              {formatCurrency(amount, currency)}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {step === 'details' && (
            <div className="space-y-4">
              {/* Channel Selector */}
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveChannel('card')}
                  className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md font-semibold transition-colors ${
                    activeChannel === 'card'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5 text-[#0ba4db]" />
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('bank_transfer')}
                  className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md font-semibold transition-colors ${
                    activeChannel === 'bank_transfer'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="h-3.5 w-3.5 text-[#0ba4db]" />
                  Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('ussd')}
                  className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-md font-semibold transition-colors ${
                    activeChannel === 'ussd'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5 text-[#0ba4db]" />
                  USSD
                </button>
              </div>

              {/* Card Channel Form */}
              {activeChannel === 'card' && (
                <form onSubmit={handleProcessCardPayment} className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">Card Number</label>
                      <button
                        type="button"
                        onClick={handleUseTestCard}
                        className="text-[10px] text-[#0ba4db] hover:underline font-medium"
                      >
                        Auto-fill Test Card
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs focus:border-[#0ba4db] focus:outline-none"
                      />
                      <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs focus:border-[#0ba4db] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs focus:border-[#0ba4db] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#0ba4db] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#098ec0] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Pay {formatCurrency(amount, currency)}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Bank Transfer Channel */}
              {activeChannel === 'bank_transfer' && (
                <div className="space-y-3 text-xs">
                  <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Pay via Dynamic Virtual Account
                    </span>
                    <div className="font-mono text-2xl font-black text-slate-900 tracking-wider">
                      9928 1402 91
                    </div>
                    <div className="text-xs text-slate-700 font-semibold">
                      Bank Name: <span className="text-[#0ba4db]">Wema Bank / Paystack Titan</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Account expires in <span className="font-mono font-bold text-slate-800">29:45 mins</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTransferPaid}
                    className="w-full rounded-lg bg-[#0ba4db] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#098ec0] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>I Have Sent the Transfer</span>
                  </button>
                </div>
              )}

              {/* USSD Channel */}
              {activeChannel === 'ussd' && (
                <div className="space-y-3 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <span className="text-slate-500 block">Dial on your registered phone:</span>
                    <div className="rounded bg-white p-2.5 font-mono text-center text-sm font-bold text-slate-900 border border-slate-200">
                      *737*2*{amount}*9821#
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">
                      Supported for GTBank, Zenith, Access, and Sterling Bank USSD banking.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTransferPaid}
                    className="w-full rounded-lg bg-[#0ba4db] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#098ec0] transition-colors"
                  >
                    Verify USSD Payment
                  </button>
                </div>
              )}

              {/* Trust Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-bit SSL Encrypted by Paystack Payment Gateway</span>
              </div>
            </div>
          )}

          {/* Processing State */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block animate-spin text-[#0ba4db]">
                <RefreshCw className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Authorizing with Paystack...</h4>
              <p className="text-xs text-slate-500">
                Contacting your issuing bank. Please do not close this window.
              </p>
            </div>
          )}

          {/* OTP Authorization Screen */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs py-2">
              <div className="text-center space-y-1">
                <Lock className="mx-auto h-7 w-7 text-[#0ba4db]" />
                <h4 className="text-sm font-bold text-slate-900">Two-Factor OTP Verification</h4>
                <p className="text-xs text-slate-500">
                  A verification code was sent to the phone linked to your card.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enter One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-center font-mono text-lg font-bold tracking-widest text-slate-900 focus:border-[#0ba4db] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400 text-center">
                  Test Sandbox OTP: <span className="font-mono font-bold text-slate-700">123456</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#0ba4db] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#098ec0]"
                >
                  Authorize Payment
                </button>
              </div>
            </form>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-slate-500">
                Reference: <span className="font-mono font-semibold text-slate-800">{reference}</span>
              </p>
              <div className="text-[11px] text-emerald-700 font-medium">
                Your subscription and receipts have been updated.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
