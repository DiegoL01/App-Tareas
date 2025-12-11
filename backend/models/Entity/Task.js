import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

export const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único de la tarea'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    },
    comment: 'Título de la tarea'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción detallada de la tarea'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending',
    allowNull: false,
    validate: {
      isIn: [['pending', 'completed']]
    },
    comment: 'Estado actual de la tarea'
  },
  duration: {
    type: DataTypes.STRING,
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'Duración total en segundos'
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: 'Tabla de tareas/tracking de tiempo',
});

export async function configurarRelacionesTask() {
  const { User } = await import('./User.js');
  const { Category } = await import('./Category.js');
  
  Task.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
  });
  
  Task.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'SET NULL'
  });
  

}