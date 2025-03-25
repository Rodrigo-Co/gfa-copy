import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate(); 

  const formatCPF = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 11);
    const match = limited.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return limited;
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um email válido.');
      return;
    } else {
      setEmailError('');
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, senha: password, cpf }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        navigate('/dashboard');
      } else {
        setRegisterError(data.message || 'Erro ao registrar usuário.');
      }
    } catch (err) {
      setRegisterError('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="register-container">
      <div className="logo">GFA</div>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(formatCPF(e.target.value))}
          maxLength={14}
          required
        />
        <div className="terms-container">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            required
          />
          <label> 
            Ao se inscrever, você concorda com nossos <a href="#">Termos de Uso</a> e com a <a href="#">Política de Privacidade</a>.
          </label>
        </div>
        <button type="submit">Registrar</button>
        {registerError && <span style={{ color: 'red', marginTop: '10px' }}>{registerError}</span>}
      </form>
    </div>
  );
};

export default Register;