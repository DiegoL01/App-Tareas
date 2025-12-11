import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo
export const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único de la categoría'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    },
    comment: 'Nombre de la categoría'
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'folder',
    comment: 'Nombre del ícono (FontAwesome/Material)'
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si es una categoría por defecto del sistema'
  }
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: 'Tabla de categorías para organizar tareas',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'name'],
      name: 'unique_category_per_user'
    }
  ]
});

// 2. Función para configurar relaciones
export async function configurarRelacionesCategory() {
  // Importación dinámica de los modelos relacionados
  const { User } = await import('./User.js');
  const { Task } = await import('./Task.js');
  
  // Category pertenece a un User
  Category.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
  });
  
  // Category tiene muchas Tasks
  Category.hasMany(Task, {
    foreignKey: 'category_id',
    as: 'tasks',
    onDelete: 'SET NULL'
  });
}