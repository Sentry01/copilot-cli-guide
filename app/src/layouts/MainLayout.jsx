import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children, onLessonSelect, onViewChange, currentView, onShowKeyboardShortcuts }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header 
        onLessonSelect={onLessonSelect}
        onShowKeyboardShortcuts={onShowKeyboardShortcuts}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          onLessonSelect={onLessonSelect} 
          onViewChange={onViewChange}
          currentView={currentView}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
