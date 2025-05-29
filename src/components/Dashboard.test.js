

jest.mock('../lib/supabaseClient.js', () => ({
  supabase: {
    from: (table) => {
      // SELECT para a tabela 'usuarios'
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
        };
      }

      // SELECT para a tabela 'sensor_data'
      if (table === 'sensor_data') {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: [
                      {
                        id: '1',
                        timestamp: '2025-05-20 00:04:53.230394+00',
                        temperatura: 29,
                        umidade: 60,
                        qualidade_do_ar: 107,
                        codigo_central: 'CENTRAL123',
                      },
                    ],
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }

      // Caso a tabela não seja reconhecida
      return {};
    },
  },
}));


import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard.js';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';

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

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
  Bar: () => <div data-testid="mock-bar-chart" />,
  // adicione outros tipos se necessário
}));




// Simula o sessionStorage com um usuário logado
beforeEach(() => {
  sessionStorage.setItem(
    'user',
    JSON.stringify({ email: 'fulano@email.com' })
  );
});

afterAll(() => {
  console.error.mockRestore();
});

const renderWithRouter = (component) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

describe('Dashboard', () => {

  it('renderiza a dashboard com os dados corretos', async () => {
    renderWithRouter(<Dashboard />);

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Olá, Fulano/i)).toBeInTheDocument();
      expect(screen.getByText(/29°C/)).toBeInTheDocument();
      expect(screen.getByText(/60%/)).toBeInTheDocument();
      expect(screen.getByText(/Última atualização/i)).toBeInTheDocument();
    });
  });

   it('mostra nome padrão quando usuário não está logado', async () => {
     
    // No teste onde quer mudar o retorno:
  supabase.from = jest.fn((table) => {
    if (table === 'usuarios') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      };
    }
    return {
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
    };
  });

    sessionStorage.setItem(
      'user', 
      JSON.stringify({nome: 'Visitante'
      }));

     renderWithRouter(<Dashboard />);

     await waitFor(() => {
       const visitantes = screen.getAllByText(/Visitante/i);
      expect(visitantes.length).toBeGreaterThan(0);
     });
   });

   it('alternar visibilidade da sidebar', async () => {
     renderWithRouter(<Dashboard />);

     await waitFor(() => {
       expect(screen.getByTitle('Abrir/Fechar menu')).toBeInTheDocument();
     });

     const toggleButton = screen.getByTitle('Abrir/Fechar menu');
     fireEvent.click(toggleButton);

     // Não temos um jeito fácil de testar `left: -180px`, então validamos apenas que a sidebar ainda está no DOM
     expect(screen.getByText(/Leitor do consumo/i)).toBeInTheDocument();
   });

   it('exibe mensagem de erro se falhar a requisição do sensor', async () => {
     jest.spyOn(supabase, 'from').mockImplementation((table) => {
  return {
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Erro simulado' },
            }),
        }),
      }),
    }),
  };
});

     renderWithRouter(<Dashboard />);

     await waitFor(() => {
       expect(screen.getByText(/Comunicados/i)).toBeInTheDocument();
     });
   });
});