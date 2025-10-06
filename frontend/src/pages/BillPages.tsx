// src/pages/BillingPage.tsx

import React, { useState, useEffect } from 'react';
import { getCompanyNames, createBill, getBillsByDate } from '../services/authService';
import type { CreateBillRequest, Bill } from '../types/types.tsx';

const BillingPage: React.FC = () => {
  // --- State定義 ---
  // 会社名一覧
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  
  // 請求書作成フォーム用
  const [selectedCompany, setSelectedCompany] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditDate, setCreditDate] = useState('');

  // 請求書一覧表示用
  const [filterDate, setFilterDate] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  
  // UI/UX用
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isLoadingBills, setIsLoadingBills] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- 副作用 ---
  // ページ読み込み時に会社名一覧を取得
  useEffect(() => {
    const fetchCompanyNames = async () => {
      try {
        const response = await getCompanyNames();
        setCompanyNames(response.names);
        if (response.names.length > 0) {
          setSelectedCompany(response.names[0]); // 初期値を設定
        }
      } catch (err) {
        setError('会社名の取得に失敗しました。');
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanyNames();
  }, []); // 空配列なので初回レンダリング時にのみ実行

  // --- イベントハンドラ ---
  // 請求書作成フォームの送信
  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsCreatingBill(true);

    const requestData: CreateBillRequest = {
      name: selectedCompany,
      credit: parseInt(creditAmount, 10),
      credit_date: creditDate
    };

    if (!selectedCompany || isNaN(requestData.credit) || !creditDate) {
      setError('すべての項目を正しく入力してください。');
      setIsCreatingBill(false);
      return;
    }

    try {
      const response = await createBill(requestData);
      setSuccessMessage(`「${response.name}」宛の請求書 (ID: ${response.id}) を作成しました。`);
      setCreditAmount('');
      setCreditDate('');
    } catch (err: any) {
      setError(err.message || '請求書の作成に失敗しました。');
    } finally {
      setIsCreatingBill(false);
    }
  };

  // 請求書一覧の取得
  const handleFetchBills = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterDate) {
      setError('日付を選択してください。');
      return;
    }
    setError(null);
    setIsLoadingBills(true);
    setBills([]); // 新しい検索の前にリストをクリア

    try {
      const response = await getBillsByDate(filterDate);
      setBills(response);
    } catch (err: any) {
      setError(err.message || '請求書の取得に失敗しました。');
    } finally {
      setIsLoadingBills(false);
    }
  };

  // --- レンダリング ---
  return (
    <div>
      <h1>請求管理ページ</h1>
      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>エラー: {error}</p>}
      
      {/* === 請求書作成セクション === */}
      <section>
        <h2>請求書作成</h2>
        {loadingCompanies ? (
          <p>会社名リストを読み込み中...</p>
        ) : (
          <form onSubmit={handleCreateBill}>
            <div>
              <label htmlFor="company-select">会社名:</label>
              <select 
                id="company-select"
                value={selectedCompany} 
                onChange={e => setSelectedCompany(e.target.value)}
                required>
                {companyNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="credit-amount">金額:</label>
              <input 
                id="credit-amount"
                type="number" 
                value={creditAmount} 
                onChange={e => setCreditAmount(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="credit-date">請求日:</label>
              <input 
                id="credit-date"
                type="date" 
                value={creditDate} 
                onChange={e => setCreditDate(e.target.value)} 
                required 
              />
            </div>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit" disabled={isCreatingBill}>
              {isCreatingBill ? '作成中...' : '請求書を作成'}
            </button>
          </form>
        )}
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* === 請求書一覧セクション === */}
      <section>
        <h2>請求書一覧</h2>
        <form onSubmit={handleFetchBills}>
          <label htmlFor="filter-date">日付で絞り込み:</label>
          <input 
            id="filter-date"
            type="date" 
            value={filterDate} 
            onChange={e => setFilterDate(e.target.value)} 
            required 
          />
          <button type="submit" disabled={isLoadingBills}>
            {isLoadingBills ? '取得中...' : '表示'}
          </button>
        </form>

        {isLoadingBills ? (
          <p>請求書を読み込み中...</p>
        ) : bills.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>会社名</th>
                <th>金額</th>
                <th>請求日</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{bill.name}</td>
                  <td>{bill.credit.toLocaleString()} 円</td>
                  <td>{bill.credit_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{filterDate ? `この日付の請求書はありません。` : `日付を選択して表示ボタンを押してください。`}</p>
        )}
      </section>
    </div>
  );
};

export default BillingPage;