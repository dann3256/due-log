// APIラッパー関数（UIとエンドポイントの機能を結び付ける関数）

import apiClient from './apiClient';
import type { 
  RegisterRequest, 
  UserResponse, 
  LoginRequest, 
  LoginResponse 
} from '../types/types.tsx';

/**
 * 新規ユーザー登録を行う
 */
export const registerUser = async (data: RegisterRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/register', data);
  return response.data;
};

/**
 * ログイン処理を行う
 */
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', data);
  return response.data;
};