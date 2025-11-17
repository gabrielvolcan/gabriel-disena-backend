import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Services() {
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
        CL: '28.000',
        AR: '42.000',
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
        CL: '65.000',
        AR: '80.000',
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
        CL: '200.000',
        AR: '200.000',
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

  const webPlans = [
    {
      name: 'WEB BÁSICO',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: '🌐',
      tagline: 'LANDING PAGE PROFESIONAL',
      prices: {
        PE: '450',
        CL: '150.000',
        AR: '200.000',
        UY: '5.000',
        US: '150'
      },
      features: [
        '1 página (landing page)',
        'Diseño personalizado',
        'Formulario de contacto',
        'Integración redes sociales',
        'Responsive (móvil y PC)',
        'Entrega en 5 días hábiles'
      ]
    },
    {
      name: 'WEB STANDARD',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      icon: '💼',
      tagline: 'SITIO COMPLETO',
      popular: true,
      prices: {
        PE: '900',
        CL: '300.000',
        AR: '400.000',
        UY: '10.000',
        US: '300'
      },
      features: [
        'Hasta 4 secciones',
        'Inicio, Servicios, Nosotros, Contacto',
        'Diseño 100% responsive',
        'Integración WhatsApp',
        'Optimización SEO básica',
        'Capacitación para el cliente',
        'Entrega en 10 días'
      ]
    },
    {
      name: 'WEB PREMIUM',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      icon: '🚀',
      tagline: 'E-COMMERCE O SITIO AVANZADO',
      prices: {
        PE: '1.800',
        CL: '600.000',
        AR: '800.000',
        UY: '20.000',
        US: '600'
      },
      features: [
        'Hasta 8 secciones o tienda online',
        'Diseño 100% personalizado',
        'Optimización SEO avanzada',
        'Hosting y dominio (1 año)',
        'Correos corporativos',
        'Panel de administración',
        'Soporte técnico 30 días',
        'Entrega en 15 días'
      ]
    }
  ];

  const currentCountry = countries.find(c => c.code === selectedCountry);

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
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none'
          }}>
            Gabriel<span style={{ color: '#3b82f6' }}>.diseña</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/services" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>Servicios</Link>
            <a href="#contacto" className="btn-primary" style={{ 
              textDecoration: 'none', 
              padding: '0.75rem 1.5rem', 
              fontSize: '0.9rem'
            }}>Contactar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '3rem 2rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
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
            Planes y
          </span>
          {' '}
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Precios
          </span>
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#94a3b8',
          marginBottom: '2rem',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'slideUpFade 1s ease-out 0.2s forwards' : 'none'
        }}>
          Diseño gráfico profesional y desarrollo web a tu medida
        </p>

        {/* Country Selector */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1rem',
          padding: '1rem',
          marginBottom: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'slideUpFade 1s ease-out 0.4s forwards' : 'none'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            marginBottom: '0.75rem',
            fontWeight: '600'
          }}>
            SELECCIONA TU PAÍS
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: selectedCountry === country.code 
                    ? '2px solid #3b82f6' 
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  background: selectedCountry === country.code 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'rgba(255, 255, 255, 0.03)',
                  color: 'white',
                  fontSize: '1rem',
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
                <span style={{ fontSize: '1.5rem' }}>{country.flag}</span>
                {country.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LOGOS Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '3rem 2rem'
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
            fontSize: '0.875rem',
            color: '#ec4899',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            🎨 DISEÑO GRÁFICO
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Planes de{' '}
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
          <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
            Identidad visual profesional para tu marca
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {logosPlans.map((plan, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredPlan(`logo-${index}`)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                position: 'relative',
                background: plan.gradient,
                borderRadius: '1.5rem',
                padding: '2.5rem',
                color: 'white',
                overflow: 'hidden',
                transform: hoveredPlan === `logo-${index}` ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: hoveredPlan === `logo-${index}` 
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
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  border: '2px solid rgba(255, 255, 255, 0.5)'
                }}>
                  ⭐ MÁS POPULAR
                </div>
              )}

              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1rem',
                transition: 'transform 0.4s ease',
                transform: hoveredPlan === `logo-${index}` ? 'rotate(10deg) scale(1.2)' : 'rotate(0) scale(1)'
              }}>
                {plan.icon}
              </div>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                opacity: 0.9
              }}>
                {plan.tagline}
              </div>

              <h3 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem'
              }}>
                {plan.name}
              </h3>

              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{currentCountry.currency}</span>
                {plan.prices[selectedCountry]}
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
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
                      fontSize: '0.9rem'
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

              <button style={{
                width: '100%',
                padding: '1.125rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: 'white',
                textDecoration: 'underline'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

        {/* WEB Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          marginTop: '5rem'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            color: '#3b82f6',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            💻 DESARROLLO WEB
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Planes{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Web
            </span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
            Sitios web profesionales y tiendas online
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {webPlans.map((plan, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredPlan(`web-${index}`)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                position: 'relative',
                background: plan.gradient,
                borderRadius: '1.5rem',
                padding: '2.5rem',
                color: 'white',
                overflow: 'hidden',
                transform: hoveredPlan === `web-${index}` ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: hoveredPlan === `web-${index}` 
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
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  border: '2px solid rgba(255, 255, 255, 0.5)'
                }}>
                  ⭐ MÁS POPULAR
                </div>
              )}

              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1rem',
                transition: 'transform 0.4s ease',
                transform: hoveredPlan === `web-${index}` ? 'rotate(10deg) scale(1.2)' : 'rotate(0) scale(1)'
              }}>
                {plan.icon}
              </div>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                opacity: 0.9
              }}>
                {plan.tagline}
              </div>

              <h3 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem'
              }}>
                {plan.name}
              </h3>

              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{currentCountry.currency}</span>
                {plan.prices[selectedCountry]}
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
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
                      fontSize: '0.9rem'
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

              <button style={{
                width: '100%',
                padding: '1.125rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: 'white',
                textDecoration: 'underline'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
        margin: '5rem auto',
        padding: '0 2rem'
      }}>
        <div style={{
          padding: '4rem 2rem',
          borderRadius: '2rem',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Transforma tu marca hoy
          </h2>
          <p style={{
            color: '#94a3b8',
            marginBottom: '2rem',
            fontSize: '1.25rem'
          }}>
            ¿Listo para llevar tu proyecto al siguiente nivel?
          </p>
          <button className="btn-primary" style={{
            fontSize: '1.125rem',
            padding: '1.25rem 3rem'
          }}>
            Solicita tu Presupuesto
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <p>© 2024 Gabriel Diseña. Todos los derechos reservados.</p>
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          <a href="#" style={{ color: '#94a3b8' }}>📷</a>
          <a href="#" style={{ color: '#94a3b8' }}>💬</a>
          <a href="#" style={{ color: '#94a3b8' }}>📧</a>
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

export default Services;