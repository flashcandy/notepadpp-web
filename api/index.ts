import express from 'express';
import { aiRouter } from '../src/server/aiRouter.js';

const app = express();

app.use(express.json({ limit: '20mb' }));

// Mount AI routes
app.use('/api/ai', aiRouter);

export default app;
