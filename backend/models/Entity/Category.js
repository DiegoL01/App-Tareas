import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

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
}, {
  tableName: 'categories',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: 'Tabla de categorías para organizar tareas',
});

export async function configurarRelacionesCategory() {
  // Importación dinámica de los modelos relacionados
  const { User } = await import('./User.js');
  const { Task } = await import('./Task.js');

  Category.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
  });

  Category.hasMany(Task, {
    foreignKey: 'category_id',
    as: 'tasks',
    onDelete: 'SET NULL'
  });
}