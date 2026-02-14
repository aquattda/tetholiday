export interface Question {
  id: number;
  content: string;
  options: string[];
  correctAnswer: number; // index 0, 1, 2, or 3
  category: 'adult' | 'kids';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  phase: 'rules' | 'select' | 'ready' | 'playing' | 'result';
  category: 'adult' | 'kids' | null;
  currentQuestionIndex: number;
  questions: Question[];
  timeLeft: number;
  isTimerActive: boolean;
  selectedAnswer: number | null;
  answerState: 'pending' | 'checking' | 'correct' | 'wrong' | null;
  eliminatedOptions: number[];
  lifelines: Lifelines;
  gameResult: 'won' | 'lost' | 'timeout' | null;
  finalPrize: number;
  usedQuestionIds: Set<number>;
}

export interface Lifelines {
  askFamily: boolean;    // Nhờ người thân
  fiftyFifty: boolean;   // Giảm 50%
  changeQuestion: boolean; // Đổi câu hỏi
}

export const PRIZE_LEVELS: number[] = [
  1000,         // Câu 1
  2000,         // Câu 2
  3000,         // Câu 3
  5000,         // Câu 4
  10000,        // Câu 5  ★ Mốc an toàn 1
  15000,        // Câu 6
  20000,        // Câu 7
  30000,        // Câu 8
  40000,        // Câu 9
  50000,        // Câu 10 ★ Mốc an toàn 2
  70000,        // Câu 11
  100000,       // Câu 12
  130000,       // Câu 13
  160000,       // Câu 14
  200000,       // Câu 15 ★ THẮNG LỚN!
];

// Mốc an toàn: index 4 (câu 5) và index 9 (câu 10)
export const MILESTONE_INDICES = [4, 9];

export const TIME_PER_QUESTION = 30; // seconds

export function formatPrize(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export function getMilestoneAmount(questionIndex: number): number {
  if (questionIndex >= 10) return PRIZE_LEVELS[9];  // 50,000đ
  if (questionIndex >= 5) return PRIZE_LEVELS[4];   // 10,000đ
  return 0;
}
