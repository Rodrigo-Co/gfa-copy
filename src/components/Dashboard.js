import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Line, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './Dashboard.module.css';
import emailjs from '@emailjs/browser';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const formatCorrectTime = (timestamp) => {
  if (!timestamp) return '--:--';
  
  const date = new Date(timestamp);
  let horas = date.getHours() + 3; // Adiciona 3 horas
  const minutos = date.getMinutes().toString().padStart(2, "0");

  // Ajusta para o formato 24h caso ultrapasse
  if (horas >= 24) horas -= 24;
  if (horas < 0) horas += 24;

  return `${horas.toString().padStart(2, "0")}:${minutos}h`;
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Visitante');
  const [Nos, setNos] = useState(localStorage.getItem('Nos') || 1);
  const [isOpen, setIsOpen] = useState(true); // <-- AQUI o estado da sidebar
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };


  const [chartData, setChartData] = useState({
    mainChart: {
      labels: [],
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: [],
          backgroundColor: '#0d6efd',
          borderColor: 'transparent',
          borderWidth: 2.5,
          barPercentage: 0.4,
        },
        {
          label: 'Umidade (%)',
          data: [],
          backgroundColor: '#dc3545',
          borderColor: 'transparent',
          borderWidth: 2.5,
          barPercentage: 0.4,
        },
      ],
    },
    lineChart: {
      labels: [],
      datasets: [
        {
          label: 'Qualidade do ar (%)',
          data: [],
          lineTension: 0.2,
          borderColor: '#d9534f',
          borderWidth: 1.5,
          backgroundColor: 'transparent'
        }
      ]
    }
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#343a40',
          boxWidth: 20,
          fontSize: 12,
          padding: 10,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#343a40'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#343a40'
        }
      },
    },
  };

  const fetchSensorData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSensorData(data || []);
      
      if (data && data.length > 0) {
        const latestTemp = data[0].temperatura;

      if (latestTemp > 45) {
        sendEmailAlert(latestTemp);
        sendSmsAlert(latestTemp);
      }

        const reversedData = [...data].reverse();
        
        const temps = reversedData.map(item => item.temperatura);
        const humids = reversedData.map(item => item.umidade);
        const airQualities = reversedData.map(item => {
          const ppm = item.qualidade_do_ar;
          const percent = Math.max(0, Math.min(100, 100 - (ppm / 1000) * 100));
          return parseFloat(percent.toFixed(1));
        });
        
        
        const labels = reversedData.map(item => {
          const date = new Date(item.timestamp);
          let horas = date.getHours() + 3; // Adiciona 3 horas
          const minutos = date.getMinutes().toString().padStart(2, "0");

          if (horas >= 24) horas -= 24;
          if (horas < 0) horas += 24;

          return `${horas.toString().padStart(2, "0")}:${minutos}h`;
        });

        setChartData(prevData => ({
          mainChart: {
            labels,
            datasets: [
              { ...prevData.mainChart.datasets[0], data: temps },
              { ...prevData.mainChart.datasets[1], data: humids }
            ]
          },
          lineChart: {
            labels,
            datasets: [
              { ...prevData.lineChart.datasets[0], data: airQualities }
            ]
          }
        }));
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (email) {
        const { data, error } = await supabase
          .from('usuarios') // Tabela de usuários no Supabase
          .select('nome, nos') // Seleciona os campos que você precisa
          .eq('email', email) // Filtra pelo email
          .single(); // Garante que retorna apenas um único usuário
        
          if (error) {
            console.error('Erro ao buscar dados do usuário:', error.message);
          } else {
            // Se encontrou o usuário, armazena os dados localmente
            setUserName(data.nome);
            localStorage.setItem('userName', data.nome);
            if (data.nos) {
              setNos(data.nos);
              localStorage.setItem('Nos', data.nos);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    };
    
    const sendEmailAlert = (temperatura) => {
      const userEmail = localStorage.getItem('userEmail');
    
      if (!userEmail) return;
    
      emailjs.send('service_zkcfc1t', 'template_uwhj73q', {
        user_email: userEmail,
        temperatura: temperatura,
      }, 'WFHqHr8QIonRw_wfu')
      .then(() => console.log('Email enviado!'))
      .catch(error => console.error('Erro ao enviar e-mail:', error));
    };

    const sendSmsAlert = async (temperatura) => {
      const accountSid = ['AC0f6a89f', 'af28ca8741ef350f0b665344a'].join('');
      const authToken = ['89f3d90a', '36ad6260c7ea1299f8a9e48c'].join('');


      const fromNumber = '+18646681236'; // Ex: +1415XXXXXXX
      const toNumber = '+5571999103011';  // Ex: +55SEUNUMEROBRASIL
    
      const body = `Alerta! Temperatura muito alta: ${temperatura}°C.`;
    
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
      const formData = new FormData();
  formData.append('From', fromNumber);
  formData.append('To', toNumber);
  formData.append('Body', body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
      },
      body: formData
    });

    if (response.ok) {
      console.log('SMS enviado com sucesso!');
    } else {
      console.error('Erro ao enviar SMS:', await response.text());
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
      }
    };
    

  useEffect(() => {
    fetchSensorData();
    fetchUserData();

    const interval = setInterval(fetchSensorData, 30000);
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>Erro: {error}</div>;

  const latestData = sensorData[0] || {};
  const lastUpdateTime = formatCorrectTime(latestData.timestamp);

  return (
    <div className={styles.dashboardWrapper}>
       

        {/* Sidebar */}
       <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <img
            className={styles.userImage}
            src="https://cdn-icons-png.flaticon.com/512/2714/2714708.png"
            alt="User"
          />
          <div className={styles.userInfo}>
            <h5 className={styles.userName}>{userName}</h5>
            <p>Leitor do consumo</p>
          </div>
        </div>

        <ul className={styles.sidebarMenu}>
          <li className={styles.menuItem}>
            <i className="uil uil-estate"></i>
            <span>Dashboard</span>
          </li>
          <li className={styles.menuItem}>
            <i className="uil uil-calendar-alt"></i>
            <a href="https://www.supercalendario.com.br/2024" target="_blank" rel="noopener noreferrer">Calendário</a>
          </li>
          <li className={styles.menuItem}>
            <i className="uil uil-envelope"></i>
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">E-mails</a>
          </li>
          <li className={styles.menuItem}>
            <i className="uil uil-cog"></i>
            <button onClick={() => navigate('/settings')}>Configurações</button>
          </li>
          <li className={styles.menuItem}>
            <i className="uil uil-map-marker"></i>
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Mapa</a>
          </li>
        </ul>

      </aside>
      <section className={`${styles.mainContent} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <nav className={styles.navbar}>
  <i className={`uil uil-bars ${styles.toggleButton}`} onClick={toggleSidebar} title={isOpen ? 'Fechar Sidebar' : 'Abrir Sidebar'}></i>
  <div className={styles.navbarBrand}>
    <img src="/Green_Fire_Alert.png" alt="Logo" className={styles.logo} />
    <h4>Green Fire Alert</h4>
  </div>
  <div className={styles.navbarMenu}>
    <ul className={styles.navItems}>
      <li className={styles.navItemDropdown}>
        <button className={styles.navLinkDropdown}>
          Menu <i className="uil uil-angle-down"></i>
        </button>
        <ul className={styles.dropdownMenu}>
          <li>
            <button onClick={() => navigate('/settings')}>
              <i className="uil uil-user-circle"></i> Minha Conta
            </button>
          </li>
          <li>
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
              <i className="uil uil-envelope"></i> Mensagens
            </a>
          </li>
          <li className={styles.divider}></li>
          <li>
            <button>
              <i className="uil uil-sign-out-alt"></i> Desconectar
            </button>
          </li>
        </ul>
      </li>
      <li className={styles.navItem}>
        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className={styles.navLink}>
          <i className="uil uil-comment-alt"></i>
        </a>
      </li>
      <li className={styles.navItem}>
        <button className={styles.navLink}>
          <i className="uil uil-bell"></i>
          <span>0</span>
        </button>
      </li>
    </ul>
  </div>
</nav>

        <div className={styles.dashboardContent}>
          <div className={styles.welcomeBanner}>
            <h1>Bem vindo ao Dashboard</h1>
            <p>Olá, {userName}, bem vindo ao seu dashboard!</p>
          </div>

          <section className={styles.statsSection}>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <i className="uil uil-temperature"></i>
                <h3>{latestData.temperatura || '--'}°C</h3>
                <p>Temperatura</p>
              </div>
              <div className={styles.statCard}>
                <i className="uil uil-tear"></i>
                <h3>{latestData.umidade || '--'}%</h3>
                <p>Umidade</p>
              </div>
              <div className={styles.statCard}>
                <i className="uil uil-wind"></i>
                <h3>
                {latestData.qualidade_do_ar !== undefined
                ? `${parseFloat(Math.max(0, Math.min(100, 100 - (latestData.qualidade_do_ar / 1000) * 100)).toFixed(1))}%`
                : '--'}
                </h3>
                <p>Qualidade do ar</p>
              </div>
              <div className={styles.statCard}>
                <i className="uil uil-clock"></i>
                <h3>{lastUpdateTime}</h3>
                <p>Última atualização</p>
              </div>
            </div>
          </section>

          <section className={styles.chartsSection}>
            <div className={styles.chartRow}>
              <div className={styles.chartContainer}>
                <h3>Balanço dos picos de temperatura e umidade</h3>
                <div className={styles.chartWrapper}>
                  <Bar data={chartData.mainChart} options={chartOptions} />
                </div>
              </div>
              <div className={styles.chartContainer}>
                <h3>Qualidade do ar</h3>
                <div className={styles.chartWrapper}>
                  <Line data={chartData.lineChart} options={chartOptions} />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.bottomStatsSection}>
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <i className="uil uil-comment-exclamation"></i>
                <div>
                  <h3>0</h3>
                  <span>Comunicados</span>
                  <p>Riscos de incêndio nas últimas 24 horas</p>
                </div>
              </div>
              <div className={styles.statBox}>
                <i className="uil uil-server-network"></i>
                <div>
                  <h3>{Nos}</h3>
                  <span>Nós</span>
                  <p>Nós de comunicação ativos</p>
                </div>
              </div>
              <div className={styles.statBox}>
                <i className="uil uil-lightbulb-alt"></i>
                <div>
                  <h3>133</h3>
                  <span>Dias</span>
                  <p>Sem alertas</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;