// src/__tests__/Inicio.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Inicio from '../pages/home';

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

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Inicio Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );
  });

  test('renderiza título principal do projeto', () => {
    expect(screen.getByText(/GFA - Green Fire Alert/i)).toBeInTheDocument();
  });

  test('renderiza botões principais', () => {
    expect(screen.getAllByText(/Página do Usuário/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Saiba Mais/i).length).toBeGreaterThanOrEqual(1);
  });

  test('renderiza seções esperadas', () => {
    expect(screen.getByText(/Nossa Solução/i)).toBeInTheDocument();
    expect(screen.getByText(/Nossa Equipe Completa/i)).toBeInTheDocument();
    expect(screen.getByText(/Sobre o Projeto/i)).toBeInTheDocument();
    expect(screen.getByText(/Contatos/i)).toBeInTheDocument();
  });

  test('botão Página do Usuário navega para "/"', () => {
    const userButtons = screen.getAllByText(/Página do Usuário/i);
    userButtons.forEach(button => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('botão Saiba Mais também navega para "/"', () => {
    const saibaMaisButtons = screen.getAllByText(/Saiba Mais/i);
    saibaMaisButtons.forEach(button => {
      fireEvent.click(button);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renderiza campos do formulário de contato', () => {
    expect(screen.getByLabelText(/Nome:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assunto:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensagem:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
  });
});
