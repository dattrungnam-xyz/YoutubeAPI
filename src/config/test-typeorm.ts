import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });
// const config = {
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   // entities: [Video],
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['dist/migrations/*.js'],
//   synchronize: true,
// };

// export default registerAs('typeorm', () => config);
// export const connectionSource = new DataSource(config as DataSourceOptions);

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // entities: [Video],
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
});
