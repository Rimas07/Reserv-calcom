export default () => ({
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    connectionString:
      process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/rezervachka',
  },
  calcom: {
    webhookSecret: process.env.CALCOM_WEBHOOK_SECRET || '',
  },
});
