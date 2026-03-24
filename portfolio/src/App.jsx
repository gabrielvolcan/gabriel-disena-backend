import { useState, useEffect, useRef } from 'react'
import './App.css'

// ─── PROJECTS DATA ───────────────────────────────────────────────────────────
// Imágenes: pon tus archivos en portfolio/public/images/
// Ejemplo: portfolio/public/images/only-cars.jpg

const BASE = import.meta.env.BASE_URL

const projects = [
  {
    id: '01',
    name: 'Daniela Lopez Academy',
    category: 'Plataforma Educativa · E-Learning',
    location: 'Latinoamérica',
    description: 'Plataforma web completa para la gestión y venta de cursos online y formaciones digitales, diseñada para ofrecer una experiencia de aprendizaje moderna, segura y escalable. El sistema permite publicar cursos, gestionar contenidos educativos, administrar estudiantes y controlar compras desde un panel administrativo centralizado. Incluye catálogo dinámico de formaciones, sistema de registro y autenticación de usuarios, recuperación de contraseña, verificación de correo electrónico y gestión de perfiles de estudiantes. La plataforma integra carrito de compras, checkout seguro y control de pedidos, permitiendo a los usuarios adquirir cursos de forma rápida y acceder al contenido desde su panel personal. También incorpora módulos para gestión de certificados, lecciones estructuradas y organización de materiales educativos. El backend fue desarrollado con arquitectura modular, incorporando validaciones del lado servidor, manejo seguro de sesiones y consultas preparadas para evitar vulnerabilidades SQL Injection. Experiencia 100% responsive, optimizada para dispositivos móviles, tablets y escritorio.',
    image: `${BASE}images/danielamockup.png`,
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #7c3aed 100%)',
    emoji: '📚',
    link: 'https://danielalopezacademy.com',
    tags: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Arquitectura modular'],
  },
  {
    id: '02',
    name: 'Zuro Dental',
    category: 'Sitio Corporativo',
    location: 'Argentina',
    description: 'Sitio web corporativo desarrollado para clínica odontológica con enfoque en conversión y posicionamiento profesional. Plataforma diseñada para presentar especialidades, equipo médico y casos clínicos, integrando llamados a la acción estratégicos para la reserva de turnos. Incluye sección dinámica de especialidades, presentación institucional, testimonios/casos de rehabilitación, validaciones de habilitación clínica y sistema de contacto optimizado. Diseño centrado en experiencia de usuario (UX) con estructura clara, jerarquía visual moderna y botones de conversión destacados. Arquitectura responsive optimizada para dispositivos móviles y escritorio, priorizando velocidad de carga, claridad informativa y experiencia fluida para potenciales pacientes.',
    image: `${BASE}images/zurodental.png`,
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0891b2 100%)',
    emoji: '🦷',
    link: 'https://www.zurodental.com.ar/',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX', 'Responsive Design'],
  },
  {
    id: '03',
    name: 'Afrodita Spa',
    category: 'Plataforma Web · Bienestar',
    location: 'Chile',
    description: 'Sitio web corporativo desarrollado para centro de estética y bienestar, enfocado en posicionamiento digital y captación de clientes. Plataforma diseñada para presentar servicios, equipo de masajistas y canales de contacto, con estructura optimizada para conversión y visibilidad en buscadores. Incluye panel administrativo para gestión interna, configuración dinámica mediante archivo central de parámetros y módulo API para manejo de datos. Secciones dedicadas a servicios, contacto y presentación institucional, junto con implementación de sitemap.xml y robots.txt para optimización SEO. Arquitectura ligera y responsive optimizada para dispositivos móviles y escritorio, priorizando velocidad de carga, experiencia visual elegante y navegación fluida.',
    image: `${BASE}images/afroditasspa.png`,
    gradient: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 60%, #c026d3 100%)',
    emoji: '💆',
    link: 'https://afroditasspa.com/',
    tags: ['PHP', 'HTML5', 'CSS3', 'JavaScript', 'SEO', 'Responsive Design'],
  },
  {
    id: '04',
    name: 'Participa y Gana Ya',
    category: 'Plataforma Web · Rifas',
    location: 'Venezuela',
    description: 'Plataforma web de rifas y sorteos digitales diseñada para la gestión integral de eventos promocionales. Permite la creación y publicación de rifas deportivas y temáticas, con talonario digital interactivo para selección de números en tiempo real. Incluye flujo completo de compra, registro de participantes, carga y validación de comprobantes, verificación de boletos y actualización automática de estados. Cuenta con panel administrativo para aprobar pagos, gestionar boletos vendidos y pendientes, consultar tickets premium, cancelar compras, administrar ganadores y exportar reportes operativos. Incorpora módulos de estadísticas públicas y privadas para monitoreo del progreso de cada rifa. Arquitectura backend con autenticación por sesiones seguras, validaciones del lado servidor y consultas preparadas para protección contra SQL Injection. Plataforma responsive optimizada para dispositivos móviles y escritorio.',
    image: `${BASE}images/participayganaya.png`,
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #0891b2 100%)',
    emoji: '🎯',
    link: 'https://participaayganaya.com/',
    tags: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
  },
  {
    id: '05',
    name: 'Pcell Electronics',
    category: 'E-Commerce',
    location: 'Perú',
    description: 'Plataforma web comercial desarrollada para empresa importadora y distribuidora de repuestos y herramientas para celulares al por mayor. Sitio orientado a catálogo digital y captación de clientes mayoristas, con estructura enfocada en presentación de productos, navegación clara y contacto directo vía WhatsApp. Incluye sección de productos organizada por categorías, buscador interno, presentación institucional y páginas informativas sobre métodos de pago y asesoría comercial. Diseño visual enfocado en identidad fuerte de marca, destacando promociones, atención online y envíos a provincias. Arquitectura responsive optimizada para dispositivos móviles y escritorio, priorizando visibilidad de productos, experiencia fluida de navegación y canales rápidos de conversión mediante contacto directo.',
    image: `${BASE}images/pcell-store.png`,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #4f46e5 100%)',
    emoji: '📱',
    link: 'https://pcell.pe/',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX', 'Responsive Design', 'E-commerce Layout'],
  },
  {
    id: '06',
    name: 'Detodo en Cursos',
    category: 'Plataforma Educativa',
    location: 'Argentina',
    description: 'Plataforma e-learning full-stack desarrollada para la venta y gestión de cursos digitales, con arquitectura separada en frontend (React + Vite) y backend (Node.js + Express). El sistema permite la publicación y comercialización de cursos, gestión de productos digitales, carrito de compras, múltiples métodos de pago (incluyendo pagos manuales verificados), autenticación segura de usuarios, recuperación de contraseña, verificación de email y emisión de certificados. Incluye panel administrativo para gestión de cursos, productos, usuarios y ventas. Incorpora sistema de email masivo y automatizado, integración de servicios de envío de correos, verificación de pagos manuales, control de compras y módulos de validación de certificados públicos. Arquitectura basada en API REST con separación por capas (routes, controllers, services, models), manejo de middlewares de autenticación y validaciones. Frontend estructurado por componentes reutilizables, contextos globales (Auth, Carrito, País), hooks personalizados y configuración dinámica de métodos de pago. Optimizada para despliegue en Vercel (frontend) y servidor Node independiente (backend). Plataforma responsive diseñada para escalar como SaaS educativo.',
    image: `${BASE}images/detodo.png`,
    gradient: 'linear-gradient(135deg, #431407 0%, #c2410c 60%, #ea580c 100%)',
    emoji: '🎓',
    link: 'https://detodoencursos.com',
    tags: ['React', 'Vite', 'Node.js', 'Express', 'MySQL', 'API REST', 'JWT/Auth', 'Email Services', 'SaaS Architecture', 'MVC Pattern'],
  },
  {
    id: '07',
    name: 'Thomas Barber World',
    category: 'E-Commerce',
    location: 'Chile',
    description: 'Plataforma web desarrollada para barbería profesional con integración de tienda online para la venta de artículos y productos especializados. El sistema combina presencia institucional del negocio con un módulo e-commerce funcional. Incluye catálogo dinámico de productos organizado por categorías, carrito de compras, proceso de checkout y gestión de estados de pago (pendiente, exitoso, fallido). Integración con pasarela de pagos mediante API para creación de preferencias y validación de transacciones. Cuenta con panel administrativo para gestión de productos, categorías, órdenes y control de comprobantes. Arquitectura estructurada en módulos backend (admin, API, configuración, procesamiento de pagos) con validaciones del lado servidor y manejo seguro de transacciones. Plataforma responsive optimizada para dispositivos móviles y escritorio, enfocada en experiencia de usuario fluida y conversión comercial.',
    image: `${BASE}images/thomasbarber.png`,
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
    emoji: '💈',
    link: 'https://thomasbarberworld.cl',
    tags: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Payment Integration', 'E-commerce', 'Admin Panel'],
  },
  {
    id: '08',
    name: 'Gana con Johander',
    category: 'Talonario Digital',
    location: 'Venezuela',
    description: 'Sistema web de talonario digital desarrollado para la gestión de rifas y sorteos online. Plataforma enfocada en automatizar la venta de números, registro de participantes y control de estados de compra en tiempo real. Incluye selección interactiva de números, procesamiento de compras, validación de transacciones y actualización automática de disponibilidad. Incorpora panel administrativo para supervisión de ventas, control de usuarios y gestión operativa del sorteo. Arquitectura backend conectada a base de datos mediante módulo de conexión centralizado, manejo seguro de sesiones administrativas y validaciones del lado servidor para garantizar integridad en el proceso de compra. Sistema ligero y adaptable, diseñado como solución escalable para proyectos de rifas digitales y eventos promocionales.',
    image: `${BASE}images/talonariodigital.png`,
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 60%, #16a34a 100%)',
    emoji: '🎰',
    link: 'https://ganaconjohander.com/',
    tags: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Digital Ticketing', 'Admin Panel', 'Raffle System'],
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
  {
    id: '10',
    name: 'Gana con Rodri',
    category: 'Plataforma Web · Rifas Digitales',
    location: 'Venezuela',
    description: 'Plataforma web de rifas digitales desarrollada para la gestión completa de sorteos online con sistema automatizado de venta de boletos. Permite publicar rifas destacadas, mostrar premios dinámicos, contador en tiempo real, notificaciones de compras en vivo y procesamiento seguro de pagos. Incluye panel administrativo completo para gestión de usuarios, boletos, compras, métodos de pago, ejecución de sorteos y control de estadísticas. Cuenta con arquitectura modular separada en administración y API, integración de envíos de correo mediante PHPMailer, autenticación segura, validaciones del lado servidor y control de estados de boletos (disponible, reservado, vendido). Incorpora ejecución automática de sorteos, generación de tickets, sistema de usuarios y estructura preparada para escalabilidad. Plataforma optimizada para experiencia móvil-first con interfaz moderna enfocada en conversión y participación inmediata.',
    image: `${BASE}images/ganaconrodri.png`,
    gradient: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 60%, #a855f7 100%)',
    emoji: '🎲',
    link: 'https://ganaconrodri.com/',
    tags: ['PHP', 'MySQL', 'JavaScript', 'PHPMailer', 'Admin Panel', 'API Modular', 'Sistema de Rifas', 'Pago Online', 'Autenticación', 'Ticketing System'],
  },
]

