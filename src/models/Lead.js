import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  note: { type: String, required: true },
  method: { type: String, enum: ['whatsapp', 'email', 'llamada', 'otro'], default: 'whatsapp' },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  country: { type: String, default: 'otro' },
  service: {
    type: String,
    enum: ['logo', 'web', 'ambos', 'otro'],
    default: 'otro'
  },
  message: { type: String, default: '' },
  source: {
    type: String,
    enum: ['portfolio', 'whatsapp', 'instagram', 'referido', 'directo', 'otro'],
    default: 'portfolio'
  },
  status: {
    type: String,
    enum: ['frio', 'interesado', 'potencial', 'cliente', 'cerrado'],
    default: 'frio'
  },
  notes: { type: String, default: '' },
  followUps: [followUpSchema],
  convertedToClient: { type: Boolean, default: false },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  budget: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, {
  timestamps: true
});

leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
