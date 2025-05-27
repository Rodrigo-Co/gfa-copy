import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '/register.js'; 

// Mock de useNavigate global
const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

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
  
  //Erro ao inserir email sem formatação correta
  test('Mostra erro ao inserir email inválido', async () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'email_invalido' } });
    fireEvent.click(screen.getByText('Registrar'));
    expect(await screen.findByText('Por favor, insira um email válido.')).toBeInTheDocument();
  });

  //Formatar o CPF para o padrão
  test('Formata o CPF corretamente', () => {
    render(<Register />);
    const cpfInput = screen.getByPlaceholderText('CPF');
    fireEvent.change(cpfInput, { target: { value: '12345678900' } });
    expect(cpfInput.value).toBe('123.456.789-00');
  });
});

  //Erro para email já cadastrado
  describe('Cadastro com email já existente', () => {
    jest.mock('../lib/supabaseClient', () => ({
      supabase: {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { email: 'teste@teste.com' },
                error: null,
              }),
            }),
          }),
        }),
      },
    }));
  
    test('Mostra erro se email já estiver registrado', async () => {
      render(<Register />);
      fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Fulano' } });
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'teste@teste.com' } });
      fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } });
      fireEvent.change(screen.getByPlaceholderText('CPF'), { target: { value: '12345678900' } });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByText('Registrar'));
  
      expect(await screen.findByText('Já existe um usuário cadastrado com este email.')).toBeInTheDocument();
    });
  });
  



//Registrar funcionando
describe('Cadastro realizado com sucesso', () => {
    jest.mock('../lib/supabaseClient', () => ({
      supabase: {
        from: () => ({
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
        }),
      },
    }));
  
    test('Realiza o cadastro com sucesso', async () => {
      render(<Register />);
      fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Fulano' } });
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'novo@teste.com' } });
      fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } });
      fireEvent.change(screen.getByPlaceholderText('CPF'), { target: { value: '12345678900' } });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByText('Registrar'));
  
      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith('/');
      });
    });
  });
  

//Erro Supabase inesperado
describe('Erro de rede no Supabase', () => {
    jest.mock('../lib/supabaseClient', () => ({
      supabase: {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => {
                throw new Error('Erro de rede');
              },
            }),
          }),
        }),
      },
    }));
  
    test('Mostra erro ao falhar conexão com Supabase', async () => {
      render(<Register />);
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'novo@teste.com' } });
      fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Fulano' } });
      fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } });
      fireEvent.change(screen.getByPlaceholderText('CPF'), { target: { value: '12345678900' } });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByText('Registrar'));
  
      expect(await screen.findByText('Erro ao conectar com o servidor.')).toBeInTheDocument();
    });
  });
  