export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'user';
  created_at?: string;
  updated_at?: string;
}
