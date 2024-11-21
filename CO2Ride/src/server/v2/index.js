import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;import tripsRoutes from './controllers/tripsController.js';
import ridesRoutes from './controllers/ridesController.js';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(cors())

app.use('/trips', tripsRoutes);
app.use('/rides', ridesRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
