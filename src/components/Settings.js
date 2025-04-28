import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [Nos, setNos] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (email) {
          const response = await fetch('http://localhost:5000/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
          });
          
          if (response.ok) {
            const userData = await response.json();
            setName(userData.name);
            setEmail(userData.email);
            if (userData.Nos) {
              setNos(userData.Nos);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name })
      });

      if (response.ok) {
        localStorage.setItem('userName', name);
        alert('Perfil atualizado com sucesso!');
      } else {
        throw new Error('Erro ao atualizar perfil');
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil');
    }
  };

  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:5000/update-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, Nos })
      });

      if (response.ok) {
        localStorage.setItem('Nos', Nos);
        alert('Configurações salvas com sucesso!');
      } else {
        throw new Error('Erro ao salvar configurações');
      }
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
                  <label htmlFor="Nos">Quantas pessoas há em sua casa:</label>
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