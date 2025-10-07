// src/pages/CompanyRegistrationPage.tsx

import React, { useState } from 'react';
import { createCompany } from '../services/authService';
import type { CreateCompanyRequest } from '../types/types.tsx';
// CSS Modulesをインポート
import styles from './CompanyRegistrationPage.module.css';
import { Link } from 'react-router-dom';

const CompanyRegistrationPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // バリデーション: 空白のみの入力を防ぐ
    if (!companyName.trim()) {
      setError('会社名を入力してください。');
      return;
    }

    const creditLimitNumber = parseInt(creditLimit, 10);
    if (isNaN(creditLimitNumber)) {
      setError('振り込み上限には有効な数値を入力してください。');
      return;
    }

    setIsLoading(true);
    const requestData: CreateCompanyRequest = {
      name: companyName.trim(),
      credit_limit: creditLimitNumber,
    };

    try {
      const response = await createCompany(requestData);
      setSuccessMessage(`会社「${response.name}」を登録しました。(ID: ${response.id})`);
      setCompanyName('');
      setCreditLimit('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || '会社の登録に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>会社登録</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="company-name" className={styles.label}>会社名:</label>
            <input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="credit-limit" className={styles.label}>振り込み上限:</label>
            <input
              id="credit-limit"
              type="number"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
              placeholder="例: 500000" // 入力例を追加
            />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? '登録中...' : '登録'}
          </button>
          <Link to="/homepage" className={styles.backButton}>
            トップページへ戻る
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;