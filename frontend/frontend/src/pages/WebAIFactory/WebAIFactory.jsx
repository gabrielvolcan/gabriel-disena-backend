import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PaymentModal from './PaymentModal';
import { PAISES } from './paymentConfig';
import './WebAIFactory.css';

function WebAIFactory() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [mostrarSelectorPais, setMostrarSelectorPais] = useState(true);

  const sectionRefs = {
    hero: useRef(null),
    problem: useRef(null),
    solution: useRef(null),
    benefits: useRef(null),
    beforeAfter: useRef(null),
    howItWorks: useRef(null),
    forWho: useRef(null),
    pricing: useRef(null),
    faq: useRef(null)
  };

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      Object.keys(sectionRefs).forEach(key => {
        const element = sectionRefs[key].current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
          setVisibleSections(prev => ({ ...prev, [key]: isVisible }));
        }
      });
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSeleccionarPais = (codigoPais) => {
    setPaisSeleccionado(codigoPais);
    setMostrarSelectorPais(false);
  };

  const faqData = [
    {
      question: '¿Realmente funciona sin saber programar?',
      answer: 'Absolutamente. El sistema está diseñado para personas sin conocimientos técnicos. Si sabes escribir un correo, puedes usar WEB AI FACTORY™.'
    },
    {
      question: '¿Necesito comprar herramientas adicionales?',
      answer: 'No. Todo está incluido. Solo necesitas acceso a IA (ChatGPT o Claude, versiones gratuitas funcionan).'
    },
    {
      question: '¿Cuánto tiempo toma aprender?',
      answer: 'Menos de 30 minutos. El sistema es intuitivo y viene con ejemplos prácticos.'
    },
    {
      question: '¿Puedo realmente cobrar $500–$2,000 por página?',
      answer: 'Sí. El valor está en el resultado final, no en cómo lo creaste. Tus clientes pagan por páginas profesionales que funcionan.'
    },
    {
      question: '¿Y si no me funciona?',
      answer: 'Garantía de 7 días. Si no ves el valor, devolvemos tu dinero sin preguntas.'
    }
  ];

  return (
    <div className="waif-container">
      {/* SELECTOR DE PAÍS MODAL */}
      {mostrarSelectorPais && (
        <div className="country-selector-overlay">
          <div className="country-selector-modal">
            <div className="country-selector-header">
              <h2>Planes y <span className="waif-gradient-text">Precios</span></h2>
              <p>Diseño gráfico profesional y desarrollo web a tu medida</p>
            </div>
            
            <div className="country-selector-label">
              SELECCIONA TU PAÍS
            </div>

            <div className="country-selector-grid">
              {PAISES.map((pais) => (
                <button
                  key={pais.codigo}
                  className="country-button"
                  onClick={() => handleSeleccionarPais(pais.codigo)}
                >
                  <span className="country-flag">{pais.icono}</span>
                  <span className="country-name">{pais.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div 
        className="waif-animated-background"
        style={{
          background: `radial-gradient(circle at ${50 + scrollY * 0.1}% ${50 + scrollY * 0.05}%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)`
        }}
      />

      {/* Navigation */}
      <nav className="waif-nav">
        <div className="waif-nav-container">
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
          <div className="waif-nav-links">
            <Link to="/" className="waif-nav-link">Inicio</Link>
            <Link to="/services" className="waif-nav-link">Servicios</Link>
            {paisSeleccionado && (
              <button 
                onClick={() => setMostrarSelectorPais(true)} 
                className="waif-nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Cambiar País
              </button>
            )}
            <button onClick={() => setShowPaymentModal(true)} className="btn-primary waif-nav-button">
              Obtener Ahora
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div ref={sectionRefs.hero} className="waif-hero-section">
        <div 
          className="waif-hero-content"
          style={{
            opacity: visibleSections.hero ? 1 : 0,
            transform: visibleSections.hero ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div 
            className="waif-hero-badge"
            style={{
              animation: mounted ? 'fadeIn 1s ease-out 0.3s forwards' : 'none',
              opacity: 0
            }}
          >
            <span className="waif-badge-dot" />
            Lanzamiento Especial
          </div>

          <h1 
            className="waif-hero-title"
            style={{
              animation: mounted ? 'slideUpFade 1s ease-out 0.5s forwards' : 'none',
              opacity: 0
            }}
          >
            <span className="waif-hero-title-main">
              Crea y Vende Páginas Web Profesionales
            </span>
            <span className="waif-hero-title-accent">
              con IA en Minutos
            </span>
          </h1>

          <p 
            className="waif-hero-description"
            style={{
              animation: mounted ? 'slideUpFade 1s ease-out 0.7s forwards' : 'none',
              opacity: 0
            }}
          >
            El sistema completo que transforma a cualquier persona en creador de sitios web de alto valor — <strong style={{ color: '#ec4899' }}>sin programar ni diseñar</strong>
          </p>

          <div 
            className="waif-hero-buttons"
            style={{
              animation: mounted ? 'slideUpFade 1s ease-out 0.9s forwards' : 'none',
              opacity: 0
            }}
          >
            <button onClick={() => setShowPaymentModal(true)} className="btn-primary waif-cta-main">
              Obtener WEB AI FACTORY™ por $7 USD
            </button>
          </div>

          <div 
            className="waif-hero-trust"
            style={{
              animation: mounted ? 'fadeIn 1s ease-out 1.1s forwards' : 'none',
              opacity: 0
            }}
          >
            <span>✓ Acceso inmediato</span>
            <span>✓ Sin suscripciones</span>
            <span>✓ Garantía 7 días</span>
          </div>
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <div ref={sectionRefs.problem} className="waif-section waif-problem-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.problem ? 1 : 0,
              transform: visibleSections.problem ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h2 className="waif-section-title">¿Te Suena Familiar?</h2>
            
            <div className="waif-problem-grid">
              <div className="waif-problem-item">
                <span className="waif-problem-icon">❌</span>
                <p>No sabes programar (y aprender llevaría meses)</p>
              </div>
              <div className="waif-problem-item">
                <span className="waif-problem-icon">❌</span>
                <p>Los cursos son caros y eternos</p>
              </div>
              <div className="waif-problem-item">
                <span className="waif-problem-icon">❌</span>
                <p>Contratar diseñadores te deja sin margen</p>
              </div>
              <div className="waif-problem-item">
                <span className="waif-problem-icon">❌</span>
                <p>Pierdes clientes porque tardas demasiado</p>
              </div>
              <div className="waif-problem-item">
                <span className="waif-problem-icon">❌</span>
                <p>No tienes un sistema repetible y escalable</p>
              </div>
            </div>

            <p className="waif-problem-result">
              <strong>Resultado:</strong> Oportunidades perdidas. Ingresos que se van. Y la frustración de saber que podrías estar ganando más.
            </p>
          </div>
        </div>
      </div>

      {/* SOLUTION SECTION */}
      <div ref={sectionRefs.solution} className="waif-section waif-solution-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.solution ? 1 : 0,
              transform: visibleSections.solution ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out'
            }}
          >
            <div className="waif-section-label">LA SOLUCIÓN</div>
            <h2 className="waif-section-title">
              Tu Propia <span className="waif-gradient-text">Fábrica de Sitios Web</span>
            </h2>
            
            <p className="waif-section-description">
              WEB AI FACTORY™ no son "prompts simples". Es un sistema de producción profesional usado por agencias de alto nivel.
            </p>

            <div className="waif-features-grid">
              <div className="waif-feature-card">
                <div className="waif-feature-icon">✅</div>
                <h3>Crear negocios digitales completos desde cero</h3>
              </div>
              <div className="waif-feature-card">
                <div className="waif-feature-icon">✅</div>
                <h3>Generar textos de venta que convierten</h3>
              </div>
              <div className="waif-feature-card">
                <div className="waif-feature-icon">✅</div>
                <h3>Estructurar páginas web de 5 cifras</h3>
              </div>
              <div className="waif-feature-card">
                <div className="waif-feature-icon">✅</div>
                <h3>Producir landings, funnels y copys premium</h3>
              </div>
              <div className="waif-feature-card">
                <div className="waif-feature-icon">✅</div>
                <h3>Exportar HTML/CSS listos para vender</h3>
              </div>
              <div className="waif-feature-card">
                <div className="waif-feature-icon">✅</div>
                <h3>Construir páginas en minutos, no semanas</h3>
              </div>
            </div>

            <p className="waif-solution-footer">
              Todo automatizado con IA. Sin escribir una línea de código. Sin experiencia previa en diseño.
            </p>
          </div>
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <div ref={sectionRefs.benefits} className="waif-section waif-benefits-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.benefits ? 1 : 0,
              transform: visibleSections.benefits ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h2 className="waif-section-title">
              Lo Que Lograrás con <span className="waif-gradient-text">WEB AI FACTORY™</span>
            </h2>

            <div className="waif-benefits-grid">
              <div className="waif-benefit-card">
                <div className="waif-benefit-icon">🚀</div>
                <h3>Velocidad 10x</h3>
                <p>Lo que antes te tomaba semanas, ahora lo haces en minutos. Más clientes, más proyectos, más ingresos.</p>
              </div>

              <div className="waif-benefit-card">
                <div className="waif-benefit-icon">💰</div>
                <h3>Monetización Inmediata</h3>
                <p>Cobra entre $200 y $2,000 USD por cada página. Con solo 1 cliente recuperas tu inversión 30 veces.</p>
              </div>

              <div className="waif-benefit-card">
                <div className="waif-benefit-icon">🎯</div>
                <h3>Sin Límites Técnicos</h3>
                <p>No necesitas saber programar. El sistema trabaja por ti. Tú solo diriges y vendes.</p>
              </div>

              <div className="waif-benefit-card">
                <div className="waif-benefit-icon">📈</div>
                <h3>Escalabilidad Total</h3>
                <p>Produce 5, 10 o 20 páginas al mes. Tu ingreso no depende de tus horas.</p>
              </div>

              <div className="waif-benefit-card">
                <div className="waif-benefit-icon">🏆</div>
                <h3>Ventaja Competitiva</h3>
                <p>Mientras otros luchan con código, tú entregas profesionalismo a velocidad de IA.</p>
              </div>

              <div className="waif-benefit-card">
                <div className="waif-benefit-icon">🔐</div>
                <h3>100% Tuyo</h3>
                <p>Sin licencias mensuales. Sin límites de uso. Compras una vez, usas siempre.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BEFORE/AFTER SECTION */}
      <div ref={sectionRefs.beforeAfter} className="waif-section waif-before-after-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.beforeAfter ? 1 : 0,
              transform: visibleSections.beforeAfter ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h2 className="waif-section-title">Tu Realidad, <span className="waif-gradient-text">Transformada</span></h2>

            <div className="waif-comparison-table">
              <div className="waif-comparison-column waif-before">
                <h3>❌ ANTES</h3>
                <ul>
                  <li>Semanas creando una página</li>
                  <li>Cobras $200–300 por proyecto</li>
                  <li>Pierdes clientes por lentitud</li>
                  <li>Dependes de programadores</li>
                  <li>Estrés constante con código</li>
                  <li>Ingresos limitados por tiempo</li>
                </ul>
              </div>

              <div className="waif-comparison-column waif-after">
                <h3>✅ CON WEB AI FACTORY™</h3>
                <ul>
                  <li>Minutos produciendo páginas completas</li>
                  <li>Cobras $800–2,000+ por proyecto</li>
                  <li>Cierras ventas en tiempo real</li>
                  <li>Eres 100% autónomo</li>
                  <li>Creatividad y estrategia pura</li>
                  <li>Ingresos escalables sin límite</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div ref={sectionRefs.howItWorks} className="waif-section waif-how-it-works-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.howItWorks ? 1 : 0,
              transform: visibleSections.howItWorks ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h2 className="waif-section-title">
              Tan Simple Que <span className="waif-gradient-text">Parece Magia</span>
            </h2>

            <div className="waif-steps-grid">
              <div className="waif-step-card">
                <div className="waif-step-number">1</div>
                <h3>Selecciona</h3>
                <p>Elige qué tipo de página necesitas: negocio, landing, funnel, e-commerce, portfolio, lo que sea.</p>
              </div>

              <div className="waif-step-card">
                <div className="waif-step-number">2</div>
                <h3>Genera</h3>
                <p>Usa el sistema WEB AI FACTORY™. La IA crea toda la estructura, textos, diseño y código.</p>
              </div>

              <div className="waif-step-card">
                <div className="waif-step-number">3</div>
                <h3>Entrega (y cobra)</h3>
                <p>Descarga el HTML listo, personalízalo en segundos y envíalo a tu cliente. Proyecto terminado.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOR WHO SECTION */}
      <div ref={sectionRefs.forWho} className="waif-section waif-for-who-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.forWho ? 1 : 0,
              transform: visibleSections.forWho ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h2 className="waif-section-title">¿Es Para Ti?</h2>

            <div className="waif-for-who-columns">
              <div className="waif-for-who-yes">
                <h3>✅ SÍ, si eres:</h3>
                <ul>
                  <li>Emprendedor que quiere un ingreso digital escalable</li>
                  <li>Diseñador gráfico que necesita ofrecer desarrollo web</li>
                  <li>Community manager que busca servicios adicionales</li>
                  <li>Freelancer que quiere multiplicar sus ingresos</li>
                  <li>Principiante con ambición pero sin conocimientos técnicos</li>
                  <li>Agencia que necesita acelerar su producción</li>
                </ul>
              </div>

              <div className="waif-for-who-no">
                <h3>❌ NO es para ti si:</h3>
                <ul>
                  <li>Buscas una solución mágica sin aplicar</li>
                  <li>No tienes interés en emprender digitalmente</li>
                  <li>Prefieres hacer todo manual en lugar de automatizar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div ref={sectionRefs.pricing} className="waif-section waif-pricing-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.pricing ? 1 : 0,
              transform: visibleSections.pricing ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 1s ease-out'
            }}
          >
            <div className="waif-section-label">PRECIO DE LANZAMIENTO ESPECIAL</div>
            
            <div className="waif-pricing-card">
              <div className="waif-pricing-header">
                <p className="waif-pricing-regular">Valor real: <span style={{ textDecoration: 'line-through' }}>$497 USD</span></p>
                <p className="waif-pricing-subtitle">(Lo que cobrarías por 1 sola página)</p>
              </div>

              <div className="waif-pricing-main">
                <div className="waif-price-tag">
                  <span className="waif-currency">USD</span>
                  <span className="waif-amount">$7</span>
                </div>
                <p className="waif-pricing-note">(o equivalente en tu moneda local)</p>
              </div>

              <ul className="waif-pricing-features">
                <li>✓ Acceso instantáneo y permanente</li>
                <li>✓ Todas las actualizaciones incluidas</li>
                <li>✓ Sin pagos recurrentes</li>
                <li>✓ Garantía de 7 días</li>
              </ul>

              <button onClick={() => setShowPaymentModal(true)} className="btn-primary waif-pricing-cta">
                SÍ, QUIERO WEB AI FACTORY™ POR $7 USD
              </button>

              <div className="waif-pricing-urgency">
                <p>⏰ Solo disponible a este precio durante el lanzamiento.</p>
                <p>Una vez cerrada esta oferta, el precio será el estándar.</p>
              </div>

              <div className="waif-guarantee-badge">
                <div className="waif-guarantee-icon">🛡️</div>
                <div className="waif-guarantee-text">
                  <strong>Garantía de Satisfacción Total</strong>
                  <p>7 días para probar. Si no te convence, devolvemos el 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div ref={sectionRefs.faq} className="waif-section waif-faq-section">
        <div className="waif-container-inner">
          <div 
            className="waif-section-content"
            style={{
              opacity: visibleSections.faq ? 1 : 0,
              transform: visibleSections.faq ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h2 className="waif-section-title">Tus Preguntas, <span className="waif-gradient-text">Respondidas</span></h2>

            <div className="waif-faq-list">
              {faqData.map((item, index) => (
                <div key={index} className="waif-faq-item">
                  <button 
                    className="waif-faq-question"
                    onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className="waif-faq-icon">{activeFAQ === index ? '−' : '+'}</span>
                  </button>
                  {activeFAQ === index && (
                    <div className="waif-faq-answer">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA SECTION */}
      <div className="waif-section waif-final-cta-section">
        <div className="waif-container-inner">
          <div className="waif-final-cta-card">
            <h2 className="waif-section-title">
              Tienes Dos <span className="waif-gradient-text">Opciones</span> Ahora Mismo
            </h2>

            <div className="waif-options-grid">
              <div className="waif-option-card waif-option-bad">
                <h3>OPCIÓN 1:</h3>
                <p>Seguir como hasta ahora. Viendo pasar oportunidades. Limitado por la falta de habilidades técnicas. Cobrando poco. Trabajando mucho.</p>
              </div>

              <div className="waif-option-card waif-option-good">
                <h3>OPCIÓN 2:</h3>
                <p>Tomar WEB AI FACTORY™ por $7 USD. Tener un sistema profesional que funciona. Crear páginas en minutos. Cobrar como experto. Construir un negocio digital escalable desde hoy.</p>
              </div>
            </div>

            <p className="waif-final-message">
              La decisión es tuya. Pero la oportunidad no estará para siempre.
            </p>

            <button onClick={() => setShowPaymentModal(true)} className="btn-primary waif-final-cta-button">
              ACCEDER A WEB AI FACTORY™ AHORA
            </button>

            <p className="waif-ps">
              <strong>P.D.</strong> — Recuerda: Con solo 1 cliente recuperas tu inversión 100 veces. El riesgo no está en comprar. El riesgo está en no hacer nada.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="waif-footer">
        <div className="waif-footer-container">
          <div className="waif-footer-content">
            <Link to="/">
              <img 
                src="/logo GD.svg" 
                alt="Gabriel Diseña" 
                style={{
                  height: '60px',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
                }}
              />
            </Link>
            <p className="waif-footer-text">
              WEB AI FACTORY™ es un producto de Gabriel Diseña
            </p>
            <div className="waif-footer-links">
              <Link to="/">Inicio</Link>
              <Link to="/services">Servicios</Link>
              <a href="mailto:contacto@gabrieldisena.com">Contacto</a>
            </div>
            <p className="waif-footer-copyright">
              ©2024 – Todos los Derechos Reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && paisSeleccionado && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)} 
          paisSeleccionado={paisSeleccionado}
        />
      )}

      {showPaymentModal && !paisSeleccionado && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="payment-modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            <div className="payment-success">
              <h2>Selecciona tu país primero</h2>
              <p>Por favor, selecciona tu país para ver los métodos de pago disponibles.</p>
              <button onClick={() => { setShowPaymentModal(false); setMostrarSelectorPais(true); }} className="btn-primary">
                Seleccionar País
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebAIFactory;