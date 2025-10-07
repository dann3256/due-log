// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentBox}>
        <h1 className={styles.title}>振り込み管理</h1>
        <nav>
          {/* ボタンを囲むコンテナを追加し、PC用のスタイルを適用 */}
          <div className={styles.buttonContainer}>
            <Link to="/company-register" className={styles.button}>
              会社登録
            </Link>
            <Link to="/transfer-management" className={styles.button}>
              日付管理
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;