import { useState } from 'react';
import { Link } from 'react-router-dom';

function PortfolioWeb() {
  const [selectedCountry] = useState('PE');

  const webProjects = [
    {
      id: 1,
      name: 'Yerba Mate Oñoiru',
      category: 'Sitio Corporativo',
      location: 'Paraguay',
      description: 'Sitio web corporativo para empresa productora de yerba mate con sistema de catálogo de productos y zona de distribuidores.',
      image: '/projects/yerba-mate.jpg', // Cambia por tu imagen
      link: 'https://yerbamateonoiru.com',
      tags: ['E-commerce', 'Corporativo', 'Responsive'],
      technologies: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      name: 'Tiny Colors Corp',
      category: 'Tienda Online',
      location: 'Miami, Florida, USA',
      description: 'Plataforma de e-commerce completa para venta de pinturas y productos de decoración con sistema de pagos integrado.',
      image: '/projects/tiny-colors.jpg',
      link: 'https://tinycolorscorp.com',
      tags: ['E-commerce', 'Pagos Online', 'Multi-idioma'],
      technologies: ['React', 'Stripe', 'PostgreSQL']
    },
    {
      id: 3,
      name: 'ProClean Support Services',
      category: 'Sitio Corporativo',
      location: 'London, England',
      description: 'Página corporativa para empresa de limpieza comercial con sistema de cotizaciones y reservas online.',
      image: '/projects/proclean.jpg',
      link: 'https://procleansupport.com',
      tags: ['Servicios', 'Reservas', 'Multi-idioma'],
      technologies: ['React', 'Express', 'MySQL']
    },
    {
      id: 4,
      name: 'Proyecto Web 4',
      category: 'Landing Page',
      location: 'Chile',
      description: 'Landing page moderna y optimizada para conversión con diseño minimalista y animaciones interactivas.',
      image: '/projects/proyecto4.jpg',
      link: 'https://proyecto4.com',
      tags: ['Landing', 'Conversión', 'Animaciones'],
      technologies: ['React', 'Tailwind', 'Framer Motion']
    },
    {
      id: 5,
      name: 'Proyecto Web 5',
      category: 'Plataforma Web',
      location: 'Argentina',
      description: 'Plataforma web interactiva con sistema de gestión de contenidos y panel administrativo completo.',
      image: '/projects/proyecto5.jpg',
      link: 'https://proyecto5.com',
      tags: ['CMS', 'Dashboard', 'API Rest'],
      technologies: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 6,
      name: 'Proyecto Web 6',
      category: 'Sitio Institucional',
      location: 'Uruguay',
      description: 'Sitio web institucional con blog integrado, área de noticias y sistema de contacto avanzado.',
      image: '/projects/proyecto6.jpg',
      link: 'https://proyecto6.com',
      tags: ['Blog', 'Noticias', 'SEO'],
      technologies: ['React', 'WordPress API', 'GraphQL']
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <div className="services-hero">
        <nav className="services-nav">
          <Link to="/" className="nav-logo">
            Gabriel<span style={{ color: '#3b82f6' }}>.design</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/services" className="nav-link">Servicios</Link>
            <a href="#contacto" className="btn-primary nav-btn">Contactar</a>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">💼</span>
            DISEÑO WEB - LANDING PAGES - SITIOS INSTITUCIONALES - ECOMMERCE
          </div>

          <h1 className="hero-title">
            Todos Nuestros
            <br />
            <span className="hero-title-accent">Proyectos</span>
          </h1>

          <p className="hero-description">
            Nos enfocamos en cada detalle para asegurar que tu presencia en línea refleje la esencia de tu marca y ofrezca una experiencia de usuario inolvidable. Ya sea que necesites un sitio web corporativo, una tienda en línea robusta o una plataforma interactiva, estamos aquí para ayudarte a alcanzar tus objetivos con eficiencia y estilo.
          </p>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="portfolio-grid-section">
        <div className="portfolio-grid">
          {webProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="portfolio-card"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Project Image/Mockup */}
              <div className="project-image-container">
                <div className="project-mockup">
                  {/* Simulación de mockup - puedes reemplazar con imágenes reales */}
                  <div className="mockup-devices">
                    <div className="device-desktop">
                      <div className="device-screen">
                        <div className="screen-header">
                          <div className="screen-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                        <div className="screen-content">
                          <div className="content-placeholder">
                            <div className="placeholder-icon">🌐</div>
                            <div className="placeholder-text">{project.name}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="device-mobile">
                      <div className="mobile-screen">
                        <div className="mobile-notch"></div>
                        <div className="mobile-content">
                          <div className="mobile-icon">📱</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="project-info">
                <h3 className="project-name">{project.name}</h3>
                
                <div className="project-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📂</span>
                    <span className="meta-label">Categoría:</span>
                    <span className="meta-value">{project.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-label">Ubicación:</span>
                    <span className="meta-value">{project.location}</span>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                {/* Tags */}
                <div className="project-tags">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="project-tag">{tag}</span>
                  ))}
                </div>

                {/* Technologies */}
                <div className="project-technologies">
                  <span className="tech-label">Tecnologías:</span>
                  <div className="tech-list">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-item">{tech}</span>
                    ))}
                  </div>
                </div>

                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-view-project"
                >
                  Ver Sitio Web
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="services-cta" id="contacto">
        <div className="cta-content">
          <h2 className="cta-title">¿Listo para tu Proyecto Web?</h2>
          <p className="cta-description">
            Contáctanos y cuéntanos tu idea. Trabajamos directamente contigo para crear la web perfecta para tu negocio.
          </p>
          <button className="btn-primary cta-button">
            Iniciar Proyecto
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="services-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-icon">✨</div>
            <h3 className="footer-title">Gabriel.design</h3>
            <p className="footer-tagline">Diseño & Desarrollo Web Profesional</p>
          </div>

          <div className="footer-links">
            <Link to="/">Inicio</Link>
            <Link to="/services">Servicios</Link>
            <a href="#contacto">Contacto</a>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Gabriel Diseña - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PortfolioWeb;