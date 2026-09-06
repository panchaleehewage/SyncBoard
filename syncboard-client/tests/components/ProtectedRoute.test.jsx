import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { AppContext } from '../../src/context/AppContext';

const renderWithRouter = (currentUser) => {
  return render(
    <AppContext.Provider value={{ currentUser }}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div>Secret Dashboard</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    </AppContext.Provider>
  );
};

describe('ProtectedRoute', () => {
  it('redirects to home if user is not logged in', () => {
    renderWithRouter(null);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('renders the protected content if user is logged in', () => {
    renderWithRouter('StudentDev');
    expect(screen.getByText('Secret Dashboard')).toBeInTheDocument();
  });
});