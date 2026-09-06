import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BoardSettingsModal from '../../src/components/BoardSettingsModal';
import { AppContext } from '../../src/context/AppContext';

vi.mock('../../src/api/users.api', () => ({
  apiSearchUsers: vi.fn().mockResolvedValue([{ id: '1', username: 'TestUser' }])
}));

const renderWithContext = (component) => {
  return render(
    <AppContext.Provider value={{ authToken: 'fake-token', currentUser: 'StudentDev' }}>
      {component}
    </AppContext.Provider>
  );
};

describe('BoardSettingsModal', () => {
  const defaultProps = {
    title: 'Test Board',
    members: ['StudentDev'],
    columns: [{ label: 'To Do', color: 'violet' }],
    tags: [],
    onSave: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders the General tab by default and switches to Columns', async () => {
    const user = userEvent.setup();
    renderWithContext(<BoardSettingsModal {...defaultProps} />);

    expect(screen.getByDisplayValue('Test Board')).toBeInTheDocument();
    expect(screen.getByText('StudentDev')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    
    expect(screen.getByPlaceholderText('New column name…')).toBeInTheDocument();
    expect(screen.getByDisplayValue('To Do')).toBeInTheDocument();
  });

  it('adds a new column to the list when Enter is pressed', async () => {
    const user = userEvent.setup();
    renderWithContext(<BoardSettingsModal {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Columns' }));

    const input = screen.getByPlaceholderText('New column name…');
    await user.type(input, 'In Progress');
    await user.keyboard('{Enter}');

    expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
  });
});