import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './services/api';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import PortfolioListPage from './pages/PortfolioListPage';
import ContactPage from './pages/ContactPage';
import PortfolioDetail from './pages/PortfolioDetail';
import DynamicPageView from './pages/DynamicPageView';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSkills from './pages/admin/AdminSkills';
import AdminPortfolioV2 from './pages/admin/AdminPortfolioV2';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminPages from './pages/admin/AdminPages';
import AdminMedia from './pages/admin/AdminMedia';
import AdminCvResume from './pages/admin/AdminCvResume';
import AdminEducation from './pages/admin/AdminEducation';
import AdminVolunteer from './pages/admin/AdminVolunteer';
import AdminPublication from './pages/admin/AdminPublication';
import AdminCourse from './pages/admin/AdminCourse';
import AdminCertification from './pages/admin/AdminCertification';
import CvPreviewPage from './pages/CvPreviewPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminMuiThemeProvider from './contexts/AdminMuiThemeProvider';
import './App.css';

function AppContent() {
  const [layoutMode, setLayoutMode] = useState<'single' | 'multiple'>('single');
  const [enablePages, setEnablePages] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/site').then((res) => {
      if (res.data.layoutMode === 'multiple') setLayoutMode('multiple');
      if (res.data.enablePages === false) setEnablePages(false);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (layoutMode === 'multiple') {
    return (
      <Routes>
        <Route path="/" element={<HomePage layoutMode="multiple" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/portfolio" element={<PortfolioListPage />} />
        <Route path="/portfolio/:id" element={<PortfolioDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        {enablePages && <Route path="/:slug" element={<DynamicPageView />} />}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminMuiThemeProvider><AdminLayout /></AdminMuiThemeProvider>}>
          <Route index element={<AdminDashboard />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="portfolio" element={<AdminPortfolioV2 />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="templates" element={<AdminTemplates />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="cv-resume" element={<AdminCvResume />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="volunteer" element={<AdminVolunteer />} />
          <Route path="publications" element={<AdminPublication />} />
          <Route path="courses" element={<AdminCourse />} />
          <Route path="certifications" element={<AdminCertification />} />
        </Route>
        <Route path="/cv" element={<CvPreviewPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/portfolio/:id" element={<PortfolioDetail />} />
      <Route path="/cv" element={<CvPreviewPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminMuiThemeProvider><AdminLayout /></AdminMuiThemeProvider>}>
        <Route index element={<AdminDashboard />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="portfolio" element={<AdminPortfolioV2 />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="templates" element={<AdminTemplates />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="cv-resume" element={<AdminCvResume />} />
        <Route path="education" element={<AdminEducation />} />
        <Route path="volunteer" element={<AdminVolunteer />} />
        <Route path="publications" element={<AdminPublication />} />
        <Route path="courses" element={<AdminCourse />} />
        <Route path="certifications" element={<AdminCertification />} />
      </Route>
      <Route path="/:slug" element={<DynamicPageView />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
