import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './Dashboard.module.css';

// Registrar componentes do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const supabaseUrl = 'https://zgeyiibklawawnycftcj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZXlpaWJrbGF3YXdueWNmdGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MzU5NzgsImV4cCI6MjA1NzMxMTk3OH0.EEaLBh-TuF8zzuKrQK6ExrvlwosIZuGmr6n6m1WVaWE';
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Visitante');
  const [fileCount, setFileCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(1);

  // Dados de exemplo para os gráficos (substitua com seus dados reais)
  const [chartData, setChartData] = useState({
    mainChart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: '#0d6efd',
          borderColor: 'transparent',
          borderWidth: 2.5,
          barPercentage: 0.4,
        },
        {
          label: 'Umidade (%)',
          data: [8, 15, 7, 12, 9, 10],
          backgroundColor: '#dc3545',
          borderColor: 'transparent',
          borderWidth: 2.5,
          barPercentage: 0.4,
        },
      ],
    },
    lineChart: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
      datasets: [
        {
          label: 'Qualidade do ar (%)',
          data: [65, 59, 80, 81, 56, 55, 40],
          lineTension: 0.2,
          borderColor: '#d9534f',
          borderWidth: 1.5,
          backgroundColor: 'transparent'
        }
      ]
    },
    multiLineChart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: '2023',
          data: [12, 19, 3, 5, 2, 3],
          lineTension: 0,
          borderColor: '#d9534f',
          borderWidth: 1.5,
          backgroundColor: 'transparent'
        },
        {
          label: '2022',
          data: [8, 15, 7, 12, 9, 10],
          lineTension: 0,
          borderColor: '#00FF00',
          borderWidth: 1.5,
          backgroundColor: 'transparent'
        },
        {
          label: '2021',
          data: [15, 10, 12, 8, 14, 6],
          lineTension: 0,
          borderColor: '#00FFFF',
          borderWidth: 1.5,
          backgroundColor: 'transparent'
        }
      ]
    },
    doughnutChart: {
      labels: ['Verão', 'Outono', 'Inverno', 'Primavera'],
      datasets: [{
        data: [300, 200, 150, 250],
        backgroundColor: [
          'rgb(247, 110, 19)',
          'rgba(247, 231, 19, 0.932)',
          'rgb(54, 162, 235)',
          'rgb(46, 155, 2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1.5)',
          'rgba(255, 206, 86, 1.5)',
          'rgba(54, 162, 235, 1.5)',
          'rgba(35, 124, 0, 1.5)'
        ],
        borderWidth: 1
      }]
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
          boxWidth: 20,
          fontSize: 12,
          padding: 10,
          color: '#ffffff'
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#ffffff'
        }
      }
    }
  };

  const fetchSensorData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSensorData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Buscar dados do usuário
  const fetchUserData = async () => {
    try {
//Simulando
      const mockUserData = { success: true, nome: "Usuário Teste" };
      if (mockUserData.success) {
        setUserName(mockUserData.nome);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
    }
  };

  // Buscar contagem de arquivos
  const fetchFileCount = async () => {
    try {
      // Simulando
      const mockFileCount = { count: 1 };
      setFileCount(mockFileCount.count);
    } catch (err) {
      console.error('Erro ao buscar contagem de arquivos:', err);
    }
  };

  // Buscar contagem de pessoas
  const fetchPeopleCount = async () => {
    try {
      // Simulando 
      const mockPeopleCount = { pessoas: 2 };
      setPeopleCount(mockPeopleCount.pessoas);
    } catch (err) {
      console.error('Erro ao buscar contagem de pessoas:', err);
    }
  };

  useEffect(() => {
    fetchSensorData();
    fetchUserData();
    fetchFileCount();
    fetchPeopleCount();
  }, []);

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>Erro: {error}</div>;

  const latestData = sensorData[0] || {};

  return (
    <div className={styles.dashboardWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img
            className={styles.userImage}
            src="https://cdn-icons-png.flaticon.com/512/2714/2714708.png"
            alt="User"
          />
          <div className={styles.userInfo}>
            <h5>
              <a href="#" className={styles.userName}>{userName}</a>
            </h5>
            <p>Leitor do consumo.</p>
          </div>
        </div>

        <ul className={styles.sidebarMenu}>
          <li className={styles.menuItem}>
            <i className="uil-estate"></i>
            <a href="#">Dashboard</a>
            <ul className={styles.subMenu}>
              <li><a href="#myChart">Balanço do consumo</a></li>
              <li><a href="#myChart2">Consumo de energia</a></li>
              <li><a href="#donutChart">Gasto por estação</a></li>
              <li><a href="#chart3">Balanço anual</a></li>
            </ul>
          </li>
          <li className={styles.menuItem}>
            <i className="uil-calendar-alt"></i>
            <a href="https://www.supercalendario.com.br/2024" target="_blank" rel="noopener noreferrer">Calendário</a>
          </li>
          <li className={styles.menuItem}>
            <i className="uil-envelope-download"></i>
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">E-mails</a>
          </li>
          <li className={styles.menuItem}>
            <i className="uil-setting"></i>
            <a href="#">Configurações</a>
          </li>
          <li className={styles.menuItem}>
            <i className="uil-map-marker"></i>
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Mapa</a>
          </li>
        </ul>
      </aside>

      <section className={styles.mainContent}>
        <nav className={styles.navbar}>
          <div className={styles.navbarBrand}>
            <img src="/Green_Fire_Alert.png" alt="Logo" className={styles.logo} />
            <h4>Green Fire Alert</h4>
          </div>
          <div className={styles.navbarMenu}>
            <ul className={styles.navItems}>
              <li className={styles.navItemDropdown}>
                <a className={styles.navLinkDropdown} href="#">
                  Menu
                </a>
                <ul className={styles.dropdownMenu}>
                  <li><a href="#">Minha Conta</a></li>
                  <li><a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">Mensagens</a></li>
                  <li><a href="/ajuda_pdf.pdf" target="_blank" rel="noopener noreferrer">Ajuda</a></li>
                  <li className={styles.divider}></li>
                  <li><a href="#">Desconectar</a></li>
                </ul>
              </li>
              <li className={styles.navItem}>
                <a className={styles.navLink} href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                  <i className="uil-comments-alt"></i>
                </a>
              </li>
              <li className={styles.navItem}>
                <a className={styles.navLink} href="#">
                  <i className="uil-bell"></i>
                  <span>0</span>
                </a>
              </li>
              <li className={styles.navItem}>
                <a className={styles.navLink} href="#">
                  <i className="uil-bars"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className={styles.dashboardContent}>
          <div className={styles.welcomeBanner}>
            <h1>Bem vindo ao Dashboard</h1>
            <p>Olá, bem vindo ao seu dashboard!</p>
          </div>

          <section className={styles.statsSection}>
            <div className={styles.statsRow}>
              <div className={styles.statCardPrimary}>
                <i className="uil-eye"></i>
                <h3>{latestData.temperatura || '--'}°C</h3>
                <p>Temperatura</p>
              </div>
              <div className={styles.statCardDanger}>
                <i className="uil-estate"></i>
                <h3>{latestData.umidade || '--'}%</h3>
                <p>Umidade</p>
              </div>
              <div className={styles.statCardWarning}>
                <i className="uil-bell"></i>
                <h3>{latestData.qualidade_do_ar || '--'}%</h3>
                <p>Qualidade do ar</p>
              </div>
              <div className={styles.statCardSuccess}>
                <i className="uil-calendar-alt"></i>
                <h3>{latestData.timestamp ? new Date(latestData.timestamp).toLocaleTimeString() : '--:--'}</h3>
                <p>Última atualização</p>
              </div>
            </div>
          </section>

          <section className={styles.chartsSection}>
            <div className={styles.chartRow}>
              <div className={styles.chartContainer}>
                <h3>Balanço dos picos de temperatura e umidade na semana</h3>
                <div className={styles.chartWrapper}>
                  <Bar data={chartData.mainChart} options={chartOptions} />
                </div>
              </div>
              <div className={styles.chartContainer}>
                <h3>Qualidade do ar na semana</h3>
                <div className={styles.chartWrapper}>
                  <Line data={chartData.lineChart} options={chartOptions} />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.doughnutSection}>
            <div className={styles.doughnutCard}>
              <h3>Média de temperatura por estação do ano</h3>
              <div className={styles.doughnutWrapper}>
                <Doughnut data={chartData.doughnutChart} options={doughnutOptions} />
              </div>
            </div>
          </section>

          <section className={styles.bottomStatsSection}>
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <i className="uil-envelope-shield"></i>
                <div>
                  <h3>0</h3>
                  <span>Comunicados</span>
                  <p>Comunicados dos riscos de incêndio nas últimas 24 horas</p>
                </div>
              </div>
              <div className={styles.statBox}>
                <i className="uil-file"></i>
                <div>
                  <h3>{fileCount}</h3>
                  <span>Nó</span>
                  <p>Quantidade de Nó de comunicação dos sensores</p>
                </div>
              </div>
              <div className={styles.statBox}>
                <i className="uil-users-alt"></i>
                <div>
                  <h3>{peopleCount}</h3>
                  <span>Pessoas</span>
                  <p>Quantidade de pessoas na residência</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.multiLineChartSection}>
            <div className={styles.multiLineChartContainer}>
              <h3>Balanço nos últimos 7 dias</h3>
              <div className={styles.chartWrapper}>
                <Line data={chartData.multiLineChart} options={chartOptions} />
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;