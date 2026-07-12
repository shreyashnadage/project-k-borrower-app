export interface Invoice {
  id: string;
  irn: string;
  anchor: string;
  amount: number;
  date: string;
  imsStatus: 'accepted' | 'pending' | 'rejected';
}

export interface LoanApplication {
  id: string;
  invoiceId: string;
  anchor: string;
  amount: number;
  requestedAmount: number;
  tenure: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  gateStatus: {
    d0: 'pending' | 'passed' | 'failed';
    d1: 'pending' | 'passed' | 'failed';
    d2: 'pending' | 'passed' | 'failed';
    d3: 'pending' | 'passed' | 'failed';
    lender: 'pending' | 'passed' | 'failed';
  };
  createdAt: string;
  offerId?: string;
}

export interface LoanOffer {
  id: string;
  applicationId: string;
  lender: string;
  amount: number;
  rate: number;
  tenure: number;
  emi: number;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface ActiveLoan {
  id: string;
  lender: string;
  amount: number;
  outstanding: number;
  emi: number;
  nextDueDate: string;
  status: 'active' | 'completed';
}

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', irn: 'a'.repeat(64), anchor: 'Tata AutoComp Systems', amount: 450000, date: '2026-07-01', imsStatus: 'accepted' },
  { id: 'INV-002', irn: 'b'.repeat(64), anchor: 'Bharat Forge Ltd', amount: 320000, date: '2026-07-05', imsStatus: 'accepted' },
  { id: 'INV-003', irn: 'c'.repeat(64), anchor: 'Kirloskar Oil Engines', amount: 180000, date: '2026-07-08', imsStatus: 'pending' },
];

export const mockApplications: LoanApplication[] = [
  {
    id: 'APP-001',
    invoiceId: 'INV-001',
    anchor: 'Tata AutoComp Systems',
    amount: 450000,
    requestedAmount: 400000,
    tenure: 90,
    status: 'approved',
    gateStatus: { d0: 'passed', d1: 'passed', d2: 'passed', d3: 'passed', lender: 'passed' },
    createdAt: '2026-07-02',
    offerId: 'OFF-001',
  },
  {
    id: 'APP-002',
    invoiceId: 'INV-002',
    anchor: 'Bharat Forge Ltd',
    amount: 320000,
    requestedAmount: 280000,
    tenure: 60,
    status: 'processing',
    gateStatus: { d0: 'passed', d1: 'passed', d2: 'pending', d3: 'pending', lender: 'pending' },
    createdAt: '2026-07-06',
  },
];

export const mockOffers: LoanOffer[] = [
  {
    id: 'OFF-001',
    applicationId: 'APP-001',
    lender: 'IDFC First Bank',
    amount: 400000,
    rate: 14.5,
    tenure: 90,
    emi: 138500,
    expiresAt: '2026-07-15',
    status: 'pending',
  },
];

export const mockActiveLoans: ActiveLoan[] = [
  {
    id: 'LOAN-001',
    lender: 'Kotak Mahindra Bank',
    amount: 250000,
    outstanding: 170000,
    emi: 86000,
    nextDueDate: '2026-07-25',
    status: 'active',
  },
];
