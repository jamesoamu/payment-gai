export type InstitutionType = 'school' | 'tutorial_center' | 'training_academy';

export type PaymentStatus = 'paid' | 'partial' | 'overdue' | 'unpaid';

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  category: 'Tuition' | 'Exam / Certification' | 'Materials & Books' | 'Tech / Lab Fee' | 'PTA / Facilities' | 'Coaching / Workshops';
  isMandatory: boolean;
}

export interface StudentFeeItem {
  itemId: string;
  name: string;
  amount: number;
  paidAmount: number;
  isPaid: boolean;
}

export interface Student {
  id: string;
  regNumber: string;
  fullName: string;
  gender: 'Male' | 'Female';
  className: string; // e.g. SS3 Alpha, Grade 11, UTME Intensive, Python Cohort 4
  institutionType: InstitutionType;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  totalBilled: number;
  totalPaid: number;
  balance: number;
  status: PaymentStatus;
  dueDate: string;
  enrollmentDate: string;
  feeItems: StudentFeeItem[];
  discountPercent?: number; // e.g. 5% sibling scholarship
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  regNumber: string;
  className: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Paystack Online' | 'Bank Transfer' | 'POS Terminal' | 'Cash Deposit' | 'Bank Draft';
  channel: 'card' | 'bank_transfer' | 'ussd' | 'cash' | 'pos';
  reference: string;
  termOrSession: string;
  verified: boolean;
  notes?: string;
  recordedBy?: string;
}

export type BillingTier = 'starter' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: BillingTier;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  studentLimit: number;
  targetAudience: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface AppBillingState {
  currentPlan: BillingTier;
  billingCycle: 'monthly' | 'annually';
  status: 'active' | 'trial' | 'past_due';
  nextBillingDate: string;
  cardLast4: string;
  cardBrand: string;
  paystackPublicKey: string;
  testMode: boolean;
  schoolFeeCollectionActive: boolean;
  invoices: AppInvoice[];
}

export interface AppInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  planName: string;
  amount: number;
  status: 'paid' | 'pending';
  reference: string;
  paymentMethod: string;
}

export interface InstitutionProfile {
  name: string;
  tagline: string;
  type: InstitutionType;
  currency: string;
  currencySymbol: string;
  email: string;
  phone: string;
  address: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  currentTerm: string;
  logoUrl?: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'bursar' | 'principal' | 'director' | 'accountant';
  institutionName: string;
  institutionType: InstitutionType;
  currency: string;
  currencySymbol: string;
  preferredPlan?: BillingTier;
  avatarUrl?: string;
  createdAt: string;
}

