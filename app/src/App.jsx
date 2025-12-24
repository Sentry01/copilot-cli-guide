import { useState } from 'react'
import { UserProvider } from './contexts/UserContext'
import { ThemeProvider } from './contexts/ThemeContext'
import MainLayout from './layouts/MainLayout'
import LessonView from './components/LessonView'
import ProgressDashboard from './components/ProgressDashboard'
import BookmarksView from './components/BookmarksView'
import CommandsView from './components/CommandsView'
import ExamplesView from './components/ExamplesView'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'

function App() {
  const [currentLessonId, setCurrentLessonId] = useState(3); // Default to first lesson (Introduction)
  const [currentView, setCurrentView] = useState('lesson'); // 'lesson', 'progress', 'bookmarks', 'commands', or 'examples'
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId);
    setCurrentView('lesson');
  };

  // Keyboard shortcut handlers
  useKeyboardShortcuts({
    onShowKeyboardShortcuts: () => setShowKeyboardShortcuts(prev => !prev),
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[type="text"]');
      searchInput?.focus();
    },
    onEscape: () => {
      setShowKeyboardShortcuts(false);
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput && searchInput === document.activeElement) {
        searchInput.blur();
        searchInput.value = '';
      }
    },
  });

  return (
    <ThemeProvider>
      <UserProvider>
        <MainLayout 
          onLessonSelect={handleLessonSelect}
          onViewChange={setCurrentView}
          currentView={currentView}
          onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
        >
          {currentView === 'progress' ? (
            <ProgressDashboard />
          ) : currentView === 'bookmarks' ? (
            <BookmarksView onLessonSelect={handleLessonSelect} />
          ) : currentView === 'commands' ? (
            <CommandsView 
              onNavigateToTerminal={(commandName) => {
                // Navigate to "First Command" lesson (id=2) which has a terminal
                handleLessonSelect(2);
              }}
            />
          ) : currentView === 'examples' ? (
            <ExamplesView />
          ) : (
            <LessonView lessonId={currentLessonId} />
          )}
        </MainLayout>

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal 
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
