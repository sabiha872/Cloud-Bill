const app = require('./app');
const { PORT } = require('./config/env');
const logger = require('./config/logger');
const { initDatabase } = require('./services/databaseService');

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      logger.info(`CloudBill API running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Database initialization failed during startup', { message: error.message });
    process.exit(1);
  }
};

startServer();
