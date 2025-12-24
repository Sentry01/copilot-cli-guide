import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { ThemeProvider } from './contexts/ThemeContext'
import MainLayout from './layouts/MainLayout'
import LessonView from './components/LessonView'
import ProgressDashboard from './components/ProgressDashboard'
import BookmarksView from './components/BookmarksView'
import CommandsView from './components/CommandsView'
import ExamplesView from './components/ExamplesView'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal'
import CommandPalette from './components/CommandPalette'
import NotFound from './components/NotFound'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLessonId, setCurrentLessonId] = useState(3);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Determine current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/progress') return 'progress';
    if (path === '/bookmarks') return 'bookmarks';
    if (path === '/commands') return 'commands';
    if (path === '/examples') return 'examples';
    return 'lesson';
  };

  const currentView = getCurrentView();

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId);
    navigate('/');
  };

  const handleNavigate = (target) => {
    if (typeof target === 'number') {
      setCurrentLessonId(target);
      navigate('/');
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
      onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
    >
      <Routes>
        <Route path="/" element={
          <LessonView 
            lessonId={currentLessonId} 
            onNavigateToLesson={handleLessonSelect}
          />
        } />
        <Route path="/progress" element={<ProgressDashboard />} />
        <Route path="/bookmarks" element={
          <BookmarksView onLessonSelect={handleLessonSelect} />
        } />
        <Route path="/commands" element={
          <CommandsView 
            onNavigateToTerminal={(commandName) => {
              handleLessonSelect(2);
            }}
          />
        } />
        <Route path="/examples" element={<ExamplesView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Command Palette */}
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