const skills = [
  { name: 'HTML5',        image: 'html5.png' },
  { name: 'JavaScript',   image: 'skillsjs.png' },
  { name: 'Illustrator',  image: 'skillsillustrator.png' },
  { name: 'Photoshop',    image: 'skillsphotoshop.png' },
  { name: 'Premiere Pro', image: 'skillspremiere.png' },
  { name: 'VS Code',      image: 'skillsvscode.png' },
  { name: 'ChatGPT',      image: 'skillschatgpt.png' },
  { name: 'Gemini',       image: 'skillsgemini.png' },
  { name: 'Claude',       image: 'skillsclaude.png' },
  { name: 'AI Tools',     image: 'skillsaitools.png' },
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
        <a href="https://www.behance.net/gabriedisena" target="_blank" rel="noopener noreferrer" aria-label="Behance">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zM15.973 14h4.823c-.092-1.445-.981-2.33-2.318-2.33-1.422 0-2.264.986-2.505 2.33zm-9.15-2.016v-.005c1.179-.228 2.004-.953 2.004-2.326 0-2.05-1.603-2.653-3.624-2.653H0v10h5.203c2.272 0 4.23-.803 4.23-3.116 0-1.523-.884-2.585-2.61-2.9zM2.368 8h2.484c.894 0 1.575.288 1.575 1.304 0 .947-.683 1.306-1.575 1.306H2.368V8zm0 5.854v-2.001h2.736c1.063 0 1.728.4 1.728 1.45 0 1.034-.728 1.551-1.728 1.551H2.368z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/gabrieldisenaoficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>
        <a href="https://wa.me/51957949278" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
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
            <a href={`${BASE}cv-gabriel-volcan.pdf`} download className="btn-primary">
              Descargar CV
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </a>
            <a href="#contacto" className="btn-ghost">Contáctame</a>
          </div>

          <div className="hero-socials">
            <a href="https://www.instagram.com/gabrieldisenaoficial/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.behance.net/gabriedisena"            target="_blank" rel="noopener noreferrer">Behance</a>
            <a href="https://wa.me/51957949278"                       target="_blank" rel="noopener noreferrer">WhatsApp</a>
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
            <div className="hero-badge-num">10+</div>
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
      <div className="project-image-wrap">
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
          { num: '10+', label: 'Proyectos completados' },
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
                <img
                  src={`${BASE}images/${s.image}`}
                  alt={s.name}
                  className="skill-icon-img"
                />
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

const API = 'https://gabriel-disena-backend.onrender.com'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: 'otro', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    if (!form.email.trim() && !form.phone.trim()) { setError('Ingresa al menos un email o teléfono'); return }

    setSending(true)
    try {
      const res = await fetch(`${API}/api/crm/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setSent(true)
        setForm({ name: '', email: '', phone: '', service: 'otro', message: '' })
      } else {
        setError('Hubo un error. Escríbeme directamente por WhatsApp.')
      }
    } catch {
      setError('Sin conexión. Escríbeme por WhatsApp.')
    } finally {
      setSending(false)
    }
  }

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

          {sent ? (
            <div className="contact-success">
              <div className="contact-success-icon">✅</div>
              <h3>¡Mensaje recibido!</h3>
              <p>Te contactaré muy pronto. También puedes escribirme directo por WhatsApp.</p>
              <a
                href="https://wa.me/51957949278?text=Hola!%20Vi%20tu%20portfolio%20y%20me%20interesa%20trabajar%20contigo"
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block', marginTop: '1rem' }}
              >
                Ir a WhatsApp
              </a>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="cf-name">Nombre *</label>
                  <input id="cf-name" name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre completo" required />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="cf-email">Email</label>
                  <input id="cf-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="cf-phone">Teléfono / WhatsApp</label>
                  <input id="cf-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+54 9 11 1234-5678" />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="cf-service">¿Qué necesitas?</label>
                  <select id="cf-service" name="service" value={form.service} onChange={handleChange}>
                    <option value="logo">Logo / Identidad visual</option>
                    <option value="web">Sitio web</option>
                    <option value="ambos">Logo + Web</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="contact-form-group">
                <label htmlFor="cf-message">Mensaje</label>
                <textarea id="cf-message" name="message" value={form.message} onChange={handleChange} placeholder="Cuéntame sobre tu proyecto..." rows="4" />
              </div>

              {error && <p className="contact-form-error">{error}</p>}

              <div className="contact-form-actions">
                <button type="submit" className="btn-primary" disabled={sending} style={{ fontSize: '1rem', padding: '1.1rem 2.5rem' }}>
                  {sending ? 'Enviando...' : 'Enviar mensaje'}
                </button>
                <a
                  href="https://wa.me/51957949278?text=Hola!%20Vi%20tu%20portfolio%20y%20me%20interesa%20trabajar%20contigo"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ fontSize: '1rem', padding: '1.1rem 2.5rem' }}
                >
                  WhatsApp directo
                </a>
              </div>
            </form>
          )}
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
          <a href="https://www.instagram.com/gabrieldisenaoficial/" target="_blank" rel="noopener noreferrer">Instagram</a>
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
