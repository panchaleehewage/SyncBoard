import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import AuthModal from '../../src/components/AuthModal';
import { AppContext } from '../../src/context/AppContext';

describe('AuthModal Submission', () => {
  it('calls the login context function with the correct credentials', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();

    render(
      <AppContext.Provider value={{ 
        authModal: 'login', 
        setAuthModal: vi.fn(), 
        login: mockLogin,
        register: vi.fn() 
      }}>
        <AuthModal />
      </AppContext.Provider>
    );

    await user.type(screen.getByPlaceholderText(/Your username/i), 'StudentDev');
    await user.type(screen.getByPlaceholderText(/••••••••/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('StudentDev', 'password123');
    });
  });
});