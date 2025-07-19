// import React, { useEffect, useState } from 'react';
// import { fetchUserInfo, UserInfo } from './api/userApi';

// const MyPage: React.FC = () => {
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

//   useEffect(() => {
//     fetchUserInfo()
//       .then((data) => setUserInfo(data))
//       .catch((error) => console.error('사용자 정보 로딩 실패:', error));
//   }, []);

//   return (
//     <div>
//       {userInfo ? (
//         <div>안녕하세요, {userInfo.num}님</div>
//       ) : (
//         <div>로딩 중...</div>
//       )}
//     </div>
//   );
// };

// export default MyPage;
