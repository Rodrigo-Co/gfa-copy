import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Mock de useNavigate global
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
import Register from '../components/register.js'; 
jest.mock('../lib/supabaseClient'); // Jest vai usar o mock automaticamente
import { supabase } from '../lib/supabaseClient';

beforeAll(() => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React Router Future Flag Warning')
    ) {
      return;
    }
    originalWarn(...args);
  };
  global.alert = jest.fn(); // ou window.alert
});


describe('Testes da página Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


// Renderização do formulário correto
test('Renderiza o formulário corretamente', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CPF')).toBeInTheDocument();
    expect(screen.getByText(/Criar Conta/i)).toBeInTheDocument();
  });

  test('Mostra erro ao inserir email inválido', async () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'email_invalido' } });
    fireEvent.click(screen.getByText('Registrar'));
    expect(await screen.findByText('Por favor, insira um email válido.')).toBeInTheDocument();
  });

  test('Formata o CPF corretamente', () => {
    render(<Register />);
    const cpfInput = screen.getByPlaceholderText('CPF');
    fireEvent.change(cpfInput, { target: { value: '12345678900' } });
    expect(cpfInput.value).toBe('123.456.789-00');
  });

  test('Mostra erro se email já estiver registrado', async () => {
    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { email: 'teste@teste.com' },
            error: null,
          }),
        }),
      }),
    });

    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Fulano' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'teste@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('CPF'), { target: { value: '12345678900' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('Registrar'));

    expect(await screen.findByText('Já existe um usuário cadastrado com este email.')).toBeInTheDocument();
  });

  test('Realiza o cadastro com sucesso', async () => {
    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: null,
            error: { code: 'PGRST116' }, // usuário não encontrado
          }),
        }),
      }),
      insert: async () => ({
        error: null,
      }),
    });

    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Fulano' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'novo@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('CPF'), { target: { value: '12345678900' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('Registrar'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('Mostra erro ao falhar conexão com Supabase', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => {
            throw new Error('Erro de rede');
          },
        }),
      }),
    });

    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Fulano' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'novo@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('CPF'), { target: { value: '12345678900' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('Registrar'));

    expect(await screen.findByText('Erro ao conectar com o servidor.')).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});