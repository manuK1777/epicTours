export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export type AuthResponse = {
  code?: number;
  message?: string;
  data?: AuthResponseData;
  error?: string | null;
} | AuthResponseData;
