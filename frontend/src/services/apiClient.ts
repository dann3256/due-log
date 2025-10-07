//  APIラッパー関数における共通の設定をしておくaxiosインスタンスを作成

import axios from 'axios';
const apiClient = axios.create({
  // 環境変数からAPIのベースURLを読み込む
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // ヘッダーにjson形式であることを書く
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;