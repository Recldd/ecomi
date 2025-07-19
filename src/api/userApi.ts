import axiosInstance from './axiosInstance';

// 사용자 정보 타입 정의
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  // 필요한 필드 추가
}

// 로그인 응답 타입 정의
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

// 사용자 정보 불러오기
export const fetchUserInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<UserInfo>('/user/info');
  return response.data;
};

// 로그인 요청
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};
