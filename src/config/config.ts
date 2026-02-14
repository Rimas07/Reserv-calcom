export default () => ({
  server: {
    port: process.env.PORT || 3000,
  },
  calcom: {
    webhookSecret: process.env.CALCOM_WEBHOOK_SECRET || '',
  },
});
