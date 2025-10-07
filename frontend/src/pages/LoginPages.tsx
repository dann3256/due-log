// src/pages/LoginPage.tsx

import React, { useState } from 'react';
// ↓↓↓ 画面遷移用のフックとリンクコンポーネントをインポート
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import type { LoginRequest } from '../types/types.tsx';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useNavigateフックを初期化
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const requestData: LoginRequest = {
      name: email,
      email: email,
      password_hash: password,
    };

    try {
      const response = await loginUser(requestData);
      console.log('ログイン成功:', response);

      // トークンをローカルストレージに保存
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // ★★★ ログイン後のページにスムーズに遷移 ★★★
      // window.location.href の代わりに navigate を使う
      navigate('/homepage'); // 例として請求管理ページへ

    } catch (err) {
      console.error(err);
      setError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>ログイン画面</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>メールアドレス:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
              placeholder="user@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>パスワード:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className={styles.linksContainer}>
          <Link to="/register" className={styles.secondaryLink}>
            新規登録はこちら
          </Link>
          <span style={{ color: '#555' }}>|</span>
          <Link to="/" className={styles.secondaryLink}>
            トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;