import { checkAndTrackRequest, releaseRequest } from '../idempotency';

describe('Idempotency Utility', () => {
  const mockUser1 = 'user-123';
  const mockUser2 = 'user-456';
  const payloadA = { action: 'generate', value: 1 };
  const payloadB = { action: 'generate', value: 2 };

  beforeEach(() => {
    // Enable fake timers to test the 10-second window
    jest.useFakeTimers();
    
    // TODO: If your idempotency utility exports a clear/reset function 
    // for its internal memory/cache, call it here to keep tests isolated.
  });

  afterEach(() => {
    // Clean up timers after each test
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should return true on first call (new request)', () => {
    const result = checkAndTrackRequest(mockUser1, payloadA);
    expect(result).toBe(true);
  });

  it('should return false within 10s for same userId+payload hash (duplicate)', () => {
    // First call (allowed)
    checkAndTrackRequest(mockUser1, payloadA);
    
    // Second call immediately after (blocked)
    const result = checkAndTrackRequest(mockUser1, payloadA);
    expect(result).toBe(false);
  });

  it('should return true after 10s window expires', () => {
    // First call
    checkAndTrackRequest(mockUser1, payloadA);
    
    // Fast-forward time by 10.1 seconds (10100 milliseconds)
    jest.advanceTimersByTime(10100);
    
    // Call again after window expires (allowed)
    const result = checkAndTrackRequest(mockUser1, payloadA);
    expect(result).toBe(true);
  });

  it('should remove the tracked key when releaseRequest is called', () => {
    // First call
    checkAndTrackRequest(mockUser1, payloadA);
    
    // Release the request manually before 10s is up
    releaseRequest(mockUser1, payloadA);
    
    // Call again immediately (allowed because it was released)
    const result = checkAndTrackRequest(mockUser1, payloadA);
    expect(result).toBe(true);
  });

  it('should not deduplicate different payloads (produce different hashes)', () => {
    // Call with Payload A
    checkAndTrackRequest(mockUser1, payloadA);
    
    // Call with Payload B immediately (allowed)
    const result = checkAndTrackRequest(mockUser1, payloadB);
    expect(result).toBe(true);
  });

  it('should isolate different users with the same payload', () => {
    // User 1 makes a request
    checkAndTrackRequest(mockUser1, payloadA);
    
    // User 2 makes the identical request immediately (allowed)
    const result = checkAndTrackRequest(mockUser2, payloadA);
    expect(result).toBe(true);
  });
});