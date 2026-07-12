import type { AuthClient, KratosSession } from './kratos-client';

const MOCK_DELAY = 800;
const MOCK_OTP = '123456';

let mockSession: KratosSession | null = null;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockAuthClient: AuthClient = {
  async sendOtp(phone) {
    await delay(MOCK_DELAY);
    if (!/^\d{10}$/.test(phone)) throw new Error('Invalid phone number');
    return { flow_id: 'mock-flow-' + Date.now() };
  },

  async login(phone, otp) {
    await delay(MOCK_DELAY);
    if (otp !== MOCK_OTP) throw new Error('Invalid OTP');
    mockSession = {
      id: 'session-' + Date.now(),
      active: true,
      identity: {
        id: 'user-' + phone,
        traits: { phone, name: 'Test Vendor' },
      },
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_session', JSON.stringify(mockSession));
    }
    return mockSession;
  },

  async register(phone, otp, name) {
    await delay(MOCK_DELAY);
    if (otp !== MOCK_OTP) throw new Error('Invalid OTP');
    mockSession = {
      id: 'session-' + Date.now(),
      active: true,
      identity: {
        id: 'user-' + phone,
        traits: { phone, name },
      },
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_session', JSON.stringify(mockSession));
    }
    return mockSession;
  },

  async getSession() {
    await delay(100);
    if (mockSession) return mockSession;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock_session');
      if (stored) {
        mockSession = JSON.parse(stored);
        return mockSession;
      }
    }
    return null;
  },

  async logout() {
    await delay(300);
    mockSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_session');
    }
  },
};
