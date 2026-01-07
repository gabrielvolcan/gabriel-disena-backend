export const METODOS_PAGO_POR_PAIS = {
  internacional: {
    nombre: 'Internacional',
    codigo: 'US',
    icono: '🌎',
    metodos: [
      {
        tipo: 'transferencia',
        nombre: 'Transferencia Internacional',
        icono: '💸',
        instrucciones: `Contactar vía WhatsApp para coordinar pago
Email: detodoencursos@gmail.com
Concepto: Pago WEB AI FACTORY + Tu Nombre`
      }
    ]
  },
  peru: {
    nombre: 'Perú',
    codigo: 'PE',
    icono: '🇵🇪',
    metodos: [
      {
        tipo: 'bcp',
        nombre: 'BCP - Yape',
        icono: '💵',
        instrucciones: `BCP 💵
GABRIEL VOLCAN
Cuenta: 37005887674096
CCI: 00237010588767409657
Yape: 989228665
Concepto: Pago WEB AI FACTORY + Tu Nombre`
      }
    ]
  },
  chile: {
    nombre: 'Chile',
    codigo: 'CL',
    icono: '🇨🇱',
    metodos: [
      {
        tipo: 'falabella',
        nombre: 'Banco Falabella',
        icono: '🏦',
        instrucciones: `Yoryelis Manzaneda
RUT: 26.974.264-K
Email: manzanedayoryelis@gmail.com
Cuenta Corriente: 15170139561
Banco Falabella
Concepto: Pago WEB AI FACTORY + Tu Nombre`
      }
    ]
  },
  argentina: {
    nombre: 'Argentina',
    codigo: 'AR',
    icono: '🇦🇷',
    metodos: [
      {
        tipo: 'mercadopago',
        nombre: 'Mercado Pago',
        icono: '💳',
        instrucciones: `Gabriel Humberto Volcan Altuve
CVU: 0000003100074314194223
Alias: gabriel.040.dejar.mp
CUIT/CUIL: 27963030407
Mercado Pago
Concepto: Pago WEB AI FACTORY + Tu Nombre`
      }
    ]
  },
  venezuela: {
    nombre: 'Venezuela',
    codigo: 'VE',
    icono: '🇻🇪',
    metodos: [
      {
        tipo: 'pagomovil',
        nombre: 'Pago Móvil - Banco de Venezuela',
        icono: '📱',
        instrucciones: `Teléfono: 04129229098
Cédula: 25011281
Banco: 0102 Bco de Vzla
Concepto: Pago WEB AI FACTORY + Tu Nombre`
      }
    ]
  },
  uruguay: {
    nombre: 'Uruguay',
    codigo: 'UY',
    icono: '🇺🇾',
    metodos: [
      {
        tipo: 'prex',
        nombre: 'Prex',
        icono: '💰',
        instrucciones: `Gabriel Volcan
Cuenta Prex: 1771890
Concepto: Pago WEB AI FACTORY + Tu Nombre`
      }
    ]
  }
};

export const PAISES = [
  { codigo: 'peru', nombre: 'Perú', icono: '🇵🇪', bandera: 'PE' },
  { codigo: 'chile', nombre: 'Chile', icono: '🇨🇱', bandera: 'CL' },
  { codigo: 'argentina', nombre: 'Argentina', icono: '🇦🇷', bandera: 'AR' },
  { codigo: 'uruguay', nombre: 'Uruguay', icono: '🇺🇾', bandera: 'UY' },
  { codigo: 'venezuela', nombre: 'Venezuela', icono: '🇻🇪', bandera: 'VE' },
  { codigo: 'internacional', nombre: 'Internacional', icono: '🌎', bandera: 'US' }
];

export const obtenerMetodosPago = (codigoPais) => {
  return METODOS_PAGO_POR_PAIS[codigoPais] || METODOS_PAGO_POR_PAIS.internacional;
};