import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/login.js';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Login component', () => {

  test('Renderiza inputs e botão', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  test('Mostra erro ao tentar login com email/senha inválidos', async () => {
    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: async () => ({
              data: null,
              error: { message: 'Usuário não encontrado' },
            }),
          }),
        }),
      }),
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'email@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senhaerrada' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(await screen.findByText('Email ou senha incorretos.')).toBeInTheDocument();
  });

  test('Realiza login com sucesso e navega para /dashboard', async () => {
    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: async () => ({
              data: { email: 'usuario@teste.com' },
              error: null,
            }),
          }),
        }),
      }),
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'usuario@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem('user')).toBe(JSON.stringify({ email: 'usuario@teste.com' }));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('Mostra erro ao falhar conexão com servidor', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: async () => {
              throw new Error('Erro de rede');
            },
          }),
        }),
      }),
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'usuario@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(await screen.findByText('Erro ao conectar com o servidor.')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

});
