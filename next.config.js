module.exports = {
  publicRuntimeConfig: {
    BASE_URL: process.env.APP_URL || 'http://localhost:3000',
    SPAM_TRESHOLD: process.env.SPAM_TRESHOLD || '1',
  },
}
