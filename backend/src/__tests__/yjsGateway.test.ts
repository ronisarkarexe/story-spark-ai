// We mock socket.io, yjs, and CollabService so the suite has no I/O deps.

import * as Y from 'yjs';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockGetCollabState = jest.fn<Promise<string | undefined>, [string]>();
const mockUpdateCollabState = jest.fn<Promise<void>, [string, string]>();

jest.mock('../app/modules/collab/collab.service', () => ({
  CollabService: {
    getCollabState: (...args: [string]) => mockGetCollabState(...args),
    updateCollabState: (...args: [string, string]) => mockUpdateCollabState(...args),
  },
}));

jest.mock('y-protocols/awareness', () => ({
  Awareness: jest.fn().mockImplementation(() => ({
    setLocalStateField: jest.fn(),
    applyUpdate: jest.fn(),
  })),
}));

// Minimal Socket.io Server / Socket stubs
type Handler = (...args: unknown[]) => void;

function makeSocket(storyId: string | undefined): {
  handshake: { query: Record<string, string | undefined> };
  emit: jest.Mock;
  on: jest.Mock;
  broadcast: { emit: jest.Mock };
  disconnect: jest.Mock;
  handlers: Record<string, Handler>;
} {
  const handlers: Record<string, Handler> = {};
  const socket = {
    handshake: { query: { storyId } as Record<string, string | undefined> },
    emit: jest.fn(),
    on: jest.fn((event: string, fn: Handler) => { handlers[event] = fn; }),
    broadcast: { emit: jest.fn() },
    disconnect: jest.fn(),
    handlers,
  };
  return socket;
}

type ConnectionHandler = (socket: ReturnType<typeof makeSocket>) => void;
let capturedConnectionHandler: ConnectionHandler;

jest.mock('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    of: jest.fn().mockReturnValue({
      on: jest.fn((event: string, fn: ConnectionHandler) => {
        if (event === 'connection') capturedConnectionHandler = fn;
      }),
    }),
  })),
}));

// ── Import under test (after mocks are in place) ─────────────────────────────
import { YjsGateway } from '../app/modules/collab/yjs.gateway';
import { Server } from 'socket.io';

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildGateway() {
  const io = new Server();
  new YjsGateway(io);
  return io;
}

/** Encode a real Y.Doc with a single text entry so we can recognise it. */
function encodeDocWithText(text: string): string {
  const doc = new Y.Doc();
  doc.getText('content').insert(0, text);
  return Buffer.from(Y.encodeStateAsUpdate(doc)).toString('base64');
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('YjsGateway — initialisation race fix (#3873)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildGateway();
  });

  it('disconnects sockets that provide no storyId', () => {
    const socket = makeSocket(undefined);
    capturedConnectionHandler(socket as never);
    expect(socket.disconnect).toHaveBeenCalledWith(true);
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it('emits sync with persisted state to the first connecting socket', async () => {
    const base64 = encodeDocWithText('persisted content');
    mockGetCollabState.mockResolvedValueOnce(base64);

    const socket = makeSocket('story-1');
    capturedConnectionHandler(socket as never);

    // Flush the loader promise
    await Promise.resolve();
    await Promise.resolve();

    expect(socket.emit).toHaveBeenCalledWith('sync', expect.any(Uint8Array));
    // The emitted update should decode to a doc containing 'persisted content'
    const [, update] = socket.emit.mock.calls[0] as [string, Uint8Array];
    const doc = new Y.Doc();
    Y.applyUpdate(doc, update);
    expect(doc.getText('content').toString()).toBe('persisted content');
  });

  it('emits sync to second socket using the same in-flight loader (no duplicate DB call)', async () => {
    let resolveLoader!: (v: string) => void;
    const loaderPromise = new Promise<string>(res => { resolveLoader = res; });
    mockGetCollabState.mockReturnValueOnce(loaderPromise as Promise<string | undefined>);

    const socketA = makeSocket('story-2');
    const socketB = makeSocket('story-2');

    // Both connect while the loader is still pending
    capturedConnectionHandler(socketA as never);
    capturedConnectionHandler(socketB as never);

    // Resolve the single DB call
    resolveLoader(encodeDocWithText('shared state'));
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    // Only one DB fetch, not two
    expect(mockGetCollabState).toHaveBeenCalledTimes(1);

    // Both sockets receive sync
    expect(socketA.emit).toHaveBeenCalledWith('sync', expect.any(Uint8Array));
    expect(socketB.emit).toHaveBeenCalledWith('sync', expect.any(Uint8Array));
  });

  it('does not register update handler until after persisted state is applied', async () => {
    // Loader resolves after a tick
    let resolveLoader!: (v: string | undefined) => void;
    mockGetCollabState.mockReturnValueOnce(
      new Promise<string | undefined>(res => { resolveLoader = res; })
    );

    const socket = makeSocket('story-3');
    capturedConnectionHandler(socket as never);

    // Before loader resolves: no 'update' handler yet
    expect(socket.handlers['update']).toBeUndefined();

    resolveLoader(undefined);
    await Promise.resolve();
    await Promise.resolve();

    // After loader resolves: 'update' handler is registered
    expect(socket.handlers['update']).toBeDefined();
  });

  it('disconnects socket and clears the loader when DB load fails', async () => {
    mockGetCollabState.mockRejectedValueOnce(new Error('DB connection lost'));

    const socket = makeSocket('story-4');
    capturedConnectionHandler(socket as never);

    await Promise.resolve();
    await Promise.resolve();

    expect(socket.emit).toHaveBeenCalledWith('error', expect.objectContaining({
      message: expect.stringContaining('Failed to load document state'),
    }));
    expect(socket.disconnect).toHaveBeenCalledWith(true);
  });

  it('emits sync with empty state when no persisted state exists', async () => {
    mockGetCollabState.mockResolvedValueOnce(undefined);

    const socket = makeSocket('story-5');
    capturedConnectionHandler(socket as never);

    await Promise.resolve();
    await Promise.resolve();

    expect(socket.emit).toHaveBeenCalledWith('sync', expect.any(Uint8Array));
  });
});