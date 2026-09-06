import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../../src/components/Navbar';
import { AppContext } from '../../src/context/AppContext';

vi.mock('../../src/context/ThemeContext', () => ({
  useTheme: () => ({ isDarkMode: false, toggleTheme: vi.fn() })
}));

const renderNavbar = (currentUser = null) => {
  return render(
    <MemoryRouter>
      <AppContext.Provider value={{ currentUser, logout: vi.fn(), setAuthModal: vi.fn() }}>
        <Navbar />
      </AppContext.Provider>
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  it('shows Login and Sign Up buttons when no user is logged in', () => {
    renderNavbar(null);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('shows the username and hides auth buttons when logged in', () => {
    renderNavbar('StudentDev');
    expect(screen.getByText('StudentDev')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
  });
});