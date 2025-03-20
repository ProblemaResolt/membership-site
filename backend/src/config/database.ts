import { Sequelize, Options } from 'sequelize';

const options: Options = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'membership',
  username: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'password',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};

const sequelize = new Sequelize(options);

export default sequelize;
