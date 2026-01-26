import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: 'María González',
      role: 'hace 2 meses',
      rating: 5,
      text: 'Gabriel diseñó mi logo y quedó increíble. Muy profesional y atento a cada detalle. Recomendado 100%!',
      avatar: '👩',
      verified: true
    },
    {
      name: 'Carlos Pérez',
      role: 'hace 1 mes',
      rating: 5,
      text: 'Excelente servicio, muy rápido y el sitio web quedó tal como lo imaginaba. Gran trabajo!',
      avatar: '👨',
      verified: true
    },
    {
      name: 'Ana Rodríguez',
      role: 'hace 3 semanas',
      rating: 5,
      text: 'Diseñó toda mi identidad corporativa. Súper profesional y comprometido.',
      avatar: '👩',
      verified: true
    },
    {
      name: 'Luis Martínez',
      role: 'hace 1 semana',
      rating: 5,
      text: 'Desarrolló mi aplicación web y superó mis expectativas. Muy recomendable!',
      avatar: '👨',
      verified: true
    }
  ];

  const whyChooseMe = [
    {
      title: 'Trabajo Directo:',
      text: 'Trabajo directamente contigo, sin intermediarios. Comunicación rápida y efectiva durante todo el proyecto.'
    },
    {
      title: 'Diseño Único:',
      text: 'Cada proyecto es diseñado desde cero. No uso plantillas ni diseños genéricos, tu marca será única.'
    },
    {
      title: 'Desarrollo Profesional:',
      text: 'Código limpio y optimizado. Sitios rápidos, seguros y preparados para crecer con tu negocio.'
    }
  ];

  return (
    <div className="home-container">
      <div 
        className="animated-background"
        style={{
          background: `radial-gradient(circle at ${50 + scrollY * 0.1}% ${50 + scrollY * 0.05}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Navigation with LOGO */}
      <nav className="home-nav">
        <div className="nav-container">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo GD.svg" 
              alt="Gabriel Diseña" 
              style={{
                height: '50px',
                width: 'auto',
                filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))';
              }}
            />
          </Link>
          <div className="nav-links">
            <Link to="/services" className="nav-link">Servicios</Link>
            <a href="#portfolio" className="nav-link">Portfolio</a>
            <Link to="/web-ai-factory" className="nav-link" style={{ color: '#ec4899', fontWeight: 'bold' }}>
              🚀 WEB AI FACTORY
            </Link>
            <a href="#contacto" className="btn-primary nav-button">Contactar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Disponible para proyectos
          </div>

          <h1 className="hero-title">
            <span className="hero-title-main">
              Diseño & Desarrollo
            </span>
            <span className="hero-title-accent">
              Que Impacta
            </span>
          </h1>

          <p className="hero-description">
            Especializado en <strong style={{ color: '#ec4899' }}>diseño gráfico profesional</strong>, 
            desarrollo web moderno y aplicaciones personalizadas. 
            <br />
            <span style={{ color: '#60a5fa', fontWeight: '600' }}>
              Trabajo directo, sin intermediarios, resultados únicos.
            </span>
          </p>

          <div className="hero-buttons">
            <Link to="/web-ai-factory" className="btn-primary" style={{ 
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
            }}>
              🚀 WEB AI FACTORY™
            </Link>
            <Link to="/services" className="btn-secondary">
              Ver Servicios
            </Link>
            <a href="#portfolio" className="btn-secondary">
              Ver Portfolio
            </a>
          </div>

          {/* Contact Icons usando SVG */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '2rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <a 
              href="https://www.instagram.com/gabrieldisena25/" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Instagram"
            >
              <img 
                src="/instagram.svg" 
                alt="Instagram" 
                style={{
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  filter: 'brightness(0.8)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(0.8)';
                }}
              />
            </a>
            <a 
              href="https://wa.me/51957949278" 
              target="_blank" 
              rel="noopener noreferrer"
              title="WhatsApp"
            >
              <img 
                src="/whatsapp.svg" 
                alt="WhatsApp" 
                style={{
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  filter: 'brightness(0.8)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(0.8)';
                }}
              />
            </a>
            <a 
              href="mailto:contacto@gabrieldisena.com"
              title="Email"
            >
              <img 
                src="/correo.svg" 
                alt="Email" 
                style={{
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  filter: 'brightness(0.8)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(0.8)';
                }}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Logos Portfolio Section */}
      <div className="portfolio-section" id="portfolio">
        <div className="portfolio-container">
          <div className="portfolio-content">
            <div className="section-label pink">
              CASOS DE ÉXITO
            </div>

            <h2 className="section-title" style={{ color: 'white' }}>
              Portfolio <span style={{ 
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Logos</span> <img 
                src="/diseño.svg" 
                alt="Diseño" 
                style={{
                  width: '60px',
                  height: '60px',
                  verticalAlign: 'middle',
                  filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.5))'
                }}
              />
            </h2>

            <p className="section-description">
              Entendemos que tu identidad visual es crucial para el éxito de tu marca. Cada logo es único, memorable y diseñado específicamente para capturar la esencia de tu negocio.
            </p>

            <ul className="features-list">
              {[
                {
                  title: 'Identidad Única:',
                  text: 'Cada logo es diseñado desde cero específicamente para tu marca. Sin plantillas, sin copias.'
                },
                {
                  title: 'Diseño Memorable:',
                  text: 'Creamos logos que impactan y se quedan en la memoria de tus clientes.'
                },
                {
                  title: 'Versatilidad Total:',
                  text: 'Tu logo funcionará perfecto en cualquier formato: redes, impresos, web y más.'
                }
              ].map((item, index) => (
                <li key={index} className="feature-item">
                  <div className="feature-dot pink" />
                  <strong className="feature-title">
                    {item.title}
                  </strong>{' '}
                  <span className="feature-text">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <a 
              href="https://www.behance.net/gabriedisena" 
              target="_blank" 
              rel="noopener noreferrer"
              className="portfolio-cta pink"
            >
              Ver Portfolio en Behance
            </a>
          </div>
        </div>
      </div>

      {/* Web Development Portfolio Section */}
      <div className="portfolio-section web-portfolio">
        <div className="portfolio-container">
          <div className="portfolio-content">
            <div className="section-label blue">
              CASOS DE ÉXITO
            </div>

            <h2 className="section-title" style={{ color: 'white' }}>
              Portfolio <span style={{ 
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Web</span> <img 
                src="/web.svg" 
                alt="Web" 
                style={{
                  width: '60px',
                  height: '60px',
                  verticalAlign: 'middle',
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
                }}
              />
            </h2>

            <p className="section-description">
              Entendemos que tu presencia en línea es crucial para el éxito de tu negocio. Ya sea que necesites lanzar un nuevo sitio web, mejorar el diseño de uno existente o asistencia con la administración y mantenimiento continuo, estamos aquí para ayudarte.
            </p>

            <ul className="features-list">
              {whyChooseMe.map((item, index) => (
                <li key={index} className="feature-item">
                  <div className="feature-dot blue" />
                  <strong className="feature-title">
                    {item.title}
                  </strong>{' '}
                  <span className="feature-text">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link to="/portfolio-web" className="portfolio-cta blue">
              Ver Portfolio Web
            </Link>
          </div>
        </div>
      </div>

      {/* WEB AI FACTORY CTA Section */}
      <div className="portfolio-section" style={{ 
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        borderTop: '1px solid rgba(236, 72, 153, 0.3)'
      }}>
        <div className="portfolio-container">
          <div className="portfolio-content" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ color: '#ec4899' }}>
              🚀 NUEVO PRODUCTO DIGITAL
            </div>

            <h2 className="section-title" style={{ color: 'white' }}>
              WEB AI <span style={{ 
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>FACTORY™</span>
            </h2>

            <p className="section-description" style={{ fontSize: '1.25rem' }}>
              El sistema completo para crear y vender páginas web profesionales con IA. 
              <br />
              <strong style={{ color: '#ec4899' }}>Sin programar. En minutos. Por solo $7 USD.</strong>
            </p>

            <Link 
              to="/web-ai-factory" 
              className="btn-primary" 
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                fontSize: '1.25rem',
                padding: '1.25rem 3rem',
                display: 'inline-block',
                marginTop: '1rem'
              }}
            >
              Ver WEB AI FACTORY™
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <div className="section-label">
              ESTAMOS EN CADA DETALLE
            </div>

            <h2 className="section-title" style={{ color: 'white' }}>
              Nuestros clientes{' '}
              <span style={{ 
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>lo dicen</span>
            </h2>
          </div>

          <div className="testimonials-content">
            <div className="rating-box">
              <div className="rating-title">
                EXCELENTE
              </div>
              <div className="rating-stars">
                ⭐⭐⭐⭐⭐
              </div>
              <div className="rating-text">
                A base de {testimonials.length} reseñas
              </div>
              <div className="rating-platform">
                Google
              </div>
            </div>

            <div className="carousel-container">
              <button
                onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                className="carousel-button prev"
              >
                ‹
              </button>

              <div className="carousel-grid">
                {[0, 1, 2].map((offset) => {
                  const index = (currentTestimonial + offset) % testimonials.length;
                  const testimonial = testimonials[index];
                  return (
                    <div
                      key={index}
                      className={`testimonial-card ${offset === 1 ? 'center' : 'side'}`}
                    >
                      <div className="testimonial-header">
                        <div className="testimonial-avatar">
                          {testimonial.avatar}
                        </div>
                        <div className="testimonial-info">
                          <div className="testimonial-name">
                            {testimonial.name}
                            {testimonial.verified && (
                              <span style={{ color: '#3b82f6', fontSize: '0.875rem' }}>✓</span>
                            )}
                          </div>
                          <div className="testimonial-role">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                      <div className="testimonial-rating">
                        {'⭐'.repeat(testimonial.rating)}
                      </div>
                      <p className="testimonial-text">
                        {testimonial.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                className="carousel-button next"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="contacto" className="cta-section">
        <div className="cta-container">
          <div className="section-label">
            CONTACTO
          </div>

          <h2 className="cta-title">
            Envíanos tu consulta
          </h2>
          <p className="cta-description">
            ¡Estamos a solo un mensaje o llamada de distancia!
          </p>

          <button className="btn-primary cta-button">
            Contactar Ahora
          </button>
        </div>
      </div>

      {/* Footer con iconos SVG */}
      <footer className="home-footer">
        <div className="footer-container">
          <div>
            <div className="footer-icon">
              ✨
            </div>
          </div>

          <h2 className="footer-title">
            Creamos
          </h2>
          <h3 className="footer-subtitle">
            Tus Ideas
          </h3>

          {/* Iconos de redes sociales con SVG */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            marginTop: '2rem',
            marginBottom: '2rem'
          }}>
            <a 
              href="https://www.instagram.com/gabrieldisena25/" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Instagram"
            >
              <img 
                src="/instagram.svg" 
                alt="Instagram" 
                style={{
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  filter: 'brightness(0.7)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2) translateY(-5px)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.filter = 'brightness(0.7)';
                }}
              />
            </a>
            <a 
              href="https://wa.me/51957949278" 
              target="_blank" 
              rel="noopener noreferrer"
              title="WhatsApp"
            >
              <img 
                src="/whatsapp.svg" 
                alt="WhatsApp" 
                style={{
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  filter: 'brightness(0.7)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2) translateY(-5px)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.filter = 'brightness(0.7)';
                }}
              />
            </a>
            <a 
              href="mailto:contacto@gabrieldisena.com"
              title="Email"
            >
              <img 
                src="/correo.svg" 
                alt="Email" 
                style={{
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  filter: 'brightness(0.7)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2) translateY(-5px)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.filter = 'brightness(0.7)';
                }}
              />
            </a>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">©2024 – Todos los Derechos Reservados</p>
            <p className="footer-brand">
              Gabriel Diseña - Diseño Gráfico & Desarrollo Web
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;