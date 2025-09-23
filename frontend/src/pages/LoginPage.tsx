import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // フォームの入力値を保存するための state
  const [name, setName]= useState('');
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
      // Goで作成したAPIサーバーのエンドポイントを指定
      // ポート番号などはご自身の環境に合わせて変更してください
      const response = await axios.post('http://localhost:8080/login', {
        name: name,
        email: email,
        password_hash: password,
      });

      // 1. サーバーから返ってきた全データを表示
      console.log('サーバーからの応答:', response);

      // 2. 応答の中の 'data' プロパティを表示
      console.log('応答データ (response.data):', response.data);
      
      // 3. accessTokenの存在を確認
      console.log('accessTokenの値:', response.data.accessToken);


    
        // 受け取ったJWTトークンをブラウザのLocalStorageに保存
       if (response.data.accessToken) {
        // accessToken と refreshToken の両方をLocalStorageに保存
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // ログイン成功後、ホームページに遷移
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>name:</label>
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ログイン</button>
      </form>
      <p>
        アカウントをお持ちでないですか？ <a href="/register">新規登録</a>
      </p>
    </div>
  );
}

export default LoginPage;