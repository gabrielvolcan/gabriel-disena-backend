import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  const sectionRefs = {
    hero: useRef(null),
    portfolio: useRef(null),
    testimonials: useRef(null),
    cta: useRef(null)
  };

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Detect visible sections for animations
      Object.keys(sectionRefs).forEach(key => {
        const element = sectionRefs[key].current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
          setVisibleSections(prev => ({ ...prev, [key]: isVisible }));
        }
      });
    };
    
    handleScroll(); // Check initial visibility
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
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
      {/* Animated Background */}
      <div 
        className="animated-background"
        style={{
          background: `radial-gradient(circle at ${50 + scrollY * 0.1}% ${50 + scrollY * 0.05}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            Gabriel<span style={{ color: '#3b82f6' }}>.design</span>
          </Link>
          <div className="nav-links">
            <Link to="/services" className="nav-link">Servicios</Link>
            <a href="#portfolio" className="nav-link">Portfolio</a>
            <a href="#contacto" className="btn-primary nav-button">Contactar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={sectionRefs.hero} className="hero-section">
        <div 
          className="hero-content"
          style={{
            opacity: visibleSections.hero ? 1 : 0,
            transform: visibleSections.hero ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Badge */}
          <div 
            className="hero-badge"
            style={{
              animation: mounted ? 'fadeIn 1s ease-out 0.3s forwards' : 'none',
              opacity: 0
            }}
          >
            <span className="badge-dot" />
            Disponible para proyectos
          </div>

          <h1 
            className="hero-title"
            style={{
              animation: mounted ? 'slideUpFade 1s ease-out 0.5s forwards' : 'none',
              opacity: 0
            }}
          >
            <span className="hero-title-main">
              Diseño & Desarrollo
            </span>
            <span className="hero-title-accent">
              Que Impacta
            </span>
          </h1>

          <p 
            className="hero-description"
            style={{
              animation: mounted ? 'slideUpFade 1s ease-out 0.7s forwards' : 'none',
              opacity: 0
            }}
          >
            Especializado en <strong style={{ color: '#ec4899' }}>diseño gráfico profesional</strong>, 
            desarrollo web moderno y aplicaciones personalizadas. 
            <br />
            <span style={{ color: '#60a5fa', fontWeight: '600' }}>
              Trabajo directo, sin intermediarios, resultados únicos
            </span>
          </p>

          <div 
            className="hero-buttons"
            style={{
              animation: mounted ? 'slideUpFade 1s ease-out 0.9s forwards' : 'none',
              opacity: 0
            }}
          >
            <Link to="/services" className="btn-primary">
              Ver Servicios
            </Link>
            <a href="#portfolio" className="btn-secondary">
              Ver Portfolio
            </a>
          </div>

          <div 
            className="hero-contact"
            style={{
              animation: mounted ? 'fadeIn 1s ease-out 1.1s forwards' : 'none',
              opacity: 0
            }}
          >
            📧 Contáctame en Instagram, WhatsApp o Email
          </div>
        </div>
      </div>

      {/* Logos Portfolio Section */}
      <div ref={sectionRefs.portfolio} className="portfolio-section" id="portfolio">
        <div className="portfolio-container">
          {/* Left Content */}
          <div 
            className="portfolio-content"
            style={{
              opacity: visibleSections.portfolio ? 1 : 0,
              transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-50px)'
            }}
          >
            <div className="section-label pink">
              CASOS DE ÉXITO
            </div>

            <h2 className="section-title">
              Portfolio{' '}
              <span className="section-title-accent pink">
                Logos
              </span>
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
                <li 
                  key={index} 
                  className="feature-item"
                  style={{
                    opacity: visibleSections.portfolio ? 1 : 0,
                    transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-30px)',
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`
                  }}
                >
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

          {/* Right Mockup - Logos */}
          <div 
            className="mockup-container"
            style={{
              opacity: visibleSections.portfolio ? 1 : 0,
              transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(50px)'
            }}
          >
            {/* Decorative gradient */}
            <div className="mockup-gradient pink" />

            {/* Main device mockup */}
            <div className="mockup-grid">
              {/* Desktop mockup */}
              <div className="mockup-card desktop">
                <div className="mockup-icon pink">
                  🎨
                </div>
                <div className="mockup-title">
                  Diseño
                </div>
                <div className="mockup-subtitle pink">
                  de Logos
                </div>
              </div>

              {/* Mobile mockup */}
              <div className="mockup-card mobile pink">
                <div className="mockup-icon-small pink">
                  ✨
                </div>
                <div className="mockup-text">
                  Logos únicos y profesionales
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Web Development Portfolio Section */}
      <div className="portfolio-section web-portfolio">
        <div className="portfolio-container">
          {/* Left Content */}
          <div 
            className="portfolio-content"
            style={{
              opacity: visibleSections.portfolio ? 1 : 0,
              transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-50px)'
            }}
          >
            <div className="section-label blue">
              CASOS DE ÉXITO
            </div>

            <h2 className="section-title">
              Portfolio{' '}
              <span className="section-title-accent blue">
                web
              </span>
            </h2>

            <p className="section-description">
              Entendemos que tu presencia en línea es crucial para el éxito de tu negocio. Ya sea que necesites lanzar un nuevo sitio web, mejorar el diseño de uno existente o asistencia con la administración y mantenimiento continuo, estamos aquí para ayudarte.
            </p>

            <ul className="features-list">
              {whyChooseMe.map((item, index) => (
                <li 
                  key={index} 
                  className="feature-item"
                  style={{
                    opacity: visibleSections.portfolio ? 1 : 0,
                    transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-30px)',
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`
                  }}
                >
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

            <Link to="/services" className="portfolio-cta blue">
              Ver Portfolio Web
            </Link>
          </div>

          {/* Right Mockup - Web */}
          <div 
            className="mockup-container"
            style={{
              opacity: visibleSections.portfolio ? 1 : 0,
              transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(50px)'
            }}
          >
            {/* Decorative gradient */}
            <div className="mockup-gradient blue" />

            <div className="mockup-grid">
              {/* Desktop mockup */}
              <div className="mockup-card desktop blue">
                <div className="mockup-icon blue">
                  💼
                </div>
                <div className="mockup-title">
                  Desarrollo Web
                </div>
                <div className="mockup-subtitle blue">
                  a Medida
                </div>
                
                {/* Decorative dots */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      opacity: 0.6
                    }} />
                  ))}
                </div>
              </div>

              {/* Mobile mockup */}
              <div className="mockup-card mobile blue">
                <div className="mockup-icon-small blue">
                  🌐
                </div>
                <div className="mockup-text">
                  Responsive y moderno
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" ref={sectionRefs.testimonials} className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <div 
              className="section-label"
              style={{
                opacity: visibleSections.testimonials ? 1 : 0,
                transform: visibleSections.testimonials ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out'
              }}
            >
              ESTAMOS EN CADA DETALLE
            </div>

            <h2 
              className="section-title"
              style={{
                opacity: visibleSections.testimonials ? 1 : 0,
                transform: visibleSections.testimonials ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out 0.1s'
              }}
            >
              Nuestros clientes{' '}
              <span className="section-title-accent blue">
                lo dicen
              </span>
            </h2>
          </div>

          <div 
            className="testimonials-content"
            style={{
              opacity: visibleSections.testimonials ? 1 : 0,
              transform: visibleSections.testimonials ? 'scale(1)' : 'scale(0.9)',
              transition: 'all 0.8s ease-out 0.3s'
            }}
          >
            {/* Rating Box */}
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

            {/* Testimonials Carousel */}
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
      <div id="contacto" ref={sectionRefs.cta} className="cta-section">
        <div 
          className="cta-container"
          style={{
            opacity: visibleSections.cta ? 1 : 0,
            transform: visibleSections.cta ? 'translateY(0)' : 'translateY(50px)'
          }}
        >
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

      {/* Footer */}
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

          <div className="footer-bottom">
            <p className="footer-copyright">©2022 – Todos los Derechos Reservados</p>
            <p className="footer-brand">
              Gabriel Diseña - Diseño Gráfico & Desarrollo Web
            </p>
          </div>
        </div>
      </footer>

      {/* Animations - Mantener por compatibilidad */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

export default Home;