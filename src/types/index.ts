export interface Question {
  id: number;
  content: string;
  options: string[];
  correctAnswer: number; // index 0, 1, or 2
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
  200000,       // Câu 1
  400000,       // Câu 2
  600000,       // Câu 3
  1000000,      // Câu 4
  2000000,      // Câu 5  ★ Mốc an toàn 1
  3000000,      // Câu 6
  6000000,      // Câu 7
  10000000,     // Câu 8
  14000000,     // Câu 9
  22000000,     // Câu 10 ★ Mốc an toàn 2
  30000000,     // Câu 11
  40000000,     // Câu 12
  60000000,     // Câu 13
  85000000,     // Câu 14
  150000000,    // Câu 15 ★ TRIỆU PHÚ!
];

// Mốc an toàn: index 4 (câu 5) và index 9 (câu 10)
export const MILESTONE_INDICES = [4, 9];

export const TIME_PER_QUESTION = 30; // seconds

export function formatPrize(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export function getMilestoneAmount(questionIndex: number): number {
  if (questionIndex >= 10) return PRIZE_LEVELS[9];  // 22,000,000đ
  if (questionIndex >= 5) return PRIZE_LEVELS[4];   // 2,000,000đ
  return 0;
}
