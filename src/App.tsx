// Update the import path if needed, or create the file at './components/ui/button.tsx'
import { Button } from "./components/ui/button";
import { EcoRobotLogo } from "./components/EcoRobotLogo";
import { RandomQuizViewer, QuizSet } from "./components/RandomQuizViewer";
import { QuizPlayer } from "./components/QuizPlayer";
import { RefreshCw, Play, ArrowLeft } from "lucide-react";
import { useState } from "react";
import './globals.css';
import { fetchUserInfo, UserInfo } from './api/userApi';

type ScreenType = "main" | "quiz-viewer" | "quiz-player" | "robot-connect";

export default function App() {
  console.log("으아아악")
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("main");
  const [quizKey, setQuizKey] = useState(0); // 퀴즈 컴포넌트 재렌더링용
  const [savedQuizSets, setSavedQuizSets] = useState<QuizSet[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // const handleRobotConnect = () => {
  //   console.log("로봇 연결 버튼 클릭됨");
  //   // 로봇 연결 로직 구현
  //   setCurrentScreen("robot-connect");
  // };

  const handleRobotConnect = () => {


    setCurrentScreen("robot-connect");
  };


  const handleQuizViewer = () => {
  fetchUserInfo()
    .then((data) => setUserInfo(data))
    .catch((error) => console.error('사용자 정보 로딩 실패:', error));

    //console.log("퀴즈 조회 시작", data);
    setCurrentScreen("quiz-viewer");
  };

  const handleQuizPlayer = () => {
    console.log("퀴즈 풀기 시작");
    setCurrentScreen("quiz-player");
  };

  const handleRefresh = () => {
    console.log("새로운 퀴즈 추출");
    // 퀴즈 컴포넌트를 새로 마운트하여 새로운 퀴즈 가져오기
    setQuizKey(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentScreen === "quiz-player") {
      setCurrentScreen("quiz-viewer");
    } else {
      setCurrentScreen("main");
    }
  };

  const handlePlayQuiz = () => {
    setCurrentScreen("quiz-player");
  };

  const handleQuizSetsUpdate = (quizSets: QuizSet[]) => {
    console.log("퀴즈셋 업데이트");
    setSavedQuizSets(quizSets);
  };

  // 퀴즈셋을 객관식 형태로 변환
  const convertToMultipleChoiceQuizSets = (quizSets: QuizSet[]) => {
    return quizSets.map(quizSet => ({
      id: quizSet.id,
      name: quizSet.name,
      createdAt: quizSet.createdAt,
      quizzes: quizSet.quizzes
        .filter((quiz: any) => quiz.options && quiz.correctAnswer !== undefined)
        .map((quiz: any) => ({
          id: quiz.id,
          question: quiz.question,
          options: quiz.options!,
          correctAnswer: quiz.correctAnswer!
        }))
    })).filter(quizSet => quizSet.quizzes.length > 0);
  };

  // 메인 화면
  console.log(currentScreen)
  if (currentScreen === "main") {
    return (
      <div className="min-h-0 h-screen bg-background p-8 flex flex-col items-center justify-center line-seed">
        {/* 상단 로고 영역 */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-56 h-56 bg-green-50 rounded-full border-2 border-green-300 flex items-center justify-center p-6">
            <EcoRobotLogo className="w-full h-full" />
          </div>
        </div>
        {/* 하단 버튼 영역 */}
        <div className="flex flex-row gap-8 justify-center items-center w-full max-w-7xl">
          <Button
            onClick={handleRobotConnect}
            className="w-72 h-20 bg-sky-400 hover:bg-sky-500 text-white rounded-xl border-2 border-sky-300 shadow-lg transition-all duration-200 hover:shadow-xl text-2xl font-semibold"
          >
            로봇 연결
          </Button>
          <Button
            onClick={handleQuizViewer}
            className="w-72 h-20 bg-gray-900 hover:bg-gray-800 text-white rounded-xl border-2 border-gray-700 shadow-lg transition-all duration-200 hover:shadow-xl text-2xl font-semibold"
          >
            퀴즈 조회
          </Button>
        </div>
      </div>
    );
  }

  // 퀴즈 조회 화면
  if (currentScreen === "quiz-viewer") {
    return (
      <div className="min-h-0 h-screen bg-background p-8 flex flex-col items-center line-seed relative">
        {/* 상단 퀴즈 영역 */}
        <div className="flex-1 mb-8 w-full max-w-7xl">
          <RandomQuizViewer 
            key={quizKey} 
            onQuizSetsUpdate={handleQuizSetsUpdate}
          />
        </div>
        {/* 좌하단, 우하단 버튼 영역 */}
        <div className="fixed left-8 bottom-8 z-50">
          <Button
            onClick={handleBack}
            className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 shadow-lg flex items-center justify-center"
            variant="ghost"
          >
            <ArrowLeft className="w-8 h-8 text-gray-700" />
          </Button>
        </div>
        <div className="fixed right-8 bottom-8 z-50 flex gap-3">
          <Button
            onClick={handlePlayQuiz}
            className="w-16 h-16 rounded-full bg-green-100 hover:bg-green-200 border-2 border-green-300 shadow-lg flex items-center justify-center"
            variant="ghost"
          >
            <Play className="w-8 h-8 text-green-700" />
          </Button>
        </div>
      </div>
    );
  }

  // 퀴즈 풀이 화면
  if (currentScreen === "quiz-player") {
    return (
      <div className="min-h-0 h-screen bg-background p-8 flex flex-col items-center line-seed relative">
        {/* 상단 퀴즈 플레이어 영역 */}
        <div className="flex-1 mb-8 w-full max-w-7xl">
          <QuizPlayer savedQuizSets={convertToMultipleChoiceQuizSets(savedQuizSets)} />
        </div>
        {/* 좌하단, 우하단 버튼 영역 */}
        <div className="fixed left-8 bottom-8 z-50">
          <Button
            onClick={handleBack}
            className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 shadow-lg flex items-center justify-center"
            variant="ghost"
          >
            <ArrowLeft className="w-8 h-8 text-gray-700" />
          </Button>
        </div>
      </div>
    );
  }
  //로봇 연결
  if (currentScreen === "robot-connect") {
    return (
      <div className="min-h-0 h-screen bg-background p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">로봇 연결 화면</h1>
        <p>로봇 연결 기능을 구현하세요.</p>
        <Button onClick={() => setCurrentScreen("main")} className="mt-4" variant={'outline'} style={{ display: 'flex', alignItems: '' }}>
          <ArrowLeft className="w-8 h-8 text-gray-700" />
          연결 마치기
        </Button>
      </div>
    );
  }

  return <>안녕하세요</>;
}