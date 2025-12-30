import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout({ children, onLessonSelect, onViewChange, currentView, onShowKeyboardShortcuts }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on landing page, render only the children (landing page content)
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-white dark:bg-gh-dark-bg flex flex-col">
        <main id="main-content" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gh-dark-bg flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <Header 
        onLessonSelect={onLessonSelect}
        onShowKeyboardShortcuts={onShowKeyboardShortcuts}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onViewChange={onViewChange}
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
        
        {/* Main content with footer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main id="main-content" className="flex-1 overflow-y-auto" tabIndex="-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
