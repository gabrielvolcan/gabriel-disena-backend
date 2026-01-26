import { useState } from 'react';
import { Link } from 'react-router-dom';

function PortfolioWeb() {
  const [selectedCountry] = useState('PE');

  const webProjects = [
    {
      id: 1,
      name: 'ZURO DENTAL',
      category: 'Sitio Corporativo',
      location: 'Argentina',
      description: 'Sitio web corporativo para clínica odontológica especializada, con sistema de reserva de turnos, presentación de especialidades, casos clínicos destacados y sección informativa para pacientes. Diseño moderno orientado a transmitir confianza, credibilidad y la experiencia profesional del equipo.',
      image: '/uploads/ZURODENTAL.jpg',
      link: 'https://www.zurodental.com.ar/',
      tags: ['E-commerce', 'Corporativo', 'Responsive'],
      technologies: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      name: 'Participayganaaya',
      category: 'Web Rifas',
      location: 'caracas - venezuela',
      description: 'Sitio web de rifas online con catálogo de sorteos activos, sistema de participación rápida y sección de pagos, diseñado para brindar una experiencia simple, segura y dinámica a los usuarios.',
      image: '/projects/tiny-colors.jpg',
      link: 'https://participaayganaya.com/',
      tags: ['Web-rifas', 'Pagos Online', ],
      technologies: ['React', 'Express', 'MySQL'] 
    },
    {
      id: 3,
      name: 'Rifas only cars',
      category: 'Web Rifas',
      location: 'caracas - venezuela',
      description: 'Sitio web de rifas automotrices con catálogo de sorteos exclusivos, sistema de participación rápida y diseño premium inspirado en el mundo motor. Enfocado en brindar una experiencia segura, clara y atractiva para los usuarios.',
      image: '/uploads/onlycars.jpg',
      link: 'https://www.rifasonlycars.com/',
      tags: ['Web-rifas', 'Pagos Online', ],
      technologies: ['React', 'Express', 'MySQL']
    },
    {
      id: 4,
      name: 'Afroditasspa',
      category: 'plataforma web',
      location: 'Chile',
      description: 'Sitio web para centro de masajes y spa, con sistema de reserva online, catálogo de servicios y presentación de masajistas. Diseñado para transmitir relajación, lujo y una experiencia de bienestar integral.',
      image: '/uploads/afroditaspa.jpg',
      link: 'https://afroditasspa.com/',
      tags: ['Landing', 'Conversión'],
      technologies: ['React', 'Express', 'MySQL']
    },

  

    {
    
    id: 5,
      name: 'pcell Store',
      category: 'plataforma web',
      location: 'Peru',
      description: 'sitio web de ventas de repuestos para celulares',
      image: '/uploads/afroditaspa.jpg',
      link: 'https://pcell.pe/',
      tags: ['Landing', 'Conversión'],
      technologies: ['React', 'Express', 'MySQL']
    },

    {

    id: 6,
      name: 'detodoencursos',
      category: 'plataforma web',
      location: 'argentina',
      description: 'sitio web de venta de cursos y estudios',
      image: '/uploads/afroditaspa.jpg',
      link: 'https://detodoencursos.com',
      tags: ['E-commerce', 'Corporativo', 'Responsive'],
      technologies: ['React', 'Express', 'MySQL']
    },

     {

    id: 7,
      name: 'Thomasbarberworld',
      category: 'plataforma web',
      location: 'Chile',
      description: 'sitio web de venta de productos y herramientas de bateria',
      image: '/uploads/afroditaspa.jpg',
      link: 'https://thomasbarberworld.cl',
      tags: ['E-commerce', 'Corporativo', 'Responsive'],
      technologies: [ 'php', 'Express', 'MySQL']
    },
  ];

  

  

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white' }}>
      {/* Navigation con LOGO */}
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
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1rem' }}>Inicio</Link>
            <Link to="/services" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1rem' }}>Servicios</Link>
            <a href="#contacto" style={{ 
              textDecoration: 'none', 
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '0.75rem',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>Contactar</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem 2rem 2rem',
        textAlign: 'center'
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
          marginBottom: '1.5rem'
        }}>
          💼 DISEÑO WEB - LANDING PAGES - SITIOS INSTITUCIONALES - ECOMMERCE
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          lineHeight: '1.1'
        }}>
          Algunos de Nuestros
          <br />
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Proyectos
          </span>
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#94a3b8',
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem'
        }}>
          Nos enfocamos en cada detalle para asegurar que tu presencia en línea refleje la esencia de tu marca y ofrezca una experiencia de usuario inolvidable.
        </p>
      </div>

      {/* Projects Grid - DISEÑO MEJORADO */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2.5rem'
      }}>
        {webProjects.map((project) => (
          <div
            key={project.id}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Project Header */}
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                🌐
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}>
                {project.name}
              </h3>
            </div>

            {/* Project Body */}
            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                  <span>📂</span>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Categoría:</span>
                  <span style={{ color: '#3b82f6', fontWeight: '500' }}>{project.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                  <span>📍</span>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Ubicación:</span>
                  <span style={{ color: '#3b82f6', fontWeight: '500' }}>{project.location}</span>
                </div>
              </div>

              <p style={{
                color: '#94a3b8',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}>
                {project.description}
              </p>

              {/* Tags */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                {project.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    padding: '0.4rem 1rem',
                    background: 'rgba(236, 72, 153, 0.1)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    borderRadius: '2rem',
                    color: '#ec4899',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Technologies */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  fontWeight: '600',
                  marginBottom: '0.75rem'
                }}>
                  Tecnologías:
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} style={{
                      padding: '0.4rem 0.875rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '0.5rem',
                      color: '#60a5fa',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Button */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Ver Sitio Web
              </a>
            </div>
          </div>
        ))}
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
            ¿Listo para tu Proyecto Web?
          </h2>
          <p style={{
            color: '#94a3b8',
            marginBottom: '2rem',
            fontSize: '1.25rem'
          }}>
            Contáctanos y cuéntanos tu idea. Trabajamos directamente contigo para crear la web perfecta para tu negocio.
          </p>
          <button style={{
            padding: '1.25rem 3rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Iniciar Proyecto
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            ✨
          </div>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Gabriel Diseña
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '2rem'
          }}>
            Diseño & Desarrollo Web Profesional
          </p>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Servicios</Link>
            <a href="#contacto" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contacto</a>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            © 2024 Gabriel Diseña - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PortfolioWeb;