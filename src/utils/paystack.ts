// Paystack Inline SDK Integration and Helper

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number; // in kobo (multiply Naira by 100)
        currency?: string;
        ref?: string;
        metadata?: Record<string, any>;
        callback: (response: { reference: string; status: string; trans: string; message: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export function generatePaystackReference(prefix: string = 'EDU'): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}_${timestamp}_${random}`;
}

export interface PaystackInitParams {
  key: string;
  email: string;
  amount: number; // in normal currency units (e.g. 35000 NGN)
  currency?: string;
  reference?: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export function openPaystackInline(params: PaystackInitParams): boolean {
  if (typeof window !== 'undefined' && window.PaystackPop && window.PaystackPop.setup) {
    try {
      const handler = window.PaystackPop.setup({
        key: params.key || 'pk_test_sample_edupay_tracker_2026',
        email: params.email,
        amount: Math.round(params.amount * 100), // Kobo conversion
        currency: params.currency || 'NGN',
        ref: params.reference || generatePaystackReference('APP_SUB'),
        metadata: params.metadata,
        callback: (response) => {
          params.onSuccess(response.reference);
        },
        onClose: () => {
          params.onClose();
        },
      });
      handler.openIframe();
      return true;
    } catch (e) {
      console.warn('Paystack inline SDK error, switching to interactive Paystack modal:', e);
      return false;
    }
  }
  return false;
}
