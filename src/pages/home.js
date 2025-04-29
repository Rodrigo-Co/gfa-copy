import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/home.css';
import backgroundImage from '../assets/agro.jpg'; 

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projeto', 'equipe', 'contato'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= 100) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserPageClick = () => {
    navigate('/'); 
  };

  const handleSaibaMaisClick = () => {
    navigate('/'); 
  };

  return (
    <div className="home-container">
      <nav id='navbar'>
        <img src="https://cdn-icons-png.flaticon.com/512/2714/2714708.png" alt="Project Logo" id="nav_logo" /> 

        <ul id='nav_list'>
          <li className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}>
            <a href='#home' onClick={scrollToTop}>Início</a>
          </li>
          <li className={`nav-item ${activeSection === 'projeto' ? 'active' : ''}`}>
            <a href='#projeto'>Sobre</a>
          </li>
          <li className={`nav-item ${activeSection === 'contato' ? 'active' : ''}`}>
            <a href='#contato'>Contato</a>
          </li>
        </ul>

        <button className='btn-default' onClick={handleUserPageClick}>
          Página do Usuário
        </button>
      </nav>

      <section id="home" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1>GFA - Green Fire Alert</h1>
            <button className='btn-default' onClick={handleUserPageClick}>Página do Usuário</button>
          </div>
        </div>
      </section>
    
      <section id="cards-section">
        <div className="card nossa-solucao">
          <h2>Nossa Solução</h2>
          <p>
            Saiba mais sobre a idealização do protótipo e como
            cada processo foi pensado para solucionar o
            problema abordado.
          </p>
          <button className='btn-default' onClick={handleSaibaMaisClick}>Saiba Mais</button>
        </div>
        <div className="card nossa-equipe">
          <h2>Nossa Equipe</h2>
          <p>
            <strong>Anna Victoria</strong> - Designer<br />
            <strong>Caio Ribeiro</strong> - Desenvolvedor de Hardware<br />
            <strong>Ícaro Bonfim</strong> - Desenvolvedor Full-Stack<br />
            <strong>Rodrigo Logrado</strong> - Desenvolvedor de Soft-Hardware
          </p>
          <button className='btn-default' onClick={handleSaibaMaisClick}>Saiba Mais</button>
        </div>
      </section>

      <section id="projeto">
        <h2>Sobre o Projeto - Sistema de Detecção e Alerta de Queimadas</h2>
        <div className="card projeto-card">
          <p>
            As queimadas representam uma grave ameaça ao meio ambiente, à saúde pública e à economia. 
            Para combater esse problema, este projeto propõe o desenvolvimento de um sistema de detecção 
            e alerta de queimadas em tempo real, com o objetivo de reduzir incêndios florestais e seus impactos.
          </p>
          <p>
            O sistema será composto por sensores, um módulo de transmissão de alertas em tempo real, 
            um painel de monitoramento contínuo e um módulo de gestão e segurança da informação. 
            Um aplicativo de fácil acesso permitirá que clientes e autoridades acompanhem os focos de incêndio.
          </p>
          <p>
            O projeto visa alcançar metas como reduzir em 50% as queimadas em um ano, alertar 90% dos focos 
            de incêndio em tempo real e aumentar em 80% a conscientização da comunidade sobre prevenção de queimadas. 
            Entre os principais benefícios estão a proteção ambiental, redução de custos no combate a incêndios 
            e aumento da produtividade agrícola.
          </p>
          <p>
            A equipe envolvida inclui engenheiros eletrônicos, cientistas da computação, especialistas em meio 
            ambiente e comunicação. O projeto será desenvolvido em três fases: prototipagem e testes (1 mês), 
            implementação piloto (2 meses) e expansão (3 meses). Os principais desafios envolvem a viabilidade 
            técnica, obtenção de recursos financeiros e autorizações necessárias.
          </p>
          <p>
            O orçamento inicial estimado é de R$ 200,00, cobrindo mão de obra, materiais e reservas de contingência. 
            Com a colaboração de stakeholders e investimentos em tecnologia, o projeto pretende se consolidar como 
            uma solução eficaz para a prevenção de queimadas em áreas agrícolas de porte familiar.
          </p>
        </div>
      </section>

      <section id="equipe">
        <h2>Nossa Equipe</h2>
        <div className="team-description">
          <p>
            <strong>Anna Victoria</strong>: Designer, responsável pela interface do usuário e experiência do usuário.<br />
            <strong>Caio Ribeiro</strong>: Desenvolvedor de Hardware, responsável pela implementação dos sensores e módulos de transmissão.<br />
            <strong>Ícaro Bonfim</strong>: Desenvolvedor Full-Stack, responsável pelo desenvolvimento do aplicativo e integração do sistema.<br />
            <strong>Rodrigo Logrado</strong>: Desenvolvedor de Soft-Hardware, responsável pela integração entre software e hardware.
          </p>
        </div>
      </section>

      <section id="contato">
        <h2>Contatos</h2>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Assunto:</label>
            <input type="text" id="subject" name="subject" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensagem:</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" className='btn-default'>Enviar</button>
        </form>
      </section>

      <footer>
        <p>&copy; 2025 GFA - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
