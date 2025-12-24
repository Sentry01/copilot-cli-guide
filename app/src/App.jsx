import { useState } from 'react'
import { UserProvider } from './contexts/UserContext'
import MainLayout from './layouts/MainLayout'
import LessonView from './components/LessonView'

function App() {
  const [currentLessonId, setCurrentLessonId] = useState(3); // Default to first lesson (Introduction)

  return (
    <UserProvider>
      <MainLayout onLessonSelect={setCurrentLessonId}>
        <LessonView lessonId={currentLessonId} />
      </MainLayout>
    </UserProvider>
  )
}

export default App
