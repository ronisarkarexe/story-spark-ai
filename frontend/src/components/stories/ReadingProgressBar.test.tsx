import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReadingProgressBar from './ReadingProgressBar';

describe('ReadingProgressBar', () => {
  it('does not render Continue Reading when onContinue is not provided', () => {
    render(<ReadingProgressBar progress={50} />);

    expect(
      screen.queryByRole('button', { name: 'Continue Reading' }),
    ).toBeNull();
  });

  it('renders and calls onContinue when the handler is provided', () => {
    const onContinue = vi.fn();

    render(
      <ReadingProgressBar
        progress={50}
        onContinue={onContinue}
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Continue Reading',
    });

    expect(button).not.toBeNull();

    fireEvent.click(button);

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('shows the completed message when progress reaches 100', () => {
    render(<ReadingProgressBar progress={100} />);

    expect(screen.getByText(/Story completed!/i)).not.toBeNull();

    expect(
      screen.queryByRole('button', { name: 'Continue Reading' }),
    ).toBeNull();
  });
});