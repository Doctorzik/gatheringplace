const REQUIRED_IN_PROD = ['JWT_SECRET', 'ARCJET_KEY', 'DATABASE_URL'];

export const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';


  if (!isProduction) return;
  const missing = REQUIRED_IN_PROD.filter(
    key => !process.env[key] || String(process.env[key]).trim() === ''
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable in production: ${missing.join(', ')}`
    );
  }
};
