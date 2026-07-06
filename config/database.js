module.exports = {
  database: process.env.DATABASE_PATH || './database/app.db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
