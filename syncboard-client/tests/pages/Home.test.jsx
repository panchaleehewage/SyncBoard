import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from '../../src/pages/Home';
import { AppContext } from '../../src/context/AppContext';

const renderHomeLoggedOut = () => {
  return render(
    <MemoryRouter>
      <AppContext.Provider value={{ 
        currentUser: null, 
        setAuthModal: vi.fn(),
        boards: [],
        pendingInvites: []
      }}>
        <Home />
      </AppContext.Provider>
    </MemoryRouter>
  );
};

describe('Home Page (Landing State)', () => {
  it('renders the hero section for unauthenticated users', () => {
    renderHomeLoggedOut();

    expect(screen.getByText(/Your team's work,/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Start for free/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });
});