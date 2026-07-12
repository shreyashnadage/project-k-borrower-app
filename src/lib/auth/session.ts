import { kratosClient } from './kratos-client';
import { mockAuthClient } from './mock-provider';
import type { AuthClient } from './kratos-client';

export function getAuthClient(): AuthClient {
  if (process.env.NEXT_PUBLIC_AUTH_MOCK === 'true') {
    return mockAuthClient;
  }
  return kratosClient;
}

export { type KratosSession, type AuthClient } from './kratos-client';
