import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = 'https://zgeyiibklawawnycftcj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZXlpaWJrbGF3YXdueWNmdGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTczNTk3OCwiZXhwIjoyMDU3MzExOTc4fQ.7E3_tHVeIxPE3tQWcU26K1jx7cYsyUzWwvfHNpeMGi4';
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const [fileCount, setFileCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(localStorage.getItem('peopleCount') || 1);
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
        const reversedData = [...data].reverse();
        
        const temps = reversedData.map(item => item.temperatura);
        const humids = reversedData.map(item => item.umidade);
        const airQualities = reversedData.map(item => item.qualidade_do_ar);
        
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
        const response = await fetch('http://localhost:5000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name);
          localStorage.setItem('userName', userData.name);
          if (userData.peopleCount) {
            setPeopleCount(userData.peopleCount);
            localStorage.setItem('peopleCount', userData.peopleCount);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
    }
  };

  const fetchFileCount = async () => {
    try {
      const mockFileCount = { count: 1 };
      setFileCount(mockFileCount.count);
    } catch (err) {
      console.error('Erro ao buscar contagem de arquivos:', err);
    }
  };

  useEffect(() => {
    fetchSensorData();
    fetchUserData();
    fetchFileCount();

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
                <h3>{latestData.qualidade_do_ar || '--'}%</h3>
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
                  <h3>{fileCount}</h3>
                  <span>Nós</span>
                  <p>Nós de comunicação ativos</p>
                </div>
              </div>
              <div className={styles.statBox}>
                <i className="uil uil-lightbulb-alt"></i>
                <div>
                  <h3>{peopleCount}</h3>
                  <span>Dia</span>
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