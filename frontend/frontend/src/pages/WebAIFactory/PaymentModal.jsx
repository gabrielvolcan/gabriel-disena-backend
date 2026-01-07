import { useState } from 'react';
import { obtenerMetodosPago } from './paymentConfig';
import './PaymentModal.css';

function PaymentModal({ onClose, paisSeleccionado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    metodoPago: '',
    comprobante: null
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const datosPais = obtenerMetodosPago(paisSeleccionado);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5000000) { // 5MB max
      setFormData(prev => ({
        ...prev,
        comprobante: file
      }));
    } else {
      alert('El archivo debe ser menor a 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.metodoPago) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setEnviando(true);

    // Aquí puedes agregar la lógica para enviar a tu backend
    // Por ahora simulo el envío
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
    }, 2000);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="payment-modal-close" onClick={onClose}>×</button>

        {!enviado ? (
          <>
            <div className="payment-modal-header">
              <h2>Completa tu Compra</h2>
              <p>WEB AI FACTORY™ - $7 USD</p>
              <div className="payment-country-badge">
                <span>{datosPais.icono}</span>
                <span>{datosPais.nombre}</span>
              </div>
            </div>

            <div className="payment-modal-body">
              {/* MÉTODOS DE PAGO */}
              <div className="payment-methods-section">
                <h3>📱 Métodos de Pago Disponibles para {datosPais.nombre}</h3>

                {datosPais.metodos.map((metodo, index) => (
                  <div key={index} className="payment-method-card">
                    <div className="payment-method-header">
                      <span className="payment-method-icon">{metodo.icono}</span>
                      <h4>{metodo.nombre}</h4>
                    </div>
                    <div className="payment-method-details">
                      <pre>{metodo.instrucciones}</pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* FORMULARIO */}
              <div className="payment-form-section">
                <h3>📝 Envía tu Comprobante</h3>
                <p className="payment-form-subtitle">
                  Una vez realizado el pago, completa este formulario y recibirás el producto en 24-48 horas.
                </p>

                <form onSubmit={handleSubmit} className="payment-form">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email (donde recibirás el producto) *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="metodoPago">Método de Pago Usado *</label>
                    <select
                      id="metodoPago"
                      name="metodoPago"
                      value={formData.metodoPago}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un método</option>
                      {datosPais.metodos.map((metodo, index) => (
                        <option key={index} value={metodo.tipo}>
                          {metodo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comprobante">
                      Comprobante de Pago (Opcional)
                    </label>
                    <input
                      type="file"
                      id="comprobante"
                      name="comprobante"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="file-input"
                    />
                    <p className="file-input-help">
                      JPG, PNG o PDF - Máximo 5MB
                    </p>
                    {formData.comprobante && (
                      <p className="file-selected">
                        ✓ Archivo seleccionado: {formData.comprobante.name}
                      </p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary payment-submit-btn"
                    disabled={enviando}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Comprobante'}
                  </button>

                  <p className="payment-form-note">
                    * Una vez verificado tu pago, recibirás WEB AI FACTORY™ en tu email en un máximo de 48 horas.
                  </p>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2>¡Solicitud Enviada!</h2>
            <p>
              Hemos recibido tu información. Verificaremos tu pago y te enviaremos 
              <strong> WEB AI FACTORY™</strong> a <strong>{formData.email}</strong> en un máximo de 48 horas.
            </p>
            <p className="success-note">
              Si tienes alguna duda, contáctanos a: <br />
              <strong>detodoencursos@gmail.com</strong>
            </p>
            <button onClick={onClose} className="btn-primary">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;