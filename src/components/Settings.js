import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import { supabase } from '../lib/supabaseClient';


const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [nome, setName] = useState('');
  const [email, setEmail] = useState('');
  const [Nos, setNos] = useState(1);
  const [CodigoCentral, setCodigoCentral] = useState('');
  const [error, setError] = useState('');
  const [novaSenha, setNovaSenha] = useState(""); // <-- Add this line
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSession = sessionStorage.getItem('user');
        if (userSession) {
          const userData = JSON.parse(userSession);
          const { data, error } = await supabase
            .from('usuarios')
            .select('nome, email, nos, codigo_central') // nomes certos da sua tabela
            .eq('email', userData.email)
            .single();

          if (error) {
            console.error('Erro ao buscar dados do usuário:', error.message);
          } else {
            setName(data.nome || '');
            setEmail(data.email || ''); // já que buscamos pelo localStorage
            setNos(Number(data.nos || 1));
            setCodigoCentral(data.codigo_central || '');
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err.message);
        setError('Erro ao buscar dados do usuário');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      const userSession = sessionStorage.getItem('user');
      if (!userSession) throw new Error('Sessão do usuário não encontrada.');

      const userData = JSON.parse(userSession);

      // Atualizar nome no banco de dados (pode ser vazio)
      await supabase
        .from('usuarios')
        .update({ nome })
        .eq('email', userData.email);

      // Atualizar senha se o campo estiver preenchido
      if (novaSenha && novaSenha.length > 0) {
        await supabase
          .from('usuarios')
          .update({ senha: novaSenha }) // <- substitui o campo 'senha'
          .eq('email', userData.email);

        setNovaSenha(""); // Limpa o campo após sucesso
        sessionStorage.clear();
        alert('Senha alterada com sucesso!');
        navigate('/');
      return;
      }
      sessionStorage.setItem('userName', nome); // Atualizar o nome na sessão
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err.message);
      alert('Erro ao atualizar perfil: ' + err.message);
    }
  };

  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    try {
      const userSession = sessionStorage.getItem('user');
      if (!userSession) throw new Error('Sessão do usuário não encontrada.');

      const userData = JSON.parse(userSession);

      // Verificar se a quantidade de "Nos" é válida
      if (isNaN(Nos) || Nos <= 0) {
        alert('Por favor, insira uma quantidade válida de "Nos".');
        return;
      }
      

      const { error } = await supabase
        .from('usuarios')
        .update({ nos: Nos, codigo_central: CodigoCentral })
        .eq('email', userData.email); // Atualizar no banco de dados

      if (error) throw error;

      sessionStorage.setItem('Nos', Nos); // Salvar a quantidade de "Nos" na sessão
      sessionStorage.setItem('deviceId', CodigoCentral); 
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar configurações:', err.message);
      alert('Erro ao salvar configurações');
    }
  };


  return (
    <div className={styles.container}>
      {/* <button 
        className={styles.backButton}
        onClick={() => navigate('/dashboard')}
      >
        <i className="uil uil-arrow-left"></i> Voltar
      </button> */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className={styles.settingsContainer}>
        <div className={styles.sidebar}>
    
          <button
            className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="uil uil-user-circle"></i> Perfil
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <i className="uil uil-cog"></i> Configurações
          </button>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
          <i className="uil uil-arrow-left"></i> Voltar
          </button>

        </div>

        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.tabContent}>
              <h2>Perfil</h2>
              <form onSubmit={handleSubmitProfile} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Nome</label>
                  <input
                    type="text"
                    id="fullName"
                    value={nome}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    disabled
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password">Nova Senha</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Digite sua nova senha"
                    value={novaSenha || ""}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.submitButton}>
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}

          {activeTab === 'general' && (
            <div className={styles.tabContent}>
              <h2>Configurações Gerais</h2>
              <form onSubmit={handleSubmitSettings} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="Nos">Quantos Nós há em sua casa:</label>
                  <input
                    type="number"
                    id="Nos"
                    value={Nos}
                    onChange={(e) => setNos(parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="CodigoCentral">Código da sua central:</label>
                  <input
                    type="text"
                    id="CodigoCentral"
                    value={CodigoCentral}
                    onChange={(e) => setCodigoCentral(e.target.value)}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.submitButton}>
                    Salvar
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => setNos(1)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;