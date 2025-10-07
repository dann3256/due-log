// src/pages/HomePage.tsx

import React from 'react';
// react-router-domからLinkコンポーネントをインポートします
import { Link } from 'react-router-dom';
// CSS Modulesをインポートします
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    // CSSモジュールからスタイルを適用します
    <div className={styles.pageContainer}>
      <div className={styles.contentBox}>
        <h1 className={styles.title}>Due-log</h1>
        <p className={styles.description}>
          面倒な振り込み管理にITで革命を
        </p>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              {/*
                Linkコンポーネントに直接スタイルを適用します。
                これにより、<a>タグがボタンのデザインになります。
              */}
              <Link to="/login" className={styles.button}>
                ログイン
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/register" className={styles.button}>
                新規登録
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;