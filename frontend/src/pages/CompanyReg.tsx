// src/pages/CompanyRegistrationPage.tsx

import React, { useState } from 'react';
import { createCompany } from '../services/authService';
import type { CreateCompanyRequest } from '../types/types.tsx';

const CompanyRegistrationPage: React.FC = () => {
  // フォームの入力値を管理するためのState
  const [companyName, setCompanyName] = useState('');
  // creditLimitは数値なので、初期値は空文字か0にする
  // ここでは空文字にして、送信時に数値に変換する
  const [creditLimit, setCreditLimit] = useState('');

  // ローディング状態とエラーメッセージを管理するためのState
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // フォームが送信されたときの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const requestData: CreateCompanyRequest = {
      name: companyName,
      // 入力値は文字列なので、parseIntで数値に変換
      credit_limit: parseInt(creditLimit, 10),
    };

    // credit_limitが有効な数値かチェック
    if (isNaN(requestData.credit_limit)) {
      setError('与信限度額には有効な数値を入力してください。');
      setIsLoading(false);
      return;
    }

    try {
      const response = await createCompany(requestData);
      setSuccessMessage(`会社「${response.name}」を登録しました。(ID: ${response.id})`);
      // 成功したらフォームをクリア
      setCompanyName('');
      setCreditLimit('');
    } catch (err: any) {
      console.error(err);
      // サービス関数で投げたエラーや、APIからのエラーメッセージを表示
      setError(err.message || '会社の登録に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>会社登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="company-name">会社名:</label>
          <input
            id="company-name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="credit-limit">振り込み上限:</label>
          <input
            id="credit-limit"
            type="number" // number型にすると入力が楽になる
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? '登録中...' : '登録'}
        </button>
      </form>
    </div>
  );
};

export default CompanyRegistrationPage;