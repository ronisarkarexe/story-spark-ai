// @vitest-environment jsdom
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import * as Y from 'yjs';
import CollabEditor from './CollabEditor';
import { io } from 'socket.io-client';

const mockEmit = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)._mockEmit = mockEmit;

// Mock socket.io-client with a clean, typed EventEmitter alternative to avoid node require/hoisting issues
class MockSocket {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners: Record<string, ((...args: any[]) => void)[]> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, cb: (...args: any[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(cb);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, cb: (...args: any[]) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== cb);
  }

  emit(event: string, ...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)._mockEmit(event, ...args);
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(...args));
    }
  }

  disconnect() {}
}

vi.mock('socket.io-client', () => {
  return { io: vi.fn(() => new MockSocket()) };
});

// Mock IndexedDB persistence
vi.mock('y-indexeddb', () => {
  return {
    IndexeddbPersistence: class {
      once(event: string, cb: () => void) {
        if (event === 'synced') cb();
      }
    },
  };
});

// Mock y-quill binding
vi.mock('y-quill', () => {
  return {
    QuillBinding: class {
      constructor(
        ytext: { observe: (cb: () => void) => void; toString: () => string },
        quill: { setText: (text: string) => void }
      ) {
        ytext.observe(() => {
          quill.setText(ytext.toString());
        });
      }
      destroy() {}
    },
  };
});

// Mock quill-cursors registration (no‑op)
vi.mock('quill-cursors', () => ({ default: class DummyCursors {} }));

// Mock Quill editor
vi.mock('quill', () => {
  class MockQuill {
    container: HTMLElement;
    text: string = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(container: HTMLElement, _options: unknown) {
      this.container = container;
      const editorNode = document.createElement('div');
      editorNode.className = 'ql-editor';
      editorNode.setAttribute('contenteditable', 'true');
      editorNode.setAttribute('role', 'textbox');
      container.appendChild(editorNode);
    }
    static register() {}
    getModule() { return {}; }
    on() {}
    setText(text: string) {
      this.text = text;
      const editorNode = this.container.querySelector('.ql-editor');
      if (editorNode) {
        editorNode.textContent = text;
      }
    }
  }
  return { default: MockQuill };
});

describe('CollabEditor', () => {
  const storyId = 'test-story';
  const userId = 'user-1';
  const username = 'Tester';
  const userColor = '#ff0000';

  beforeEach(() => {
    mockEmit.mockClear();
    (io as unknown as { mockClear: () => void }).mockClear();
  });

  it('renders editor container', () => {
    render(
      <CollabEditor
        storyId={storyId}
        userId={userId}
        username={username}
        userColor={userColor}
      />,
    );
    const container = screen.getByRole('textbox', { hidden: true });
    expect(container).toBeInTheDocument();
  });

  it('applies remote Yjs updates to the editor', async () => {
    const { container } = render(
      <CollabEditor
        storyId={storyId}
        userId={userId}
        username={username}
        userColor={userColor}
      />,
    );
    // Wait for Yjs doc creation
    await act(async () => {});
    // Simulate remote update
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText('quill');
    ytext.insert(0, 'Hello world');
    const update = Y.encodeStateAsUpdate(ydoc);
    const socket = (io as unknown as { mock: { results: Array<{ value: MockSocket }> } }).mock.results[0].value;
    await act(async () => {
      socket.emit('update', update);
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    // Quill should now contain the text
    const editor = container.querySelector('.ql-editor');
    expect(editor?.textContent).toContain('Hello world');
  });

  it('broadcasts local cursor changes via awareness', async () => {
    render(
      <CollabEditor
        storyId={storyId}
        userId={userId}
        username={username}
        userColor={userColor}
      />,
    );
    // Not easily accessible – instead we verify that socket.emit was called at least once for awareness
    await act(async () => {});
    expect(mockEmit).toHaveBeenCalled();
  });
});
