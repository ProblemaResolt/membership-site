import React from 'react';
import { useForm } from 'react-hook-form';

interface ResetFormData {
  email: string;
}

export const PasswordReset = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>();

  const onSubmit = async (data: ResetFormData) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        alert('パスワードリセット用のメールを送信しました。');
      } else {
        throw new Error('パスワードリセットに失敗しました。');
      }
    } catch (error) {
      console.error('Reset failed:', error);
      alert('エラーが発生しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          id="email"
          {...register('email', { required: true })}
        />
        {errors.email && <span>このフィールドは必須です</span>}
      </div>
      <button type="submit">パスワードをリセット</button>
    </form>
  );
};
