import { useState } from 'react'
import { UserProvider } from './contexts/UserContext'
import MainLayout from './layouts/MainLayout'
import LessonView from './components/LessonView'
import ProgressDashboard from './components/ProgressDashboard'

function App() {
  const [currentLessonId, setCurrentLessonId] = useState(3); // Default to first lesson (Introduction)
  const [currentView, setCurrentView] = useState('lesson'); // 'lesson' or 'progress'

  return (
    <UserProvider>
      <MainLayout 
        onLessonSelect={setCurrentLessonId}
        onViewChange={setCurrentView}
        currentView={currentView}
      >
        {currentView === 'progress' ? (
          <ProgressDashboard />
        ) : (
          <LessonView lessonId={currentLessonId} />
        )}
      </MainLayout>
    </UserProvider>
  )
}

export default App
