// src/pages/HomePage.tsx

import React from 'react';
// react-router-domからLinkコンポーネントをインポートします
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>ようこそ！</h1>
      <p>サービスを利用するにはログインまたは新規登録をしてください。</p>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px' }}>
            {/* to属性で遷移先のパスを指定します */}
            <Link to="/login">
              <button>ログインページへ</button>
            </Link>
          </li>
          <li style={{ margin: '10px' }}>
            <Link to="/register">
              <button>新規登録ページへ</button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;