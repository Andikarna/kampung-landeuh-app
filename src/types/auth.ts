export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  roleId: number;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
