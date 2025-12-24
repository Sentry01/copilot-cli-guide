import { useState } from 'react'
import { UserProvider } from './contexts/UserContext'
import MainLayout from './layouts/MainLayout'
import LessonView from './components/LessonView'
import ProgressDashboard from './components/ProgressDashboard'
import BookmarksView from './components/BookmarksView'

function App() {
  const [currentLessonId, setCurrentLessonId] = useState(3); // Default to first lesson (Introduction)
  const [currentView, setCurrentView] = useState('lesson'); // 'lesson', 'progress', or 'bookmarks'

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
        ) : (
          <LessonView lessonId={currentLessonId} />
        )}
      </MainLayout>
    </UserProvider>
  )
}

export default App
