import { describe, test, expect, beforeEach } from 'vitest';
import { a11yUtils, keyboardShortcuts, focusManagement, contrastUtils } from '../utils/accessibility';

describe('Accessibility Utilities', () => {
  describe('a11yUtils', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    test('announce() creates and removes screen reader announcement', async () => {
      a11yUtils.announce('Test message');

      const announcement = document.querySelector('[role="status"]');
      expect(announcement).toBeTruthy();
      expect(announcement?.textContent).toBe('Test message');
      expect(announcement?.getAttribute('aria-live')).toBe('polite');

      await new Promise((resolve) => setTimeout(resolve, 1100));
      expect(document.querySelector('[role="status"]')).toBeFalsy();
    });

    test('announce() supports assertive priority', () => {
      a11yUtils.announce('Important message', 'assertive');

      const announcement = document.querySelector('[role="status"]');
      expect(announcement?.getAttribute('aria-live')).toBe('assertive');
    });

    test('setAriaLabel() sets aria-label attribute', () => {
      const element = document.createElement('button');
      a11yUtils.setAriaLabel(element, 'Close button');

      expect(element.getAttribute('aria-label')).toBe('Close button');
    });

    test('setAriaDescribedBy() sets aria-describedby attribute', () => {
      const element = document.createElement('input');
      a11yUtils.setAriaDescribedBy(element, 'desc-id');

      expect(element.getAttribute('aria-describedby')).toBe('desc-id');
    });

    test('setAriaLabelledBy() sets aria-labelledby attribute', () => {
      const element = document.createElement('div');
      a11yUtils.setAriaLabelledBy(element, 'label-id');

      expect(element.getAttribute('aria-labelledby')).toBe('label-id');
    });

    test('makeButton() adds button role and tabindex', () => {
      const element = document.createElement('div');
      a11yUtils.makeButton(element);

      expect(element.getAttribute('role')).toBe('button');
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    test('makeNavigable() adds tabindex', () => {
      const element = document.createElement('div');
      a11yUtils.makeNavigable(element);

      expect(element.getAttribute('tabindex')).toBe('0');
    });

    test('announcePageLoad() prepends page title for screen readers', () => {
      a11yUtils.announcePageLoad('Home Page');

      const heading = document.querySelector('h1');
      expect(heading?.textContent).toBe('Home Page');
      expect(heading?.className).toContain('sr-only');
    });
  });

  describe('keyboardShortcuts', () => {
    test('isEnterKey() detects Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      expect(keyboardShortcuts.isEnterKey(event)).toBe(true);
    });

    test('isSpaceKey() detects Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      expect(keyboardShortcuts.isSpaceKey(event)).toBe(true);
    });

    test('isEscapeKey() detects Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      expect(keyboardShortcuts.isEscapeKey(event)).toBe(true);
    });

    test('isTabKey() detects Tab key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      expect(keyboardShortcuts.isTabKey(event)).toBe(true);
    });

    test('isArrowKey() detects arrow keys', () => {
      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });

      expect(keyboardShortcuts.isArrowKey(upEvent)).toBe(true);
      expect(keyboardShortcuts.isArrowKey(downEvent)).toBe(true);
      expect(keyboardShortcuts.isArrowKey(leftEvent)).toBe(true);
      expect(keyboardShortcuts.isArrowKey(rightEvent)).toBe(true);
    });
  });

  describe('focusManagement', () => {
    test('restoreFocus() focuses element', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);

      focusManagement.restoreFocus(element);
      expect(document.activeElement).toBe(element);

      document.body.innerHTML = '';
    });

    test('trapFocus() prevents focus from leaving container', () => {
      const container = document.createElement('div');
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');

      container.appendChild(button1);
      container.appendChild(button2);
      document.body.appendChild(container);

      focusManagement.trapFocus(container, button1);

      button1.focus();
      expect(document.activeElement).toBe(button1);

      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
      });
      button1.dispatchEvent(shiftTabEvent);

      expect(document.activeElement).toBe(button2);

      document.body.innerHTML = '';
    });
  });

  describe('contrastUtils', () => {
    test('enableHighContrast() sets data-contrast attribute', () => {
      contrastUtils.enableHighContrast();
      expect(document.documentElement.getAttribute('data-contrast')).toBe('high');
    });

    test('disableHighContrast() removes data-contrast attribute', () => {
      contrastUtils.enableHighContrast();
      contrastUtils.disableHighContrast();
      expect(document.documentElement.getAttribute('data-contrast')).toBeNull();
    });

    test('toggleHighContrast() toggles the attribute', () => {
      contrastUtils.disableHighContrast();
      contrastUtils.toggleHighContrast();
      expect(document.documentElement.getAttribute('data-contrast')).toBe('high');

      contrastUtils.toggleHighContrast();
      expect(document.documentElement.getAttribute('data-contrast')).toBeNull();
    });

    test('getHighContrastEnabled() returns correct state', () => {
      contrastUtils.disableHighContrast();
      expect(contrastUtils.getHighContrastEnabled()).toBe(false);

      contrastUtils.enableHighContrast();
      expect(contrastUtils.getHighContrastEnabled()).toBe(true);
    });
  });
});
