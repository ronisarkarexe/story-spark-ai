import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import StoriesViewComponent, {
  ApiError,
  RelatedStoriesComponent,
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

describe('StoriesViewComponent - Error Handlers', () => {
  it('should return correct message for ApiError 429', () => {
    const error = new ApiError(429, 'Too Many Requests');
    expect(error.status).toBe(429);
    expect(error.message).toBe('Too Many Requests');
    expect(error.name).toBe('ApiError');
  });
});

describe('RelatedStoriesComponent', () => {
  const mockPosts = [
    { _id: 'post-1', title: 'Story One' },
    { _id: 'post-2', title: 'Story Two' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and filters out the current post', () => {
    render(<RelatedStoriesComponent posts={mockPosts} currentPostId="post-1" />);
    
    expect(screen.queryByText('Story One')).not.toBeInTheDocument();
    expect(screen.getByText('Story Two')).toBeInTheDocument();
  });

  it('navigates to the correct URL when a related story is clicked', () => {
    render(<RelatedStoriesComponent posts={mockPosts} currentPostId="post-1" />);
    
    const storyCard = screen.getByText('Story Two');
    fireEvent.click(storyCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('/stories/post-2');
  });
});

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
    expect(screen.getByText('The Great AI Adventure')).toBeInTheDocument();
    expect(screen.getByText('Once upon a time in a digital world...')).toBeInTheDocument();
  });
});

describe('StoriesViewComponent - Alternate Endings Generation', () => {
  const mockSetStories = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls generateAlternateEndings when user is logged in', async () => {
    mockGenerateAlternateEndings.mockReturnValue({
      unwrap: () => Promise.resolve({ data: [{ style: 'Dark', ending: '...', fullStory: '...' }] }),
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

    expect(generateBtn).toBeDisabled();
    expect(screen.getByText('Generating Endings...')).toBeInTheDocument();

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