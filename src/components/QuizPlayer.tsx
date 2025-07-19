import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

export interface MultipleChoiceQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface MultipleChoiceQuizSet {
  id: string;
  name: string;
  quizzes: MultipleChoiceQuiz[];
  createdAt: string;
}

// 객관식 환경 퀴즈 데이터
const multipleChoiceQuizDatabase: MultipleChoiceQuiz[] = [
  {
    id: "1",
    question: "지구 온난화의 주요 원인인 온실가스 중 가장 많은 비중을 차지하는 것은?",
    options: ["이산화탄소(CO₂)", "메탄(CH₄)", "아산화질소(N₂O)", "프레온가스(CFC)"],
    correctAnswer: 0
  },
  {
    id: "2",
    question: "다음 중 재활용이 불가능한 것은?",
    options: ["종이컵", "알루미늄 캔", "유리병", "PET병"],
    correctAnswer: 0
  },
  {
    id: "3",
    question: "생물다양성이 가장 풍부한 생태계는?",
    options: ["사막", "열대우림", "초원", "툰드라"],
    correctAnswer: 1
  },
  {
    id: "4",
    question: "미세먼지(PM2.5)의 직경은?",
    options: ["2.5mm 이하", "2.5μm 이하", "25μm 이하", "250μm 이하"],
    correctAnswer: 1
  },
  {
    id: "5",
    question: "지구상 담수의 비율은 약 몇 %인가요?",
    options: ["1%", "3%", "5%", "10%"],
    correctAnswer: 1
  },
  {
    id: "6",
    question: "가정에서 전력 소비가 가장 많은 가전제품은?",
    options: ["냉장고", "에어컨", "세탁기", "TV"],
    correctAnswer: 1
  },
  {
    id: "7",
    question: "오존층 파괴의 주요 원인 물질은?",
    options: ["이산화탄소", "프레온가스(CFC)", "메탄", "일산화탄소"],
    correctAnswer: 1
  },
  {
    id: "8",
    question: "산성비의 주요 원인은?",
    options: ["황산화물과 질소산화물", "이산화탄소", "메탄가스", "수증기"],
    correctAnswer: 0
  },
  {
    id: "9",
    question: "재생에너지가 아닌 것은?",
    options: ["태양광", "풍력", "천연가스", "지열"],
    correctAnswer: 2
  },
  {
    id: "10",
    question: "지속가능한 발전의 핵심 원칙은?",
    options: ["경제성장 우선", "환경보호 우선", "현재와 미래세대의 균형", "기술발전 우선"],
    correctAnswer: 2
  }
];

interface QuizPlayerProps {
  savedQuizSets?: MultipleChoiceQuizSet[];
}

