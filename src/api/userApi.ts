import axiosInstance from './axiosInstance';

// 사용자 정보 타입 정의
export interface UserInfo {
  id : string;
  quesion : string;
  correctAnswer : string;
  options : string;
}

// 로그인 응답 타입 정의
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

// 사용자 정보 불러오기
export const fetchUserInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<UserInfo>('/hello?option=a&num=10');
  console.log("사용자 정보:", response.data);
  return response.data;
};

export const fetchQuiz = async () => {
  const response = await axiosInstance.get('/hello');
  console.log("퀴즈 정보:", response.data);
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
