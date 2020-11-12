module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://username@localhost/workwork',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || 'postgresql://username@localhost/workwork-test',
};
