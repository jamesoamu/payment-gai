import React, { useState, useEffect } from 'react';
import {
  DEFAULT_INSTITUTION,
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  INITIAL_BILLING_STATE,
  DEFAULT_FEE_CATALOG,
  DEFAULT_USER,
} from './data/mockData';
import {
  Student,
  PaymentRecord,
  InstitutionProfile,
  AppBillingState,
  FeeItem,
  UserAccount,
  BillingTier,
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { StudentsList } from './components/StudentsList';
import { StudentProfileModal } from './components/StudentProfileModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PaymentReminderModal } from './components/PaymentReminderModal';
import { PaystackBillingView } from './components/PaystackBillingView';
import { PaystackCheckoutModal } from './components/PaystackCheckoutModal';
import { FeeStructureManager } from './components/FeeStructureManager';
import { InstitutionSettingsModal } from './components/InstitutionSettingsModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { openPaystackInline } from './utils/paystack';
import { ArrowRight } from 'lucide-react';

export default function App() {
  // Current logged in user session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('edupay_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Main view router: 'landing' vs 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    try {
      const savedUser = localStorage.getItem('edupay_current_user');
      return savedUser ? 'app' : 'landing';
    } catch {
      return 'landing';
    }
  });

  // Auth Modal State
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
    selectedPlan?: BillingTier;
  }>({
    isOpen: false,
    mode: 'signin',
    selectedPlan: undefined,
  });

  // Persistent or Local State
  const [institution, setInstitution] = useState<InstitutionProfile>(() => {
    try {
      const saved = localStorage.getItem('edupay_institution');
      return saved ? JSON.parse(saved) : DEFAULT_INSTITUTION;
    } catch {
      return DEFAULT_INSTITUTION;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('edupay_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edupay_payments');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [billing, setBilling] = useState<AppBillingState>(() => {
    try {
      const saved = localStorage.getItem('edupay_billing');
      return saved ? JSON.parse(saved) : INITIAL_BILLING_STATE;
    } catch {
      return INITIAL_BILLING_STATE;
    }
  });

  const [feeCatalog, setFeeCatalog] = useState<FeeItem[]>(() => {
    try {
      const saved = localStorage.getItem('edupay_fees');
      return saved ? JSON.parse(saved) : DEFAULT_FEE_CATALOG;
    } catch {
      return DEFAULT_FEE_CATALOG;
    }
  });

  // Active view navigation within app workspace
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | undefined>(undefined);

  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<PaymentRecord | null>(null);

  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedStudentForReminder, setSelectedStudentForReminder] = useState<Student | undefined>(undefined);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Paystack checkout modal state
  const [paystackCheckout, setPaystackCheckout] = useState<{
    isOpen: boolean;
    amount: number;
    email: string;
    planName: string;
    onSuccessCallback?: (reference: string) => void;
  }>({
    isOpen: false,
    amount: 0,
    email: '',
    planName: '',
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('edupay_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('edupay_current_user');
      }
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('edupay_institution', JSON.stringify(institution));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }, [institution]);

  useEffect(() => {
    try {
      localStorage.setItem('edupay_students', JSON.stringify(students));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('edupay_payments', JSON.stringify(payments));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem('edupay_billing', JSON.stringify(billing));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }, [billing]);

  useEffect(() => {
    try {
      localStorage.setItem('edupay_fees', JSON.stringify(feeCatalog));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  }, [feeCatalog]);

  // Auth Success Handler (called by AuthModal on Sign In or Sign Up)
  const handleAuthSuccess = (
    user: UserAccount,
    customInstitution?: Partial<InstitutionProfile>
  ) => {
    setCurrentUser(user);
    if (customInstitution) {
      setInstitution((prev) => ({
        ...prev,
        ...customInstitution,
        currentTerm: prev.currentTerm || 'First Term 2026/2027 Academic Session',
      }));
    }
    if (user.preferredPlan) {
      setBilling((prev) => ({
        ...prev,
        currentPlan: user.preferredPlan || prev.currentPlan,
      }));
    }
    setViewMode('app');
    setActiveTab('dashboard');
  };

  // Quick Demo Launch Handler (bypasses modal, logs into interactive demo)
  const handleLaunchDemo = () => {
    setCurrentUser(DEFAULT_USER);
    setViewMode('app');
    setActiveTab('dashboard');
  };

  // Sign out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('edupay_current_user');
    setViewMode('landing');
  };

  // Payment Recording Handler
  const handlePaymentSuccess = (newPayment: PaymentRecord, updatedStudent: Student) => {
    setPayments((prev) => [newPayment, ...prev]);
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );

    // If profile modal is open for this student, sync it
    if (selectedStudentForProfile && selectedStudentForProfile.id === updatedStudent.id) {
      setSelectedStudentForProfile(updatedStudent);
    }

    setIsRecordPaymentOpen(false);
    // Immediately open the official receipt modal for printing/WhatsApp
    setSelectedPaymentForReceipt(newPayment);
  };

  // Add Student Handler
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  // Bulk Invoicing Handler
  const handleBulkGenerateInvoices = (selectedFeeIds: string[], targetClass: string) => {
    const includedFees = feeCatalog.filter((f) => selectedFeeIds.includes(f.id));
    const additionalAmount = includedFees.reduce((sum, f) => sum + f.amount, 0);

    setStudents((prev) =>
      prev.map((student) => {
        if (targetClass !== 'all' && student.className !== targetClass) {
          return student;
        }

        const newFeeItems = [
          ...student.feeItems,
          ...includedFees.map((f) => ({
            itemId: f.id,
            name: `${f.name} (${institution.currentTerm})`,
            amount: f.amount,
            paidAmount: 0,
            isPaid: false,
          })),
        ];

        const newTotalBilled = student.totalBilled + additionalAmount;
        const newBalance = newTotalBilled - student.totalPaid;
        const newStatus = newBalance <= 0 ? 'paid' : student.totalPaid > 0 ? 'partial' : 'unpaid';

        return {
          ...student,
          totalBilled: newTotalBilled,
          balance: newBalance,
          status: newStatus,
          feeItems: newFeeItems,
        };
      })
    );
  };

  // Paystack Launch Handler (checks SDK first, then opens our authentic Paystack checkout modal)
  const handleLaunchPaystack = (params: {
    amount: number;
    email: string;
    planName: string;
    onSuccess: (reference: string) => void;
  }) => {
    const openedInPopup = openPaystackInline({
      key: billing.paystackPublicKey,
      email: params.email,
      amount: params.amount,
      currency: institution.currency === 'USD' ? 'USD' : 'NGN',
      metadata: {
        custom_fields: [
          { display_name: 'Plan', variable_name: 'plan_name', value: params.planName },
          { display_name: 'Institution', variable_name: 'school_name', value: institution.name },
        ],
      },
      onSuccess: (ref) => {
        params.onSuccess(ref);
      },
      onClose: () => {
        // closed popup
      },
    });

    if (!openedInPopup) {
      // Fallback to our interactive built-in Paystack checkout modal
      setPaystackCheckout({
        isOpen: true,
        amount: params.amount,
        email: params.email,
        planName: params.planName,
        onSuccessCallback: params.onSuccess,
      });
    }
  };

  // Reset demo data handler
  const handleResetData = () => {
    if (confirm('Reset all students, payments, and fees to the default demo state?')) {
      localStorage.clear();
      setInstitution(DEFAULT_INSTITUTION);
      setStudents(INITIAL_STUDENTS);
      setPayments(INITIAL_PAYMENTS);
      setBilling(INITIAL_BILLING_STATE);
      setFeeCatalog(DEFAULT_FEE_CATALOG);
      setCurrentUser(DEFAULT_USER);
      setIsSettingsOpen(false);
    }
  };

  // Export full ledger JSON
  const handleExportData = () => {
    const data = {
      institution,
      students,
      payments,
      billing,
      feeCatalog,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    dlAnchor.setAttribute('download', `EduPay_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* If viewMode is 'landing', show full Landing Page */}
      {viewMode === 'landing' ? (
        <div className="flex flex-col min-h-screen">
          {/* If user is already authenticated in session, show quick banner to return to dashboard */}
          {currentUser && (
            <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  Signed in as <strong>{currentUser.fullName}</strong> ({institution.name})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('app')}
                  className="font-semibold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
                >
                  <span>Open Bursary Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          <LandingPage
            onOpenSignIn={() =>
              setAuthModal({
                isOpen: true,
                mode: 'signin',
                selectedPlan: undefined,
              })
            }
            onOpenSignUp={(plan) =>
              setAuthModal({
                isOpen: true,
                mode: 'signup',
                selectedPlan: plan,
              })
            }
            onLaunchDemo={handleLaunchDemo}
          />
        </div>
      ) : (
        /* Workspace App Mode */
        <div className="flex flex-col min-h-screen">
          {/* Top Header */}
          <Header
            institution={institution}
            billing={billing}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onOpenRecordPayment={() => {
              setSelectedStudentForPayment(undefined);
              setIsRecordPaymentOpen(true);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onViewLandingPage={() => setViewMode('landing')}
            onSignOut={handleSignOut}
          />

          {/* Main Workspace: Sidebar + Viewport Content */}
          <div className="flex flex-1">
            {/* Sidebar */}
            <Sidebar
              institution={institution}
              billing={billing}
              students={students}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              onOpenRecordPayment={() => {
                setSelectedStudentForPayment(undefined);
                setIsRecordPaymentOpen(true);
              }}
              onOpenReminderModal={(student) => {
                setSelectedStudentForReminder(student);
                setIsReminderOpen(true);
              }}
              onViewLandingPage={() => setViewMode('landing')}
              onSignOut={handleSignOut}
            />

            {/* Viewport content area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  students={students}
                  payments={payments}
                  institution={institution}
                  billing={billing}
                  onSelectStudent={(student) => setSelectedStudentForProfile(student)}
                  onOpenRecordPayment={(student) => {
                    setSelectedStudentForPayment(student);
                    setIsRecordPaymentOpen(true);
                  }}
                  onOpenReminderModal={(student) => {
                    setSelectedStudentForReminder(student);
                    setIsReminderOpen(true);
                  }}
                  onViewReceipt={(payment) => setSelectedPaymentForReceipt(payment)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'students' && (
                <StudentsList
                  students={students}
                  institution={institution}
                  feeCatalog={feeCatalog}
                  onSelectStudent={(student) => setSelectedStudentForProfile(student)}
                  onOpenRecordPayment={(student) => {
                    setSelectedStudentForPayment(student);
                    setIsRecordPaymentOpen(true);
                  }}
                  onOpenReminderModal={(student) => {
                    setSelectedStudentForReminder(student);
                    setIsReminderOpen(true);
                  }}
                  onAddStudent={handleAddStudent}
                />
              )}

              {activeTab === 'fee_structure' && (
                <FeeStructureManager
                  feeCatalog={feeCatalog}
                  institution={institution}
                  students={students}
                  onUpdateFeeCatalog={setFeeCatalog}
                  onBulkGenerateInvoices={handleBulkGenerateInvoices}
                />
              )}

              {activeTab === 'billing' && (
                <PaystackBillingView
                  billing={billing}
                  students={students}
                  institution={institution}
                  onUpdateBillingState={(newState) => setBilling((prev) => ({ ...prev, ...newState }))}
                  onLaunchPaystackCheckout={handleLaunchPaystack}
                />
              )}

              {activeTab === 'settings' && (
                <div className="py-4">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                      <h2 className="text-base font-bold text-slate-900 mb-1">
                        Institution &amp; Bursary Settings
                      </h2>
                      <p className="text-xs text-slate-600 mb-4">
                        Update your school name, contact details, official currency, and bank account for fee receipts.
                      </p>
                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                      >
                        Open Full Settings Modal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Auth Modal (Sign In & Sign Up) */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        selectedPlan={authModal.selectedPlan}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && (
        <RecordPaymentModal
          students={students}
          initialStudent={selectedStudentForPayment}
          institution={institution}
          billing={billing}
          onClose={() => setIsRecordPaymentOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onLaunchPaystackCheckout={(params) => {
            handleLaunchPaystack({
              amount: params.amount,
              email: params.email,
              planName: `Tuition Fee for ${params.studentName}`,
              onSuccess: params.onSuccess,
            });
          }}
        />
      )}

      {/* Student Ledger / Profile Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          payments={payments}
          institution={institution}
          onClose={() => setSelectedStudentForProfile(null)}
          onOpenRecordPayment={(student) => {
            setSelectedStudentForPayment(student);
            setIsRecordPaymentOpen(true);
          }}
          onOpenReminderModal={(student) => {
            setSelectedStudentForReminder(student);
            setIsReminderOpen(true);
          }}
          onViewReceipt={(payment) => setSelectedPaymentForReceipt(payment)}
        />
      )}

      {/* Official Receipt Modal */}
      {selectedPaymentForReceipt && (
        <ReceiptModal
          payment={selectedPaymentForReceipt}
          student={students.find((s) => s.id === selectedPaymentForReceipt.studentId)}
          institution={institution}
          onClose={() => setSelectedPaymentForReceipt(null)}
        />
      )}

      {/* Payment Reminder Modal */}
      {isReminderOpen && (
        <PaymentReminderModal
          students={students}
          student={selectedStudentForReminder}
          institution={institution}
          onClose={() => setIsReminderOpen(false)}
        />
      )}

      {/* Institution Settings Modal */}
      {isSettingsOpen && (
        <InstitutionSettingsModal
          institution={institution}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(updated) => setInstitution(updated)}
          onResetData={handleResetData}
          onExportData={handleExportData}
        />
      )}

      {/* Interactive Paystack Checkout Modal */}
      {paystackCheckout.isOpen && (
        <PaystackCheckoutModal
          amount={paystackCheckout.amount}
          email={paystackCheckout.email}
          planName={paystackCheckout.planName}
          currency={institution.currencySymbol}
          onSuccess={(ref) => {
            if (paystackCheckout.onSuccessCallback) {
              paystackCheckout.onSuccessCallback(ref);
            }
            setPaystackCheckout({
              isOpen: false,
              amount: 0,
              email: '',
              planName: '',
            });
          }}
          onClose={() => {
            setPaystackCheckout({
              isOpen: false,
              amount: 0,
              email: '',
              planName: '',
            });
          }}
        />
      )}
    </div>
  );
}

