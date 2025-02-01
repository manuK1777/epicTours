export interface Artist {
  id: number;
  user_id?: number;
  name: string;
  email: string;
  contact: string;
  phone: string;
  webPage?: string | null;
  file?: string | null;
  created_at?: string;
  updated_at?: string;
  // Relations
  musicians?: any[];
  crew?: any[];
  events?: any[];
  venues?: any[];
  user?: any;
}
