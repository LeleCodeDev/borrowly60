import type { User } from "./user";

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginError {
  email: string;
  password: string;
}

export interface RegisterError {
  username: string;
  password: string;
  email: string;
  phone: string;
}
