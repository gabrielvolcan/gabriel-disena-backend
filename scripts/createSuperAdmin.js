import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    const email = 'gabriel@admin.com';
    const password = 'admin123';
    const name = 'Gabriel Volcán';

    // Verificar si ya existe
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️ El usuario ya existe. Actualizando rol y contraseña...\n');
      
      existing.role = 'superadmin';
      existing.password = password; // El pre-save hook lo hasheará
      await existing.save();
      
      console.log('✅ Usuario actualizado exitosamente:');
      console.log(`   Nombre: ${existing.name}`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Contraseña: ${password}`);
      console.log(`   Rol: ${existing.role}\n`);
    } else {
      // Crear nuevo usuario
      const user = new User({
        name,
        email,
        password,
        role: 'superadmin',
        phone: '',
        country: 'argentina'
      });

      await user.save();
      
      console.log('✅ Super Admin creado exitosamente:');
      console.log(`   Nombre: ${name}`);
      console.log(`   Email: ${email}`);
      console.log(`   Contraseña: ${password}`);
      console.log(`   Rol: superadmin\n`);
    }

    console.log('🔐 USA ESTAS CREDENCIALES PARA ENTRAR:');
    console.log(`   Email: ${email}`);
    console.log(`   Contraseña: ${password}\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createSuperAdmin();