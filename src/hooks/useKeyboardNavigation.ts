import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  onEscape?: () => void;
  onSelectOption?: (index: number) => void;
  disabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    onNext,
    onPrevious,
    onSubmit,
    onEscape,
    onSelectOption,
    disabled = false
  } = options;

  const handlersRef = useRef(options);
  handlersRef.current = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    const { key, ctrlKey, metaKey, altKey } = event;
    const handlers = handlersRef.current;

    // Prevent default for handled keys
    const shouldPreventDefault = () => {
      switch (key) {
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'Enter':
        case 'Escape':
        case '1':
        case '2':
        case '3':
        case '4':
          return true;
        default:
          return false;
      }
    };

    if (shouldPreventDefault()) {
      event.preventDefault();
    }

    // Handle keyboard shortcuts
    switch (key) {
      case 'ArrowRight':
        if (!ctrlKey && !metaKey && !altKey) {
          handlers.onNext?.();
        }
        break;

      case 'ArrowLeft':
        if (!ctrlKey && !metaKey && !altKey) {
          handlers.onPrevious?.();
        }
        break;

      case 'Enter':
        if (ctrlKey || metaKey) {
          handlers.onSubmit?.();
        }
        break;

      case 'Escape':
        handlers.onEscape?.();
        break;

      case '1':
      case '2':
      case '3':
      case '4':
        if (!ctrlKey && !metaKey && !altKey) {
          const optionIndex = parseInt(key) - 1;
          handlers.onSelectOption?.(optionIndex);
        }
        break;

      default:
        break;
    }
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, disabled]);

  // Return keyboard shortcut info for UI display
  return {
    shortcuts: [
      { key: '→', description: 'Next question' },
      { key: '←', description: 'Previous question' },
      { key: '1-4', description: 'Select answer option' },
      { key: 'Ctrl+Enter', description: 'Submit exam' },
      { key: 'Esc', description: 'Exit exam' }
    ]
  };
};