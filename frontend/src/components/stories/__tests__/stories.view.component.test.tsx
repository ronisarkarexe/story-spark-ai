import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import StoriesViewComponent from './stories.view.component';
import { useCreatePostMutation, useDeletePostMutation } from '../../redux/apis/post.api';
import { useGetProfileInfoQuery } from '../../redux/apis/user.api';
import { useGenerateAlternateEndingsMutation, useGenerateFreeAlternateEndingsMutation } from '../../redux/apis/ai.model.api';
import { setStory } from '../../redux/slices/storySlice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../../redux/apis/user.api';
import { useGetUserPostsQuery } from '../../redux/apis/post.api';
import { useGetUserStoriesQuery } from '../../redux/apis/story.api';
import { useGetUserBookmarksQuery } from '../../redux/apis/story.api';
import { useGetUserRemixesQuery } from '../../redux/apis/story.api';
import { useGetUserWorldsQuery } from '../../redux/apis/story.api';
import { useGetUserStoryRemixesQuery } from '../../redux/apis/story.api';
import { useGetUserStoryWorldsQuery } from '../../redux/apis/story.api';

vi.mock('../../redux/apis/post.api', () => ({
  useCreatePostMutation: vi.fn(),
  useDeletePostMutation: vi.fn(),
}));

vi.mock('../../redux/apis/user.api', () => ({
  useGetProfileInfoQuery: vi.fn(),
  useGetUserQuery: vi.fn(),
}));

vi.mock('../../redux/apis/ai.model.api', () => ({
  useGenerateAlternateEndingsMutation: vi.fn(),
  useGenerateFreeAlternateEndingsMutation: vi.fn(),
}));

vi.mock('../../redux/slices/storySlice', () => ({
  setStory: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

describe('StoriesViewComponent', () => {
  let stories: any;
  let isLogin: boolean;
  let setStories: any;
  let onPublishSuccess: any;
  let isLoading: boolean;

  beforeEach(() => {
    stories = [
      {
        uuid: 'uuid1',
        title: 'title1',
        content: 'content1',
        tag: 'tag1',
        imageURL: 'imageURL1',
      },
      {
        uuid: 'uuid2',
        title: 'title2',
        content: 'content2',
        tag: 'tag2',
        imageURL: 'imageURL2',
      },
    ];

    isLogin = true;
    setStories = vi.fn();
    onPublishSuccess = vi.fn();
    isLoading = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component', () => {
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
      />,
    );

    expect(getByText('title1')).toBeInTheDocument();
  });

  it('renders the story content', () => {
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
      />,
    );

    expect(getByText('content1')).toBeInTheDocument();
  });

  it('renders the story tags', () => {
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
      />,
    );

    expect(getByText('tag1')).toBeInTheDocument();
  });

  it('renders the story image', () => {
    const { getByAltText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
      />,
    );

    expect(getByAltText('card-image')).toBeInTheDocument();
  });

  it('renders the bookmark button', () => {
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
      />,
    );

    expect(getByText('Bookmark')).toBeInTheDocument();
  });

  it('renders the publish button', () => {
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
      />,
    );

    expect(getByText('Publish')).toBeInTheDocument();
  });

  it('calls the handlePublishStory function when the publish button is clicked', () => {
    const handlePublishStory = vi.fn();
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
        handlePublishStory={handlePublishStory}
      />,
    );

    fireEvent.click(getByText('Publish'));

    expect(handlePublishStory).toHaveBeenCalledTimes(1);
  });

  it('calls the handleCopyStory function when the copy button is clicked', () => {
    const handleCopyStory = vi.fn();
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
        handleCopyStory={handleCopyStory}
      />,
    );

    fireEvent.click(getByText('Copy'));

    expect(handleCopyStory).toHaveBeenCalledTimes(1);
  });

  it('calls the handleExportPDF function when the export PDF button is clicked', () => {
    const handleExportPDF = vi.fn();
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
        handleExportPDF={handleExportPDF}
      />,
    );

    fireEvent.click(getByText('Export PDF'));

    expect(handleExportPDF).toHaveBeenCalledTimes(1);
  });

  it('calls the handleExportMarkdown function when the export markdown button is clicked', () => {
    const handleExportMarkdown = vi.fn();
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
        handleExportMarkdown={handleExportMarkdown}
      />,
    );

    fireEvent.click(getByText('Export Markdown'));

    expect(handleExportMarkdown).toHaveBeenCalledTimes(1);
  });

  it('calls the handleGenerateAlternateEndings function when the generate alternate endings button is clicked', () => {
    const handleGenerateAlternateEndings = vi.fn();
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
        handleGenerateAlternateEndings={handleGenerateAlternateEndings}
      />,
    );

    fireEvent.click(getByText('Generate Alternate Endings'));

    expect(handleGenerateAlternateEndings).toHaveBeenCalledTimes(1);
  });

  it('calls the handleApplyEnding function when the apply ending button is clicked', () => {
    const handleApplyEnding = vi.fn();
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
        handleApplyEnding={handleApplyEnding}
      />,
    );

    fireEvent.click(getByText('Apply to Story'));

    expect(handleApplyEnding).toHaveBeenCalledTimes(1);
  });

  it('calls the handleResetEnding function when the reset ending button is clicked', () => {
    const handleResetEnding = vi.fn();
    const { getByText } = render(
      <StoriesViewComponent
        stories={stories}
        isLogin={isLogin}
        setStories={setStories}
        onPublishSuccess={onPublishSuccess}
        isLoading={isLoading}
        handleResetEnding={handleResetEnding}
      />,
    );

    fireEvent.click(getByText('Reset to Original'));

    expect(handleResetEnding).toHaveBeenCalledTimes(1);
  });
});