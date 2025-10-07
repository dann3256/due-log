// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import type { RegisterRequest } from '../types/types.tsx';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ローディングとメッセージ用のStateを追加
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    // パスワードの文字数チェックなどのバリデーションを追加
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください。');
      setIsLoading(false);
      return;
    }

    const requestData: RegisterRequest = {
      name: name,
      email: email,
      password_hash: password,
    };

    try {
      const user = await registerUser(requestData);
      console.log('登録成功:', user);
      setSuccessMessage(`ようこそ、${user.name}さん！ログインページに移動します...`);
      
      // 2秒後にログインページへ自動遷移
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || '登録に失敗しました。メールアドレスが既に使用されている可能性があります。');
    } finally {
      // 成功時は遷移するので、ローディング解除は不要な場合もある
      if (!successMessage) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>新規登録</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>名前:</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>メールアドレス:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>パスワード (8文字以上):</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className={styles.input} />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </form>

        <div className={styles.linksContainer}>
          <Link to="/login" className={styles.secondaryLink}>
            アカウントをお持ちの方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;