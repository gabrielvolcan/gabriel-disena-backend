import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LogosServices() {
  const [mounted, setMounted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('PE');
  const [hoveredPlan, setHoveredPlan] = useState(null);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const countries = [
    { code: 'PE', flag: '🇵🇪', name: 'Perú', currency: 'S/' },
    { code: 'CL', flag: '🇨🇱', name: 'Chile', currency: '$' },
    { code: 'AR', flag: '🇦🇷', name: 'Argentina', currency: '$' },
    { code: 'UY', flag: '🇺🇾', name: 'Uruguay', currency: '$' },
    { code: 'US', flag: '🇺🇸', name: 'Internacional', currency: 'US$' }
  ];

  const logosPlans = [
    {
      name: 'PLAN BÁSICO',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      icon: '🎨',
      tagline: 'PERFECTO PARA EMPEZAR',
      prices: {
        PE: '130.00',
        CL: '50.000',
        AR: '50.000',
        UY: '3.000',
        US: '35'
      },
      features: [
        '2 propuestas únicas adaptadas',
        'Archivos editables para redes',
        'Archivos para tarjetas',
        'Sticker para WhatsApp',
        'Marcas de agua (PNG)',
        'Hasta 2 cambios de revisión'
      ]
    },
    {
      name: 'PLAN STANDARD',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: '✨',
      tagline: 'MÁS POPULAR',
      popular: true,
      prices: {
        PE: '250.00',
        CL: '70.000',
        AR: '70.000',
        UY: '6.000',
        US: '70'
      },
      features: [
        '3 propuestas únicas',
        'Diseño 100% personalizado',
        'Archivos editables cualquier formato',
        'Paleta de colores definida',
        'Tipografías corporativas',
        'Mockups profesionales',
        'Sticker para WhatsApp',
        'Marcas de agua (PNG)',
        'Hasta 3 cambios'
      ]
    },
    {
      name: 'PLAN PREMIUM',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: '👑',
      tagline: 'IDENTIDAD COMPLETA',
      prices: {
        PE: '500.00',
        CL: '250.000',
        AR: '250.000',
        UY: '6.000',
        US: '150'
      },
      features: [
        '5 propuestas únicas',
        'Manual de marca (15 páginas)',
        'Archivos editables todos los formatos',
        'Identidad visual completa',
        'Paleta de colores extendida',
        'Tipografía corporativa',
        'Mockups premium',
        'Sticker para WhatsApp',
        'Marcas de agua (PNG)',
        'Hasta 5 cambios'
      ]
    }
  ];

  const currentCountry = countries.find(c => c.code === selectedCountry);

  const handleContact = (planName) => {
    const message = `Hola! Estoy interesado en el ${planName}. ¿Podrías darme más información?`;
    const whatsappUrl = `https://wa.me/51957949278?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
        padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'center'
      }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '2rem',
          fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          color: '#94a3b8'
        }}>
          <Link to="/services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Servicios</Link>
          <span>→</span>
          <span style={{ color: '#ec4899', fontWeight: 'bold' }}>Diseño de Logos</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          fontWeight: 'bold',
          marginBottom: '1rem',
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
            Planes de
          </span>
          {' '}
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Logos
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#94a3b8',
          marginBottom: '2rem',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'slideUpFade 1s ease-out 0.2s forwards' : 'none'
        }}>
          Identidad visual profesional para tu marca
        </p>

        {/* Country Selector */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1rem',
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          marginBottom: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'slideUpFade 1s ease-out 0.4s forwards' : 'none',
          maxWidth: '95%',
          width: '100%'
        }}>
          <div style={{
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            color: '#94a3b8',
            marginBottom: '0.75rem',
            fontWeight: '600'
          }}>
            SELECCIONA TU PAÍS
          </div>
          <div style={{
            display: 'flex',
            gap: 'clamp(0.35rem, 1vw, 0.5rem)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                style={{
                  padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.5rem)',
                  borderRadius: '0.75rem',
                  border: selectedCountry === country.code 
                    ? '2px solid #3b82f6' 
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  background: selectedCountry === country.code 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'rgba(255, 255, 255, 0.03)',
                  color: 'white',
                  fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: selectedCountry === country.code ? 'bold' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (selectedCountry !== country.code) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCountry !== country.code) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{country.flag}</span>
                <span style={{ display: window.innerWidth < 400 ? 'none' : 'inline' }}>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '2rem',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            color: '#ec4899',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            🎨 DISEÑO GRÁFICO
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2rem)',
          marginBottom: '5rem'
        }}>
          {logosPlans.map((plan, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                position: 'relative',
                background: plan.gradient,
                borderRadius: '1.5rem',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                color: 'white',
                overflow: 'hidden',
                transform: hoveredPlan === index ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: hoveredPlan === index 
                  ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                border: plan.popular ? '3px solid rgba(255, 255, 255, 0.5)' : 'none'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.25)',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                  fontWeight: 'bold',
                  border: '2px solid rgba(255, 255, 255, 0.5)'
                }}>
                  ⭐ MÁS POPULAR
                </div>
              )}

              <div style={{
                fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                marginBottom: '1rem',
                transition: 'transform 0.4s ease',
                transform: hoveredPlan === index ? 'rotate(10deg) scale(1.2)' : 'rotate(0) scale(1)'
              }}>
                {plan.icon}
              </div>

              <div style={{
                fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                fontWeight: '600',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                opacity: 0.9
              }}>
                {plan.tagline}
              </div>

              <h3 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 'bold',
                marginBottom: '1.5rem'
              }}>
                {plan.name}
              </h3>

              <div style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{currentCountry.currency}</span>
                {plan.prices[selectedCountry]}
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '1rem',
                padding: 'clamp(1rem, 2vw, 1.5rem)',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  ✨ INCLUYE
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gap: '0.75rem'
                }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.25)',
                        fontSize: '0.75rem',
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

              <button 
                onClick={() => handleContact(plan.name)}
                style={{
                  width: '100%',
                  padding: 'clamp(0.875rem, 2vw, 1.125rem)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                }}
              >
                Solicitar Cotización
              </button>

              <div style={{
                position: 'absolute',
                bottom: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
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
        margin: 'clamp(3rem, 6vw, 5rem) auto',
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
            Transforma tu marca hoy
          </h2>
          <p style={{
            color: '#94a3b8',
            marginBottom: '2rem',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
          }}>
            ¿Listo para darle una identidad única a tu marca?
          </p>
          <button 
            onClick={() => {
              const message = 'Hola! Estoy interesado en solicitar un presupuesto para un logo. ¿Podrías ayudarme?';
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
            Solicita tu Presupuesto
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

export default LogosServices;