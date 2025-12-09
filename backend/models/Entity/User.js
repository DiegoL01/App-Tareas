import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo
export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único del usuario'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    },
    comment: 'Email del usuario (único)'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    },
    comment: 'Contraseña encriptada'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    },
    comment: 'Nombre completo del usuario'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: 'Tabla de usuarios del sistema',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Métodos de instancia
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  delete values.created_at;
  delete values.updated_at;
  return values;
};

// 2. Función para configurar relaciones
export async function configurarRelacionesUser() {
  // Importación dinámica de los modelos relacionados
  const { Category } = await import('./Category.js');
  const { Task } = await import('./Task.js');
  const { WorkSession } = await import('./WorkSession.js');
  
  // User tiene muchas Categories
  User.hasMany(Category, {
    foreignKey: 'user_id',
    as: 'categories',
    onDelete: 'CASCADE'
  });
  
  // User tiene muchas Tasks
  User.hasMany(Task, {
    foreignKey: 'user_id',
    as: 'tasks',
    onDelete: 'CASCADE'
  });
  
  // Hook para crear categorías por defecto
  User.afterCreate(async (user) => {
    const defaultCategories = [
      { name: '💼 Trabajo', color: '#3498db', icon: 'briefcase', is_default: true },
      { name: '🏋️ Ejercicio', color: '#e74c3c', icon: 'dumbbell', is_default: true },
      { name: '📚 Estudio', color: '#2ecc71', icon: 'book', is_default: true },
      { name: '👨‍👩‍👧 Familiar', color: '#f1c40f', icon: 'home', is_default: true },
      { name: '😎 Ocio', color: '#9b59b6', icon: 'gamepad', is_default: true },
      { name: '🧘 Mindfulness', color: '#1abc9c', icon: 'brain', is_default: true }
    ];
    
    await Category.bulkCreate(
      defaultCategories.map(cat => ({
        ...cat,
        user_id: user.id
      }))
    );
  });
}