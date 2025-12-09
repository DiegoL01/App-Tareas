import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo
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
    type: DataTypes.ENUM('active', 'paused', 'completed'),
    defaultValue: 'active',
    allowNull: false,
    validate: {
      isIn: [['active', 'paused', 'completed']]
    },
    comment: 'Estado actual de la tarea'
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha y hora de inicio de la tarea'
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterStart(value) {
        if (value && this.start_time && value <= this.start_time) {
          throw new Error('end_time debe ser después de start_time');
        }
      }
    },
    comment: 'Fecha y hora de finalización de la tarea'
  },
  duration: {
    type: DataTypes.INTEGER,
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
  hooks: {
    beforeUpdate: async (task) => {
      // Calcular duración si se actualiza end_time
      if (task.changed('end_time') && task.end_time && task.start_time) {
        const durationMs = new Date(task.end_time) - new Date(task.start_time);
        task.duration = Math.floor(durationMs / 1000);
      }
    }
  },
  indexes: [
    {
      fields: ['user_id', 'status'],
      where: { status: 'active' },
      name: 'idx_user_active_task'
    }
  ]
});

// 2. Función para configurar relaciones
export async function configurarRelacionesTask() {
  // Importación dinámica de los modelos relacionados
  const { User } = await import('./User.js');
  const { Category } = await import('./Category.js');
  const { WorkSession } = await import('./WorkSession.js');
  
  // Task pertenece a un User
  Task.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
  });
  
  // Task pertenece a una Category (opcional)
  Task.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'SET NULL'
  });
  
  // Task tiene muchas WorkSessions
  Task.hasMany(WorkSession, {
    foreignKey: 'task_id',
    as: 'work_sessions',
    onDelete: 'CASCADE'
  });
}