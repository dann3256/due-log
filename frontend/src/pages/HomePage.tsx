import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // LocalStorageからトークンを取得
    const token = localStorage.getItem('accessToken');

    // トークンがなければ（未ログイン状態なら）ログインページにリダイレクト
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  
  // ログアウト処理
  const handleLogout = () => {
    // LocalStorageからトークンを削除
    localStorage.removeItem('token');
    // ログインページにリダイレクト
    navigate('/login');
  };

  return (
    <div>
      <h1>ようこそ！</h1>
      <p>これはログインしたユーザーだけが見られるページです。</p>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}

export default HomePage;