import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css'; 
import { supabase } from '../lib/supabaseClient';

const Register = () => {
  const [nome, setName] = useState('');
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
    setRegisterError('');
    setEmailError('');
  
    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um email válido.');
      return;
    }
  
    try {
      // Primeiro: Verifica se já existe usuário com esse email
      const { data: existingUser, error: selectError } = await supabase
        .from('usuarios') // <-- sua tabela no Supabase
        .select('email')
        .eq('email', email)
        .single(); // Retorna apenas um, se existir
  
      if (existingUser) {
        setRegisterError('Já existe um usuário cadastrado com este email.');
        return;
      }
  
      if (selectError && selectError.code !== 'PGRST116') {
        // Se der outro erro que não seja "não encontrado", mostra
        console.error(selectError);
        setRegisterError('Erro ao verificar o email.');
        return;
      }
  
      // Segundo: Se não existir, insere o novo usuário
      const { error: insertError } = await supabase
        .from('usuarios') // <-- sua tabela
        .insert([
          { nome, email, senha: password, cpf }
        ]);
  
      if (insertError) {
        console.error(insertError);
        setRegisterError('Erro ao registrar usuário.');
        return;
      }
  
      // Se cadastrou com sucesso
      alert('Cadastro realizado com sucesso!');
      navigate('/'); // Leva para a página de login
  
    } catch (err) {
      console.error('Erro geral:', err);
      setRegisterError('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <form onSubmit={handleRegister} className={styles.form}>
          <h2 className={styles.title}>Criar Conta</h2>
          <p className={styles.description}>ou use o email para registro</p>
  
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setName(e.target.value)}
            className={styles.formInput}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
            required
          />
          {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
            required
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(formatCPF(e.target.value))}
            className={styles.formInput}
            maxLength={14}
            required
          />
          
          <div className={styles.termsContainer}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              required
            />
            <label>
              Ao se inscrever, você concorda com nossos Termos de Uso e com a Política de Privacidade.
            </label>
          </div>
  
          <button type="submit" className={`${styles.button} ${styles.formButton}`}>Registrar</button>
          {registerError && <span style={{ color: 'red', marginTop: '10px' }}>{registerError}</span>}
        </form>
      </div>
  
      <div className={styles.switch}>
        <div className={styles.switchContainer} style={{ height: '100%' }}>
          <h2 className={styles.title}>Bem-vindo de Volta!</h2>
          <p className={styles.description}>Para se manter conectado, faça login com suas informações pessoais</p>
          <a href="/" className={styles.formLink}>Entrar</a>
        </div>
      </div>
    </div>
  );
  
};

export default Register;