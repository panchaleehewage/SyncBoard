import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AppContext } from '../../src/context/AppContext';
import AuthModal from '../../src/components/AuthModal'; 

const MOCK_TOKEN = 'fake.jwt.token';
const MOCK_USER = { username: 'StudentDev', id: '123' };

const server = setupServer(
  http.post('/api/auth/login', () => {
    return HttpResponse.json({ 
      status: 'success', 
      data: { token: MOCK_TOKEN, user: MOCK_USER } 
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Login Form Submission', () => {
  it('signs in with the token returned by the mock API', async () => {
    const user = userEvent.setup();
    const onLoginSuccess = vi.fn();
    let capturedCredentials;

    server.use(
      http.post('/api/auth/login', async ({ request }) => {
        capturedCredentials = await request.json();
        return HttpResponse.json({ 
          status: 'success', 
          data: { token: MOCK_TOKEN, user: MOCK_USER } 
        });
      })
    );

    render(
      <AppContext.Provider value={{ authModal: 'login', setAuthModal: vi.fn(), login: vi.fn(), register: vi.fn() }}>
        <AuthModal onLogin={onLoginSuccess}/>
      </AppContext.Provider>
    );

    await user.type(screen.getByLabelText(/username/i), 'StudentDev');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login|sign in/i }));

    await waitFor(() => {
      expect(capturedCredentials).toEqual({
        username: 'StudentDev',
        password: 'password123',
      });
    });
  });
});