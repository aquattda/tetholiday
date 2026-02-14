'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Question, PRIZE_LEVELS, MILESTONE_INDICES, TIME_PER_QUESTION, formatPrize, getMilestoneAmount } from '@/types';
import { adultQuestions, kidsQuestions } from '@/data/questions';
import TetBackground from '@/components/TetBackground';

type Phase = 'rules' | 'select' | 'ready' | 'playing' | 'result';
type AnswerState = 'pending' | 'checking' | 'correct' | 'wrong' | null;
type GameResult = 'won' | 'lost' | 'timeout' | null;
type ToastType = { message: string; type: 'info' | 'success' | 'error' };

function shuffle<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function shuffleQuestionOptions(q: Question): Question {
  const indices = q.options.map((_, i) => i);
  const shuffledIndices = shuffle(indices);
  return {
    ...q,
    options: shuffledIndices.map(i => q.options[i]),
    correctAnswer: shuffledIndices.indexOf(q.correctAnswer),
  };
}

export default function GamePage() {
  const router = useRouter();

  // Game state
  const [phase, setPhase] = useState<Phase>('rules');
  const [category, setCategory] = useState<'adult' | 'kids' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [lifelines, setLifelines] = useState({ askFamily: true, fiftyFifty: true, changeQuestion: true });
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [finalPrize, setFinalPrize] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<ToastType | null>(null);
  const [showMobilePrizes, setShowMobilePrizes] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ left: string; color: string; delay: string; duration: string }>>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isTimerActive && timeLeft === 0) {
      handleTimeout();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerActive, timeLeft]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
  }, []);

  // ==================== GAME LOGIC ====================

  const selectCategory = (cat: 'adult' | 'kids') => {
    setCategory(cat);
    const pool = cat === 'adult' ? adultQuestions : kidsQuestions;
    const easy = shuffle(pool.filter((q) => q.difficulty === 'easy'));
    const medium = shuffle(pool.filter((q) => q.difficulty === 'medium'));
    const hard = shuffle(pool.filter((q) => q.difficulty === 'hard'));

    const selected = [...easy.slice(0, 5), ...medium.slice(0, 5), ...hard.slice(0, 5)].map(shuffleQuestionOptions);
    setQuestions(selected);
    setUsedQuestionIds(new Set(selected.map((q) => q.id)));
    setPhase('ready');
  };

  const startPlaying = () => {
    setPhase('playing');
    setTimeLeft(TIME_PER_QUESTION);
    setIsTimerActive(true);
  };

  const handleAnswer = (index: number) => {
    if (answerState || selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setIsTimerActive(false);
    setAnswerState('checking');

    setTimeout(() => {
      const isCorrect = index === questions[currentIndex].correctAnswer;
      setAnswerState(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        if (currentIndex === 14) {
          // WON THE GAME!
          setTimeout(() => {
            triggerConfetti();
            setGameResult('won');
            setFinalPrize(PRIZE_LEVELS[14]);
            setPhase('result');
          }, 1500);
        } else {
          // Check milestone
          const isMilestone = MILESTONE_INDICES.includes(currentIndex);
          if (isMilestone) {
            showToast(`🎉 Chúc mừng! Bạn đã đạt mốc an toàn ${formatPrize(PRIZE_LEVELS[currentIndex])}!`, 'success');
          }

          setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setSelectedAnswer(null);
            setAnswerState(null);
            setEliminatedOptions([]);
            setTimeLeft(TIME_PER_QUESTION);
            setIsTimerActive(true);
          }, 2000);
        }
      } else {
        setTimeout(() => {
          const milestone = getMilestoneAmount(currentIndex);
          setGameResult('lost');
          setFinalPrize(milestone);
          setPhase('result');
        }, 2000);
      }
    }, 1500);
  };

  const handleTimeout = () => {
    setIsTimerActive(false);
    setAnswerState('wrong');
    showToast('⏰ Hết thời gian!', 'error');
    setTimeout(() => {
      const milestone = getMilestoneAmount(currentIndex);
      setGameResult('timeout');
      setFinalPrize(milestone);
      setPhase('result');
    }, 2000);
  };

  // ==================== LIFELINES ====================

  const useAskFamily = () => {
    if (!lifelines.askFamily || answerState) return;
    setLifelines((l) => ({ ...l, askFamily: false }));
    setTimeLeft((t) => t + 30);
    showToast('👨‍👩‍👧‍👦 Đã cộng thêm 30 giây! Hãy hỏi người thân nhé!', 'info');
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || answerState) return;
    setLifelines((l) => ({ ...l, fiftyFifty: false }));
    const correct = questions[currentIndex].correctAnswer;
    const allIndices = questions[currentIndex].options.map((_, i) => i);
    const wrong = shuffle(allIndices.filter((i) => i !== correct));
    setEliminatedOptions(wrong.slice(0, 2));
    showToast('✂️ Đã loại bỏ 2 phương án sai!', 'info');
  };

  const useChangeQuestion = () => {
    if (!lifelines.changeQuestion || answerState) return;
    setLifelines((l) => ({ ...l, changeQuestion: false }));

    const currentQ = questions[currentIndex];
    const difficulty = currentIndex < 5 ? 'easy' : currentIndex < 10 ? 'medium' : 'hard';
    const pool = (category === 'adult' ? adultQuestions : kidsQuestions).filter(
      (q) => q.difficulty === difficulty && !usedQuestionIds.has(q.id) && q.id !== currentQ.id
    );

    if (pool.length > 0) {
      const newQ = shuffleQuestionOptions(pool[Math.floor(Math.random() * pool.length)]);
      const newQuestions = [...questions];
      newQuestions[currentIndex] = newQ;
      setQuestions(newQuestions);
      setUsedQuestionIds((s) => { const n = new Set(Array.from(s)); n.add(currentQ.id); n.add(newQ.id); return n; });
      setTimeLeft(TIME_PER_QUESTION);
      setEliminatedOptions([]);
      setSelectedAnswer(null);
      setAnswerState(null);
      showToast('🔄 Đã đổi câu hỏi mới!', 'info');
    } else {
      showToast('⚠️ Không còn câu hỏi thay thế!', 'error');
    }
  };

  // ==================== CONFETTI ====================

  const triggerConfetti = () => {
    const colors = ['#F59E0B', '#DC2626', '#22C55E', '#3B82F6', '#EC4899', '#FDE68A'];
    const pieces = Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 5000);
  };

  // ==================== RESET ====================

  const resetGame = () => {
    setPhase('rules');
    setCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setTimeLeft(TIME_PER_QUESTION);
    setIsTimerActive(false);
    setSelectedAnswer(null);
    setAnswerState(null);
    setEliminatedOptions([]);
    setLifelines({ askFamily: true, fiftyFifty: true, changeQuestion: true });
    setGameResult(null);
    setFinalPrize(0);
    setUsedQuestionIds(new Set());
    setConfetti([]);
  };

  // ==================== RENDER HELPERS ====================

  const currentQuestion = questions[currentIndex];
  const answerLabels = ['A', 'B', 'C', 'D'];

  const getTimerColor = () => {
    if (timeLeft > 20) return '#22C55E';
    if (timeLeft > 10) return '#F59E0B';
    return '#EF4444';
  };

  const timerRadius = 40;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const maxTime = timeLeft > TIME_PER_QUESTION ? 60 : TIME_PER_QUESTION;
  const timerDashOffset = timerCircumference * (1 - timeLeft / maxTime);

  // ==================== RENDER PHASES ====================

  return (
    <main className="relative min-h-screen overflow-hidden">
      <TetBackground />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Confetti */}
      {confetti.map((piece, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
          }}
        />
      ))}

      {/* ==================== RULES PHASE ==================== */}
      {phase === 'rules' && (
        <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
          <div className="game-card max-w-xl w-full p-8 animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">📜</div>
              <h2 className="text-3xl font-black tet-title mb-2">THỂ LỆ TRÒ CHƠI</h2>
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-tet-gold to-transparent mx-auto"></div>
            </div>

            {/* Rules */}
            <div className="space-y-4 text-tet-cream/90 text-sm md:text-base">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="text-tet-gold text-xl mt-0.5">🎯</span>
                <div>
                  <strong className="text-tet-gold">15 câu hỏi</strong> về chủ đề Tết Nguyên Đán, độ khó tăng dần từ dễ đến khó.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="text-tet-gold text-xl mt-0.5">⏱️</span>
                <div>
                  Mỗi câu hỏi có <strong className="text-tet-gold">30 giây</strong> để trả lời. Chọn <strong className="text-tet-gold">1 trong 4</strong> phương án.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="text-tet-gold text-xl mt-0.5">🛟</span>
                <div>
                  <strong className="text-tet-gold">3 quyền trợ giúp:</strong>
                  <ul className="mt-2 space-y-1 text-tet-cream/70">
                    <li>👨‍👩‍👧‍👦 <strong>Nhờ người thân:</strong> Cộng thêm 30 giây</li>
                    <li>✂️ <strong>Giảm 50%:</strong> Loại bỏ 2 phương án sai</li>
                    <li>🔄 <strong>Đổi câu hỏi:</strong> Thay bằng câu hỏi khác</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="text-tet-gold text-xl mt-0.5">🏆</span>
                <div>
                  Giải thưởng tăng dần. Có <strong className="text-tet-gold">2 mốc an toàn</strong> (câu 5 và câu 10). Trả lời sai sẽ rớt về mốc gần nhất.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="text-tet-gold text-xl mt-0.5">💰</span>
                <div>
                  Trả lời đúng cả 15 câu để trở thành <strong className="text-tet-gold">TRIỆU PHÚ</strong> với giải thưởng <strong className="text-tet-gold">200.000đ!</strong>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center mt-8">
              <button onClick={() => setPhase('select')} className="btn-tet text-lg px-8 py-3">
                TIẾP TỤC →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SELECT PHASE ==================== */}
      {phase === 'select' && (
        <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
          <div className="game-card max-w-lg w-full p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🎮</div>
              <h2 className="text-3xl font-black tet-title mb-2">CHỌN BỘ CÂU HỎI</h2>
              <p className="text-tet-cream/60 text-sm">Hãy chọn bộ câu hỏi phù hợp với bạn</p>
            </div>

            <div className="space-y-4">
              {/* Kids */}
              <button
                onClick={() => selectCategory('kids')}
                className="w-full p-6 rounded-xl border-2 border-tet-gold/20 bg-gradient-to-r from-pink-900/20 to-purple-900/20 hover:border-tet-gold hover:shadow-lg hover:shadow-tet-gold/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform">👶</div>
                  <div>
                    <h3 className="text-xl font-bold text-tet-gold mb-1">Em Bé</h3>
                    <p className="text-sm text-tet-cream/60">Dành cho các bạn nhỏ từ 2-10 tuổi</p>
                    <p className="text-xs text-tet-cream/40 mt-1">20 câu hỏi vui nhộn về ngày Tết</p>
                  </div>
                  <div className="ml-auto text-tet-gold/50 group-hover:text-tet-gold transition-colors text-2xl">→</div>
                </div>
              </button>

              {/* Adults */}
              <button
                onClick={() => selectCategory('adult')}
                className="w-full p-6 rounded-xl border-2 border-tet-gold/20 bg-gradient-to-r from-red-900/20 to-amber-900/20 hover:border-tet-gold hover:shadow-lg hover:shadow-tet-gold/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform">🧑‍🦱</div>
                  <div>
                    <h3 className="text-xl font-bold text-tet-gold mb-1">Người Lớn</h3>
                    <p className="text-sm text-tet-cream/60">Dành cho thanh thiếu niên & người lớn (11-22 tuổi)</p>
                    <p className="text-xs text-tet-cream/40 mt-1">100 câu hỏi phong phú về Tết Việt Nam</p>
                  </div>
                  <div className="ml-auto text-tet-gold/50 group-hover:text-tet-gold transition-colors text-2xl">→</div>
                </div>
              </button>
            </div>

            <div className="text-center mt-6">
              <button onClick={() => setPhase('rules')} className="text-tet-cream/40 hover:text-tet-cream/70 text-sm transition-colors">
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== READY PHASE ==================== */}
      {phase === 'ready' && (
        <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
          <div className="game-card max-w-md w-full p-8 text-center animate-bounce-in">
            <div className="text-6xl mb-6 animate-float">🎆</div>
            <h2 className="text-3xl font-black tet-title mb-4">SẴN SÀNG CHƯA?</h2>
            <p className="text-tet-cream/70 mb-2">
              Bộ câu hỏi: <strong className="text-tet-gold">{category === 'kids' ? 'Em Bé 👶' : 'Người Lớn 🧑‍🦱'}</strong>
            </p>
            <p className="text-tet-cream/50 text-sm mb-8">
              15 câu hỏi • 30 giây/câu • 3 quyền trợ giúp
            </p>

            <div className="space-y-3">
              <button onClick={startPlaying} className="btn-tet text-xl px-10 py-4 w-full">
                SẴN SÀNG!
              </button>
              <button onClick={() => setPhase('select')} className="text-tet-cream/40 hover:text-tet-cream/70 text-sm transition-colors">
                ← Chọn lại bộ câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PLAYING PHASE ==================== */}
      {phase === 'playing' && currentQuestion && (
        <div className="relative z-20 min-h-screen p-3 md:p-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4">
            {/* LEFT: Main Game Area */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Top Bar: Timer + Question Number + Mobile Prize Toggle */}
              <div className="flex items-center justify-between">
                {/* Timer */}
                <div className={`relative ${timeLeft <= 10 ? 'timer-urgent' : ''}`}>
                  <svg width="90" height="90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={timerRadius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r={timerRadius}
                      fill="none"
                      stroke={getTimerColor()}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={timerCircumference}
                      strokeDashoffset={timerDashOffset}
                      className="timer-circle"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill={getTimerColor()} fontSize="24" fontWeight="bold">
                      {timeLeft}
                    </text>
                  </svg>
                </div>

                {/* Question Number & Prize */}
                <div className="text-center">
                  <div className="text-tet-gold font-bold text-lg">Câu {currentIndex + 1}/15</div>
                  <div className="text-tet-cream/60 text-sm">{formatPrize(PRIZE_LEVELS[currentIndex])}</div>
                  {currentIndex < 5 && <span className="text-xs text-tet-cream/40">Dễ</span>}
                  {currentIndex >= 5 && currentIndex < 10 && <span className="text-xs text-yellow-400/60">Trung bình</span>}
                  {currentIndex >= 10 && <span className="text-xs text-red-400/60">Khó</span>}
                </div>

                {/* Mobile Prize Toggle */}
                <button
                  onClick={() => setShowMobilePrizes(!showMobilePrizes)}
                  className="lg:hidden p-2 rounded-lg border border-tet-gold/30 text-tet-gold hover:bg-tet-gold/10 transition-colors"
                >
                  💰
                </button>
              </div>

              {/* Mobile Prize Tracker */}
              {showMobilePrizes && (
                <div className="lg:hidden game-card p-4 animate-slide-in">
                  <PrizeTrackerContent currentIndex={currentIndex} />
                </div>
              )}

              {/* Question Card */}
              <div className="game-card p-6 md:p-8 ornate-corners">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-tet-gold">❓</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-tet-gold/30 to-transparent"></div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-tet-cream leading-relaxed">
                  {currentQuestion.content}
                </h3>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  let className = 'answer-option flex items-center gap-4';
                  if (eliminatedOptions.includes(idx)) className += ' eliminated';
                  if (answerState) className += ' disabled';
                  if (selectedAnswer === idx && answerState === 'checking') className += ' selected';
                  if (selectedAnswer === idx && answerState === 'correct') className += ' correct';
                  if (selectedAnswer === idx && answerState === 'wrong') className += ' wrong';
                  if (answerState === 'correct' && idx === currentQuestion.correctAnswer && selectedAnswer !== idx) className += ' correct';
                  if (answerState === 'wrong' && idx === currentQuestion.correctAnswer) className += ' correct';

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={className}
                      disabled={!!answerState || eliminatedOptions.includes(idx)}
                    >
                      <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-tet-gold/40 text-tet-gold font-bold text-lg shrink-0">
                        {answerLabels[idx]}
                      </span>
                      <span className="text-base md:text-lg font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Lifelines */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="text-center">
                  <button
                    onClick={useAskFamily}
                    className={`lifeline-btn ${!lifelines.askFamily ? 'used' : ''}`}
                    disabled={!lifelines.askFamily || !!answerState}
                    title="Nhờ người thân (+30 giây)"
                  >
                    {lifelines.askFamily && <span className="text-2xl">👨‍👩‍👧‍👦</span>}
                  </button>
                  <p className="text-xs text-tet-cream/40 mt-2">Nhờ<br/>người thân</p>
                </div>

                <div className="text-center">
                  <button
                    onClick={useFiftyFifty}
                    className={`lifeline-btn ${!lifelines.fiftyFifty ? 'used' : ''}`}
                    disabled={!lifelines.fiftyFifty || !!answerState}
                    title="Giảm 50% - Loại 2 đáp án sai"
                  >
                    {lifelines.fiftyFifty && <span className="text-xl font-black text-tet-gold">50<span className="text-xs">%</span></span>}
                  </button>
                  <p className="text-xs text-tet-cream/40 mt-2">Giảm<br/>50%</p>
                </div>

                <div className="text-center">
                  <button
                    onClick={useChangeQuestion}
                    className={`lifeline-btn ${!lifelines.changeQuestion ? 'used' : ''}`}
                    disabled={!lifelines.changeQuestion || !!answerState}
                    title="Đổi câu hỏi khác"
                  >
                    {lifelines.changeQuestion && <span className="text-2xl">🔄</span>}
                  </button>
                  <p className="text-xs text-tet-cream/40 mt-2">Đổi<br/>câu hỏi</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Prize Tracker (Desktop) */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="game-card p-4 sticky top-6">
                <h3 className="text-center text-tet-gold font-bold mb-3 text-sm tracking-wider">💰 BẢNG THƯỞNG</h3>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-tet-gold/30 to-transparent mb-3"></div>
                <PrizeTrackerContent currentIndex={currentIndex} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RESULT PHASE ==================== */}
      {phase === 'result' && (
        <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
          <div className="game-card max-w-md w-full p-8 text-center animate-bounce-in">
            {/* Result Icon */}
            <div className="text-7xl mb-6">
              {gameResult === 'won' ? '🏆' : gameResult === 'lost' ? '😢' : '⏰'}
            </div>

            {/* Result Title */}
            <h2 className="text-3xl font-black mb-4">
              {gameResult === 'won' && <span className="tet-title">CHÚC MỪNG TRIỆU PHÚ!</span>}
              {gameResult === 'lost' && <span className="text-red-400">TIẾC QUÁ!</span>}
              {gameResult === 'timeout' && <span className="text-yellow-400">HẾT THỜI GIAN!</span>}
            </h2>

            {/* Result Message */}
            <p className="text-tet-cream/70 mb-2">
              {gameResult === 'won' && 'Bạn đã trả lời đúng tất cả 15 câu hỏi! 🎉'}
              {gameResult === 'lost' && `Bạn đã trả lời sai ở câu hỏi số ${currentIndex + 1}.`}
              {gameResult === 'timeout' && `Bạn đã hết thời gian ở câu hỏi số ${currentIndex + 1}.`}
            </p>

            {/* Show correct answer if lost/timeout */}
            {(gameResult === 'lost' || gameResult === 'timeout') && currentQuestion && (
              <div className="my-4 p-3 rounded-lg bg-green-900/20 border border-green-500/30 text-sm">
                <p className="text-green-400 font-semibold mb-1">Đáp án đúng:</p>
                <p className="text-tet-cream/80">{answerLabels[currentQuestion.correctAnswer]}. {currentQuestion.options[currentQuestion.correctAnswer]}</p>
              </div>
            )}

            {/* Prize */}
            <div className="my-6 p-6 rounded-xl bg-gradient-to-r from-tet-gold/10 to-yellow-900/10 border border-tet-gold/30">
              <p className="text-tet-cream/60 text-sm mb-1">Phần thưởng của bạn</p>
              <p className="text-4xl font-black tet-title">
                {formatPrize(finalPrize)}
              </p>
              {finalPrize === 0 && (
                <p className="text-tet-cream/40 text-xs mt-1">Chưa đạt mốc an toàn nào</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-tet-gold font-bold text-lg">{gameResult === 'won' ? 15 : currentIndex}</p>
                <p className="text-xs text-tet-cream/50">Câu trả lời đúng</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-tet-gold font-bold text-lg">{category === 'kids' ? 'Em bé' : 'Người lớn'}</p>
                <p className="text-xs text-tet-cream/50">Bộ câu hỏi</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button onClick={resetGame} className="btn-tet w-full text-lg py-3">
                🔄 CHƠI LẠI
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 rounded-xl border border-tet-gold/30 text-tet-cream/60 hover:text-tet-cream hover:border-tet-gold/60 transition-colors"
              >
                🏠 Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tet-red via-tet-gold to-tet-red z-30"></div>
    </main>
  );
}

// ==================== SUB COMPONENT ====================

function PrizeTrackerContent({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="space-y-0.5">
      {PRIZE_LEVELS.slice().reverse().map((prize, reverseIdx) => {
        const idx = 14 - reverseIdx;
        const isCurrent = idx === currentIndex;
        const isCompleted = idx < currentIndex;
        const isMilestone = MILESTONE_INDICES.includes(idx);
        const isTop = idx === 14;

        let className = 'prize-level flex justify-between items-center rounded';
        if (isCurrent) className += ' current';
        else if (isCompleted) className += ' completed';
        else if (isMilestone) className += ' milestone';
        else className += ' upcoming';

        return (
          <div key={idx} className={className}>
            <span className="w-6 text-right mr-2 opacity-60">{idx + 1}</span>
            <span className="flex-1 text-right font-mono">
              {isMilestone && !isCurrent && '★ '}
              {isTop && !isCurrent && '🏆 '}
              {formatPrize(prize)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
