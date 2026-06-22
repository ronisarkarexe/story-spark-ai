// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import StoriesViewComponent, { IStories } from './stories.view.component';

// --- Cleanup after every single test ---
afterEach(() => {
  cleanup();
});

// --- Shared Mocks ---
const mockNavigate = vi.fn();

vi.mock('../../helpers/config', () => ({
  getBaseUrl: () => 'http://localhost:5000',
  API_BASE: 'http://localhost:5000',
  API_V1: 'http://localhost:5000/api/v1',
}));

vi.mock('../AudioPlayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const AudioPlayerMock = React.forwardRef((props, ref) => {
    return React.createElement('div', { 'data-testid': 'audio-player-mock' }, 'AudioPlayerMock');
  });
  return {
    __esModule: true,
    default: AudioPlayerMock,
  };
});

vi.mock('react-router-dom', () => {
  return {
    useLocation: () => ({ pathname: '/stories' }),
    useNavigate: () => mockNavigate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Link: ({ to, children, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
  };
});

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
vi.mock('../../redux/apis/ai.model.api', () => ({
  useGenerateAlternateEndingsMutation: () => [vi.fn()],
  useGenerateFreeAlternateEndingsMutation: () => [vi.fn()],
}));

vi.mock('../../redux/apis/post.api', () => ({
  useCreatePostMutation: () => [vi.fn()],
  useDeletePostMutation: () => [vi.fn()],
}));

vi.mock('../../redux/apis/story.visualizer.api', () => ({
  useGenerateStoryVisualsMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('../../redux/apis/bookmark.api', () => ({
  useToggleBookmarkMutation: () => [vi.fn()],
  useGetMyBookmarksQuery: () => ({ data: [] }),
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
  },
];

describe('StoriesViewComponent - Core Rendering', () => {
  const mockSetStories = vi.fn();

  it('renders landing state when stories array is empty', () => {
    render(
      <StoriesViewComponent
        stories={[]}
        isLogin={true}
        setStories={mockSetStories}
      />
    );
    expect(screen.getByText(/your first story will appear here/i)).toBeInTheDocument();
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

  it('renders scientific warnings when present in the story', () => {
    const storiesWithWarnings = [
      {
        uuid: '123-abc',
        title: 'The Great AI Adventure',
        content: 'Once upon a time in a digital world...',
        tag: 'Sci-Fi',
        imageURL: 'http://example.com/image.jpg',
        scientificWarnings: [
          {
            detectedIssue: 'Spiders classified as insects',
            explanation: 'Spiders are arachnids, not insects.',
            suggestedCorrection: 'Refer to spiders as arachnids.',
          },
        ],
      },
    ];

    render(
      <StoriesViewComponent
        stories={storiesWithWarnings}
        isLogin={true}
        setStories={mockSetStories}
      />
    );

    expect(screen.getByText('Scientific Fact-Check')).toBeInTheDocument();
    expect(screen.getByText('Spiders classified as insects')).toBeInTheDocument();
    expect(screen.getByText('Spiders are arachnids, not insects.')).toBeInTheDocument();
    expect(screen.getByText('Refer to spiders as arachnids.')).toBeInTheDocument();
  });
});