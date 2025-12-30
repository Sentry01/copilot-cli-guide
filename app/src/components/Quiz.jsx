import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Quiz({ lessonId, userId }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchQuizQuestions();
  }, [lessonId]);

  const fetchQuizQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/lessons?lesson_id=${lessonId}&quiz=true`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        if (data.length === 0) {
          setQuizCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (!showFeedback) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          question_id: currentQuestion.id,
          selected_answer: selectedAnswer
        })
      });

      if (response.ok) {
        const result = await response.json();
        setFeedback(result);
        setShowFeedback(true);

        if (result.is_correct) {
          setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
        } else {
          setScore(prev => ({ ...prev, total: prev.total + 1 }));
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFeedback(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFeedback(null);
    setScore({ correct: 0, total: 0 });
    setQuizCompleted(false);
  };

  if (isLoading) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gh-dark-surface rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gh-dark-surface rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gh-dark-surface rounded w-full mb-2"></div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-text-light dark:text-text-dark">No quiz available for this lesson yet.</p>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score.correct / score.total) * 100);
    const passed = percentage >= 70;

    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
          }`}>
            {passed ? (
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
            Quiz Complete!
          </h3>
          
          <p className="text-lg text-text-light dark:text-text-dark mb-4">
            Your Score: <span className="font-bold text-primary">{score.correct} / {score.total}</span> ({percentage}%)
          </p>
          
          <p className="text-text-light dark:text-text-dark mb-6">
            {passed 
              ? '🎉 Great job! You passed the quiz.' 
              : '📚 Keep practicing! You can retry to improve your score.'}
          </p>
          
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-text-light dark:text-text-dark mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{score.correct} / {score.total} correct</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gh-dark-surface rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
        {currentQuestion.question}
      </h3>

      {/* Answer options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = feedback && index === feedback.correct_answer;
          const isWrong = feedback && isSelected && !feedback.is_correct;

          let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
          
          if (showFeedback) {
            if (isCorrect) {
              buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100';
            } else if (isWrong) {
              buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100';
            } else {
              buttonClass += 'border-gray-300 dark:border-gh-dark-border bg-white dark:bg-gh-dark-surface text-text-light dark:text-text-dark opacity-50';
            }
          } else {
            if (isSelected) {
              buttonClass += 'border-primary bg-blue-50 dark:bg-blue-900/20 text-text-light dark:text-text-dark';
            } else {
              buttonClass += 'border-gray-300 dark:border-gh-dark-border bg-white dark:bg-gh-dark-surface text-text-light dark:text-text-dark hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              className={buttonClass}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {showFeedback && isCorrect && (
                  <CheckCircle className="ml-auto w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {showFeedback && isWrong && (
                  <XCircle className="ml-auto w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && feedback && (
        <div className={`p-4 rounded-lg mb-6 ${
          feedback.is_correct 
            ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
            : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
        }`}>
          <div className="flex items-start">
            {feedback.is_correct ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            )}
            <div>
              <p className={`font-semibold mb-1 ${
                feedback.is_correct 
                  ? 'text-green-900 dark:text-green-100' 
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {feedback.is_correct ? 'Correct!' : 'Incorrect'}
              </p>
              <p className={feedback.is_correct 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
              }>
                {feedback.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          {!showFeedback && selectedAnswer !== null && (
            <span>Answer selected</span>
          )}
        </div>
        
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
