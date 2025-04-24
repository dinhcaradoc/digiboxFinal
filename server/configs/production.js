module.exports = {
  hostname: '0.0.0.0',
  port: process.env.PORT || 5000,
  database: {
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
};