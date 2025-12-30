import { useEffect, useCallback } from 'react';

export default function useKeyboardShortcuts(handlers) {
  const handleKeyPress = useCallback((event) => {
    // Don't trigger shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable) {
      // Allow \ to still work for search focus
      if (event.key !== '\\') {
        return;
      }
    }

    const key = event.key.toLowerCase();
    const isMod = event.metaKey || event.ctrlKey;
    const isShift = event.shiftKey;

    // Command/Ctrl + Key combinations
    if (isMod && !isShift) {
      switch (key) {
        case 'k':
          event.preventDefault();
          handlers.onCommandPalette?.();
          break;
        case 'enter':
          event.preventDefault();
          handlers.onExecuteCommand?.();
          break;
      }
      return;
    }

    // Ctrl + Key combinations (different from Command)
    if (event.ctrlKey && !event.metaKey) {
      switch (key) {
        case 'c':
          if (handlers.onClearTerminal) {
            event.preventDefault();
            handlers.onClearTerminal();
          }
          break;
      }
      return;
    }

    // Single key shortcuts (no modifiers)
    if (!isMod && !isShift) {
      switch (key) {
        case '?':
          event.preventDefault();
          handlers.onShowKeyboardShortcuts?.();
          break;
        case '\\':
          event.preventDefault();
          handlers.onFocusSearch?.();
          break;
        case 'escape':
          event.preventDefault();
          handlers.onEscape?.();
          break;
        case '[':
          event.preventDefault();
          handlers.onToggleSidebar?.();
          break;
        case ',':
          event.preventDefault();
          handlers.onOpenSettings?.();
          break;
        case 't':
          event.preventDefault();
          handlers.onToggleTheme?.();
          break;
        case 'm':
          event.preventDefault();
          handlers.onMarkComplete?.();
          break;
        case 'b':
          event.preventDefault();
          handlers.onToggleBookmark?.();
          break;
        case 'arrowleft':
          if (handlers.onPreviousLesson) {
            event.preventDefault();
            handlers.onPreviousLesson();
          }
          break;
        case 'arrowright':
          if (handlers.onNextLesson) {
            event.preventDefault();
            handlers.onNextLesson();
          }
          break;
        case 'arrowup':
          if (handlers.onPreviousCommand) {
            event.preventDefault();
            handlers.onPreviousCommand();
          }
          break;
        case 'arrowdown':
          if (handlers.onNextCommand) {
            event.preventDefault();
            handlers.onNextCommand();
          }
          break;
      }
    }
  }, [handlers]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}
