export const ARIA_LABELS = {
  screenReaderOnly: 'Screen reader only',
  menuButton: 'Menu',
  closeButton: 'Close',
  contentRegion: 'Main content',
};

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
};

export const handleKeyboardNavigation = (event, handlers) => {
  if (handlers[event.key]) {
    event.preventDefault();
    handlers[event.key](event);
  }
};

export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};
