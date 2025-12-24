import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import LessonView from './components/LessonView'

function App() {
  const [currentLessonId, setCurrentLessonId] = useState(3); // Default to first lesson (Introduction)

  return (
    <MainLayout onLessonSelect={setCurrentLessonId}>
      <LessonView lessonId={currentLessonId} />
    </MainLayout>
  )
}

export default App
