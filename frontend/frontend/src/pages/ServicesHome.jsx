import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ServicesHome() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      id: 'logos',
      title: 'Diseño Gráfico',
      subtitle: 'Logos & Branding',
      description: 'Identidad visual profesional para tu marca',
      icon: '🎨',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      path: '/services/logos',
      features: ['Logos profesionales', 'Manual de marca', 'Identidad visual completa']
    },
    {
      id: 'web',
      title: 'Desarrollo Web',
      subtitle: 'Sitios & E-commerce',
      description: 'Páginas web y tiendas online profesionales',
      icon: '💻',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      path: '/services/web',
      features: ['Landing pages', 'Sitios completos', 'Tiendas online']
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      color: 'white'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1.5rem 2rem',
        backdropFilter: 'blur(10px)',
        background: 'rgba(2, 6, 23, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
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
            />
          </Link>
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Inicio</Link>
            <Link to="/services" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Servicios</Link>
            <a href="#contacto" style={{ 
              textDecoration: 'none', 
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '0.75rem',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
            }}>Contactar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 10vw, 6rem)',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          lineHeight: '1.1',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'slideUpFade 1s ease-out forwards' : 'none'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Nuestros
          </span>
          {' '}
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Servicios
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          color: '#94a3b8',
          marginBottom: '4rem',
          maxWidth: '800px',
          margin: '0 auto 4rem',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'slideUpFade 1s ease-out 0.2s forwards' : 'none'
        }}>
          Elige el servicio que necesitas para llevar tu proyecto al siguiente nivel
        </p>

        {/* Services Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: 'clamp(2rem, 4vw, 3rem)',
          marginTop: '3rem',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'slideUpFade 1s ease-out 0.4s forwards' : 'none'
        }}>
          {services.map((service, index) => (
            <div
              key={service.id}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(service.path)}
              style={{
                position: 'relative',
                background: service.gradient,
                borderRadius: '2rem',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                cursor: 'pointer',
                overflow: 'hidden',
                transform: hoveredCard === service.id ? 'translateY(-15px) scale(1.03)' : 'translateY(0)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: hoveredCard === service.id 
                  ? '0 30px 60px rgba(0, 0, 0, 0.5)' 
                  : '0 15px 40px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: 'clamp(4rem, 10vw, 6rem)',
                marginBottom: '1.5rem',
                transition: 'transform 0.5s ease',
                transform: hoveredCard === service.id ? 'rotate(10deg) scale(1.2)' : 'rotate(0) scale(1)'
              }}>
                {service.icon}
              </div>

              {/* Title */}
              <div style={{
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                fontWeight: '600',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                opacity: 0.9,
                textTransform: 'uppercase'
              }}>
                {service.title}
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                {service.subtitle}
              </h2>

              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                marginBottom: '2rem',
                opacity: 0.9
              }}>
                {service.description}
              </p>

              {/* Features */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '1rem',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.25)',
                        fontSize: '0.875rem',
                        flexShrink: 0,
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <button 
                style={{
                  width: '100%',
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '1rem',
                  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Ver Planes y Precios →
              </button>

              {/* Decorative gradient */}
              <div style={{
                position: 'absolute',
                bottom: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div id="contacto" style={{
        maxWidth: '1400px',
        margin: 'clamp(4rem, 8vw, 6rem) auto clamp(3rem, 6vw, 5rem)',
        padding: '0 clamp(1rem, 3vw, 2rem)'
      }}>
        <div style={{
          padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 3vw, 2rem)',
          borderRadius: '2rem',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            ¿Tienes dudas sobre qué servicio elegir?
          </h2>
          <p style={{
            color: '#94a3b8',
            marginBottom: '2rem',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
          }}>
            Contáctanos y te ayudaremos a encontrar la mejor solución para tu proyecto
          </p>
          <button 
            onClick={() => {
              const message = 'Hola! Tengo dudas sobre los servicios. ¿Podrías ayudarme?';
              const whatsappUrl = `https://wa.me/51957949278?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              padding: 'clamp(1rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '0.75rem',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Contáctanos por WhatsApp
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1rem'
          }}>
            ✨
          </div>
          <h3 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: 'white'
          }}>
            Gabriel Diseña
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '2rem',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)'
          }}>
            Diseño & Desarrollo Web Profesional
          </p>

          <div style={{
            display: 'flex',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
            justifyContent: 'center',
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
                  width: 'clamp(35px, 6vw, 45px)',
                  height: 'clamp(35px, 6vw, 45px)',
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
                  width: 'clamp(35px, 6vw, 45px)',
                  height: 'clamp(35px, 6vw, 45px)',
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
                  width: 'clamp(35px, 6vw, 45px)',
                  height: 'clamp(35px, 6vw, 45px)',
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

          <div style={{
            display: 'flex',
            gap: 'clamp(1rem, 3vw, 2rem)',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Inicio</Link>
            <Link to="/services" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Servicios</Link>
            <a href="#contacto" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Contacto</a>
          </div>

          <p style={{ 
            color: '#64748b', 
            fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' 
          }}>
            © 2024 Gabriel Diseña - Todos los derechos reservados
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default ServicesHome;