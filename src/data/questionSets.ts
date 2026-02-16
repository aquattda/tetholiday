import { Question } from '@/types';
import { adultQuestions, kidsQuestions } from './questions';

// ============================================================
// HỆ THỐNG BỘ CÂU HỎI
// 10 bộ cố định + 10 bộ random = 20 bộ để đảm bảo người chơi khác nhau
// gặp câu hỏi khác nhau
// ============================================================

// Hàm shuffle array
function shuffle<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

// ============================================================
// BỘ CÂU HỎI NGƯỜI LỚN - 10 bộ cố định
// Mỗi bộ 15 câu: 5 dễ (câu 1-5), 5 trung bình (câu 6-10), 5 khó (câu 11-15)
// ============================================================

const adultEasy = adultQuestions.filter(q => q.difficulty === 'easy'); // 25 câu
const adultMedium = adultQuestions.filter(q => q.difficulty === 'medium'); // 25 câu
const adultHard = adultQuestions.filter(q => q.difficulty === 'hard'); // 50 câu

export const adultQuestionSets: Question[][] = [
  // Bộ 1
  [
    ...adultEasy.slice(0, 5),
    ...adultMedium.slice(0, 5),
    ...adultHard.slice(0, 5)
  ],
  // Bộ 2
  [
    ...adultEasy.slice(5, 10),
    ...adultMedium.slice(5, 10),
    ...adultHard.slice(5, 10)
  ],
  // Bộ 3
  [
    ...adultEasy.slice(10, 15),
    ...adultMedium.slice(10, 15),
    ...adultHard.slice(10, 15)
  ],
  // Bộ 4
  [
    ...adultEasy.slice(15, 20),
    ...adultMedium.slice(15, 20),
    ...adultHard.slice(15, 20)
  ],
  // Bộ 5
  [
    ...adultEasy.slice(20, 25),
    ...adultMedium.slice(20, 25),
    ...adultHard.slice(20, 25)
  ],
  // Bộ 6
  [
    ...adultEasy.slice(0, 5),
    ...adultMedium.slice(10, 15),
    ...adultHard.slice(25, 30)
  ],
  // Bộ 7
  [
    ...adultEasy.slice(5, 10),
    ...adultMedium.slice(15, 20),
    ...adultHard.slice(30, 35)
  ],
  // Bộ 8
  [
    ...adultEasy.slice(10, 15),
    ...adultMedium.slice(20, 25),
    ...adultHard.slice(35, 40)
  ],
  // Bộ 9
  [
    ...adultEasy.slice(15, 20),
    ...adultMedium.slice(0, 5),
    ...adultHard.slice(40, 45)
  ],
  // Bộ 10
  [
    ...adultEasy.slice(20, 25),
    ...adultMedium.slice(5, 10),
    ...adultHard.slice(45, 50)
  ],
];

// ============================================================
// BỘ CÂU HỎI TRẺ EM - 10 bộ cố định
// Mỗi bộ 15 câu: 5 dễ, 5 trung bình, 5 khó
// ============================================================

const kidsEasy = kidsQuestions.filter(q => q.difficulty === 'easy'); // ~30 câu
const kidsMedium = kidsQuestions.filter(q => q.difficulty === 'medium'); // ~30 câu
const kidsHard = kidsQuestions.filter(q => q.difficulty === 'hard'); // ~40 câu

export const kidsQuestionSets: Question[][] = [
  // Bộ 1
  [
    ...kidsEasy.slice(0, 5),
    ...kidsMedium.slice(0, 5),
    ...kidsHard.slice(0, 5)
  ],
  // Bộ 2
  [
    ...kidsEasy.slice(5, 10),
    ...kidsMedium.slice(5, 10),
    ...kidsHard.slice(5, 10)
  ],
  // Bộ 3
  [
    ...kidsEasy.slice(10, 15),
    ...kidsMedium.slice(10, 15),
    ...kidsHard.slice(10, 15)
  ],
  // Bộ 4
  [
    ...kidsEasy.slice(15, 20),
    ...kidsMedium.slice(15, 20),
    ...kidsHard.slice(15, 20)
  ],
  // Bộ 5
  [
    ...kidsEasy.slice(20, 25),
    ...kidsMedium.slice(20, 25),
    ...kidsHard.slice(20, 25)
  ],
  // Bộ 6
  [
    ...kidsEasy.slice(0, 5),
    ...kidsMedium.slice(10, 15),
    ...kidsHard.slice(25, 30)
  ],
  // Bộ 7
  [
    ...kidsEasy.slice(5, 10),
    ...kidsMedium.slice(15, 20),
    ...kidsHard.slice(30, 35)
  ],
  // Bộ 8
  [
    ...kidsEasy.slice(10, 15),
    ...kidsMedium.slice(20, 25),
    ...kidsHard.slice(0, 5)
  ],
  // Bộ 9
  [
    ...kidsEasy.slice(15, 20),
    ...kidsMedium.slice(0, 5),
    ...kidsHard.slice(5, 10)
  ],
  // Bộ 10
  [
    ...kidsEasy.slice(20, 25),
    ...kidsMedium.slice(5, 10),
    ...kidsHard.slice(10, 15)
  ],
];

// ============================================================
// HÀM LẤY BỘ CÂU HỎI RANDOM
// Tạo bộ câu hỏi hoàn toàn ngẫu nhiên để tránh trùng lặp giữa người chơi
// ============================================================

export function getRandomQuestionSet(category: 'adult' | 'kids'): Question[] {
  const pool = category === 'adult' ? adultQuestions : kidsQuestions;
  
  // Lọc câu hỏi theo độ khó
  const easyPool = shuffle(pool.filter(q => q.difficulty === 'easy'));
  const mediumPool = shuffle(pool.filter(q => q.difficulty === 'medium'));
  const hardPool = shuffle(pool.filter(q => q.difficulty === 'hard'));
  
  // Lấy ngẫu nhiên 5 câu từ mỗi độ khó
  const selectedQuestions: Question[] = [
    ...easyPool.slice(0, 5),      // Câu 1-5: Dễ
    ...mediumPool.slice(0, 5),    // Câu 6-10: Trung bình
    ...hardPool.slice(0, 5)       // Câu 11-15: Khó
  ];
  
  return selectedQuestions;
}
