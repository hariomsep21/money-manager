import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalState';
import BottomNav from './components/Layout/BottomNav';
import LandingPage from './pages/Landing/LandingPage';
import TransactionsPage from './pages/Transactions/TransactionsPage';
import AddTransactionPage from './pages/Transactions/AddTransactionPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import NotesPage from './pages/Notes/NotesPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ThemePage from './pages/Theme/ThemePage';
import MorePage from './pages/More/MorePage';
import { InstallPWA } from './components/InstallPWA';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="app-wrapper">
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/add-transaction" element={<AddTransactionPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          {/* Profile route removed */}
          {/* Accounts section removed */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/theme" element={<ThemePage />} />
          <Route path="/more" element={<MorePage />} />
        </Routes>
      </div>
      {!isLanding && <BottomNav />}
      {!isLanding && <InstallPWA />}
    </div>
  );
}

function App() {
  return (
    <GlobalProvider>
      <Router>
        <AppContent />
      </Router>
    </GlobalProvider>
  );
}

export default App;
