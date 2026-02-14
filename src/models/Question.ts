import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  content: string;
  options: string[];
  correctAnswer: number;
  category: 'adult' | 'kids';
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    content: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    category: { type: String, enum: ['adult', 'kids'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
