import { useParams, Link } from 'react-router-dom';

function ProjectView() {
  const { token } = useParams();

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          <span className="gradient-text">Vista del Proyecto</span>
        </h1>
        <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
            Token: <code style={{ background: '#1f2937', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{token}</code>
          </p>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '1rem' }}>
            Próximamente: Vista detallada del proyecto con timeline en tiempo real
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link to="/" className="btn-secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectView;