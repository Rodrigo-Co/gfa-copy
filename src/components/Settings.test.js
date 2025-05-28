// Settings.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from './Settings';
import { BrowserRouter } from 'react-router-dom';
import supabase from '../lib/supabaseClient.js';

beforeAll(() => {
    // Remove aviso do React Router Future Flag
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        args[0] &&
        args[0].includes('React Router Future Flag Warning')
      ) {
        return;
      }
      originalWarn(...args);
    };
  });
  

// Mock do supabase
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: (...args) => {
      const [table] = args;

      // SELECT
      if (table === 'usuarios') {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: {
                    nome: 'Fulano',
                    email: 'fulano@email.com',
                    nos: 2,
                    codigo_central: 'CENTRAL123',
                  },
                  error: null,
                }),
            }),
          }),
          // UPDATE
          update: () => ({
            eq: () =>
              Promise.resolve({
                data: {},
                error: null,
              }),
          }),
        };
      }

      return {};
    },
  },
}));

// Simula o sessionStorage com um usuário logado
beforeEach(() => {
  sessionStorage.setItem(
    'user',
    JSON.stringify({ email: 'fulano@email.com' })
  );
});

const renderWithRouter = (component) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

describe('Settings Component', () => {
    it('exibe os dados do usuário corretamente', async () => {
        renderWithRouter(<Settings />);
      
        // Espera os dados do perfil carregarem
        await waitFor(() => {
          expect(screen.getByDisplayValue('Fulano')).toBeInTheDocument();
          expect(screen.getByDisplayValue('fulano@email.com')).toBeInTheDocument();
        });
      
        // Troca para a aba "Configurações" para ver os valores de `Nos` e `CodigoCentral`
        fireEvent.click(screen.getByText(/Configurações/i));
      
        // Espera os dados da aba "Configurações" aparecerem
        await waitFor(() => {
          expect(screen.getByDisplayValue('2')).toBeInTheDocument(); // valor de Nos
          expect(screen.getByDisplayValue('CENTRAL123')).toBeInTheDocument();
        });
      });
      

  it('atualiza os dados do perfil', async () => {
    renderWithRouter(<Settings />);

    await waitFor(() => screen.getByDisplayValue('Fulano'));

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Ciclano' },
    });

    fireEvent.click(screen.getByText(/salvar alterações/i));

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('Ciclano')
      ).toBeInTheDocument();
    });
  });

  it('atualiza configurações gerais', async () => {
    renderWithRouter(<Settings />);

    // Troca para aba "Configurações"
    fireEvent.click(screen.getByText(/configurações/i));

    fireEvent.change(screen.getByLabelText(/quantos nós/i), {
      target: { value: 5 },
    });

    fireEvent.change(screen.getByLabelText(/código da sua central/i), {
      target: { value: 'NOVOCODIGO' },
    });

    fireEvent.click(screen.getByText(/salvar/i));

    await waitFor(() => {
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('NOVOCODIGO')).toBeInTheDocument();
    });
  });
});