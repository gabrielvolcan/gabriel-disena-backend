import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['logo', 'web'],
    required: true
  },
  plan: {
    type: String,
    enum: ['basico', 'standard', 'premium'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pendiente', 'en-progreso', 'revision', 'completado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // 💰 SISTEMA DE PAGOS
  paymentStatus: {
    type: String,
    enum: ['pending_deposit', 'deposit_paid', 'pending_final', 'fully_paid'],
    default: 'pending_deposit'
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  
  // 📄 FACTURAS
  invoices: [{
    invoiceNumber: String,
    type: { type: String, enum: ['deposit', 'final'] },
    amount: Number,
    currency: { type: String, default: 'USD' },
    paidAt: Date,
    paymentMethod: String,
    transactionId: String,
    notes: String
  }],
  
  isPaid: {
    type: Boolean,
    default: false
  },
  
  files: [{
    url: String,
    name: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: String,
      enum: ['client', 'admin'],
      default: 'admin'
    }
  }],
  
  updates: [{
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    author: {
      type: String,
      enum: ['client', 'admin'],
      default: 'admin'
    },
    isPaymentNotification: {
      type: Boolean,
      default: false
    }
  }],
  
  deliveryDate: Date
}, {
  timestamps: true
});

// Calcular montos automáticamente antes de guardar
projectSchema.pre('save', function(next) {
  if (this.isModified('price')) {
    this.depositAmount = this.price * 0.5;
    this.finalAmount = this.price * 0.5;
  }
  next();
});

projectSchema.index({ userId: 1 });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;