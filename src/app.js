import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('This is the gathering Place API');
});

export default app;
