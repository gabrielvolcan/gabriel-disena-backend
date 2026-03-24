import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true solo si usas el puerto 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verificar conexión solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  transporter.verify((error) => {
    if (error) console.error('❌ Error configurando email:', error);
    else console.log('✅ Servidor de email listo');
  });
}

// ✉️ EMAIL 1: BIENVENIDA + CONTRASEÑA
export const sendWelcomeEmail = async (userEmail, userName, password) => {
  const mailOptions = {
    from: 'Gabriel Diseña <gabrieldisena1@gmail.com>',
    to: userEmail,
    subject: '🎉 Bienvenido a Gabriel Diseña - Tus Credenciales de Acceso',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; color: #334155; line-height: 1.8; }
          .credentials-box { background: linear-gradient(135deg, #f0f9ff 0%, #ede9fe 100%); border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px; }
          .credentials-box strong { color: #1e40af; font-size: 16px; }
          .credentials-box .password { font-size: 24px; color: #7c3aed; font-weight: bold; letter-spacing: 2px; margin-top: 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          .divider { height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Bienvenido a Gabriel Diseña</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>¡Nos emociona tenerte con nosotros! Tu cuenta ha sido creada exitosamente.</p>
            
            <div class="credentials-box">
              <strong>📧 Email:</strong><br>
              <div style="font-size: 18px; color: #1e293b; margin-top: 8px;">${userEmail}</div>
              
              <div class="divider"></div>
              
              <strong>🔑 Tu Contraseña Temporal:</strong><br>
              <div class="password">${password}</div>
              
              <p style="margin-top: 15px; font-size: 14px; color: #64748b;">
                ⚠️ <strong>Importante:</strong> Guarda esta contraseña en un lugar seguro. Te recomendamos cambiarla después de tu primer inicio de sesión.
              </p>
            </div>
            
            <p><strong>¿Qué sigue?</strong></p>
            <p>1️⃣ Ingresa a tu dashboard usando tus credenciales<br>
               2️⃣ Revisa el progreso de tus proyectos en tiempo real<br>
               3️⃣ Descarga tus archivos cuando estén listos<br>
               4️⃣ Mantente en contacto directo conmigo</p>
            
            <div style="text-align: center;">
              <a href="https://gabrieldisena.com/dashboard" class="button">🚀 Acceder al Dashboard</a>
            </div>
            
            <p>Si tienes alguna pregunta, no dudes en contactarme. ¡Estoy aquí para ayudarte!</p>
            
            <p>Saludos,<br>
            <strong>Gabriel Diseña</strong><br>
            Diseño Gráfico & Desarrollo Web</p>
          </div>
          <div class="footer">
            <p><strong>Gabriel Diseña</strong> - Creamos Tus Ideas</p>
            <p>📧 gabrieldisena1@gmail.com | 💬 WhatsApp | 📸 Instagram</p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 15px;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida enviado a:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error);
    return { success: false, error };
  }
};

// ✉️ EMAIL 2: NUEVO PROYECTO ASIGNADO
export const sendProjectAssignedEmail = async (userEmail, userName, project) => {
  const mailOptions = {
    from: 'Gabriel Diseña <gabrieldisena1@gmail.com>',
    to: userEmail,
    subject: `🎉 Nuevo Proyecto Asignado: ${project.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; color: #334155; line-height: 1.8; }
          .project-box { background: linear-gradient(135deg, #fef2f2 0%, #fdf4ff 100%); border-left: 4px solid #ec4899; padding: 25px; margin: 25px 0; border-radius: 8px; }
          .project-detail { margin: 12px 0; font-size: 16px; }
          .project-detail strong { color: #be185d; }
          .button { display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 Nuevo Proyecto Asignado</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>¡Excelentes noticias! Te hemos asignado un nuevo proyecto y ya estamos trabajando en él.</p>
            
            <div class="project-box">
              <h2 style="color: #be185d; margin-top: 0;">📋 ${project.title}</h2>
              
              <div class="project-detail">
                <strong>📝 Descripción:</strong><br>
                ${project.description}
              </div>
              
              <div class="project-detail">
                <strong>💰 Precio Total:</strong> $${project.price}
              </div>
              
              <div class="project-detail">
                <strong>💵 Anticipo (50%):</strong> $${project.price * 0.5}
              </div>
              
              <div class="project-detail">
                <strong>📦 Plan:</strong> ${project.plan.charAt(0).toUpperCase() + project.plan.slice(1)}
              </div>
              
              <div class="project-detail">
                <strong>🎯 Tipo:</strong> ${project.type === 'logo' ? '🎨 Logo' : '🌐 Sitio Web'}
              </div>
              
              <div class="project-detail">
                <strong>📊 Estado:</strong> <span style="color: #f59e0b;">Esperando Anticipo</span>
              </div>
            </div>
            
            <p><strong>💡 Importante:</strong> Para iniciar tu proyecto, necesitamos el anticipo del 50% ($${project.price * 0.5}). Una vez confirmado el pago, comenzamos inmediatamente.</p>
            
            <p><strong>🔥 Ventaja exclusiva:</strong></p>
            <p>Podrás ver el progreso de tu proyecto en <strong>tiempo real</strong>, minuto a minuto, desde tu dashboard personal. ¡No más esperas sin saber qué está pasando!</p>
            
            <div style="text-align: center;">
              <a href="https://gabrieldisena.com/dashboard" class="button">👀 Ver Mi Proyecto</a>
            </div>
            
            <p>Mantente atento a las actualizaciones. Te notificaremos cada vez que haya avances importantes.</p>
            
            <p>¡Estamos emocionados de trabajar contigo!</p>
            
            <p>Saludos,<br>
            <strong>Gabriel Diseña</strong></p>
          </div>
          <div class="footer">
            <p><strong>Gabriel Diseña</strong> - Creamos Tus Ideas</p>
            <p>📧 gabrieldisena1@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de proyecto asignado enviado a:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando email de proyecto asignado:', error);
    return { success: false, error };
  }
};

// ✉️ EMAIL 3: NUEVO ARCHIVO SUBIDO
export const sendFileUploadedEmail = async (userEmail, userName, project, fileName) => {
  const mailOptions = {
    from: 'Gabriel Diseña <gabrieldisena1@gmail.com>',
    to: userEmail,
    subject: `📎 Nuevo Archivo Disponible - ${project.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; color: #334155; line-height: 1.8; }
          .file-box { background: linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%); border-left: 4px solid #3b82f6; padding: 25px; margin: 25px 0; border-radius: 8px; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📎 Nuevo Archivo Disponible</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>¡Tenemos una actualización! Hemos subido un nuevo archivo a tu proyecto.</p>
            
            <div class="file-box">
              <h2 style="color: #0369a1; margin-top: 0;">📋 ${project.title}</h2>
              
              <div style="margin: 15px 0;">
                <strong style="color: #0369a1;">📎 Archivo subido:</strong><br>
                <div style="font-size: 18px; color: #1e293b; margin-top: 8px; padding: 10px; background: white; border-radius: 6px;">
                  ${fileName}
                </div>
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #0369a1;">📊 Progreso actual:</strong>
                <div style="margin-top: 10px;">
                  <div style="background: #e2e8f0; height: 12px; border-radius: 6px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #3b82f6, #06b6d4); height: 100%; width: ${project.progress}%; transition: width 0.3s;"></div>
                  </div>
                  <div style="text-align: right; margin-top: 5px; font-weight: bold; color: #3b82f6;">${project.progress}%</div>
                </div>
              </div>
            </div>
            
            <p>🔓 <strong>Importante:</strong> Podrás ver una vista previa del archivo en tu dashboard. La descarga completa estará disponible una vez que el proyecto esté completado y el pago confirmado.</p>
            
            <div style="text-align: center;">
              <a href="https://gabrieldisena.com/dashboard" class="button">👀 Ver Archivo</a>
            </div>
            
            <p>Seguimos trabajando para que tu proyecto quede perfecto!</p>
            
            <p>Saludos,<br>
            <strong>Gabriel Diseña</strong></p>
          </div>
          <div class="footer">
            <p><strong>Gabriel Diseña</strong> - Creamos Tus Ideas</p>
            <p>📧 gabrieldisena1@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de archivo subido enviado a:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando email de archivo subido:', error);
    return { success: false, error };
  }
};

// ✉️ EMAIL 4: PROYECTO COMPLETADO
export const sendProjectCompletedEmail = async (userEmail, userName, project) => {
  const mailOptions = {
    from: 'Gabriel Diseña <gabrieldisena1@gmail.com>',
    to: userEmail,
    subject: `✅ Proyecto Completado - ${project.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; color: #334155; line-height: 1.8; }
          .success-box { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #10b981; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          .celebration { font-size: 60px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Proyecto Completado!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <div class="success-box">
              <div class="celebration">🎊 🎉 ✨</div>
              <h2 style="color: #059669; margin: 20px 0;">¡Excelentes Noticias!</h2>
              <p style="font-size: 18px; color: #065f46; margin: 0;">
                Tu proyecto <strong>${project.title}</strong> ha sido completado exitosamente
              </p>
            </div>
            
            <p><strong>📦 ¿Qué sigue?</strong></p>
            
            <p>1️⃣ <strong>Revisa tu proyecto:</strong> Todos los archivos finales están listos en tu dashboard<br>
               2️⃣ <strong>Pago final:</strong> Para descargar los archivos, necesitamos el pago final del 50% ($${project.price * 0.5})<br>
               3️⃣ <strong>Descarga completa:</strong> Una vez confirmado el pago final, podrás descargar todos los archivos sin restricciones<br>
               4️⃣ <strong>Soporte continuo:</strong> Si necesitas algún ajuste, estoy aquí para ayudarte</p>
            
            <div style="text-align: center;">
              <a href="https://gabrieldisena.com/dashboard" class="button">🎁 Ver Proyecto Completado</a>
            </div>
            
            <p><strong>💡 Información de entrega:</strong></p>
            <p>Los archivos incluyen todos los formatos necesarios para que puedas usar tu ${project.type === 'logo' ? 'logo' : 'sitio web'} donde lo necesites. Si tienes alguna duda sobre cómo utilizarlos, no dudes en contactarme.</p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 8px;">
              <p style="margin: 0; color: #92400e;">
                <strong>⭐ ¿Te gustó nuestro trabajo?</strong><br>
                Tu opinión es muy importante para nosotros. Si estás satisfecho con el resultado, nos encantaría que compartieras tu experiencia. ¡Muchas gracias! 😊
              </p>
            </div>
            
            <p>Ha sido un placer trabajar contigo. Espero que tu proyecto tenga mucho éxito!</p>
            
            <p>Saludos,<br>
            <strong>Gabriel Diseña</strong><br>
            Diseño Gráfico & Desarrollo Web</p>
          </div>
          <div class="footer">
            <p><strong>Gabriel Diseña</strong> - Creamos Tus Ideas</p>
            <p>📧 gabrieldisena1@gmail.com | 💬 WhatsApp | 📸 Instagram</p>
            <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
              ¿Necesitas otro proyecto? ¡Contáctame en cualquier momento!
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de proyecto completado enviado a:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando email de proyecto completado:', error);
    return { success: false, error };
  }
};

// ✉️ EMAIL 5: CONFIRMACIÓN DE PAGO (ANTICIPO O FINAL)
export const sendPaymentConfirmationEmail = async (userEmail, userName, project, paymentType, invoiceNumber) => {
  const isDeposit = paymentType === 'deposit';
  const amount = isDeposit ? project.depositAmount : project.finalAmount;
  const paymentTypeText = isDeposit ? 'ANTICIPO (50%)' : 'PAGO FINAL (50%)';

  const mailOptions = {
    from: 'Gabriel Diseña <gabrieldisena1@gmail.com>',
    to: userEmail,
    subject: `✅ Pago Recibido - Factura ${invoiceNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; color: #334155; line-height: 1.8; }
          .payment-box { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #10b981; padding: 25px; margin: 25px 0; border-radius: 8px; }
          .payment-detail { margin: 12px 0; font-size: 16px; }
          .payment-detail strong { color: #065f46; }
          .amount { font-size: 32px; color: #059669; font-weight: bold; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Pago Confirmado</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            
            <p>¡Excelente noticia! Hemos recibido tu pago correctamente.</p>
            
            <div class="payment-box">
              <h2 style="color: #059669; margin-top: 0; text-align: center;">💰 Detalles del Pago</h2>
              
              <div class="amount">$${amount} USD</div>
              
              <div class="payment-detail" style="text-align: center; padding: 15px; background: white; border-radius: 8px; margin: 15px 0;">
                <strong>📄 Factura:</strong> ${invoiceNumber}<br>
                <strong>🏷️ Tipo:</strong> ${paymentTypeText}<br>
                <strong>📅 Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
                <strong>📋 Proyecto:</strong> ${project.title}
              </div>

              ${isDeposit ? `
                <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
                  <p style="margin: 0; color: #1e40af;">
                    <strong>🚀 ¡Iniciamos tu proyecto!</strong><br>
                    Ya comenzamos a trabajar en tu ${project.type === 'logo' ? 'logo' : 'sitio web'}. Podrás ver el progreso en tiempo real desde tu dashboard.
                  </p>
                </div>
              ` : `
                <div style="background: rgba(236, 72, 153, 0.1); border-left: 4px solid #ec4899; padding: 20px; margin: 20px 0; border-radius: 8px;">
                  <p style="margin: 0; color: #be185d;">
                    <strong>🎉 ¡Proyecto Entregado!</strong><br>
                    Ya puedes descargar todos los archivos finales sin restricciones desde tu dashboard. ¡Disfruta tu ${project.type === 'logo' ? 'logo' : 'sitio web'}!
                  </p>
                </div>
              `}
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; margin: 25px 0; border-radius: 8px;">
              <p style="margin: 0; color: #92400e;">
                <strong>📋 Resumen de Pagos:</strong><br>
                • Precio Total: $${project.price}<br>
                • Anticipo Pagado: $${project.depositAmount}<br>
                • ${isDeposit ? `Saldo Pendiente: $${project.finalAmount}` : `Pago Final: $${project.finalAmount}`}<br>
                • <strong>Total Pagado: $${isDeposit ? project.depositAmount : project.price}</strong>
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="https://gabrieldisena.com/dashboard" class="button">👀 Ver Mi Dashboard</a>
            </div>
            
            <p><strong>💡 ¿Necesitas la factura?</strong></p>
            <p>Puedes descargar tu factura completa directamente desde tu dashboard en la sección de "Pagos".</p>
            
            <p>Si tienes alguna pregunta sobre tu pago, no dudes en contactarme.</p>
            
            <p>Saludos,<br>
            <strong>Gabriel Diseña</strong><br>
            Diseño Gráfico & Desarrollo Web</p>
          </div>
          <div class="footer">
            <p><strong>Gabriel Diseña</strong> - Creamos Tus Ideas</p>
            <p>📧 gabrieldisena1@gmail.com | 💬 WhatsApp | 📸 Instagram</p>
            <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
              Factura: ${invoiceNumber} | Fecha: ${new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de confirmación de pago (${paymentType}) enviado a:`, userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando email de confirmación de pago:', error);
    return { success: false, error };
  }
};

export default transporter;
