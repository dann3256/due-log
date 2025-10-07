// src/main.tsx

import React from 'react'; // Reactのインポートを推奨
import ReactDOM from 'react-dom/client'; // createRootではなくReactDOMをインポート
import './index.css';
// import App from './App.tsx' // App.tsxは現在使用していないため、コメントアウトまたは削除
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RegisterPages from './pages/RegisterPages';
import LoginPages from './pages/LoginPages';
import WelcomePages from './pages/WelcomePages';
import HomePages from './pages/HomePages';
import CompanyReg from './pages/CompanyReg';
import BillPages from './pages/BillPages';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePages />} />
        <Route path="/register" element={<RegisterPages />} />
        <Route path="/login" element={<LoginPages />} />
        <Route path="/homepage" element={<HomePages />} />
        <Route path="/company-register" element={<CompanyReg />} />
        <Route path="/transfer-management" element={<BillPages />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);