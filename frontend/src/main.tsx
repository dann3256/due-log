// src/main.tsx

import React from 'react'; // Reactのインポートを推奨
import ReactDOM from 'react-dom/client'; // createRootではなくReactDOMをインポート
import './index.css';
// import App from './App.tsx' // App.tsxは現在使用していないため、コメントアウトまたは削除
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RegisterPages from './pages/RegisterPages';
import LoginPages from './pages/LoginPages';
import WelcomePages from './pages/WelcomePages';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePages />} />
        <Route path="/register" element={<RegisterPages />} />
        <Route path="/login" element={<LoginPages />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);