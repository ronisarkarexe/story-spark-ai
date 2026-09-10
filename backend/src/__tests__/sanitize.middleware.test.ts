import { sanitizeBodyMiddleware, sanitizeQueryMiddleware, sanitizeAllMiddleware } from '../app/middleware/sanitize.middleware'

describe('sanitizeBodyMiddleware', () => {
  let mockReq: any
  let mockRes: any
  let mockNext: jest.Mock

  beforeEach(() => {
    mockReq = { body: {} }
    mockRes = {}
    mockNext = jest.fn()
  })

  it('calls next after sanitizing string fields in body', () => {
    mockReq.body = {
      name: '<script>alert("xss")</script>Name',
      age: 25,
      bio: 'Hello <b>world</b>',
    }

    sanitizeBodyMiddleware(mockReq, mockRes, mockNext)

    // Script tags should be stripped from string fields
    expect(mockReq.body.name).not.toContain('<script>')
    expect(mockReq.body.name).not.toContain('</script>')
    expect(mockReq.body.name).toContain('Name')
    // Non-string fields should remain unchanged
    expect(mockReq.body.age).toBe(25)
    // Other HTML tags in bio should be stripped
    expect(mockReq.body.bio).not.toContain('<b>')
    expect(mockReq.body.bio).not.toContain('</b>')
    expect(mockReq.body.bio).toContain('Hello')
    expect(mockReq.body.bio).toContain('world')
    expect(mockNext).toHaveBeenCalled()
  })

  it('handles empty body gracefully', () => {
    mockReq.body = {}

    sanitizeBodyMiddleware(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

  it('leaves non-string fields unchanged', () => {
    mockReq.body = {
      count: 42,
      active: true,
      nested: { value: 'keep <em>this</em>' },
    }

    sanitizeBodyMiddleware(mockReq, mockRes, mockNext)

    expect(mockReq.body.count).toBe(42)
    expect(mockReq.body.active).toBe(true)
    expect(mockNext).toHaveBeenCalled()
  })
})

describe('sanitizeQueryMiddleware', () => {
  let mockReq: any
  let mockRes: any
  let mockNext: jest.Mock

  beforeEach(() => {
    mockReq = { query: {} }
    mockRes = {}
    mockNext = jest.fn()
  })

  it('calls next after sanitizing string fields in query', () => {
    mockReq.query = {
      search: '<img src=x onerror=alert(1)>',
      page: '1',
    }

    sanitizeQueryMiddleware(mockReq, mockRes, mockNext)

    expect(mockReq.query.search).not.toContain('<img')
    expect(mockReq.query.search).not.toContain('onerror')
    expect(mockReq.query.page).toBe('1')
    expect(mockNext).toHaveBeenCalled()
  })

  it('handles empty query gracefully', () => {
    mockReq.query = {}

    sanitizeQueryMiddleware(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })
})

describe('sanitizeAllMiddleware', () => {
  let mockReq: any
  let mockRes: any
  let mockNext: jest.Mock

  beforeEach(() => {
    mockReq = { body: {}, query: {} }
    mockRes = {}
    mockNext = jest.fn()
  })

  it('applies both body and query sanitization', () => {
    mockReq.body = { content: '<script>bad</script>safe' }
    mockReq.query = { q: '<b>query</b>' }

    // sanitizeAllMiddleware is an array of two middleware functions
    // Apply them in sequence
    for (const mw of sanitizeAllMiddleware) {
      mw(mockReq, mockRes, mockNext)
    }

    expect(mockReq.body.content).not.toContain('<script>')
    expect(mockReq.body.content).toContain('safe')
    expect(mockReq.query.q).not.toContain('<b>')
    expect(mockReq.query.q).toContain('query')
  })

  it('always calls next for each middleware in the chain', () => {
    mockReq.body = { name: '<em>test</em>' }
    mockReq.query = {}

    for (const mw of sanitizeAllMiddleware) {
      mw(mockReq, mockRes, mockNext)
    }

    // Each middleware calls next once
    expect(mockNext).toHaveBeenCalledTimes(2)
  })
})
