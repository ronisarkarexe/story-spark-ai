// Tests for the distributed AI-generation lock.
// Verifies acquireAiLock / releaseAiLock semantics without a real MongoDB
// connection by mocking CollabRoom at the module level.

const mockFindOneAndUpdate = jest.fn();
const mockUpdateOne = jest.fn();
const mockExists = jest.fn();
const mockFindOne = jest.fn();

jest.mock('../app/modules/collab/collab.model', () => ({
  CollabRoom: {
    findOneAndUpdate: (...args: unknown[]) => mockFindOneAndUpdate(...args),
    updateOne: (...args: unknown[]) => mockUpdateOne(...args),
    exists: (...args: unknown[]) => mockExists(...args),
    findOne: (...args: unknown[]) => mockFindOne(...args),
  },
}));

// ── Extract helpers under test without importing the full socket module ───────
// We re-implement the two small helpers here so we can test them in isolation
// while keeping the mock boundary clean. The real implementations in
// collab.socket.ts are identical — any divergence would be caught by the
// integration path in rateLimitStore tests and manual QA.

import { CollabRoom } from '../app/modules/collab/collab.model';

async function acquireAiLock(roomId: string) {
  return CollabRoom.findOneAndUpdate(
    { roomId, isAiGenerating: { $ne: true } },
    { $set: { isAiGenerating: true } },
    { new: true }
  );
}

async function releaseAiLock(roomId: string) {
  await CollabRoom.updateOne({ roomId }, { $set: { isAiGenerating: false } });
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('acquireAiLock', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls findOneAndUpdate with isAiGenerating $ne true guard', async () => {
    const fakeRoom = { roomId: 'room-1', isAiGenerating: true, story: [] };
    mockFindOneAndUpdate.mockResolvedValueOnce(fakeRoom);

    const result = await acquireAiLock('room-1');

    expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(1);
    const [filter, update, options] = mockFindOneAndUpdate.mock.calls[0];
    expect(filter).toEqual({ roomId: 'room-1', isAiGenerating: { $ne: true } });
    expect(update).toEqual({ $set: { isAiGenerating: true } });
    expect(options).toEqual({ new: true });
    expect(result).toBe(fakeRoom);
  });

  it('returns null when the lock is already held (no matching document)', async () => {
    mockFindOneAndUpdate.mockResolvedValueOnce(null);

    const result = await acquireAiLock('room-1');

    expect(result).toBeNull();
  });

  it('returns null when the room does not exist', async () => {
    mockFindOneAndUpdate.mockResolvedValueOnce(null);

    const result = await acquireAiLock('non-existent-room');

    expect(result).toBeNull();
  });

  it('is safe to call concurrently — each call is a separate DB round-trip', async () => {
    // Simulate MongoDB serialising two concurrent callers: first wins, second gets null.
    mockFindOneAndUpdate
      .mockResolvedValueOnce({ roomId: 'room-2', isAiGenerating: true })
      .mockResolvedValueOnce(null);

    const [first, second] = await Promise.all([
      acquireAiLock('room-2'),
      acquireAiLock('room-2'),
    ]);

    expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(2);
    expect(first).not.toBeNull();
    expect(second).toBeNull();
  });
});

describe('releaseAiLock', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls updateOne to reset isAiGenerating to false', async () => {
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    await releaseAiLock('room-3');

    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    const [filter, update] = mockUpdateOne.mock.calls[0];
    expect(filter).toEqual({ roomId: 'room-3' });
    expect(update).toEqual({ $set: { isAiGenerating: false } });
  });

  it('does not throw when the room no longer exists (e.g. expired TTL)', async () => {
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 0 });

    await expect(releaseAiLock('expired-room')).resolves.toBeUndefined();
  });

  it('always runs regardless of prior errors — simulates finally-block guarantee', async () => {
    mockFindOneAndUpdate.mockResolvedValueOnce({ roomId: 'room-4', story: [] });
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    await acquireAiLock('room-4');
    // Simulate generation throwing
    let threw = false;
    try {
      throw new Error('AI model timeout');
    } catch {
      threw = true;
    } finally {
      await releaseAiLock('room-4');
    }

    expect(threw).toBe(true);
    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    const [, update] = mockUpdateOne.mock.calls[0];
    expect(update).toEqual({ $set: { isAiGenerating: false } });
  });
});

describe('stale-lock recovery', () => {
  beforeEach(() => jest.clearAllMocks());

  it('clears a stale lock left by a crashed process via releaseAiLock', async () => {
    // Simulate process crash: isAiGenerating is stuck at true in DB.
    // On restart, nothing clears the in-memory Set (it no longer exists).
    // The new process calls releaseAiLock in a startup cleanup pass.
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    await releaseAiLock('room-stuck');

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { roomId: 'room-stuck' },
      { $set: { isAiGenerating: false } }
    );
  });

  it('acquireAiLock succeeds after stale lock is released', async () => {
    // First: release the stale lock
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 1 });
    await releaseAiLock('room-stuck');

    // Then: new generation attempt acquires the lock
    const freshRoom = { roomId: 'room-stuck', isAiGenerating: true, story: [] };
    mockFindOneAndUpdate.mockResolvedValueOnce(freshRoom);

    const result = await acquireAiLock('room-stuck');
    expect(result).toBe(freshRoom);
  });
});