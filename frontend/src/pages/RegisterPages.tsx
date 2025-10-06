// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import type { RegisterRequest } from '../types/types.tsx';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    setError(null);

    const requestData: RegisterRequest = {
      name: name,
      email: email,
      password_hash: password, // API仕様に合わせてキーを修正
    };

    try {
      const user = await registerUser(requestData);
      console.log('登録成功:', user);
      alert(`ようこそ、${user.name}さん！`);
      // ここでログインページに遷移させるなどの処理を追加
    } catch (err) {
      console.error(err);
      setError('登録に失敗しました。');
    }
  };

  
  return (
    <div>
      <h1>新規登録</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" required />
        <button type="submit">登録</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;