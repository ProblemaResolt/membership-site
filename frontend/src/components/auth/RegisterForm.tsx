import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

interface RegisterFormData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  prefecture: string;
  city: string;
  address: string;
  password: string;
}

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    prefecture: '',
    city: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || '登録に失敗しました');
        return;
      }

      // 登録成功時の処理
      alert('登録が完了しました。ログインしてください。');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('サーバーとの通信に失敗しました');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div>
        <label htmlFor="userId">ユーザーID</label>
        <input
          type="text"
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          minLength={8}
          maxLength={16}
          pattern="^[a-zA-Z0-9_-]*$"
          title="8-16文字の英数字とハイフン、アンダースコアのみ使用可能です"
          required
        />
      </div>

      <div>
        <label htmlFor="firstName">姓</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="lastName">名</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="phone">電話番号</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          pattern="^[0-9-]*$"
          title="数字とハイフンのみ使用可能です"
          required
        />
      </div>

      <div>
        <label htmlFor="prefecture">都道府県</label>
        <select
          id="prefecture"
          name="prefecture"
          value={formData.prefecture}
          onChange={handleChange}
          required
        >
          <option value="">選択してください</option>
          {PREFECTURES.map(pref => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city">市区町村</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="address">住所</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password">パスワード</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />
      </div>

      <button type="submit">登録</button>
    </form>
  );
};
