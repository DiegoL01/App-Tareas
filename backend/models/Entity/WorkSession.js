import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo
export const WorkSession = sequelize.define('WorkSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único de la sesión de trabajo'
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha y hora de inicio de la sesión'
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
    comment: 'Fecha y hora de finalización de la sesión'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'Duración de la sesión en segundos'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas adicionales sobre la sesión'
  },
  is_manual: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indica si la sesión fue creada manualmente'
  }
}, {
  tableName: 'work_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: 'Tabla de sesiones de trabajo (para tracking preciso)',
  hooks: {
    beforeSave: async (session) => {
      // Calcular duración automáticamente
      if (session.end_time && session.start_time) {
        const durationMs = new Date(session.end_time) - new Date(session.start_time);
        session.duration = Math.floor(durationMs / 1000);
      }
    }
  }
});

// 2. Función para configurar relaciones
export async function configurarRelacionesWorkSession() {
  // Importación dinámica del modelo relacionado
  const { Task } = await import('./Task.js');
  
  // WorkSession pertenece a una Task
  WorkSession.belongsTo(Task, {
    foreignKey: 'task_id',
    as: 'task',
    onDelete: 'CASCADE'
  });
}