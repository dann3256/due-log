// src/pages/BillingPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanyNames, createBill, getBillsByDate } from '../services/authService';
import type { CreateBillRequest, Bill } from '../types/types.tsx';
import styles from './BillingPage.module.css';

// --- ヘルパー関数と選択肢の定義 ---
const calculateDueDate = (option: string): string => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  switch (option) {
    case 'current-month-end': return new Date(year, month + 1, 0).toISOString().split('T')[0];
    case 'next-month-15': return new Date(year, month + 1, 15).toISOString().split('T')[0];
    case 'next-month-20': return new Date(year, month + 1, 20).toISOString().split('T')[0];
    case 'next-month-end': return new Date(year, month + 2, 0).toISOString().split('T')[0];
    default: return '';
  }
};
const dueDateOptions = [
  { value: 'current-month-end', label: '当月末' },
  { value: 'next-month-15', label: '翌月15日' },
  { value: 'next-month-20', label: '翌月20日' },
  { value: 'next-month-end', label: '翌月末' },
];
type CategorizedBills = {
  [key: string]: { label: string; date: string; bills: Bill[]; };
};

const BillingPage: React.FC = () => {
  // --- State定義 ---
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState(dueDateOptions[0].value);
  const [categorizedBills, setCategorizedBills] = useState<CategorizedBills>({});
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isLoadingBills, setIsLoadingBills] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- 副作用 (useEffect) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setError(null);
      // 会社名を取得
      try {
        const companyResponse = await getCompanyNames();
        setCompanyNames(companyResponse.names);
        if (companyResponse.names && companyResponse.names.length > 0) {
          setSelectedCompany(companyResponse.names[0]);
        }
      } catch (err) { 
        setError('会社名の取得に失敗しました。'); 
      } finally { 
        setLoadingCompanies(false); 
      }
      // 請求書を取得
      try {
        const billPromises = dueDateOptions.map(option => getBillsByDate(calculateDueDate(option.value)));
        const billResults = await Promise.all(billPromises);
        const newCategorizedBills: CategorizedBills = {};
        dueDateOptions.forEach((option, index) => {
          newCategorizedBills[option.value] = {
            label: option.label,
            date: calculateDueDate(option.value),
            bills: billResults[index],
          };
        });
        setCategorizedBills(newCategorizedBills);
      } catch (err) { 
        setError('請求書一覧の取得に失敗しました。'); 
      } finally { 
        setIsLoadingBills(false); 
      }
    };
    fetchInitialData();
  }, []);

  // --- イベントハンドラ ---
  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!selectedCompany) {
      setError('会社を選択してください。');
      return;
    }
    setIsCreatingBill(true);
    const requestData: CreateBillRequest = {
      name: selectedCompany,
      credit: parseInt(creditAmount, 10),
      credit_date: calculateDueDate(selectedDueDate)
    };
    try {
      await createBill(requestData);
      setSuccessMessage(`請求書を作成しました。一覧はリロードすると更新されます。`);
      setCreditAmount('');
    } catch (err: any) {
      setError(err.message || '請求書の作成に失敗しました。');
    } finally {
      setIsCreatingBill(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>請求管理ダッシュボード</h1>
        <Link to="/homepage" className={styles.backButton}>
          トップページへ戻る
        </Link>
      </div>
      
      {error && <p className={styles.errorMessage}>エラー: {error}</p>}
      
      <div className={styles.dashboardGrid}>
        {/* === 左カラム: 請求書作成フォーム === */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>請求書作成</h2>
          {loadingCompanies ? <p className={styles.loadingText}>会社名リストを読み込み中...</p> : (
            <form onSubmit={handleCreateBill}>
              <div className={styles.formGroup}>
                <label htmlFor="company-select" className={styles.label}>会社名:</label>
                <select id="company-select" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} required className={styles.select} disabled={companyNames.length === 0}>
                  {companyNames.length > 0 ? (
                    companyNames.map(name => <option key={name} value={name}>{name}</option>)
                  ) : (
                    <option>登録済みの会社がありません</option>
                  )}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="credit-amount" className={styles.label}>金額 (円):</label>
                <input id="credit-amount" type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} required className={styles.input} placeholder="例: 50000" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="due-date-select" className={styles.label}>支払期日:</label>
                <select id="due-date-select" value={selectedDueDate} onChange={e => setSelectedDueDate(e.target.value)} required className={styles.select}>
                  {dueDateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
              <button type="submit" disabled={isCreatingBill || companyNames.length === 0} className={styles.button}>
                {isCreatingBill ? '作成中...' : '請求書を作成'}
              </button>
            </form>
          )}
        </div>

        {/* === 右カラム: 請求書一覧 === */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>支払期日ごとの請求書一覧</h2>
          
          {/* ↓↓↓ 抜け落ちていた請求書一覧の表示ロジックをここに追加しました ↓↓↓ */}
          {isLoadingBills ? <p className={styles.loadingText}>請求書を読み込み中...</p> : (
            Object.values(categorizedBills).map(category => (
              <div key={category.date} className={styles.billCategory}>
                <h3 className={styles.categoryHeader}>{category.label} ({category.date})</h3>
                {category.bills.length > 0 ? (
                  <table className={styles.billTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>会社名</th>
                        <th>金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.bills.map(bill => (
                        <tr key={bill.id}>
                          <td>{bill.id}</td>
                          <td>{bill.name}</td>
                          <td className={styles.amountCell}>{bill.credit.toLocaleString()} 円</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className={styles.emptyText}>この支払期日の請求書はありません。</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;