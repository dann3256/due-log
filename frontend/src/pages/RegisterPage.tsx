import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  // フォームの入力値を保存するための state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ページ遷移を使うための hook
  const navigate = useNavigate();

  // フォームが送信されたときの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信時の画面リロードを防ぐ
    setError(''); // エラーメッセージをリセット

    try {
      // Goで作成したAPIサーバーの /register エンドポイントを指定
      // APIで期待するフィールド名（username, email, passwordなど）に合わせてください
      await axios.post('http://localhost:8080/register', {
        name: username,
        email: email,
        password_hash: password,
      });

      // 登録成功後、ログインページに遷移
      alert('登録が完了しました！ログインページに移動します。');
      navigate('/login');

    } catch (err) {
      console.error('Registration failed:', err);
      setError('このメールアドレスは既に使用されているか、入力内容が正しくありません。');
    }
  };

  return (
    <div>
      <h2>新規登録</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* エラーがあればメッセージを表示 */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">登録する</button>
      </form>
      <p>
        アカウントを既にお持ちですか？ <a href="/login">ログインはこちら</a>
      </p>
    </div>
  );
}

export default RegisterPage;