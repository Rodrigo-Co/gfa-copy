import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular busca de dados do usuário
    const fetchUserData = async () => {
      try {
        // Substitua por chamada real à sua API
        const mockUserData = { nome: "Usuário Teste", email: "usuario@teste.com" };
        setName(mockUserData.nome);
        setEmail(mockUserData.email);
        
        const mockPeopleCount = { pessoas: 2 };
        setPeopleCount(mockPeopleCount.pessoas);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      // Substitua por chamada real à sua API
      console.log('Dados atualizados:', { name });
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil');
    }
  };

  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    try {
      // Substitua por chamada real à sua API
      console.log('Pessoas na casa:', peopleCount);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
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
                    value={name}
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
                  <label htmlFor="peopleCount">Quantas pessoas há em sua casa:</label>
                  <input
                    type="number"
                    id="peopleCount"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
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
                    onClick={() => setPeopleCount(1)}
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