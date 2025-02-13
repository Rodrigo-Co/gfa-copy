import React, { useState } from 'react';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Enviar dados para o servidor
    const response = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha: password }),
    });

    if (response.ok) {
      alert('Login bem-sucedido!');
      // Aqui você pode redirecionar o usuário ou armazenar um token, se necessário
    } else {
      const errorMessage = await response.text();
      setLoginError(errorMessage);
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