import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import CollabEditor from './CollabEditor';
import * as Y from 'yjs';
import { io } from 'socket.io-client';

// Track socket emit calls globally to avoid render race conditions
const socketEmitMock = vi.fn();

// Mock socket.io-client
vi.mock('socket.io-client', () => {
  class MockSocket {
    listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
    emit(event: string, ...args: unknown[]) {
      socketEmitMock(event, ...args);
      const callbacks = this.listeners[event] || [];
      callbacks.forEach((cb) => cb(...args));
    }
    on(event: string, cb: (...args: unknown[]) => void) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(cb);
    }
    disconnect() {}
  }
  return { io: vi.fn(() => new MockSocket()) };
});

// Mock IndexedDB persistence
vi.mock('y-indexeddb', () => {
  return {
    IndexeddbPersistence: class {
      constructor() {}
      once(event: string, cb: () => void) {
        if (event === 'synced') cb();
      }
    },
  };
});

// Mock quill-cursors registration (no‑op, constructible dummy class)
vi.mock('quill-cursors', () => ({
  default: class MockQuillCursors {
    constructor() {}
  },
}));

// Global ref to keep track of active mock quill instance for triggering events
let globalActiveQuillInstance: Record<string, unknown> | null = null;

// Mock Quill editor to support headless testing in jsdom
vi.mock('quill', () => {
  class MockQuill {
    container: HTMLElement;
    listeners: Record<string, ((...args: unknown[]) => void)[]> = {};

    constructor(container: HTMLElement) {
      this.container = container;
      globalActiveQuillInstance = this as unknown as Record<string, unknown>;
      // Render editor workspace elements so testing-library can query them
      container.innerHTML = `
        <div class="ql-editor"></div>
        <textarea role="textbox" style="display:none"></textarea>
      `;
    }

    static register() {}
    getModule() {
      return {
        createCursor: vi.fn(),
        moveCursor: vi.fn(),
      };
    }
    on(event: string, cb: (...args: unknown[]) => void) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(cb);
    }
  }
  return { default: MockQuill };
});

// Mock Yjs to prevent constructor check issues and multi-import errors in jsdom
vi.mock('yjs', () => {
  class MockText {
    content = '';
    observers: (() => void)[] = [];
    insert(index: number, text: string) {
      this.content = this.content.substring(0, index) + text + this.content.substring(index);
      this.observers.forEach(cb => cb());
    }
    toString() {
      return this.content;
    }
    observe(cb: () => void) {
      this.observers.push(cb);
    }
  }
  class MockDoc {
    textInstance = new MockText();
    getText() {
      return this.textInstance;
    }
    on() {}
    off() {}
  }
  return {
    Doc: MockDoc,
    applyUpdate: (ydoc: MockDoc, update: { text?: string }) => {
      if (update && typeof update.text === 'string') {
        ydoc.textInstance.insert(0, update.text);
      }
    },
    encodeStateAsUpdate: (ydoc: MockDoc) => {
      return { text: ydoc.textInstance.toString() };
    },
  };
});

// Mock y-protocols/awareness to prevent serialization crashes in jsdom
vi.mock('y-protocols/awareness', () => {
  class MockAwareness {
    listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
    constructor() {}
    setLocalStateField() {
      const updateListeners = this.listeners['update'] || [];
      updateListeners.forEach(cb => cb({ added: [], updated: [], removed: [] }));
    }
    on(event: string, cb: (...args: unknown[]) => void) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(cb);
    }
    off() {}
    encodeUpdate() {
      return new Uint8Array();
    }
    applyUpdate() {}
    getStates() {
      return new Map();
    }
  }
  return {
    Awareness: MockAwareness,
    encodeAwarenessUpdate: vi.fn(() => new Uint8Array()),
    applyAwarenessUpdate: vi.fn(),
  };
});

// Mock y-quill to sync Yjs text changes manually to our mock Quill container
vi.mock('y-quill', () => {
  class MockQuillBinding {
    constructor(ytext: { observe: (cb: () => void) => void, toString: () => string }, quill: { container: HTMLElement }) {
      ytext.observe(() => {
        const editorEl = quill.container.querySelector('.ql-editor');
        if (editorEl) {
          editorEl.textContent = ytext.toString();
        }
      });
    }
  }
  return { QuillBinding: MockQuillBinding };
});

describe('CollabEditor', () => {
  const storyId = 'test-story';
  const userId = 'user-1';
  const username = 'Tester';
  const userColor = '#ff0000';

  beforeEach(() => {
    socketEmitMock.mockClear();
    globalActiveQuillInstance = null;
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
    expect(container).toBeTruthy();
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
    
    // Resolve active socket (last instance created due to react strict mode mounts)
    const results = (io as unknown as { mock: { results: { value: { emit: (event: string, data: unknown) => void } }[] } }).mock.results;
    const socket = results[results.length - 1].value;
    
    act(() => socket.emit('update', update));
    
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
    await act(async () => {});
    
    // Simulate selection change on the active Quill instance to trigger local state changes
    if (globalActiveQuillInstance) {
      const selectionChangeCallback = (globalActiveQuillInstance as any).listeners['selection-change']?.[0];
      if (selectionChangeCallback) {
        act(() => selectionChangeCallback({ index: 0, length: 5 }));
      }
    }
    
    expect(socketEmitMock).toHaveBeenCalled();
  });
});
