import { useState } from 'react'
import { UserProvider } from './contexts/UserContext'
import MainLayout from './layouts/MainLayout'
import LessonView from './components/LessonView'
import ProgressDashboard from './components/ProgressDashboard'
import BookmarksView from './components/BookmarksView'
import CommandsView from './components/CommandsView'

function App() {
  const [currentLessonId, setCurrentLessonId] = useState(3); // Default to first lesson (Introduction)
  const [currentView, setCurrentView] = useState('lesson'); // 'lesson', 'progress', 'bookmarks', or 'commands'

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId);
    setCurrentView('lesson');
  };

  return (
    <UserProvider>
      <MainLayout 
        onLessonSelect={handleLessonSelect}
        onViewChange={setCurrentView}
        currentView={currentView}
      >
        {currentView === 'progress' ? (
          <ProgressDashboard />
        ) : currentView === 'bookmarks' ? (
          <BookmarksView onLessonSelect={handleLessonSelect} />
        ) : currentView === 'commands' ? (
          <CommandsView />
        ) : (
          <LessonView lessonId={currentLessonId} />
        )}
      </MainLayout>
    </UserProvider>
  )
}

export default App
