// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import type { LoginRequest } from '../types/types.tsx';

const LoginPage: React.FC = () => {
  // フォームの入力値を管理するためのState
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ローディング状態とエラーメッセージを管理するためのState
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォームが送信されたときの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    setError(null); // 前のエラーをクリア
    setIsLoading(true); // ローディング開始

    // APIに送信するデータを作成
    // APIの仕様に合わせてnameをemailにしています
    const requestData: LoginRequest = {
      name: email, // OpenAPIの仕様でnameとなっていたため
      email: email,
      password_hash: password,
    };

    try {
      // サービス関数を呼び出してログイン処理を実行
      const response = await loginUser(requestData);

      console.log('ログイン成功:', response);
      alert('ログインに成功しました！');

      // ★重要：ここで受け取ったトークンを保存する処理を追加します
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // ログイン後のページに遷移する処理 (例: /dashboard)
      // window.location.href = '/dashboard';

    } catch (err) {
      console.error(err);
      setError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading} // ローディング中は入力を無効化
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading} // ローディング中は入力を無効化
          />
        </div>
        
        {/* エラーがあればメッセージを表示 */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* ローディング中はボタンを無効化し、テキストを変更 */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;