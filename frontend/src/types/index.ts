export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  is_active: boolean;  
  year: number;
}

export interface Gift {
  id: number;
  name: string;
  description: string;
  campaign_id: number;
}

export interface Order {
  id: number;
  user_id: number;
  gift_id: number;
}

// Added these to fix your login and api errors
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  detail?: string;
  error?: string;
}