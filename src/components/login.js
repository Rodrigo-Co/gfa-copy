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
    <div className="login-container">
      <div className="logo">GFA</div>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {loginError && <span style={{ color: 'red' }}>{loginError}</span>}
      </form>
      <div className="register-link">
        <a href="/register">Registre-se</a>
      </div>
    </div>
  );
};

export default Login;