export function QuizPlayer({ savedQuizSets = [] }: QuizPlayerProps) {
  const [currentQuizSet, setCurrentQuizSet] = useState<MultipleChoiceQuizSet | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // 랜덤 퀴즈셋 생성
  const generateRandomQuizSet = (count: number = 5): MultipleChoiceQuizSet => {
    const shuffled = [...multipleChoiceQuizDatabase].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, multipleChoiceQuizDatabase.length));
    
    return {
      id: "random",
      name: "랜덤 퀴즈",
      quizzes: selected,
      createdAt: new Date().toLocaleString('ko-KR')
    };
  };

  const handleQuizSetSelect = (quizSetId: string) => {
    if (quizSetId === "random") {
      setCurrentQuizSet(generateRandomQuizSet());
    } else {
      const quizSet = savedQuizSets.find(set => set.id === quizSetId);
      if (quizSet) {
        setCurrentQuizSet(quizSet);
      }
    }
    // 퀴즈 상태 초기화
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers({});
    setIsQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return; // 결과 표시 중일 때는 선택 불가
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuizSet) return;

    const currentQuiz = currentQuizSet.quizzes[currentQuizIndex];
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    
    // 답안 기록
    setAnswers(prev => ({
      ...prev,
      [currentQuiz.id]: selectedAnswer
    }));

    // 점수 업데이트
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
  };

  const handleNextQuiz = () => {
    if (!currentQuizSet) return;

    if (currentQuizIndex < currentQuizSet.quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers({});
    setIsQuizCompleted(false);
  };

  const getCurrentQuiz = () => {
    if (!currentQuizSet) return null;
    return currentQuizSet.quizzes[currentQuizIndex];
  };

  const currentQuiz = getCurrentQuiz();
  const progress = currentQuizSet ? ((currentQuizIndex + 1) / currentQuizSet.quizzes.length) * 100 : 0;

  // 퀴즈셋 선택 화면
  if (!currentQuizSet) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-2">환경 퀴즈 풀기</h2>
          <p className="text-muted-foreground">풀고 싶은 퀴즈 셋을 선택하세요</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>퀴즈 셋 선택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button
                onClick={() => handleQuizSetSelect("random")}
                className="w-full h-16 text-lg"
                variant="outline"
              >
                <div className="text-center">
                  <div className="font-medium">랜덤 퀴즈</div>
                  <div className="text-sm text-muted-foreground">데이터베이스에서 랜덤으로 5문제</div>
                </div>
              </Button>

              {savedQuizSets.length > 0 && (
                <>
                  <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">
                    저장된 퀴즈 셋
                  </div>
                  {savedQuizSets.map((quizSet) => (
                    <Button
                      key={quizSet.id}
                      onClick={() => handleQuizSetSelect(quizSet.id)}
                      className="w-full h-16 text-lg"
                      variant="outline"
                    >
                      <div className="text-center">
                        <div className="font-medium">{quizSet.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {quizSet.quizzes.length}문제 • {quizSet.createdAt}
                        </div>
                      </div>
                    </Button>
                  ))}
                </>
              )}
            </div>

            {savedQuizSets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>저장된 퀴즈 셋이 없습니다.</p>
                <p className="text-sm">퀴즈 조회 화면에서 퀴즈를 저장해보세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 퀴즈 완료 화면
  if (isQuizCompleted) {
    const percentage = Math.round((score / currentQuizSet.quizzes.length) * 100);
    
    return (
      <div className="w-full">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">퀴즈 완료!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-medium text-primary">
              {score}/{currentQuizSet.quizzes.length}
            </div>
            <div className="text-xl">
              정답률: {percentage}%
            </div>
            
            <div className="space-y-2">
              {percentage >= 80 && (
                <p className="text-green-600 font-medium">훌륭합니다! 🎉</p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-blue-600 font-medium">잘했어요! 👏</p>
              )}
              {percentage < 60 && (
                <p className="text-orange-600 font-medium">더 공부해보세요! 📚</p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestartQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                다시 풀기
              </Button>
              <Button onClick={() => setCurrentQuizSet(null)}>
                다른 퀴즈 선택
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 퀴즈 풀이 화면
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-medium">{currentQuizSet.name}</h2>
            <p className="text-muted-foreground">
              문제 {currentQuizIndex + 1} / {currentQuizSet.quizzes.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">현재 점수</div>
            <div className="text-xl font-medium">{score} / {currentQuizIndex + (showResult ? 1 : 0)}</div>
          </div>
        </div>
        <Progress value={progress} className="w-full h-2" />
      </div>

      {currentQuiz && (
        <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* 왼쪽: 문제 영역 */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">문제</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg leading-relaxed p-6 bg-slate-50 rounded-lg border">
                {currentQuiz.question}
              </div>
            </CardContent>
          </Card>

          {/* 오른쪽: 답안 선택 영역 */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">답안 선택</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuiz.correctAnswer;
                  const isWrong = showResult && isSelected && !isCorrect;
                  const shouldShowCorrect = showResult && isCorrect;

                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full h-auto p-4 text-left justify-start relative ${
                        isWrong ? "bg-red-50 border-red-200 text-red-700" :
                        shouldShowCorrect ? "bg-green-50 border-green-200 text-green-700" : ""
                      }`}
                      disabled={showResult}
                    >
                      <div className="flex items-center w-full">
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex-1">{option}</div>
                        {showResult && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                        )}
                        {isWrong && (
                          <XCircle className="w-5 h-5 text-red-600 ml-2" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="pt-4 border-t">
                {!showResult ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full"
                    size="lg"
                  >
                    답안 제출
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuiz}
                    className="w-full"
                    size="lg"
                  >
                    {currentQuizIndex < currentQuizSet.quizzes.length - 1 ? (
                      <>
                        다음 문제
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "결과 보기"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}