import 'dotenv/config.js';

// validate that enviroment variables are available before starting the app.

import { validateEnv } from '../env.js';


validateEnv();


import './server.js';
