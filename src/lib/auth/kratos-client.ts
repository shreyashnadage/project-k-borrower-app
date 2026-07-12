export interface KratosSession {
  id: string;
  active: boolean;
  identity: {
    id: string;
    traits: {
      phone: string;
      name?: string;
    };
  };
}

export interface AuthClient {
  login(phone: string, otp: string): Promise<KratosSession>;
  register(phone: string, otp: string, name: string): Promise<KratosSession>;
  getSession(): Promise<KratosSession | null>;
  logout(): Promise<void>;
  sendOtp(phone: string): Promise<{ flow_id: string }>;
}

const KRATOS_URL = process.env.NEXT_PUBLIC_KRATOS_URL || 'http://localhost:4433';

export const kratosClient: AuthClient = {
  async login(phone, otp) {
    const res = await fetch(`${KRATOS_URL}/self-service/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'code', identifier: phone, code: otp }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(phone, otp, name) {
    const res = await fetch(`${KRATOS_URL}/self-service/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'code', traits: { phone, name }, code: otp }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async getSession() {
    try {
      const res = await fetch(`${KRATOS_URL}/sessions/whoami`, { credentials: 'include' });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async logout() {
    await fetch(`${KRATOS_URL}/self-service/logout`, { method: 'POST', credentials: 'include' });
  },

  async sendOtp(phone) {
    const res = await fetch(`${KRATOS_URL}/self-service/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'code', identifier: phone }),
    });
    if (!res.ok) throw new Error('Failed to send OTP');
    return res.json();
  },
};
