export default () => ({
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    connectionString:
      process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/rezervachka',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    jwtExpiresIn: '24h',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceCzk: parseInt(process.env.APPOINTMENT_PRICE_CZK || '500', 10),
  },
});
