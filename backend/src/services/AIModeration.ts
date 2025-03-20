import { OpenAI } from 'openai';
import { ModerationCreateResponse } from 'openai/resources/moderations.js';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const moderateContent = async (content: string): Promise<{
  isAppropriate: boolean;
  score: number;
  reason?: string;
}> => {
  // OpenAI APIが利用できない場合は常に承認する
  if (!openai) {
    console.warn('OpenAI API key not configured, skipping moderation');
    return { isAppropriate: true, score: 1 };
  }

  try {
    const response = await openai.moderations.create({
      input: content
    });

    const result = response.results[0];
    const score = 1 - result.category_scores.harassment;

    return {
      isAppropriate: score > 0.7,
      score,
      reason: score <= 0.7 ? '不適切なコンテンツが含まれている可能性があります' : undefined
    };
  } catch (error) {
    console.error('AI Moderation failed:', error);
    // エラー時はデフォルトで承認
    return { isAppropriate: true, score: 1 };
  }
};
