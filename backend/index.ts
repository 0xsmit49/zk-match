import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to ZKmatch API' });
});


app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`ZKmatch server listening at http://localhost:${port}`);
});
