import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend
);

const supabaseUrl = 'https://zgeyiibklawawnycftcj.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZXlpaWJrbGF3YXdueWNmdGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MzU5NzgsImV4cCI6MjA1NzMxMTk3OH0.EEaLBh-TuF8zzuKrQK6ExrvlwosIZuGmr6n6m1WVaWE'; // Substitua pela chave pública
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchData = async () => {
    try {
      const { data: sensorData, error } = await supabase
        .from('sensor_data') 
        .select('*')
        .order('timestamp', { ascending: false }); 

      if (error) throw error;

      setData(sensorData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const chartData = {
    labels: data.map((item) => new Date(item.timestamp).toLocaleTimeString()), 
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: data.map((item) => item.temperatura),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Umidade (%)',
        data: data.map((item) => item.umidade),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monitoramento de Temperatura e Umidade',
      },
    },
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>Erro: {error}</p>;

  const latestData = data[0] || {};

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard de Monitoramento</h1>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h2>Temperatura</h2>
          <p>{latestData.temperatura || 'N/A'} °C</p>
        </div>
        <div className={styles.card}>
          <h2>Umidade</h2>
          <p>{latestData.umidade || 'N/A'} %</p>
        </div>
        <div className={styles.card}>
          <h2>Qualidade do Ar</h2>
          <p>{latestData.qualidade_do_ar || 'N/A'}</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Qualidade do Ar</th>
              <th>Umidade</th>
              <th>Temperatura</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.qualidade_do_ar}</td>
                <td>{item.umidade}</td>
                <td>{item.temperatura}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;