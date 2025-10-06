// src/pages/HomePage.tsx

import React from 'react';
// react-router-domからLinkコンポーネントをインポートします
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>振り込み管理画面</h1>
      
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px' }}>
            {/* to属性で遷移先のパスを指定します */}
            <Link to="/company-register">
              <button>会社登録</button>
            </Link>
          </li>
          <li style={{ margin: '10px' }}>
            <Link to="/transfer-management">
              <button>振り込み管理</button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;