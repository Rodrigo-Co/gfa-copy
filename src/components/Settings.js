import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import { supabase } from '../lib/supabaseClient';


const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [nome, setName] = useState('');
  const [email, setEmail] = useState('');
  const [Nos, setNos] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const emailStorage = localStorage.getItem('userEmail');
        if (emailStorage) {
          const { data, error } = await supabase
            .from('usuarios')
            .select('nome, nos') // nomes certos da sua tabela
            .eq('email', emailStorage)
            .single();

          if (error) {
            console.error('Erro ao buscar dados do usuário:', error.message);
          } else {
            setName(data.nome || '');
            setEmail(emailStorage); // já que buscamos pelo localStorage
            if (data.nos) {
              setNos(data.nos);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      const emailStorage = localStorage.getItem('userEmail');
      if (!emailStorage) throw new Error('Email não encontrado no localStorage.');

      const { error } = await supabase
        .from('usuarios')
        .update({ nome })
        .eq('email', emailStorage);

      if (error) throw error;

      localStorage.setItem('userName', nome);
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err.message);
      alert('Erro ao atualizar perfil');
    }
  };

  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    try {
      const emailStorage = localStorage.getItem('userEmail');
      if (!emailStorage) throw new Error('Email não encontrado no localStorage.');

      const { error } = await supabase
        .from('usuarios')
        .update({ nos: Nos })
        .eq('email', emailStorage);

      if (error) throw error;

      localStorage.setItem('Nos', Nos);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar configurações:', err.message);
      alert('Erro ao salvar configurações');
    }
  };


  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => navigate('/dashboard')}
      >
        <i className="uil uil-arrow-left"></i> Voltar
      </button>

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
                    required
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
                    onChange={(e) => setNos(parseInt(e.target.value) || 1)}
                    min="1"
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