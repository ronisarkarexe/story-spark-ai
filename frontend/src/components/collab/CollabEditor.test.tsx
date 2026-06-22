// @vitest-environment jsdom
import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import CollabEditor from './CollabEditor';
import * as Y from 'yjs';
import { io } from 'socket.io-client';

// Mock socket.io-client
vi.mock('socket.io-client', () => {
  const EventEmitter = require('events');
  class MockSocket extends EventEmitter {
    emit = vi.fn(function (this: any, event: string, ...args: any[]) {
      EventEmitter.prototype.emit.apply(this, [event, ...args]);
    });
    disconnect() {}
  }
  return { io: vi.fn(() => new MockSocket()) };
});

// Mock IndexedDB persistence
vi.mock('y-indexeddb', () => {
  return {
    IndexeddbPersistence: class {
      constructor(storyId: string, ydoc: any) {
        (global as any).mockYdoc = ydoc;
      }
      once(event: string, cb: () => void) {
        if (event === 'synced') cb();
      }
    },
  };
});

// Mock quill-cursors registration (no‑op)
vi.mock('quill-cursors', () => ({
  default: class {
    constructor() {}
  }
}));

describe('CollabEditor', () => {
  const storyId = 'test-story';
  const userId = 'user-1';
  const username = 'Tester';
  const userColor = '#ff0000';

  beforeEach(() => {
    vi.clearAllMocks();
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
    const mockYdoc = (global as any).mockYdoc;
    act(() => {
      mockYdoc.getText('quill').insert(0, 'Hello world');
    });
    
    console.log("MOCKYDOC TEXT IN TEST:", mockYdoc?.getText('quill')?.toString());

    // Quill should now contain the text
    const editor = container.querySelector('.ql-editor');
    await waitFor(() => {
      expect(editor?.textContent).toContain('Hello world');
    });
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
    const socket = (io as any).mock.results[0].value;
    
    // Simulate selection change on Quill
    const mockQuill = (global as any).mockQuill;
    act(() => {
      mockQuill.emitter.emit('selection-change', { index: 0, length: 5 });
    });

    await act(async () => {});
    expect(socket.emit).toHaveBeenCalledWith('awareness', expect.any(Uint8Array));
  });
});
