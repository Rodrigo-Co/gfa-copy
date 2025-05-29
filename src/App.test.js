import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mocks dos componentes usados nas rotas
jest.mock('./components/login', () => () => <div>Login Page</div>);
jest.mock('./components/register', () => () => <div>Register Page</div>);
jest.mock('./pages/home', () => () => <div>Home Page</div>);
jest.mock('./components/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('./components/Settings', () => () => <div>Settings Page</div>);

// Função auxiliar para renderizar com rota simulada
const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
};

describe('App routing', () => {
  test('renders Login component on default route "/"', () => {
    renderWithRouter(<App />, { route: '/' });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders Register component on "/register"', () => {
    renderWithRouter(<App />, { route: '/register' });
    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });

  test('renders Home component on "/home"', () => {
    renderWithRouter(<App />, { route: '/home' });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders Dashboard component on "/dashboard"', () => {
    renderWithRouter(<App />, { route: '/dashboard' });
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  test('renders Settings component on "/settings"', () => {
    renderWithRouter(<App />, { route: '/settings' });
    expect(screen.getByText('Settings Page')).toBeInTheDocument();
  });

  test('shows nothing for unknown routes (no fallback)', () => {
    renderWithRouter(<App />, { route: '/not-found' });
    expect(screen.queryByText(/Page/i)).not.toBeInTheDocument();
  });
});
