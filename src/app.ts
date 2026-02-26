import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/auth.routes.js';
import swaggerRoutes from './routes/swagger.routes.js';
import securityMiddleware from './middleware/security.middleware.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const swaggerEnabled =
  process.env.ENABLE_SWAGGER === 'true' || !isProduction;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.use(securityMiddleware);
app.get('/', (req, res) => {
  logger.info('Hello from Gathering Api');
  res.status(200).send('This is the gathering Place API');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Gathering Place Api' });
});

if (swaggerEnabled) {
  app.use('/swagger', swaggerRoutes);
}
app.use('/api/auth', authRoutes);

export default app;
