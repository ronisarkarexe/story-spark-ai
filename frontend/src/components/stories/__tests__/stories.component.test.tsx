import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import StoriesComponent from './stories.component';
import { useGetProfileInfoQuery } from '../../redux/apis/user.api';
import { useGenerateModelMutation, useGenerateFreeModelMutation } from '../../redux/apis/ai.model.api';
import { getUserInfo, isLoggedIn } from '../../services/auth.service';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useRecentPrompts } from '../../hooks/useRecentPrompts';
import { useGetProfileInfoQuery as mockGetProfileInfoQuery } from '../../redux/apis/user.api';
import { useGenerateModelMutation as mockUseGenerateModelMutation } from '../../redux/apis/ai.model.api';
import { useGenerateFreeModelMutation as mockUseGenerateFreeModelMutation } from '../../redux/apis/ai.model.api';
import { getUserInfo as mockGetUserInfo } from '../../services/auth.service';
import { isLoggedIn as mockIsLoggedIn } from '../../services/auth.service';
import { useKeyboardShortcuts as mockUseKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useRecentPrompts as mockUseRecentPrompts } from '../../hooks/useRecentPrompts';

describe('StoriesComponent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    expect(getByText('Turn Your Ideas Into Amazing Stories!')).toBeInTheDocument();
  });

  it('renders login button when not logged in', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => false);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('renders generate button when logged in', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    expect(getByText('Generate')).toBeInTheDocument();
  });

  it('calls generateModel mutation when generate button is clicked', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const generateButton = getByText('Generate');
    fireEvent.click(generateButton);
    expect(mockUseGenerateModelMutation.mutate).toHaveBeenCalledTimes(1);
  });

  it('calls generateFreeModel mutation when generate button is clicked and user is not logged in', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => false);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const generateButton = getByText('Generate');
    fireEvent.click(generateButton);
    expect(mockUseGenerateFreeModelMutation.mutate).toHaveBeenCalledTimes(1);
  });

  it('calls addPrompt when generate button is clicked and user is logged in', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const generateButton = getByText('Generate');
    fireEvent.click(generateButton);
    expect(mockUseRecentPrompts.addPrompt).toHaveBeenCalledTimes(1);
  });

  it('calls removePrompt when delete button is clicked', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [{ id: 1, prompt: 'test' }], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const deleteButton = getByText('Delete');
    fireEvent.click(deleteButton);
    expect(mockUseRecentPrompts.removePrompt).toHaveBeenCalledTimes(1);
  });

  it('calls clearAll when clear all button is clicked', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [{ id: 1, prompt: 'test' }], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const clearAllButton = getByText('Clear All');
    fireEvent.click(clearAllButton);
    expect(mockUseRecentPrompts.clearAll).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenHelp when help button is clicked', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const helpButton = getByText('Open help');
    fireEvent.click(helpButton);
    expect(mockUseKeyboardShortcuts.onOpenHelp).toHaveBeenCalledTimes(1);
  });

  it('calls onCloseHelp when help button is clicked', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const helpButton = getByText('Close help');
    fireEvent.click(helpButton);
    expect(mockUseKeyboardShortcuts.onCloseHelp).toHaveBeenCalledTimes(1);
  });

  it('calls focusPrompt when focus prompt button is clicked', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn(), focusPrompt: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() => ({ recentPrompts: [], addPrompt: vi.fn(), removePrompt: vi.fn(), clearAll: vi.fn() }));

    vi.mocked(useGetProfileInfoQuery).mockImplementation(mockGetProfileInfoQuery);
    vi.mocked(useGenerateModelMutation).mockImplementation(mockUseGenerateModelMutation);
    vi.mocked(useGenerateFreeModelMutation).mockImplementation(mockUseGenerateFreeModelMutation);
    vi.mocked(getUserInfo).mockImplementation(mockGetUserInfo);
    vi.mocked(isLoggedIn).mockImplementation(mockIsLoggedIn);
    vi.mocked(useKeyboardShortcuts).mockImplementation(mockUseKeyboardShortcuts);
    vi.mocked(useRecentPrompts).mockImplementation(mockUseRecentPrompts);

    const { getByText } = render(<StoriesComponent />);
    const focusPromptButton = getByText('Focus prompt');
    fireEvent.click(focusPromptButton);
    expect(mockUseKeyboardShortcuts.focusPrompt).toHaveBeenCalledTimes(1);
  });

  it('calls publishStory when publish story button is clicked', async () => {
    const mockGetProfileInfoQuery = vi.fn(() => ({ data: { user: { id: 1 } } }));
    const mockUseGenerateModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockUseGenerateFreeModelMutation = vi.fn(() => ({ mutate: vi.fn() }));
    const mockGetUserInfo = vi.fn(() => ({ id: 1 }));
    const mockIsLoggedIn = vi.fn(() => true);
    const mockUseKeyboardShortcuts = vi.fn(() => ({ onOpenHelp: vi.fn(), onCloseHelp: vi.fn(), focusPrompt: vi.fn() }));
    const mockUseRecentPrompts = vi.fn(() =>