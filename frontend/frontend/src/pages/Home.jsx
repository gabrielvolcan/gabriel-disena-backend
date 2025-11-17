import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.4,
        background: `radial-gradient(circle at ${50 + scrollY * 0.1}% ${50 + scrollY * 0.05}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
        transition: 'background 0.3s ease'
      }} />

      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1.5rem 2rem',
        backdropFilter: 'blur(10px)',
        background: 'rgba(2, 6, 23, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Gabriel<span style={{ color: '#3b82f6' }}>.design</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/services" style={{ 
              color: '#94a3b8', 
              textDecoration: 'none', 
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >Servicios</Link>
            <a href="#portfolio" style={{ 
              color: '#94a3b8', 
              textDecoration: 'none', 
              transition: 'all 0.3s ease' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >Portfolio</a>
            <a href="#contacto" className="btn-primary" style={{ 
              textDecoration: 'none', 
              padding: '0.75rem 1.5rem', 
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}>Contactar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={sectionRefs.hero} style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '6rem 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          textAlign: 'left',
          maxWidth: '800px',
          opacity: visibleSections.hero ? 1 : 0,
          transform: visibleSections.hero ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '2rem',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: '#60a5fa',
            animation: mounted ? 'fadeIn 1s ease-out 0.3s forwards' : 'none',
            opacity: 0
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'pulse 2s infinite'
            }} />
            Disponible para proyectos
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 10vw, 6rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            animation: mounted ? 'slideUpFade 1s ease-out 0.5s forwards' : 'none',
            opacity: 0
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Diseño & Desarrollo
            </span>
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              animation: 'gradientShift 3s ease infinite'
            }}>
              Que Impacta
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            color: '#94a3b8',
            marginBottom: '3rem',
            lineHeight: '1.6',
            animation: mounted ? 'slideUpFade 1s ease-out 0.7s forwards' : 'none',
            opacity: 0
          }}>
            Especializado en <strong style={{ color: '#ec4899' }}>diseño gráfico profesional</strong>, 
            desarrollo web moderno y aplicaciones personalizadas. 
            <br />
            <span style={{ color: '#60a5fa', fontWeight: '600' }}>
              Trabajo directo, sin intermediarios, resultados únicos
            </span>
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
            animation: mounted ? 'slideUpFade 1s ease-out 0.9s forwards' : 'none',
            opacity: 0
          }}>
            <Link to="/services" className="btn-primary" style={{ 
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              Ver Servicios
            </Link>
            <a href="#portfolio" className="btn-secondary" style={{ 
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              Ver Portfolio
            </a>
          </div>

          <div style={{
            fontSize: '0.875rem',
            color: '#64748b',
            marginTop: '2rem',
            animation: mounted ? 'fadeIn 1s ease-out 1.1s forwards' : 'none',
            opacity: 0
          }}>
            📧 Contáctame en Instagram, WhatsApp o Email
          </div>
        </div>
      </div>

      {/* Logos Portfolio Section */}
      <div ref={sectionRefs.portfolio} style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(236, 72, 153, 0.2)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div style={{
            opacity: visibleSections.portfolio ? 1 : 0,
            transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ec4899',
              marginBottom: '1rem'
            }}>
              CASOS DE ÉXITO
            </div>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'normal',
              marginBottom: '0.5rem',
              color: 'white',
              lineHeight: '1.1'
            }}>
              Portfolio{' '}
              <span style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Logos
              </span>
            </h2>

            <p style={{
              fontSize: '1rem',
              lineHeight: '1.7',
              color: '#cbd5e1',
              marginBottom: '2rem'
            }}>
              Entendemos que tu identidad visual es crucial para el éxito de tu marca. Cada logo es único, memorable y diseñado específicamente para capturar la esencia de tu negocio.
            </p>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
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
                <li key={index} style={{
                  marginBottom: '1.5rem',
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  opacity: visibleSections.portfolio ? 1 : 0,
                  transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-30px)',
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '0.4rem',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
                  }} />
                  <strong style={{
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {item.title}
                  </strong>{' '}
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '0.95rem'
                  }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <a 
              href="https://www.behance.net/gabriedisena" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '2rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                color: 'white',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Ver Portfolio en Behance
            </a>
          </div>

          {/* Right Mockup - Logos */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            opacity: visibleSections.portfolio ? 1 : 0,
            transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
          }}>
            {/* Decorative gradient */}
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              animation: 'pulseGlow 4s ease-in-out infinite'
            }} />

            {/* Main device mockup */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '1.5rem'
            }}>
              {/* Desktop mockup */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                aspectRatio: '16/10',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  animation: 'float 3s ease-in-out infinite',
                  boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
                }}>
                  🎨
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  Diseño
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  de Logos
                </div>
              </div>

              {/* Mobile mockup */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                top: '2rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  marginBottom: '0.75rem',
                  boxShadow: '0 5px 20px rgba(236, 72, 153, 0.3)'
                }}>
                  ✨
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#cbd5e1',
                  textAlign: 'center'
                }}>
                  Logos únicos y profesionales
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Web Development Portfolio Section */}
      <div id="web-portfolio" style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div style={{
            opacity: visibleSections.portfolio ? 1 : 0,
            transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#3b82f6',
              marginBottom: '1rem'
            }}>
              CASOS DE ÉXITO
            </div>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'normal',
              marginBottom: '0.5rem',
              color: 'white',
              lineHeight: '1.1'
            }}>
              Portfolio{' '}
              <span style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                web
              </span>
            </h2>

            <p style={{
              fontSize: '1rem',
              lineHeight: '1.7',
              color: '#cbd5e1',
              marginBottom: '2rem'
            }}>
              Entendemos que tu presencia en línea es crucial para el éxito de tu negocio. Ya sea que necesites lanzar un nuevo sitio web, mejorar el diseño de uno existente o asistencia con la administración y mantenimiento continuo, estamos aquí para ayudarte.
            </p>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {whyChooseMe.map((item, index) => (
                <li key={index} style={{
                  marginBottom: '1.5rem',
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  opacity: visibleSections.portfolio ? 1 : 0,
                  transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(-30px)',
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '0.4rem',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                  }} />
                  <strong style={{
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {item.title}
                  </strong>{' '}
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '0.95rem'
                  }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link to="/services" style={{
              display: 'inline-block',
              marginTop: '2rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Ver Portfolio Web
            </Link>
          </div>

          {/* Right Mockup - Web */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            opacity: visibleSections.portfolio ? 1 : 0,
            transform: visibleSections.portfolio ? 'translateX(0)' : 'translateX(50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
          }}>
            {/* Decorative gradient */}
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              animation: 'pulseGlow 4s ease-in-out infinite'
            }} />

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '1.5rem'
            }}>
              {/* Desktop mockup */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                aspectRatio: '16/10',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  animation: 'float 3s ease-in-out infinite',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                }}>
                  💼
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  Desarrollo Web
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
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
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                top: '2rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  marginBottom: '0.75rem',
                  boxShadow: '0 5px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  🌐
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#cbd5e1',
                  textAlign: 'center'
                }}>
                  Responsive y moderno
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" ref={sectionRefs.testimonials} style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: '1rem',
            textAlign: 'center',
            opacity: visibleSections.testimonials ? 1 : 0,
            transform: visibleSections.testimonials ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out'
          }}>
            ESTAMOS EN CADA DETALLE
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'normal',
            textAlign: 'center',
            marginBottom: '1rem',
            opacity: visibleSections.testimonials ? 1 : 0,
            transform: visibleSections.testimonials ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.1s'
          }}>
            Nuestros clientes{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              lo dicen
            </span>
          </h2>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '3rem',
            opacity: visibleSections.testimonials ? 1 : 0,
            transform: visibleSections.testimonials ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.8s ease-out 0.3s'
          }}>
            {/* Rating Box */}
            <div style={{
              flex: '0 0 250px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                EXCELENTE
              </div>
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.5rem'
              }}>
                ⭐⭐⭐⭐⭐
              </div>
              <div style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                A base de {testimonials.length} reseñas
              </div>
              <div style={{
                color: '#60a5fa',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                Google
              </div>
            </div>

            {/* Testimonials Carousel */}
            <div style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              minHeight: '250px'
            }}>
              <button
                onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ‹
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                padding: '0 4rem'
              }}>
                {[0, 1, 2].map((offset) => {
                  const index = (currentTestimonial + offset) % testimonials.length;
                  const testimonial = testimonials[index];
                  return (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.5s ease',
                        opacity: offset === 1 ? 1 : 0.6,
                        transform: offset === 1 ? 'scale(1.05)' : 'scale(0.95)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div style={{
                            fontWeight: 'bold',
                            marginBottom: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            {testimonial.name}
                            {testimonial.verified && (
                              <span style={{ color: '#3b82f6', fontSize: '0.875rem' }}>✓</span>
                            )}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8'
                          }}>
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        color: '#fbbf24',
                        marginBottom: '0.75rem',
                        fontSize: '1.25rem'
                      }}>
                        {'⭐'.repeat(testimonial.rating)}
                      </div>
                      <p style={{
                        color: '#cbd5e1',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}>
                        {testimonial.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="contacto" ref={sectionRefs.cta} style={{
        maxWidth: '1400px',
        margin: '5rem auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          padding: '4rem 2rem',
          borderRadius: '2rem',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          opacity: visibleSections.cta ? 1 : 0,
          transform: visibleSections.cta ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: '1rem'
          }}>
            CONTACTO
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Envíanos tu consulta
          </h2>
          <p style={{
            color: '#94a3b8',
            marginBottom: '2rem',
            fontSize: '1.125rem'
          }}>
            ¡Estamos a solo un mensaje o llamada de distancia!
          </p>

          <button className="btn-primary" style={{
            fontSize: '1.125rem',
            padding: '1.25rem 3rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Contactar Ahora
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '5rem 2rem 3rem',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(180deg, transparent 0%, #020617 50%)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              ✨
            </div>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 'normal',
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            Creamos
          </h2>
          <h3 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontStyle: 'italic',
            fontWeight: 'normal',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.1'
          }}>
            Tus Ideas
          </h3>

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            marginTop: '3rem',
            color: '#64748b'
          }}>
            <p>©2022 – Todos los Derechos Reservados</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Gabriel Diseña - Diseño Gráfico & Desarrollo Web
            </p>
          </div>
        </div>
      </footer>

      {/* Animations */}
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