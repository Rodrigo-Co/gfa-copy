import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password })
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', email);
        if (userData.peopleCount) {
          localStorage.setItem('peopleCount', userData.peopleCount);
        }
        navigate('/dashboard');
      } else {
        const errorMessage = await response.text();
        setLoginError(errorMessage);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginError('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="main">
      <div className="container a-container">
        <form onSubmit={handleLogin} className="form">
          <h2 className="title">Bem-vindo de Volta!</h2>
          <p className="description">Para se manter conectado, faça login com suas informações pessoais</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form__input"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form__input"
            required
          />
          <button type="submit" className="button form__button">Entrar</button>
          {loginError && <span style={{ color: 'red' }}>{loginError}</span>}
        </form>
      </div>
      <div className="switch">
        <div className="switch__container">
          <h2 className="title">Criar Conta</h2>
          <p className="description">ou use o email para registro</p>
          <a href="/register" className="form__link">Registrar</a>
        </div>
      </div>
    </div>
  );
};

export default Login;