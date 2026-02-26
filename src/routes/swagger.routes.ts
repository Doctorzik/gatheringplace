import express from 'express';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../data/swagger.json' with { type: 'json' };
const router = express.Router();

router.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  })
);

router.use('/api-docs', swaggerUI.serve);

router.use('/api-docs', swaggerUI.setup(swaggerDocument));

export default router;
