// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import StoriesViewComponent, {
  IStories
} from './stories.view.component';

// --- Cleanup after every single test ---
afterEach(() => {
  cleanup();
});

// --- Shared Mocks ---
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/stories' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    loading: vi.fn(() => 'test-toast-id'),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster-mock" />,
}));

// Mock RTK Query Hooks
const mockGenerateAlternateEndings = vi.fn();
const mockGenerateFreeAlternateEndings = vi.fn();

vi.mock('../../redux/apis/ai.model.api', () => ({
  useGenerateAlternateEndingsMutation: () => [mockGenerateAlternateEndings],
  useGenerateFreeAlternateEndingsMutation: () => [mockGenerateFreeAlternateEndings],
}));

vi.mock('../../redux/apis/post.api', () => ({
  useCreatePostMutation: () => [vi.fn()],
  useDeletePostMutation: () => [vi.fn()],
}));

vi.mock('../../redux/apis/bookmark.api', () => ({
  useToggleBookmarkMutation: () => [vi.fn()],
  useCheckBookmarkStatusQuery: () => ({ data: { isBookmarked: false }, isLoading: false, isError: false }),
}));

vi.mock('../../redux/apis/user.api', () => ({
  useGetProfileInfoQuery: () => ({ data: { name: 'Test User' } }),
}));

// --- Test Data ---
const mockStories: IStories[] = [
  {
    uuid: '123-abc',
    title: 'The Great AI Adventure',
    content: 'Once upon a time in a digital world...',
    tag: 'Sci-Fi',
    imageURL: 'http://example.com/image.jpg',
    language: 'English',
  },
];



describe('StoriesViewComponent - Core Rendering', () => {
  const mockSetStories = vi.fn();

  it('renders "No stories available." when stories array is empty', () => {
    render(
      <StoriesViewComponent
        stories={[]}
        isLogin={true}
        setStories={mockSetStories}
      />
    );
    expect(screen.getByText('No stories available.')).toBeInTheDocument();
  });

  it('renders the first story correctly when stories are provided', () => {
    render(
      <StoriesViewComponent
        stories={mockStories}
        isLogin={true}
        setStories={mockSetStories}
      />
    );
    expect(screen.getAllByText('The Great AI Adventure')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Once upon a time in a digital world...')[0]).toBeInTheDocument();
  });
});

describe('StoriesViewComponent - Alternate Endings Generation', () => {
  const mockSetStories = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls generateAlternateEndings when user is logged in', async () => {
    // eslint-disable-with-line is not standard, let's use disable rule
    let resolveMutation: (value: any) => void = () => {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const promise = new Promise<any>((resolve) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      resolveMutation = resolve;
    });
    mockGenerateAlternateEndings.mockReturnValue({
      unwrap: () => promise,
    });

    render(
      <StoriesViewComponent
        stories={mockStories}
        isLogin={true}
        setStories={mockSetStories}
      />
    );

    const generateBtn = screen.getByText('Generate Alternate Endings');
    fireEvent.click(generateBtn);

    expect(screen.getByText('Generating alternate endings...')).toBeInTheDocument();

    // Resolve the promise to complete the mutation
    resolveMutation({ data: [{ style: 'Dark', ending: '...', fullStory: '...' }] });

    await waitFor(() => {
      expect(mockGenerateAlternateEndings).toHaveBeenCalledWith({
        title: 'The Great AI Adventure',
        content: 'Once upon a time in a digital world...',
        tag: 'Sci-Fi',
        language: 'English',
      });
    });
  });

  it('calls generateFreeAlternateEndings when user is NOT logged in', async () => {
    mockGenerateFreeAlternateEndings.mockReturnValue({
      unwrap: () => Promise.resolve({ data: [{ style: 'Happy', ending: '...', fullStory: '...' }] }),
    });

    render(
      <StoriesViewComponent
        stories={mockStories}
        isLogin={false}
        setStories={mockSetStories}
      />
    );

    const generateBtn = screen.getByText('Generate Alternate Endings');
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(mockGenerateFreeAlternateEndings).toHaveBeenCalled();
      expect(mockGenerateAlternateEndings).not.toHaveBeenCalled();
    });
  });
});