const poolSettings = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
}

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    protocol: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: poolSettings
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    protocol: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: poolSettings
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    protocol: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: poolSettings
  }
}
