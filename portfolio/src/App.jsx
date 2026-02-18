import { useState, useEffect, useRef } from 'react'
import './App.css'

// ─── PROJECTS DATA ───────────────────────────────────────────────────────────
// Imágenes: pon tus archivos en portfolio/public/images/
// Ejemplo: portfolio/public/images/only-cars.jpg

const BASE = import.meta.env.BASE_URL

const projects = [
  {
    id: '01',
    name: 'Only Cars',
    category: 'Plataforma Web · Rifas',
    location: 'Venezuela',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/onlycars.png`,
    gradient: 'linear-gradient(135deg, #450a0a 0%, #991b1b 60%, #b45309 100%)',
    emoji: '🚗',
    link: 'https://www.rifasonlycars.com/',
    tags: ['React', 'Express', 'MySQL'],
  },
  {
    id: '02',
    name: 'Zuro Dental',
    category: 'Sitio Corporativo',
    location: 'Argentina',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/zuro-dental.png`,
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0891b2 100%)',
    emoji: '🦷',
    link: 'https://www.zurodental.com.ar/',
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: '03',
    name: 'Afroditasspa',
    category: 'Plataforma Web · Bienestar',
    location: 'Chile',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/afroditasspa.png`,
    gradient: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 60%, #c026d3 100%)',
    emoji: '💆',
    link: 'https://afroditasspa.com/',
    tags: ['React', 'Express', 'MySQL'],
  },
  {
    id: '04',
    name: 'Participayganaaya',
    category: 'Plataforma Web · Rifas',
    location: 'Venezuela',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/participayganaaya.png`,
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #0891b2 100%)',
    emoji: '🎯',
    link: 'https://participaayganaya.com/',
    tags: ['React', 'Express', 'MySQL'],
  },
  {
    id: '05',
    name: 'Pcell Store',
    category: 'E-Commerce',
    location: 'Perú',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/pcell-store.png`,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #4f46e5 100%)',
    emoji: '📱',
    link: 'https://pcell.pe/',
    tags: ['React', 'Express', 'MySQL'],
  },
  {
    id: '06',
    name: 'Detodoencursos',
    category: 'Plataforma Educativa',
    location: 'Argentina',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/detodo.png`,
    gradient: 'linear-gradient(135deg, #431407 0%, #c2410c 60%, #ea580c 100%)',
    emoji: '🎓',
    link: 'https://detodoencursos.com',
    tags: ['React', 'Express', 'MySQL'],
  },
  {
    id: '07',
    name: 'Thomas Barber World',
    category: 'E-Commerce',
    location: 'Chile',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/thomas-barber.png`,
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
    emoji: '💈',
    link: 'https://thomasbarberworld.cl',
    tags: ['PHP', 'MySQL'],
  },
  {
    id: '08',
    name: 'Ganaconjohander',
    category: 'Talonario Digital',
    location: 'Venezuela',
    description: 'Descripción pendiente — pégala aquí.',
    image: `${BASE}images/ganaconjohander.png`,
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 60%, #16a34a 100%)',
    emoji: '🎰',
    link: 'https://ganaconjohander.com/',
    tags: ['PHP', 'Express', 'MySQL'],
  },
  {
    id: '09',
    name: 'Fundación MB Solidaria',
    category: 'Plataforma Web · Gestión de Eventos',
    location: 'Ibagué, Colombia',
    description: 'Plataforma completa para gestionar eventos de sostenimiento solidarios de principio a fin: registro de participantes con selección interactiva de números, sistema de pagos con soporte para abonos parciales, carga y validación de comprobantes, notificaciones automáticas por email y generación de comprobantes en PDF. Panel de administración con +8 módulos: gestión de eventos, aprobación de pagos, configuración dinámica y consulta pública de estado. Arquitectura MVC con seguridad avanzada: protección CSRF, consultas preparadas contra SQL Injection y autenticación con sesiones seguras.',
    image: `${BASE}images/fundamb.png`,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #6d28d9 100%)',
    emoji: '🤝',
    link: 'https://fundacionmbsolidaria.com/',
    tags: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'PHPMailer', 'MVC'],
  },
]

const skills = [
  { name: 'HTML5',        emoji: '🔶' },
  { name: 'JavaScript',   emoji: '🟨' },
  { name: 'React',        emoji: '⚛️' },
  { name: 'Node.js',      emoji: '🟢' },
  { name: 'Illustrator',  emoji: '🖊️' },
  { name: 'Photoshop',    emoji: '🖼️' },
  { name: 'Premiere Pro', emoji: '🎞️' },
  { name: 'VS Code',      emoji: '🔵' },
  { name: 'ChatGPT',      emoji: '🤖' },
  { name: 'Gemini',       emoji: '✨' },
  { name: 'MySQL',        emoji: '🗄️' },
  { name: 'MongoDB',      emoji: '🍃' },
]

// ─── CURSOR HOOK (sin React state = 0 re-renders, 60fps garantizados) ────────

function useCursor(dotEl, ringEl, glowEl) {
  const mousePos = useRef({ x: -300, y: -300 })
  const ringPos  = useRef({ x: -300, y: -300 })
  const rafId    = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY

      // Dot sigue el mouse al instante (GPU via transform)
      if (dotEl.current) {
        dotEl.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      // Glow con CSS transition slow
      if (glowEl.current) {
        glowEl.current.style.left = `${e.clientX}px`
        glowEl.current.style.top  = `${e.clientY}px`
      }
    }

    // Ring: lerp suave via RAF, nunca se pega
    const tick = () => {
      const rx = mousePos.current.x
      const ry = mousePos.current.y
      ringPos.current.x += (rx - ringPos.current.x) * 0.13
      ringPos.current.y += (ry - ringPos.current.y) * 0.13

      if (ringEl.current) {
        ringEl.current.style.transform =
          `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      }
      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [dotEl, ringEl, glowEl])
}

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )

    const els = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip, .reveal-clip-rtl'
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ scrolled }) {
  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <a href="#inicio" className="nav-brand">
        Portafolio<span>.</span>
      </a>

      <ul className="nav-links">
        {[
          ['#inicio',    'Inicio'],
          ['#sobre-mi',  'Sobre Mí'],
          ['#proyectos', 'Proyectos'],
          ['#programas', 'Programas'],
          ['#contacto',  'Contacto'],
        ].map(([href, label]) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>

      <div className="nav-social">
        <a href="https://www.behance.net/gabriedisena"       target="_blank" rel="noopener noreferrer">Bē</a>
        <a href="https://www.instagram.com/gabrieldisena25/" target="_blank" rel="noopener noreferrer">Ig</a>
        <a href="https://wa.me/51957949278"                  target="_blank" rel="noopener noreferrer">WA</a>
      </div>
    </nav>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg-gradient" />

      <div className="hero-grid">
        <div>
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Disponible para proyectos
          </div>

          <h1 className="hero-title">
            Diseñador
            <span className="hero-title-accent">Creativo y</span>
            Dev Web
          </h1>

          <p className="hero-desc">
            Apasionado por transformar ideas complejas en experiencias visuales
            impactantes y soluciones digitales innovadoras, potenciando proyectos
            con el poder de la Inteligencia Artificial.
          </p>

          <div className="hero-actions">
            <a href="/cv-gabriel-disena.pdf" download className="btn-primary">
              Descargar CV
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </a>
            <a href="#contacto" className="btn-ghost">Contáctame</a>
          </div>

          <div className="hero-socials">
            <a href="https://www.instagram.com/gabrieldisena25/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.behance.net/gabriedisena"       target="_blank" rel="noopener noreferrer">Behance</a>
            <a href="https://wa.me/51957949278"                  target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>

        <div className="hero-image-side">
          <div className="hero-photo-ring">
            <div className="hero-photo-inner">
              {/* Pon tu foto en: portfolio/public/images/foto-gabriel.jpg */}
              <img
                src={`${BASE}images/foto-gabriel.jpg`}
                alt="Gabriel Diseña"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div className="hero-photo-placeholder" style={{ display: 'none' }}>👤</div>
            </div>
          </div>

          <div className="hero-badge pos-1">
            <div className="hero-badge-num">9+</div>
            <div className="hero-badge-label">Proyectos</div>
          </div>
          <div className="hero-badge pos-2">
            <div className="hero-badge-num">5</div>
            <div className="hero-badge-label">Países</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="sobre-mi" style={{ padding: '8rem 0', background: 'rgba(13,17,23,0.5)' }}>
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <div className="section-tag reveal">SOBRE MÍ</div>
          <h2 className="section-heading reveal d1">Quién <span>Soy</span></h2>
          <div className="section-line reveal d2" style={{ margin: '1.5rem auto 0' }} />
        </div>

        <div className="about-grid">
          {[
            { icon: '❓', title: '¿Quién Soy?',  delay: 'd2', text: 'Soy un profesional creativo y versátil con una sólida base en diseño gráfico y edición de video, siempre buscando innovar y crecer en el desarrollo web.' },
            { icon: '🎯', title: 'Mi Objetivo',   delay: 'd4', text: 'Aplicar mis conocimientos actuales para generar soluciones visuales y digitales atractivas, optimizando proyectos con el poder de la Inteligencia Artificial.' },
            { icon: '🧑‍💻', title: 'Mi Perfil',  delay: 'd6', text: 'Me caracterizo por mi capacidad de adaptación a nuevos entornos, mi atención al detalle y mi compromiso con la entrega de productos de alta calidad.' },
          ].map((c) => (
            <div key={c.title} className={`about-card reveal ${c.delay}`}>
              <div className="about-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROJECT ROW ─────────────────────────────────────────────────────────────

function ProjectRow({ project, index }) {
  const reversed = index % 2 !== 0

  return (
    <div className={`project-row${reversed ? ' reversed' : ''}`}>
      <span className="project-watermark">{project.id}</span>

      {/* Imagen */}
      <div className={`project-image-wrap ${reversed ? 'reveal-clip-rtl' : 'reveal-clip'}`}>
        <img
          src={project.image}
          alt={project.name}
          className="project-image-inner"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div
          className="project-image-placeholder"
          style={{ background: project.gradient, display: 'none' }}
        >
          {project.emoji}
        </div>

        <div className="project-overlay">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-overlay-cta"
          >
            Ver Proyecto
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Info */}
      <div className={`project-info ${reversed ? 'reveal-left' : 'reveal-right'} d2`}>
        <div className="project-cat-row">
          <span className="project-cat-line" />
          {project.category}
        </div>

        <h3 className="project-name">{project.name}</h3>

        <div className="project-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {project.location}
        </div>

        <p className="project-desc">{project.description}</p>

        <div className="project-tech-list">
          {project.tags.map((t) => <span key={t} className="tech-tag">{t}</span>)}
        </div>

        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link-row">
          Ver sitio en vivo <span className="link-arrow">→</span>
        </a>
      </div>
    </div>
  )
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

function Projects() {
  return (
    <section id="proyectos" className="projects-section">
      <div className="projects-header">
        <div className="projects-header-left">
          <div className="section-tag reveal">MIS PROYECTOS</div>
          <h2 className="section-heading reveal d1">Trabajo que <span>habla</span></h2>
          <div className="section-line reveal d2" />
        </div>
        <div className="projects-count reveal d3">
          {String(projects.length).padStart(2, '0')}
        </div>
      </div>

      <div className="projects-stats">
        {[
          { num: '9+', label: 'Proyectos completados' },
          { num: '5',  label: 'Países atendidos'      },
          { num: '3+', label: 'Años de experiencia'   },
          { num: '∞',  label: 'Pasión por el detalle' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-item reveal d${i + 1}`}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {projects.map((project, i) => (
        <ProjectRow key={project.id} project={project} index={i} />
      ))}
    </section>
  )
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

function Skills() {
  return (
    <section id="programas" style={{ padding: '8rem 0' }}>
      <div className="container">
        <div className="skills-bg reveal-scale">
          <div style={{ textAlign: 'center' }}>
            <div className="section-tag">PROGRAMAS Y TECNOLOGÍAS</div>
            <h2 className="section-heading" style={{ marginTop: '0.5rem' }}>
              Mis Habilidades <span>Técnicas</span>
            </h2>
            <div className="section-line" style={{ margin: '1.5rem auto 0' }} />
          </div>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <div key={s.name} className={`skill-card reveal d${Math.min(i + 1, 8)}`}>
                <span className="skill-icon">{s.emoji}</span>
                <span className="skill-name">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contacto" style={{ padding: '4rem 0 8rem' }}>
      <div className="container">
        <div className="contact-card reveal-scale">
          <div className="contact-glow-1" />
          <div className="contact-glow-2" />
          <h2 className="contact-title">
            ¿Listo para crear<br />
            <span style={{ background: 'linear-gradient(135deg, #4361ee, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              algo increíble?
            </span>
          </h2>
          <p className="contact-sub">
            Cuéntame tu idea. Trabajo directamente contigo, sin intermediarios.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <a
              href="https://wa.me/51957949278?text=Hola!%20Vi%20tu%20portfolio%20y%20me%20interesa%20trabajar%20contigo"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '1.1rem 2.5rem' }}
            >
              Escribir por WhatsApp
            </a>
            <a
              href="mailto:contacto@gabrieldisena.com"
              className="btn-ghost"
              style={{ fontSize: '1rem', padding: '1.1rem 2.5rem' }}
            >
              Enviar un Email
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="footer">
        <div className="footer-brand">Gabriel <span>Diseña</span></div>
        <div className="footer-links">
          <a href="https://www.gabrieldisena.com">Inicio</a>
          <a href="https://www.gabrieldisena.com/services">Servicios</a>
          <a href="https://www.behance.net/gabriedisena"       target="_blank" rel="noopener noreferrer">Behance</a>
          <a href="https://www.instagram.com/gabrieldisena25/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <p className="footer-copy">© 2025 Gabriel Diseña</p>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled,  setScrolled]  = useState(false)
  const [progress,  setProgress]  = useState(0)

  // Refs del cursor — directo al DOM, sin React state
  const dotEl  = useRef(null)
  const ringEl = useRef(null)
  const glowEl = useRef(null)

  useCursor(dotEl, ringEl, glowEl)
  useScrollReveal()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div>
      {/* Cursor — refs directos, cero re-renders */}
      <div className="cursor-glow" ref={glowEl} />
      <div className="cursor-ring" ref={ringEl} />
      <div className="cursor-dot"  ref={dotEl}  />

      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      <Nav scrolled={scrolled} />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  )
}
