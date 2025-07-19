import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { RefreshCw, Eye, EyeOff, Save, BookOpen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export interface SimpleQuiz {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: number;
}

export interface QuizSet {
  id: string;
  name: string;
  quizzes: SimpleQuiz[];
  createdAt: string;
}

// 데이터베이스에서 가져온 환경 퀴즈 (문제와 답만 포함)
const environmentalQuizDatabase: SimpleQuiz[] = [
  {
    id: "1",
    question: "지구 온난화의 주요 원인인 온실가스는 무엇인가요?",
    options: ["이산화탄소(CO₂)", "메탄(CH₄)", "아산화질소(N₂O)", "프레온가스(CFC)"],
    correctAnswer: 0
  },
];

interface RandomQuizViewerProps {
  onQuizSetsUpdate?: (quizSets: QuizSet[]) => void;
}

export function RandomQuizViewer({ onQuizSetsUpdate }: RandomQuizViewerProps) {
  const [currentQuizzes, setCurrentQuizzes] = useState<SimpleQuiz[]>([]);
  const [showAnswers, setShowAnswers] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [quizCount, setQuizCount] = useState<string>("5");
  
  // 퀴즈 셋 관리 상태
  const [savedQuizSets, setSavedQuizSets] = useState<QuizSet[]>([]);
  const [selectedQuizSet, setSelectedQuizSet] = useState<string>("random");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [quizSetName, setQuizSetName] = useState("");

  // 퀴즈셋이 업데이트될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onQuizSetsUpdate) {
      onQuizSetsUpdate(savedQuizSets);
    }
  }, [savedQuizSets, onQuizSetsUpdate]);

  // 랜덤 퀴즈 추출 함수
  const getRandomQuizzes = (count: number) => {
    setIsLoading(true);
    setShowAnswers({});
    setSelectedQuizSet("random");
    
    // 실제로는 데이터베이스 API 호출
    setTimeout(() => {
      const shuffled = [...environmentalQuizDatabase].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(count, environmentalQuizDatabase.length));
      setCurrentQuizzes(selected);
      setIsLoading(false);
    }, 800);
  };

  // 퀴즈 셋 저장 함수
  const saveCurrentQuizSet = () => {
    if (!quizSetName.trim()) {
      alert("퀴즈 셋 이름을 입력해주세요.");
      return;
    }

    if (currentQuizzes.length === 0) {
      alert("저장할 퀴즈가 없습니다.");
      return;
    }

    const newQuizSet: QuizSet = {
      id: Date.now().toString(),
      name: quizSetName.trim(),
      quizzes: [...currentQuizzes],
      createdAt: new Date().toLocaleString('ko-KR')
    };

    setSavedQuizSets(prev => [...prev, newQuizSet]);
    setQuizSetName("");
    setSaveDialogOpen(false);
    console.log("퀴즈 셋 저장됨:", newQuizSet);
  };

  // 저장된 퀴즈 셋 불러오기
  const loadQuizSet = (quizSetId: string) => {
    if (quizSetId === "random") {
      getRandomQuizzes(parseInt(quizCount));
      return;
    }

    const quizSet = savedQuizSets.find(set => set.id === quizSetId);
    if (quizSet) {
      setCurrentQuizzes(quizSet.quizzes);
      setShowAnswers({});
      setSelectedQuizSet(quizSetId);
      console.log("퀴즈 셋 불러옴:", quizSet);
    }
  };

  // 퀴즈 셋 삭제
  const deleteQuizSet = (quizSetId: string) => {
    if (window.confirm("정말로 이 퀴즈 셋을 삭제하시겠습니까?")) {
      setSavedQuizSets(prev => prev.filter(set => set.id !== quizSetId));
      if (selectedQuizSet === quizSetId) {
        setSelectedQuizSet("random");
        getRandomQuizzes(parseInt(quizCount));
      }
    }
  };

  // 컴포넌트 마운트 시 첫 번째 퀴즈들 로드
  useEffect(() => {
    getRandomQuizzes(parseInt(quizCount));
  }, []);

  const toggleAnswer = (quizId: string) => {
    setShowAnswers(prev => ({
      ...prev,
      [quizId]: !prev[quizId]
    }));
  };

  const getNewQuizzes = () => {
    getRandomQuizzes(parseInt(quizCount));
  };

  const handleQuizCountChange = (value: string) => {
    setQuizCount(value);
  };

  const handleQuizSetChange = (value: string) => {
    loadQuizSet(value);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-2">환경 퀴즈</h2>
          <p className="text-muted-foreground">데이터베이스에서 랜덤으로 퀴즈를 추출하고 있습니다</p>
        </div>
        <Card className="min-h-[600px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">{quizCount}개의 새로운 퀴즈를 불러오는 중...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium mb-2">환경 퀴즈</h2>
          <p className="text-muted-foreground">데이터베이스에서 추출된 환경 관련 문제들입니다</p>
        </div>
        {/* 상단 컨트롤 영역 */}
        <div className="flex items-center gap-4">
          {/* 퀴즈 셋 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">퀴즈 셋:</span>
            <Select value={selectedQuizSet} onValueChange={handleQuizSetChange}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">랜덤 추출</SelectItem>
                {savedQuizSets.map((quizSet) => (
                  <SelectItem key={quizSet.id} value={quizSet.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{quizSet.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          deleteQuizSet(quizSet.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* 추출 개수 선택 (랜덤 모드일 때만) */}
          {selectedQuizSet === "random" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">추출 개수:</span>
              <Select value={quizCount} onValueChange={handleQuizCountChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3개</SelectItem>
                  <SelectItem value="5">5개</SelectItem>
                  <SelectItem value="7">7개</SelectItem>
                  <SelectItem value="10">10개</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      {/* 퀴즈 목록 스크롤 영역 */}
      <Card className="min-h-[700px] max-h-[700px]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>
              {selectedQuizSet === "random" 
                ? "추출된 퀴즈 목록" 
                : `저장된 퀴즈 셋: ${savedQuizSets.find(set => set.id === selectedQuizSet)?.name}`
              }
            </span>
            <div className="flex gap-2">
              {/* 퀴즈 셋 저장 버튼 */}
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={currentQuizzes.length === 0}
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>퀴즈 셋 저장</DialogTitle>
                    <DialogDescription>
                      현재 추출된 퀴즈들을 하나의 퀴즈 셋으로 저장합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">퀴즈 셋 이름</label>
                      <Input
                        value={quizSetName}
                        onChange={(e) => setQuizSetName(e.target.value)}
                        placeholder="퀴즈 셋 이름을 입력하세요"
                        className="mt-2"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      현재 {currentQuizzes.length}개의 퀴즈가 저장됩니다.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSaveDialogOpen(false)}
                      >
                        취소
                      </Button>
                      <Button onClick={saveCurrentQuizSet}>
                        저장
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              {/* 새로 추출 버튼 (랜덤 모드일 때만) */}
              {selectedQuizSet === "random" && (
                <Button 
                  onClick={getNewQuizzes}
                  variant="outline"
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  새로 추출
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[580px] px-6 pb-6">
            {currentQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">퀴즈를 불러올 수 없습니다.</p>
                <Button onClick={getNewQuizzes}>다시 시도</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {currentQuizzes.map((quiz, index) => (
                  <Card key={quiz.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>문제 {index + 1}</span>
                        <span className="text-sm font-normal text-muted-foreground">ID: {quiz.id}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 문제 내용 */}
                      <div className="p-4 bg-slate-50 rounded-lg border">
                        <p className="leading-relaxed">{quiz.question}</p>
                      </div>
                      {/* 객관식 선택지 (있는 경우) */}
                      {quiz.options && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground">객관식 선택지</h4>
                          <div className="grid gap-2">
                            {quiz.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`p-2 rounded border text-sm ${
                                  quiz.correctAnswer === optionIndex 
                                    ? 'bg-green-50 border-green-200 text-green-700' 
                                    : 'bg-gray-50'
                                }`}
                              >
                                <span className="font-medium">{String.fromCharCode(65 + optionIndex)}. </span>
                                {option}
                                {quiz.correctAnswer === optionIndex && (
                                  <span className="text-xs text-green-600 ml-2">(정답)</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* 답안 영역 */}

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      {/* 하단 정보 */}
      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <span>현재 {currentQuizzes.length}개의 퀴즈를 표시 중</span>
        <div className="flex items-center gap-4">
          <span>저장된 퀴즈 셋: {savedQuizSets.length}개</span>
          <span>전체 데이터베이스: {environmentalQuizDatabase.length}개의 퀴즈</span>
        </div>
      </div>
    </div>
  );
}