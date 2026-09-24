import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Mail,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Send,
  Building,
  CreditCard,
} from 'lucide-react';
import { Student, InstitutionProfile } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PaymentReminderModalProps {
  students: Student[];
  student?: Student;
  institution: InstitutionProfile;
  onClose: () => void;
}

export const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({
  students,
  student: initialStudent,
  institution,
  onClose,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students.find((s) => s.balance > 0)?.id || students[0]?.id || ''
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const [reminderType, setReminderType] = useState<'friendly' | 'installment' | 'urgent'>('installment');
  const [copied, setCopied] = useState<boolean>(false);
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  if (!selectedStudent) {
    return null;
  }

  const balanceFormatted = formatCurrency(selectedStudent.balance, institution.currencySymbol);
  const dueDateFormatted = formatDate(selectedStudent.dueDate);

  // Generate dynamic message content based on tone & template
  let messageSubject = `School Fee Statement: ${selectedStudent.fullName} - ${institution.name}`;
  let messageBody = '';

  if (reminderType === 'friendly') {
    messageBody = `Dear ${selectedStudent.guardianName},\n\n` +
      `Warm greetings from ${institution.name}.\n\n` +
      `This is a gentle reminder regarding the school fee assessment for your ward, *${selectedStudent.fullName}* (${selectedStudent.className}).\n\n` +
      `• Outstanding Balance: *${balanceFormatted}*\n` +
      `• Due Date: *${dueDateFormatted}*\n\n` +
      `You may make payment directly via:\n` +
      `🏦 Bank Transfer: ${institution.bankName}\n` +
      `🔢 Account No: ${institution.accountNumber}\n` +
      `🏷️ Account Name: ${institution.accountName}\n` +
      `💳 Or pay securely online via Paystack: https://paystack.com/pay/apex-fees-${selectedStudent.regNumber.replace(/\//g, '-')}\n\n` +
      `Please forward proof of payment once completed. Thank you for your continued support!`;
  } else if (reminderType === 'installment') {
    messageBody = `Dear ${selectedStudent.guardianName},\n\n` +
      `Greetings from the Bursary Unit of ${institution.name}.\n\n` +
      `We acknowledge the previous partial settlement made for *${selectedStudent.fullName}* (${selectedStudent.className}).\n\n` +
      `The remaining installment balance of *${balanceFormatted}* is due for clearance by *${dueDateFormatted}*.\n\n` +
      `Kindly finalize payment using either method below:\n` +
      `1. Instant Online Card/Transfer via Paystack: https://paystack.com/pay/apex-fees-${selectedStudent.regNumber.replace(/\//g, '-')}\n` +
      `2. Bank Deposit: ${institution.bankName} | ${institution.accountNumber} (${institution.accountName})\n\n` +
      `Thank you for ensuring timely settlement.`;
  } else {
    // Urgent
    messageSubject = `URGENT: Outstanding School Fee Notice for ${selectedStudent.fullName}`;
    messageBody = `URGENT NOTICE: ${institution.name.toUpperCase()}\n\n` +
      `Dear ${selectedStudent.guardianName},\n\n` +
      `Our records show that the school fee balance of *${balanceFormatted}* for *${selectedStudent.fullName}* (${selectedStudent.className}) is now past due (Deadline: ${dueDateFormatted}).\n\n` +
      `Students with outstanding balances will not receive examination clearance cards.\n\n` +
      `To avoid any disruption to academic activities, please clear this balance immediately:\n` +
      `• Quick Paystack Link: https://paystack.com/pay/apex-fees-${selectedStudent.regNumber.replace(/\//g, '-')}\n` +
      `• Bank Transfer: ${institution.bankName} | ${institution.accountNumber} | ${institution.accountName}\n\n` +
      `If you have already made this transfer today, kindly send your receipt to ${institution.phone}.`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(channel === 'email' ? `Subject: ${messageSubject}\n\n${messageBody}` : messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = selectedStudent.guardianPhone.replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`
      : `https://wa.me/?text=${encodeURIComponent(messageBody)}`;
    window.open(url, '_blank');
  };

  const handleOpenMailto = () => {
    const email = selectedStudent.guardianEmail || '';
    const url = `mailto:${email}?subject=${encodeURIComponent(messageSubject)}&body=${encodeURIComponent(messageBody)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Send Payment Reminder</h3>
              <p className="text-xs text-slate-500">Automated WhatsApp, SMS and Email notices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Student Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.regNumber}) - Bal: {formatCurrency(s.balance, institution.currencySymbol)}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Snapshot Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">{selectedStudent.guardianName}</div>
              <div className="text-[11px] font-mono text-slate-500">
                Phone: {selectedStudent.guardianPhone} · Email: {selectedStudent.guardianEmail || 'None'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Balance Pending</div>
              <div className="text-sm font-bold font-mono text-rose-700">
                {balanceFormatted}
              </div>
            </div>
          </div>

          {/* Template Tone Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reminder Template & Tone</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReminderType('friendly')}
                className={`rounded-lg border p-2 text-left transition-colors ${
                  reminderType === 'friendly'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">Friendly Notice</div>
                <div className="text-[10px] text-slate-400">Approaching due date</div>
              </button>

              <button
                type="button"
                onClick={() => setReminderType('installment')}
                className={`rounded-lg border p-2 text-left transition-colors ${
                  reminderType === 'installment'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">Installment Bal.</div>
                <div className="text-[10px] text-slate-400">Part payment follow-up</div>
              </button>

              <button
                type="button"
                onClick={() => setReminderType('urgent')}
                className={`rounded-lg border p-2 text-left transition-colors ${
                  reminderType === 'urgent'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">Urgent Overdue</div>
                <div className="text-[10px] text-slate-400">Exam clearance alert</div>
              </button>
            </div>
          </div>

          {/* Channel selector tabs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Message Channel Preview</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    channel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    channel === 'sms' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  SMS
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    channel === 'email' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Email
                </button>
              </div>
            </div>

            {channel === 'email' && (
              <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-[11px] text-slate-700">
                <span className="font-semibold text-slate-500">Subject: </span>
                {messageSubject}
              </div>
            )}

            <div className="relative">
              <textarea
                rows={9}
                readOnly
                value={messageBody}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 font-mono text-xs text-slate-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" />
                    Copy Text
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-white"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {channel === 'whatsapp' && (
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Open WhatsApp Web / App
              </button>
            )}

            {channel === 'email' && (
              <button
                type="button"
                onClick={handleOpenMailto}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Draft in Mail App
              </button>
            )}

            {channel === 'sms' && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy SMS Text
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
