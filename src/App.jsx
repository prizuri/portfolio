import { HashRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './contexts/LangContext';
import { ContentProvider } from './contexts/ContentContext';
import { ToastProvider } from './contexts/ToastContext';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';

export default function App() {
  return (
    <HashRouter>
      <ContentProvider>
        <LangProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/f9xk7b" element={<Admin />} />
              <Route path="/f9xk7b/*" element={<Admin />} />
            </Routes>
          </ToastProvider>
        </LangProvider>
      </ContentProvider>
    </HashRouter>
  );
}
