import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import { UserProvider } from './contexts/UserContext'
import { ThemeProvider } from './contexts/ThemeContext'
import MainLayout from './layouts/MainLayout'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import AchievementNotification from './components/AchievementNotification'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load route components
const LandingPage = lazy(() => import('./components/LandingPage'))
const LessonView = lazy(() => import('./components/LessonView'))
const ProgressDashboard = lazy(() => import('./components/ProgressDashboard'))
const BookmarksView = lazy(() => import('./components/BookmarksView'))
const CommandsView = lazy(() => import('./components/CommandsView'))
const ExamplesView = lazy(() => import('./components/ExamplesView'))
const KeyboardShortcutsModal = lazy(() => import('./components/KeyboardShortcutsModal'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))
const NotFound = lazy(() => import('./components/NotFound'))

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLessonId, setCurrentLessonId] = useState(1); // Default to first lesson: "What is Copilot CLI?"
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Scroll to top on initial mount and disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Determine current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'landing';
    if (path === '/learn') return 'lesson';
    if (path === '/progress') return 'progress';
    if (path === '/bookmarks') return 'bookmarks';
    if (path === '/commands') return 'commands';
    if (path === '/examples') return 'examples';
    return 'lesson';
  };

  const currentView = getCurrentView();

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId);
    navigate('/learn');
  };

  const handleNavigate = (target) => {
    if (typeof target === 'number') {
      setCurrentLessonId(target);
      navigate('/learn');
    } else if (typeof target === 'string') {
      navigate(`/${target}`);
    }
  };

  // Keyboard shortcut handlers
  useKeyboardShortcuts({
    onCommandPalette: () => setShowCommandPalette(prev => !prev),
    onShowKeyboardShortcuts: () => setShowKeyboardShortcuts(prev => !prev),
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[type="text"]');
      searchInput?.focus();
    },
    onEscape: () => {
      setShowKeyboardShortcuts(false);
      setShowCommandPalette(false);
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput && searchInput === document.activeElement) {
        searchInput.blur();
        searchInput.value = '';
      }
    },
  });

  return (
    <MainLayout 
      onLessonSelect={handleLessonSelect}
      onViewChange={(view) => navigate(`/${view}`)}
      currentView={currentView}
      currentLessonId={currentLessonId}
      onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }>
        <ErrorBoundary>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LandingPage />
              </motion.div>
            } />
            <Route path="/learn" element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <LessonView 
                  lessonId={currentLessonId} 
                  onNavigateToLesson={handleLessonSelect}
                />
              </motion.div>
            } />
            <Route path="/progress" element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ProgressDashboard />
              </motion.div>
            } />
            <Route path="/bookmarks" element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <BookmarksView onLessonSelect={handleLessonSelect} />
              </motion.div>
            } />
            <Route path="/commands" element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CommandsView />
              </motion.div>
            } />
            <Route path="/examples" element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ExamplesView />
              </motion.div>
            } />
            <Route path="*" element={
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <NotFound />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
        </ErrorBoundary>
      </Suspense>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <Suspense fallback={null}>
          <KeyboardShortcutsModal 
            isOpen={showKeyboardShortcuts}
            onClose={() => setShowKeyboardShortcuts(false)}
          />
        </Suspense>
      )}

      {/* Command Palette */}
      {showCommandPalette && (
        <Suspense fallback={null}>
          <CommandPalette 
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            onNavigate={handleNavigate}
            onOpenSettings={() => {
              setShowCommandPalette(false);
              const settingsBtn = document.querySelector('button[aria-label="Open settings"]');
              settingsBtn?.click();
            }}
          />
        </Suspense>
      )}

      {/* Achievement Notifications */}
      <AchievementNotification />

      {/* Aria-live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="status-announcer"></div>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App
