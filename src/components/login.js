import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgeyiibklawawnycftcj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZXlpaWJrbGF3YXdueWNmdGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTczNTk3OCwiZXhwIjoyMDU3MzExOTc4fQ.7E3_tHVeIxPE3tQWcU26K1jx7cYsyUzWwvfHNpeMGi4'; // <<< sua chave pública do Supabase

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError('');

  try {
    
    const { data, error } = await supabase
      .from('usuarios') 
      .select('*')
      .eq('email', email)
      .eq('senha', senha) 
      .single();

    if (error || !data) {
      setLoginError('Usuário não encontrado. Por favor, registre-se.');
      return;
    }

    // Se encontrou o usuário
    localStorage.setItem('userName', data.nome);
    localStorage.setItem('userEmail', data.email);

    if (data.Nos) {
      localStorage.setItem('Nos', data.Nos);
    }

    navigate('/dashboard');
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    setLoginError('Erro ao conectar com o servidor.');
  }
};


  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <form onSubmit={handleLogin} className={styles.form}>
          <h2 className={styles.title}>Bem-vindo de Volta!</h2>
          <p className={styles.description}>Para se manter conectado, faça login com suas informações pessoais</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
            required
          />
          <button type="submit" className={`${styles.button} ${styles.formButton}`}>Entrar</button>
          {loginError && <span style={{ color: 'red' }}>{loginError}</span>}
        </form>
      </div>
      <div className={styles.switch}>
        <div className={styles.switchContainer}>
          <h2 className={styles.title}>Criar Conta</h2>
          <p className={styles.description}>ou use o email para registro</p>
          <a href="/register" className={styles.formLink}>Registrar</a>
        </div>
      </div>
    </div>
  );
  
};

export default Login;