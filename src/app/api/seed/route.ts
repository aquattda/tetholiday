import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QuestionModel from '@/models/Question';
import { adultQuestions, kidsQuestions } from '@/data/questions';

export async function POST() {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await QuestionModel.deleteMany({});

    // Chuyển đổi và thêm câu hỏi người lớn
    const allQuestions = [...adultQuestions, ...kidsQuestions].map((q) => ({
      content: q.content,
      options: q.options,
      correctAnswer: q.correctAnswer,
      category: q.category,
      difficulty: q.difficulty,
      isActive: true,
    }));

    await QuestionModel.insertMany(allQuestions);

    return NextResponse.json({
      message: `Đã thêm ${allQuestions.length} câu hỏi vào database thành công!`,
      adult: adultQuestions.length,
      kids: kidsQuestions.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi seed dữ liệu. Hãy kiểm tra kết nối MongoDB.' },
      { status: 500 }
    );
  }
}
