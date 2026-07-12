import { mockInvoices, mockApplications, mockOffers, mockActiveLoans } from './mock-data';
import type { Invoice, LoanApplication, LoanOffer, ActiveLoan } from './mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
const PLATFORM_BASE = process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_AUTH_MOCK === 'true';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiClient = {
  async getInvoices(): Promise<Invoice[]> {
    if (USE_MOCK) { await delay(500); return mockInvoices.filter(i => i.imsStatus === 'accepted'); }
    const res = await fetch(`${API_BASE}/invoices`, { credentials: 'include' });
    return res.json();
  },

  async getApplications(): Promise<LoanApplication[]> {
    if (USE_MOCK) { await delay(500); return mockApplications; }
    const res = await fetch(`${API_BASE}/applications`, { credentials: 'include' });
    return res.json();
  },

  async getApplication(id: string): Promise<LoanApplication | null> {
    if (USE_MOCK) { await delay(300); return mockApplications.find(a => a.id === id) || null; }
    const res = await fetch(`${API_BASE}/applications/${id}`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  },

  async createApplication(data: { invoiceId: string; amount: number; tenure: number }): Promise<LoanApplication> {
    if (USE_MOCK) {
      await delay(1000);
      const invoice = mockInvoices.find(i => i.id === data.invoiceId)!;
      const app: LoanApplication = {
        id: 'APP-' + Date.now(),
        invoiceId: data.invoiceId,
        anchor: invoice.anchor,
        amount: invoice.amount,
        requestedAmount: data.amount,
        tenure: data.tenure,
        status: 'processing',
        gateStatus: { d0: 'passed', d1: 'pending', d2: 'pending', d3: 'pending', lender: 'pending' },
        createdAt: new Date().toISOString().split('T')[0],
      };
      mockApplications.push(app);
      return app;
    }
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return res.json();
  },

  async getOffer(id: string): Promise<LoanOffer | null> {
    if (USE_MOCK) { await delay(300); return mockOffers.find(o => o.id === id) || null; }
    const res = await fetch(`${API_BASE}/offers/${id}`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  },

  async respondToOffer(id: string, accept: boolean): Promise<void> {
    if (USE_MOCK) {
      await delay(800);
      const offer = mockOffers.find(o => o.id === id);
      if (offer) offer.status = accept ? 'accepted' : 'rejected';
      return;
    }
    await fetch(`${API_BASE}/offers/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accept }),
      credentials: 'include',
    });
  },

  async getActiveLoans(): Promise<ActiveLoan[]> {
    if (USE_MOCK) { await delay(500); return mockActiveLoans; }
    const res = await fetch(`${API_BASE}/loans`, { credentials: 'include' });
    return res.json();
  },

  async getDashboardStats(): Promise<{ activeLoans: number; pendingApplications: number; totalDisbursed: number }> {
    if (USE_MOCK) {
      await delay(300);
      return { activeLoans: mockActiveLoans.length, pendingApplications: mockApplications.filter(a => a.status === 'processing' || a.status === 'pending').length, totalDisbursed: 250000 };
    }
    const res = await fetch(`${API_BASE}/dashboard/stats`, { credentials: 'include' });
    return res.json();
  },

  async activateInvite(data: {
    invite_token: string;
    name: string;
    gstin: string;
    phone: string;
    udyam_number?: string;
  }): Promise<{ vendor_id: string; status: string; message: string }> {
    if (USE_MOCK) {
      await delay(1000);
      return { vendor_id: 'mock-vendor-' + Date.now(), status: 'active', message: 'Account activated.' };
    }
    const res = await fetch(`${PLATFORM_BASE}/vendors/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Activation failed' }));
      throw new Error(err.detail || 'Activation failed');
    }
    return res.json();
  },
};
