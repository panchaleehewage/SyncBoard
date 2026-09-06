import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskFormModal from '../../src/components/TaskFormModal';

describe('TaskFormModal', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onSave: vi.fn(),
    board: { members: ['StudentDev'], tags: ['Urgent'] }
  };

  it('shows an error and prevents saving if the title is under 3 characters', async () => {
    const user = userEvent.setup();
    const { container } = render(<TaskFormModal {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText(/What needs to be done/i);
    await user.type(titleInput, 'Hi'); 

    const dateInput = container.querySelector('input[type="date"]');
    await user.type(dateInput, '2026-12-31');

    await user.click(screen.getByRole('button', { name: /Add Task/i }));

    expect(screen.getByText('Title must be at least 3 characters long.')).toBeInTheDocument();
    expect(defaultProps.onSave).not.toHaveBeenCalled();
    });
});